"use client";

import { useState } from "react";
import { TaskSection } from "./task-section";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date(),
    status: "",
    category: "",
  });

  const handleAddTask = () => {
    if (!newTask.title) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask.title,
        date: newTask.date || new Date(),
        status: newTask.status || "TO-DO",
        category: newTask.category || "WORK",
      },
    ]);

    setNewTask({
      title: "",
      date: new Date(),
      status: "",
      category: "",
    });
    setIsAddingTask(false);
  };
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setNewTask(taskToEdit); 
    setIsAddingTask(true); 
  };
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const [expandedSections, setExpandedSections] = useState({
    todo: true,
    inProgress: true,
    completed: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };


  // Filter tasks based on their status
  const todoTasks = tasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN-PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  return (
    <div className="px-8 ">
      {/* Common Table Header */}
      <div className="grid grid-cols-5 gap-4 py-3 px-12 text-sm font-semibold text-gray-600">
        <h1 className="col-span-2">Task Title</h1>
        <h1>Due On</h1>
        <h1>Task Status</h1>
        <h1 >Task Category</h1>
      </div>

      {/* Todo Section */}
      <TaskSection
        title="Todo"
        count={todoTasks.length}
        color="bg-[#FAC3FF]"
        isExpanded={expandedSections.todo}
        onToggle={() => toggleSection("todo")}
      >
        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="w-full border-b p-2 px-6 text-left text-gray-600 hover:bg-gray-50"
        >
          <span className="text-[#7B1984] text-2xl font-extrabold">+</span> ADD TASK
        </button>

        {isAddingTask && (
          <div className="grid grid-cols-5 gap-4 py-3 px-8">
            <Input
              className="col-span-2 bg-transparent border-none"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />

            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="rounded-full" variant="outline">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {newTask.date ? format(newTask.date, "PP"): "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                  
                    mode="single"
                    selected={newTask.date}
                    onSelect={(date) => setNewTask({ ...newTask, date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {newTask.status === "" ? <Plus className="h-4 w-4" /> : newTask.status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                  <DropdownMenuItem onClick={() => setNewTask({ ...newTask, status: "TO-DO" })}>
                    TO-DO
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTask({ ...newTask, status: "IN-PROGRESS" })}>
                    IN-PROGRESS
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTask({ ...newTask, status: "COMPLETED" })}>
                    COMPLETED
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {newTask.category === "" ? <Plus className="h-4 w-4" /> : newTask.category}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setNewTask({ ...newTask, category: "WORK" })}>
                    WORK
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTask({ ...newTask, category: "PERSONAL" })}>
                    PERSONAL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="col-span-4 flex gap-2 mt-2">
              <Button onClick={handleAddTask} className="bg-[#7B1984] rounded-full hover:bg-blue-600 text-white">
                ADD
                <Image src="/addicon.svg" alt="Logo" width={16} height={16} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddingTask(false)}
                className="border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {todoTasks.map((task) => (
          <div key={task.id} className="grid grid-cols-5 gap-4 py-2 px-4">
            <p className="col-span-2">{task.title}</p>
            <p>{format(task.date, "PP")}</p>
            <p>{task.status}</p>
            <p>{task.category}</p>
          </div>
        ))}

        {todoTasks.length === 0 && (
          <div className="text-center text-muted-foreground">No Tasks in To-Do</div>
        )}
      </TaskSection>

      {/* In Progress Section */}
      <TaskSection
        title="In-Progress"
        count={inProgressTasks.length}
        color="bg-[#85D9F1]"
        isExpanded={expandedSections.inProgress}
        onToggle={() => toggleSection("inProgress")}
      >
        {inProgressTasks.map((task) => (
          <div key={task.id} className="grid grid-cols-5 gap-4 py-2 px-6">
            <p className="col-span-2">{task.title}</p>
            <p>{format(task.date, "PP")}</p>
            <p>{task.status}</p>
            <p>{task.category}</p>
          </div>
        ))}

        {inProgressTasks.length === 0 && (
          <div className="text-center text-muted-foreground">No Tasks in Progress</div>
        )}
      </TaskSection>

      {/* Completed Section */}
      <TaskSection
        title="Completed"
        count={completedTasks.length}
        color="bg-[#CEFFCC]"
        isExpanded={expandedSections.completed}
        onToggle={() => toggleSection("completed")}
      >
        {completedTasks.map((task) => (
          <div key={task.id} className="grid grid-cols-6 gap-4 py-2 pl-6">
            <p className="col-span-2">{task.title}</p>
            <p>{format(task.date, "PP")}</p>
            <p>{task.status}</p>
            <p>{task.category}</p>
            <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Image src="/more_icon.svg" alt="More Options" width={16} height={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
          </div>
        ))}

        {completedTasks.length === 0 && (
          <div className="text-center text-muted-foreground">No Tasks Completed</div>
        )}
      </TaskSection>
    </div>
  );
}

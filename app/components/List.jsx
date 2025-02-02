"use client";

import { useState } from "react";
import { TaskSection } from "./task-section";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarIcon, ChevronsUpDown, Plus, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


export default function List({
  tasks,
  isAddingTask,
  selectedTasks,
  sortDirection,
  newTask,
  onEditTask,
  onDeleteTask,
  handleDialogClose,
  onUpdateTaskStatus,
  onBulkStatusUpdate,
  onBulkDelete,
  setIsAddingTask,
  setSelectedTasks,
  setSortDirection,
  setNewTask,
  setTasks,
}) {
  

  const handleAddTask = () => {
    if (!newTask.title) return;

    const newTaskItem = {
      id: Date.now(),
      title: newTask.title,
      date: newTask.date || new Date(),
      status: newTask.status || "TO-DO",
      category: newTask.category || "WORK",
    };

    const updatedTasks = [...tasks, newTaskItem];
    if (sortDirection) {
      setTasks(sortTasksByDate(updatedTasks, sortDirection));
    } else {
      setTasks(updatedTasks);
    }

    setNewTask({
      title: "",
      date: new Date(),
      status: "",
      category: "",
    });
    setIsAddingTask(false);
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
  const sortTasksByDate = (tasksToSort, direction) => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };


  const toggleSort = () => {
    const newDirection = sortDirection === null ? 'asc' :
      sortDirection === 'asc' ? 'desc' : null;
    setSortDirection(newDirection);

    if (newDirection) {
      setTasks(sortTasksByDate(tasks, newDirection));
    }
  };

  const getSortIcon = () => {
    switch (sortDirection) {
      case 'asc':
        return <ArrowUp className="h-4 w-4" />;
      case 'desc':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <ChevronsUpDown className="h-4 w-4" />;
    }
  };
 

  const todoTasks = tasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN-PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const reorderTasks = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const handleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    let taskList;
    switch (source.droppableId) {
      case "todo-list":
        taskList = tasks.filter(t => t.status === "TO-DO");
        break;
      case "progress-list":
        taskList = tasks.filter(t => t.status === "IN-PROGRESS");
        break;
      case "completed-list":
        taskList = tasks.filter(t => t.status === "COMPLETED");
        break;
      default:
        return;
    }

    const reorderedTasks = reorderTasks(
      taskList,
      source.index,
      destination.index
    );

    const updatedTasks = tasks.filter(t => t.status !== taskList[0].status);
    setTasks([...updatedTasks, ...reorderedTasks]);
  };
  const SelectionActionBar = () => {
    if (selectedTasks.size === 0) return null;

    return (
      <div className="flex justify-center">

        <div className="fixed bottom-0  rounded-2xl mb-4 bg-black text-white p-4 flex items-center ">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              className="text-white border rounded-2xl hover:text-gray-200 hover:text-black"
              onClick={() => setSelectedTasks(new Set())}
            >
              <span className="md:mr-2 ">{selectedTasks.size} Tasks Selected</span>
              <X size={16} />
            </Button>

            <Image src="/selected.svg" alt="checkmark" width={20} height={20} className="mr-6" />

          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black text-white rounded-xl mb-4">
                <DropdownMenuItem onClick={() => onBulkStatusUpdate("TO-DO")}>
                  TO-DO
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkStatusUpdate("IN-PROGRESS")}>
                  IN-PROGRESS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkStatusUpdate("COMPLETED")}>
                  COMPLETED
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-400"
              onClick={onBulkDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8 ">
      {/* Common Table Header */}
      <div className="hidden md:grid grid-cols-5 gap-4 py-3 px-12 text-sm font-semibold text-gray-600">
        <h1 className="col-span-2">Task Title</h1>
        <div className="flex items-center gap-2">
          <h1>Due On</h1>
          <button
            onClick={toggleSort}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={
              sortDirection === 'asc' ? 'Sort Descending' :
                sortDirection === 'desc' ? 'Clear Sort' : 'Sort Ascending'
            }
          >
            {getSortIcon()}
          </button>
        </div>
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
          className="w-full hidden md:flex items-center gap-2 border-b p-2 px-6 text-left text-gray-600 hover:bg-gray-50"
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
                    {newTask.date ? format(newTask.date, "PP") : "Pick a date"}
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
                  <Button variant="ghost" className="rounded-full border">
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
                  <Button variant="ghost" className="rounded-full border">
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

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todo-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`transition-colors ${snapshot.isDraggingOver ? "bg-gray-50" : ""
                  }`}
              >
                {todoTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                     
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-5 items-center gap-4 border-b py-2 px-6 ${snapshot.isDragging ? "bg-white shadow-lg" : ""
                          }`}
                      >
                        <p
                          className="col-span-5 md:col-span-2  flex gap-1 items-center"
                          {...provided.dragHandleProps} 
                        
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#7B1984]"
                            checked={selectedTasks.has(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                            
                          />
                          <Image src="/drag_icon.svg" alt="drag" className="hidden md:flex" width={20} height={20} />
                          <Image src="/checkmark.svg" alt="checkmark" width={20} height={20} />
                          <span  onClick={() => onEditTask(task.id)}>
                            {task.title}
                            </span>
                        </p>
                        <p className="hidden md:flex">{format(task.date, "PP")}</p>
                        <div className="hidden md:flex">

                        <DropdownMenu >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex justify-start">
                              <span className="bg-gray-200 p-2 rounded-md font-bold">{task.status}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent  side="bottom" align="start">
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "TO-DO")}
                            >
                              TO-DO
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "IN-PROGRESS")}
                              >
                              IN-PROGRESS
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateTaskStatus(task.id, "COMPLETED")}
                              >
                              COMPLETED
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                              </div>
                        <div className="hidden md:flex justify-between">
                          <p>{task.category}</p>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                  <Image
                                    src="/more_icon.svg"
                                    alt="More Options"
                                    width={16}
                                    height={16}
                                  />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                align="end"
                                className="w-32 rounded-2xl p-3 bg-[#FFF9F9]"
                              >
                                <DropdownMenuItem
                                  onClick={() => onEditTask(task.id)}
                                  className="font-bold"
                                >
                                  <Image
                                    src="/edit_icon.svg"
                                    alt="Edit"
                                    width={16}
                                    height={16}
                                  />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>{onDeleteTask(task.id)
                                    ,handleDialogClose()}}
                                  className="font-bold text-red-500"
                                >
                                  <Image
                                    src="/delete_icon.svg"
                                    alt="Delete"
                                    width={16}
                                    height={16}
                                  />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="progress-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`transition-colors ${snapshot.isDraggingOver ? "bg-gray-50" : ""
                  }`}
              >
                {inProgressTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-5 items-center gap-4 border-b py-2 px-6 ${snapshot.isDragging ? "bg-white shadow-lg" : ""
                          }`}
                      >
                        <p
                          className="col-span-5 md:col-span-2   flex gap-1 items-center"
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#7B1984]"
                            checked={selectedTasks.has(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                          />
                          <Image src="/drag_icon.svg" className="hidden md:flex" alt="drag" width={20} height={20} />
                          <Image src="/checkmark.svg" alt="checkmark" width={20} height={20} />
                          {task.title}
                        </p>
                        <p className="hidden md:flex">{format(task.date, "PP")}</p>
                        <div className="hidden md:flex">

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex justify-start">
                              <span className="bg-gray-200 p-2 rounded-md font-bold">{task.status}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="start">
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "TO-DO")}
                            >
                              TO-DO
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "IN-PROGRESS")}
                            >
                              IN-PROGRESS
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "COMPLETED")}
                            >
                              COMPLETED
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                        <div className=" hidden md:flex justify-between">
                          <p>{task.category}</p>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                  <Image
                                    src="/more_icon.svg"
                                    alt="More Options"
                                    width={16}
                                    height={16}
                                  />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                align="end"
                                className="w-32 rounded-2xl p-3 bg-[#FFF9F9]"
                              >
                                <DropdownMenuItem
                                  onClick={() => onEditTask(task.id)}
                                  className="font-bold"
                                >
                                  <Image
                                    src="/edit_icon.svg"
                                    alt="Edit"
                                    width={16}
                                    height={16}
                                  />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteTask(task.id)}
                                  className="font-bold text-red-500"
                                >
                                  <Image
                                    src="/delete_icon.svg"
                                    alt="Delete"
                                    width={16}
                                    height={16}
                                  />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="completed-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`transition-colors ${snapshot.isDraggingOver ? "bg-gray-50" : ""
                  }`}
              >
                {completedTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-5 items-center gap-4 border-b py-2 px-6 ${snapshot.isDragging ? "bg-white shadow-lg" : ""
                          }`}
                      >
                        <p
                          className="col-span-5 md:col-span-2 line-through flex gap-1 items-center"
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#7B1984]"
                            checked={selectedTasks.has(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                          />
                          <Image src="/drag_icon.svg" className="hidden md:flex" alt="drag" width={20} height={20} />
                          <Image src="/checkmarkGreen.svg" alt="checkmark" width={20} height={20} />
                          {task.title}
                        </p>
                        <p className="hidden md:flex">{format(task.date, "PP")}</p>
                        <div className="hidden md:flex">

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex justify-start">
                              <span className="bg-gray-200 p-2 rounded-md font-bold">{task.status}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="start">
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "TO-DO")}
                              >
                              TO-DO
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "IN-PROGRESS")}
                              >
                              IN-PROGRESS
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>  onUpdateTaskStatus(task.id, "COMPLETED")}
                              >
                              COMPLETED
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                              </div>
                        <div className="hidden md:flex justify-between">
                          <p>{task.category}</p>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                  <Image
                                    src="/more_icon.svg"
                                    alt="More Options"
                                    width={16}
                                    height={16}
                                  />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                align="end"
                                className="w-32 rounded-2xl p-3 bg-[#FFF9F9]"
                              >
                                <DropdownMenuItem
                                  onClick={() =>onEditTask(task.id)}
                                  className="font-bold"
                                >
                                  <Image
                                    src="/edit_icon.svg"
                                    alt="Edit"
                                    width={16}
                                    height={16}
                                  />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteTask(task.id)}
                                  className="font-bold text-red-500"
                                >
                                  <Image
                                    src="/delete_icon.svg"
                                    alt="Delete"
                                    width={16}
                                    height={16}
                                  />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {completedTasks.length === 0 && (
          <div className="text-center text-muted-foreground">No Tasks Completed</div>
        )}
      </TaskSection>
      <SelectionActionBar />
     
    </div>
  );
}

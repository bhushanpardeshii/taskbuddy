"use client"
import { useState } from "react"
import { Header } from "./components/header"
import List from "./components/List"
import Board from "./components/Board"

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [sortDirection, setSortDirection] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date(),
    status: "",
    category: "",
  });

  // Task management functions
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

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setNewTask(taskToEdit);
    setIsAddingTask(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const sortTasksByDate = (tasksToSort, direction) => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setTasks(tasks.map(task =>
      selectedTasks.has(task.id)
        ? { ...task, status: newStatus }
        : task
    ));
    setSelectedTasks(new Set());
  };

  const handleBulkDelete = () => {
    setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
    setSelectedTasks(new Set());
  };

  // Props to be passed to both List and Board components
  const taskManagementProps = {
    tasks,
    isAddingTask,
    selectedTasks,
    sortDirection,
    newTask,
    onAddTask: handleAddTask,
    onEditTask: handleEditTask,
    onDeleteTask: handleDeleteTask,
    onUpdateTaskStatus: handleUpdateTaskStatus,
    onBulkStatusUpdate: handleBulkStatusUpdate,
    onBulkDelete: handleBulkDelete,
    setIsAddingTask,
    setSelectedTasks,
    setSortDirection,
    setNewTask,
    setTasks,
  };
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  return (
    <div className="min-h-screen ">
     <Header onViewChange={handleViewChange} />
      {currentView === 'list' ? (
        <List {...taskManagementProps}/>
      ) : (
        <Board {...taskManagementProps}/>
      )}
    </div>
  )
}


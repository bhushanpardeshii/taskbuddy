"use client"
import { useState } from "react"
import { Header } from "../components/header"
import List from "../components/List"
import Board from "../components/Board"
import CreateTaskDialog from "../components/dialog"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [sortDirection, setSortDirection] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date(),
    status: "",
    category: "",
    createdAt: new Date(),
    updatedAt: null,
    attachmentHistory: [],
  });

  const handleAddTask = (task) => {
    if (!task.title) return;
  
    const newTaskItem = {
      id: Date.now(),
      title: task.title,
      description: task.description || "",
      date: task.date || new Date(),
      status: task.status || "TO-DO",
      category: task.category || "WORK",
      createdAt: task.createdAt,
    updatedAt:task.updatedAt,
    attachmentHistory: task.attachmentHistory,
    };
  
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTaskItem];
  
      return sortDirection ? sortTasksByDate(updatedTasks, sortDirection) : updatedTasks;
    });
  
    setIsDialogOpen(false);
  
    setNewTask({
      title: "",
      description: "",
      date: new Date(),
      status: "TO-DO",
      category: "WORK",
      createdAt: new Date(),
    updatedAt: null,
    attachmentHistory: [],
    });
  
    setIsAddingTask(false);
  };
  const handleFilterCategory = (category) => {
    setTasks((prevTasks) =>
      category ? prevTasks.filter((task) => task.category === category) : prevTasks
    );
  };
  
  const handleSortByDate = (direction) => {
    setSortDirection(direction);
    setTasks((prevTasks) => (direction ? sortTasksByDate(prevTasks, direction) : prevTasks));
  };
  
  const handleSearchTasks = (query) => {
    setTasks((prevTasks) =>
      query ? prevTasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())) : prevTasks
    );
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setNewTask(taskToEdit);
    setIsDialogOpen(true);
    setIsAddingTask(true);
  };
  const handleUpdateTask = (taskData) => {
    setTasks(tasks.map(task =>
      task.id === taskData.id ? { ...task, ...taskData,updatedAt: new Date() } : task
    ));
    setEditingTask(null);
    setIsDialogOpen(false);
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
  const handleDialogOpen = () => {

    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      date: new Date(),
      status: "TO-DO",
      category: "WORK",
    });
  };
  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };
  const handleAttachmentChange = (taskId, file) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              attachment: file,
              updatedAt: new Date(),
              attachmentHistory: [...task.attachmentHistory, { fileName: file.name, date: new Date() }],
            }
          : task
      )
    );
  };
 
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
    handleDialogClose,
    setIsAddingTask,
    setSelectedTasks,
    setSortDirection,
    setNewTask,
    setTasks,
   
  };
  const dialogProps = {
    isOpen: isDialogOpen,
    onOpenChange: setIsDialogOpen,
    onClose: handleDialogClose,
    onSubmit: editingTask ? handleUpdateTask : handleAddTask,
    editingTask,
    initialData: newTask,
  };
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  return (
    <div className="min-h-screen ">
      <Header onViewChange={handleViewChange}
        onAddTaskClick={handleDialogOpen}
        handleLogout={handleLogout}
        onFilterCategory={handleFilterCategory}
        onSortByDate={handleSortByDate}
        onSearchTasks={handleSearchTasks}
       
      />

      <CreateTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(task) => handleAddTask(task)}
        handleAttachmentChange={handleAttachmentChange}
        initialData={newTask}
      />
      {currentView === 'list' ? (
        <List {...taskManagementProps} />
      ) : (
        <Board {...taskManagementProps} />
      )}
    </div>
  )
}


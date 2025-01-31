
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const TaskCard = ({ task, index, onEditTask, onDeleteTask }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg p-4 mb-3 shadow-sm ${
            snapshot.isDragging ? "shadow-lg" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-sm">{task.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{task.category}</span>
            <span>{format(new Date(task.date), "d MMM, yyyy")}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const Column = ({ title, tasks, id, onEditTask, onDeleteTask }) => {
  const todoTasks = tasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN-PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const getBackgroundColor = () => {
    switch (id) {
      case "IN-PROGRESS":
        return "bg-[#85D9F1]";
      case "COMPLETED":
        return "bg-[#A2D6A0] ";
      default:
        return "bg-[#FAC3FF]";
    }
  };

  return (
    <div className={"flex-1 max-w-[400px] rounded-lg p-4 bg-gray-100 "}>
      <div className="mb-4">
        <span className={`font-semibold uppercase p-2 rounded-md ${getBackgroundColor()} `}>{title}</span>
        
      </div>
        
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-svh transition-colors ${
              snapshot.isDraggingOver ? "bg-opacity-50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    
    </div>
  );
};

export default function Board({
  tasks,
  isAddingTask,
  selectedTasks,
  sortDirection,
  newTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onBulkStatusUpdate,
  onBulkDelete,
  setIsAddingTask,
  setSelectedTasks,
  setSortDirection,
  setNewTask,
  setTasks,
}) {
  const todoTasks = tasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN-PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a new array of tasks
    const updatedTasks = Array.from(tasks);
    
    // Find the task that was dragged
    const draggedTask = tasks.find(
      task => task.id.toString() === result.draggableId
    );

    if (draggedTask) {
      // Remove the task from its original position
      const taskIndex = tasks.findIndex(
        task => task.id === draggedTask.id
      );
      updatedTasks.splice(taskIndex, 1);

      // Find the destination index
      const destinationTasks = tasks.filter(
        task => task.status === destination.droppableId
      );
      
      // Update the task's status
      const updatedTask = {
        ...draggedTask,
        status: destination.droppableId
      };

      // Calculate the new position in the overall tasks array
      const allTasksBeforeDestination = tasks.filter(
        task => task.status === destination.droppableId && 
        tasks.indexOf(task) < tasks.indexOf(draggedTask)
      );
      
      const insertIndex = allTasksBeforeDestination.length + destination.index;
      
      // Insert the task at the new position
      updatedTasks.splice(insertIndex, 0, updatedTask);

      // Update the tasks state
      setTasks(updatedTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            title="To Do"
            tasks={todoTasks}
            id="TO-DO"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            />
            
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            id="IN-PROGRESS"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
          <Column
            title="Completed"
            tasks={completedTasks}
            id="COMPLETED"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
         
        </div>
      </div>
    </DragDropContext>
  );
}
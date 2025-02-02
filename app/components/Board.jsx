
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import Image from "next/image";

const TaskCard = ({ task, index, onEditTask, onDeleteTask }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg p-4 mb-3 shadow-sm ${snapshot.isDragging ? "shadow-lg" : ""
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
                  <Image
                    src="/edit_icon.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                  /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Image
                    src="/delete_icon.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                  /> Delete
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
            className={`min-h-svh transition-colors ${snapshot.isDraggingOver ? "bg-opacity-50" : ""
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
  onEditTask,
  onDeleteTask,
  setTasks,
}) {
  const todoTasks = tasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN-PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }


    const updatedTasks = Array.from(tasks);

    const draggedTask = tasks.find(
      task => task.id.toString() === result.draggableId
    );

    if (draggedTask) {
      const taskIndex = tasks.findIndex(
        task => task.id === draggedTask.id
      );
      updatedTasks.splice(taskIndex, 1);
      const destinationTasks = tasks.filter(
        task => task.status === destination.droppableId
      );

      const updatedTask = {
        ...draggedTask,
        status: destination.droppableId
      };

      const allTasksBeforeDestination = tasks.filter(
        task => task.status === destination.droppableId &&
          tasks.indexOf(task) < tasks.indexOf(draggedTask)
      );

      const insertIndex = allTasksBeforeDestination.length + destination.index;

      updatedTasks.splice(insertIndex, 0, updatedTask);

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
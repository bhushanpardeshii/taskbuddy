"use client"

import * as React from "react";
import { Bold, Italic, List, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const CreateTaskDialog = ({ isOpen, onOpenChange, onSubmit, initialData = {} }) => {
  const [task, setTask] = React.useState({
    title: "",
    description: "",
    date: new Date(),
    status: "TODO",
    category: "WORK",
    createdAt: new Date(),
    updatedAt: null,
    attachmentHistory: [],
  });

  React.useEffect(() => {
    if (initialData) {
      setTask({ ...task, ...initialData });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({
      title: "",
      description: "",
      date: new Date(),
      status: "TODO",
      category: "WORK"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl flex max-w-[904px]">
        <div className="flex flex-grow flex-col">

          <DialogHeader>
            <div className="flex items-center py-3 md:py-4 justify-between border-b">
              <DialogTitle className="font-medium text-xl">Create Task</DialogTitle>

            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              className="bg-gray-100"
              placeholder="Task title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />

            <div className="space-y-2 bg-gray-100 rounded-xl border">

              <Textarea

                placeholder="Description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                className="min-h-[60px] md:min-h-[100px] bg-gray-100 border-none resize-none"

              />
              <div className="flex gap-2  pb-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 pt-3 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-gray-600 text-sm">Task Category*</h1>
                <div className="flex gap-2" >

                  <Button
                    className="rounded-full px-8"
                    variant={task.category === "WORK" ? "default" : "outline"}
                    onClick={() => setTask({ ...task, category: "WORK" })}
                  >
                    Work
                  </Button>
                  <Button
                    className="rounded-full px-4"
                    variant={task.category === "PERSONAL" ? "default" : "outline"}
                    onClick={() => setTask({ ...task, category: "PERSONAL" })}
                  >
                    Personal
                  </Button>
                </div>
              </div>
              <div className="flex  flex-col gap-2">
                <h1 className="text-gray-600 text-sm">Due on*</h1>
                <Popover className="px-8">
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between  bg-gray-100 text-left font-normal">
                      {format(task.date, "PP")}
                      <CalendarIcon className=" h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={task.date} onSelect={(date) => setTask({ ...task, date })} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-gray-600 text-sm">Task Status*</h1>
                <Select onValueChange={(value) => setTask({ ...task, status: value })} value={task.status}>
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col md:pb-16 md:pt-10 gap-2">
              <h1 >Attachment</h1>
              <Button variant="outline" asChild>
                <label className="flex w-full bg-gray-100 items-center gap-2 cursor-pointer">
                  Drop your files here to
                  <span className="text-blue-600 underline">
                    Upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setTask({ ...task, attachment: e.target.files[0] })}
                  />
                </label>
              </Button>
              {task.attachment && <span className="text-sm border w-full flex justify-center p-2">{task.attachment.name}</span>}
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{initialData.id ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </div>
        <div className="w-2/7 md:flex flex-col mt-14 hidden bg-gray-100 p-4 rounded-xl">
          <h3 className="text-lg font-medium">Task Activity</h3>
          <div className="mt-2 text-xs">
            <p>You created this task {task.createdAt ? format(new Date(task.createdAt), "PPp") : "N/A"}</p>
            {task.updatedAt && <p><strong>Last Updated:</strong> {format(new Date(task.updatedAt), "PPpp")}</p>}


          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;

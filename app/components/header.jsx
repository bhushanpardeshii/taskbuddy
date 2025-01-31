"use client"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react";

export function Header({onViewChange,onAddTaskClick,handleLogout}) {
  const [activeView, setActiveView] = useState('list');

  const handleViewChange = (view) => {
    setActiveView(view);
    onViewChange(view);
  };
  return (
    <header className=" md:border-b md:px-8 md:py-8">

      <div className="flex bg-[#FAEEFC] md:bg-white px-4 md:px-0 py-2 md:py-0 justify-between space-x-4">
        <div className="flex flex-col justify-between">
          <h1 className="text-xl flex gap-2 text-2xl font-semibold">
            <Image src="/task_icon.svg" className="hidden md:flex" alt="Logo" width={29} height={29} />
            TaskBuddy</h1>
          <div className="hidden md:flex gap-4">
          <button 
              onClick={() => handleViewChange('list')}
              className={`flex gap-1 items-center ${activeView === 'list' ? 'text-[#7B1984] font-semibold' : ''}`}
            >
              <Image src="/list_icon.svg" alt="Logo" width={16} height={16} />
              List
            </button>
            <button 
              onClick={() => handleViewChange('board')}
              className={`flex gap-1 items-center ${activeView === 'board' ? 'text-[#7B1984] font-semibold' : ''}`}
            >
              <Image src="/board_icon.svg" alt="Logo" width={16} height={16} />
              Board
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Avatar>
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/taskbuddyheader-M3Olg6RK7nicBiTjQBt0p6eM8vpHWA.png"
              alt="User"
            />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Button className="rounded-xl hidden md:flex" variant="outline" size="sm"  onClick={handleLogout}>
           
            <Image src="/logout_icon.svg" alt="Logo" width={16} height={16} />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex mt-2 px-4 md:px-0 py-2 md:py-0 justify-between md:hidden">
<div></div>
      <Button className="bg-[#7B1984] md:hidden rounded-full hover:bg-purple-700" onClick={onAddTaskClick}>ADD TASK</Button>
      </div>
      <div className="flex flex-col px-4 md:px-0 pb-2 md:pb-0 gap-3 md:gap-0 md:flex-row md:items-center justify-between md:space-x-4 mt-4">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:space-x-4 md:items-center ">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <div className="flex gap-3">
            <Button className="rounded-full" variant="outline" size="sm">
              Category
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <Button className="rounded-full" variant="outline" size="sm">
              Due Date
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="flex gap-4">

          <div className="relative">
           
            <Image className="absolute left-3 top-3" src="/search_icon.svg" alt="Logo" width={16} height={16} />
            <Input placeholder="Search" className="pl-8 border rounded-full "
            />
          </div>
          <Button className="bg-[#7B1984] hidden md:flex rounded-full hover:bg-purple-700" onClick={() => {
    // console.log("Add Task Clicked!"); 
    onAddTaskClick();
  }}>ADD TASK</Button>
        </div>

      </div>


    </header>
  )
}


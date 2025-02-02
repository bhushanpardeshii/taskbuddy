"use client"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDown, ArrowDown01, ChevronDown } from "lucide-react"


export function Header({ onViewChange, onAddTaskClick, handleLogout, onFilterCategory, onSortByDate, onSearchTasks }) {
  const [activeView, setActiveView] = useState('list');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth State Changed:", currentUser);
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
              className={`flex gap-1 text-gray-700 items-center ${activeView === 'list' ? 'text-black underline font-semibold' : ''}`}
            >
              <Image src="/list_icon.svg" alt="Logo" width={16} height={16} />
              List
            </button>
            <button
              onClick={() => handleViewChange('board')}
              className={`flex gap-1 text-gray-700 items-center ${activeView === 'board' ? 'text-black underline font-semibold' : ''}`}
            >
              <Image src="/board_icon.svg" alt="Logo" width={16} height={16} />
              Board
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">

            {user?.photoURL && (
              <Image
                className="rounded-full"
                src={user.photoURL}
                alt="User Avatar"
                width={40}
                height={40}
              />

            )}
            <h3 className="hidden md:flex text-sm text-gray-700">{user?.displayName}</h3>
          </div>
          <Button className="rounded-xl hidden md:flex" variant="outline" size="sm" onClick={handleLogout}>

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-gray-600  rounded-full px-3 py-1">
                  Category
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">

                <DropdownMenuItem onClick={() => onFilterCategory("WORK")}>WORK</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterCategory("PERSONAL")}>PERSONAL</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" text-gray-600 rounded-full px-3 py-1">
                  Due Date
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">

                <DropdownMenuItem onClick={() => onSortByDate("asc")}>Oldest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortByDate("desc")}>Newest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-4">

          <div className="relative">

            <Image className="absolute left-3 top-3" src="/search_icon.svg" alt="Logo" width={16} height={16} />
            <Input placeholder="Search" className="pl-8 border rounded-full" value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearchTasks(e.target.value);
              }}
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


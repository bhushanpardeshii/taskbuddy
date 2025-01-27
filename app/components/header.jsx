import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="border-b px-6 py-4">
    
       <div className="flex justify-between space-x-4">
         <div className="flex flex-col justify-between">
          <h1 className="text-xl flex gap-2 text-2xl font-semibold">
            <Image src="/task_icon.svg" alt="Logo" width={29} height={29} />
            TaskBuddy</h1>
           <div className="flex gap-4">
             <h1 className="flex gap-1 items-center">
             <Image src="/list_icon.svg" alt="Logo" width={16} height={16} />
                List</h1>
                <h1 className="flex gap-1 items-center ">
             <Image src="/board_icon.svg" alt="Logo" width={16} height={16} />
                Board</h1>
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
             <Button className="rounded-xl" variant="outline" size="sm">
             <Image src="/logout_icon.svg" alt="Logo" width={16} height={16} />
              Logout
             </Button>
            </div>
        </div>
        <div className="flex items-center justify-between space-x-4 mt-4">
        <div className="flex space-x-4 items-center ">
         <span className="text-sm text-muted-foreground">Filter by:</span>
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
        <div className="flex gap-4">

          <div className="relative">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            <Image className="absolute left-3 top-3" src="/search_icon.svg" alt="Logo" width={16} height={16} />
            <Input placeholder="Search" className="pl-8 border rounded-full "
            />
          </div>
          <Button className="bg-[#7B1984] rounded-full hover:bg-purple-700">ADD TASK</Button>
        </div>
           
        </div>
      
      
    </header>
  )
}


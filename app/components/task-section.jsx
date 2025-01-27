import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TaskSection({ title, count, color, isExpanded, onToggle, children }) {
  return (
    <div className="mb-4 rounded-2xl">
      <Button variant="ghost" onClick={onToggle} className={`w-full justify-between p-3 ${color} hover:${color}/90`}>
        <div className="flex items-center">
          <span className="font-medium">{title}</span>
          <span className="ml-2">({count})</span>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      {isExpanded && <div className="p-4 rounded-2xl bg-gray-100">{children}</div>}
    </div>
  )
}


import { Bell, Search, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] bg-muted"
          />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>TD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}


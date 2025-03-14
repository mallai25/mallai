"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function UserInfoForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted:", { name, description })
    // Here you would typically send this data to an API or perform some other action
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Please enter your name and a brief description about yourself.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about yourself"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-lg"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full rounded-lg">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function FlyerShare() {
  const [flyer, setFlyer] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFlyer(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically upload the file to your server
    console.log("Uploading flyer:", flyer)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Flyers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="flyer">Upload Flyer</Label>
            <Input id="flyer" type="file" onChange={handleFileChange} />
          </div>
          <Button type="submit" className="w-full">Share Flyer</Button>
        </form>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recent Flyers</h4>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Summer_Campaign_Flyer.pdf</span>
              <Button variant="outline" size="sm">View</Button>
            </li>
            <li className="flex justify-between items-center">
              <span>New_Product_Launch.pdf</span>
              <Button variant="outline" size="sm">View</Button>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


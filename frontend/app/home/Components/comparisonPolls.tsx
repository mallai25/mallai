'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Sparkles } from "lucide-react"

type FlavorComparison = {
  name: string
  preference: number
  color: string
}

const currentFlavors: FlavorComparison[] = [
  {
    name: "Sour Strawberry",
    preference: 42,
    color: "bg-red-500",
  },
  {
    name: "Blue Raspberry",
    preference: 28,
    color: "bg-blue-500",
  },
  {
    name: "Green Apple",
    preference: 18,
    color: "bg-green-500",
  },
  {
    name: "Pink Lemonade",
    preference: 12,
    color: "bg-pink-400",
  }
]

const requestedFlavors = [
  { name: "Watermelon Blast", votes: 32 },
  { name: "Tropical Punch", votes: 28 },
  { name: "Cherry Cola", votes: 22 },
  { name: "Grape Soda", votes: 18 }
]

function FlavorPreferenceBar({ flavor }: { flavor: FlavorComparison }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs md:text-sm font-medium">{flavor.name}</span>
        </div>
        <div className="h-1.5 md:h-2 bg-gray-100 mt-4 rounded-full overflow-hidden">
          <div
            className={`h-full ${flavor.color} transition-all duration-300`}
            style={{ width: `${flavor.preference}%` }}
          />
        </div>
      </div>
      <div className="mt-2 flex justify-center">
      <span className="text-xs md:text-sm text-gray-500">{flavor.preference}%</span>
      </div>
    </div>
  )
}

function NewFlavorBar({ name, votes, maxVotes }) {
  const percentage = (votes / maxVotes) * 100
  
  return (
    <div className="border rounded-lg p-3 ">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs md:text-sm font-medium">{name}</span>
      </div>
      <div className="h-1.5 md:h-2 mt-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-center">
      <span className="text-xs md:text-sm text-gray-500">{votes} votes</span>
</div>
    </div>
  )
}

export function ComparisonComponent() {
  const maxVotes = Math.max(...requestedFlavors.map(f => f.votes))

  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="mb-3 grid w-full grid-cols-2 bg-transparent gap-2">
        <TabsTrigger 
          value="current" 
          className="data-[state=active]:bg-emerald-600 rounded-full data-[state=active]:text-white shadow-sm border bg-white hover:bg-gray-50 data-[state=active]:hover:bg-emerald-600"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Current Flavors</span>
            <span className="sm:hidden">Current</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="requested" 
          className="data-[state=active]:bg-emerald-600 rounded-full data-[state=active]:text-white shadow-sm border bg-white hover:bg-gray-50 data-[state=active]:hover:bg-emerald-600"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Requested Flavors</span>
            <span className="sm:hidden">Requested</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="current">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 md:gap-4 pb-2 md:pb-4">
          {currentFlavors.map((flavor) => (
              <div key={flavor.name} className="inline-block">
                <FlavorPreferenceBar flavor={flavor} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="requested">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 md:gap-4 pb-2 md:pb-4">
            {requestedFlavors.map((flavor) => (
              <div key={flavor.name} className="inline-block">
                <NewFlavorBar 
                  name={flavor.name} 
                  votes={flavor.votes} 
                  maxVotes={maxVotes}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
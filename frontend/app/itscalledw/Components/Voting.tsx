'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Sparkles } from "lucide-react"
import { useState } from "react";

type FlavorComparison = {
  name: string
  preference: number
  color: string
}

const initialCurrentFlavors: FlavorComparison[] = [
  {
    name: "W ORIGINAL",
    preference: 65,
    color: "bg-yellow-500",
  },
  {
    name: "WAVE BREAKER",
    preference: 45,
    color: "bg-blue-500",
  },
  {
    name: "DEEP WOODS",
    preference: 18,
    color: "bg-green-500",
  },
  {
    name: "FRESH ICE",
    preference: 12,
    color: "bg-gray-400",
  }
]

const initialRequestedFlavors = [
  { name: "Watermelon Blast", votes: 32 },
  { name: "Tropical Punch", votes: 28 },
  { name: "Cherry Cola", votes: 22 },
  { name: "Grape Soda", votes: 18 }
]

function FlavorPreferenceBar({ flavor }: { flavor: FlavorComparison }) {
  return (
    <div className=" mb-3 border rounded-lg p-3">
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
    <div className="mb-3 border rounded-lg p-3 ">
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

export function Voting() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [votedFlavors, setVotedFlavors] = useState<string[]>([]);
  const maxVotes = Math.max(...initialRequestedFlavors.map(f => f.votes));

  const handleVote = (flavorName: string, isCurrentFlavor: boolean) => {
    if (votedFlavors.includes(flavorName)) return;
    
    setVotedFlavors(prev => [...prev, flavorName]);
    
    if (isCurrentFlavor) {
      setCurrentFlavors(prev => 
        prev.map(f => 
          f.name === flavorName 
            ? { ...f, preference: f.preference + 1 }
            : f
        )
      );
    } else {
      setRequestedFlavors(prev =>
        prev.map(f =>
          f.name === flavorName
            ? { ...f, votes: f.votes + 1 }
            : f
        )
      );
    }
  };

  const [currentFlavors, setCurrentFlavors] = useState(initialCurrentFlavors);
  const [requestedFlavors, setRequestedFlavors] = useState(initialRequestedFlavors);

  const polls = [
    {
      id: 1,
      question: "Which flavor do you prefer?",
      options: [
        { id: 1, text: "Strawberry", votes: 45 },
        { id: 2, text: "Blue Raspberry", votes: 30 },
        { id: 3, text: "Green Apple", votes: 25 },
      ],
    },
    {
      id: 2,
      question: "How sour do you like your candy?",
      options: [
        { id: 1, text: "Very Sour", votes: 40 },
        { id: 2, text: "Moderately Sour", votes: 35 },
        { id: 3, text: "Slightly Sour", votes: 25 },
      ],
    },
    {
      id: 3,
      question: "Preferred package size?",
      options: [
        { id: 1, text: "Small (32g)", votes: 30 },
        { id: 2, text: "Medium (64g)", votes: 45 },
        { id: 3, text: "Large (128g)", votes: 25 },
      ],
    },
  ];

  return (
    <div className="flex w-full items-center justify-center">
      <Tabs defaultValue="current" className="w-full">
        <div className="flex w-full justify-center">
          <TabsList className="mb-4 w-[300px] sm:w-[400px] bg-transparent">
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:bg-emerald-600 w-full rounded-full data-[state=active]:text-white shadow-sm border bg-white hover:bg-gray-50 data-[state=active]:hover:bg-emerald-600"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Current</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="current">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {currentFlavors.map((flavor) => (
              <Card key={flavor.name} className="w-full max-w-[350px] sm:w-[300px] bg-white">
                <CardContent className="p-4">
                  {/* <h3 className="text-lg font-semibold mb-4 text-center">{flavor.name}</h3> */}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{flavor.name}</span>
                        <span>{flavor.preference}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${flavor.color} rounded-full transition-all duration-500`}
                          style={{ width: `${flavor.preference}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => handleVote(flavor.name, true)}
                        disabled={votedFlavors.includes(flavor.name)}
                        className="px-6 py-2 rounded-full border border-gray-300 text-sm font-medium transition-all
                          hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
                        aria-label="Vote"
                      >
                        {votedFlavors.includes(flavor.name) ? 'Voted' : 'Vote'}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
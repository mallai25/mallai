'use client'

import { Card } from "@/components/ui/card"
import { Gift } from "lucide-react"

export function LoyaltyCard() {
  const stamps = [
    { date: "06/01", stamped: true },
    { date: "06/15", stamped: true },
    { date: "06/28", stamped: true },
    { date: "07/05", stamped: true },
    { date: "07/12", stamped: true },
    { date: "07/20", stamped: true },
    { date: "07/28", stamped: false },
    { date: "", stamped: false },
    { date: "", stamped: false },
  ]

  return (
    <Card className="w-[min(100%,500px)] bg-white p-2 sm:p-4 sm:pb-5 flex flex-col shadow">
      <div className="mb-1 sm:mb-1.5 flex items-center justify-between w-full">
        <p className="text-sm sm:text-base leading-tight sm:leading-snug text-gray-600">
          Share purchase reciepts, Get instore Rewards
        </p>
        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 ml-2" />
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2 justify-center">
        {stamps.map((stamp, i) => (
          <div key={i} className="flex flex-col items-center">
            {stamp.stamped ? (
              <>
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-emerald-600 rounded-full flex items-center justify-center mb-0.5 sm:mb-2">
                  <span className="text-white text-[10px] sm:text-sm font-bold">✓</span>
                </div>
                <span className="text-[8px] sm:text-xs text-gray-600">{stamp.date}</span>
              </>
            ) : (
              <>
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-gray-300 mb-0.5 sm:mb-2" 
                     aria-label="Empty stamp spot" />
                <span className="text-[8px] sm:text-xs text-gray-300">{stamp.date}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
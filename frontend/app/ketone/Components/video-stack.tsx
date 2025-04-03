'use client'

import { useState } from "react"
import Image from "next/image"
import { Play, ChevronRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import Foundketone from './Thumbnails/Foundketone.png'
import TryIt from './Thumbnails/Checkit.png'
import Unboxed from './Thumbnails/Unboxing.png'

const videos = [
  {
    id: "https://ik.imagekit.io/archivecdn/facebook/2023/8/8/241aaafd-0774-4dc6-88cb-4bd9c66045f5/IG_reel_steph_rose_phase6_2023-08-08.mp4?tr=h-704,ar-9-16,fo-center,f-auto,q-50",
    title: "Natural Energy Source",
    timestamp: "2023-08-05T09:15:00Z",
    thumbnail: Foundketone
  },
  {
    id: "https://ik.imagekit.io/archivecdn/facebook/2024/6/2/845cbeb9-dc01-4945-bd75-7c74059d69a4/IG_reel_sketchyandylewis_2024-06-02.mp4?tr=h-704,ar-9-16,fo-center,f-auto,q-50",
    title: "Peach Caffeine Shot",
    timestamp: "2023-08-10T15:30:00Z",
    thumbnail: TryIt
  },
  {
    id: "https://ik.imagekit.io/archivecdn/facebook/2024/6/10/e04dc9d8-488d-40c9-b336-a15f5a1aa23e/IG_reel_benjohnson763_2024-06-10.mp4?tr=h-704,ar-9-16,fo-center,f-auto,q-50",
    title: "Ketone-IQ Unboxing",
    thumbnail: Unboxed
  }
]


export function VideoStack() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    

<div className="min-h-[410px] sm:min-h-[430px] flex items-center justify-center pt-2">
<div className="relative w-full max-w-[330px] sm:max-w-[380px] rounded-[16px] sm:rounded-[30px] h-[420px] sm:h-[460px] overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-full">
    {videos.map((video, index) => (
      <Card 
        key={index} 
        className={`absolute top-0 left-0 w-full max-w-[320px] sm:max-w-[340px] rounded-[16px] sm:rounded-[20px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${index < currentIndex ? 'opacity-0' : 
            index === currentIndex ? 'z-30 shadow-[0px_8px_16px_rgba(0,0,0,0.08)]' : 
            index === currentIndex + 1 ? 'z-20 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] opacity-90' :
            index === currentIndex + 2 ? 'z-10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] opacity-75' :
            'opacity-0'}`}
        style={{
          transform: `translateX(${(index - currentIndex) * 24}px) translateY(${(index - currentIndex) * 12}px) scale(${1 - (index - currentIndex) * 0.03})`,
          opacity: index < currentIndex ? 0 : 1,
        }}
      >
        <CardContent className="p-0">
          <div className="relative w-full h-[320px] sm:h-[370px]">
            {isPlaying && index === currentIndex ? (
              <iframe
                width="100%"
                height="100%"
                src={`${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <Image
                  src={video.thumbnail}
                  alt={`Thumbnail for ${video.title}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 320px, 370px"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity hover:bg-black/20" />
                <Button 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-white/95 hover:bg-white hover:scale-105 transition-all duration-300"
                  onClick={handlePlay}
                >
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 text-black ml-1" fill="currentColor" />
                </Button>
                
              </>
            )}
          </div>
          <div className="p-3 sm:p-3">
            <h2 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 mb-2">
              {video.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  <Button 
    onClick={handleNext} 
    className="absolute bottom-[110px] border border-white right-4 sm:right-4 z-40 rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-300/50 to-emerald-400/50 hover:from-emerald-400/60 hover:to-emerald-500/60 transition-all duration-300 flex items-center justify-center group"
    aria-label="Next video"
  >
    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform duration-300" />
  </Button>
</div>
</div>
  )
}
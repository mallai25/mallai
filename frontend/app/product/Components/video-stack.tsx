'use client'

import { useState } from "react"
import Image from "next/image"
import { Play, ChevronRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VideoStackProps {
  selectedProduct: any;
  brandName: string;
}

export function VideoStack({ selectedProduct, brandName }: VideoStackProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <>
    {selectedProduct.thumbnailUrl && (
      <div className="min-h-[410px] sm:min-h-[410px] flex items-center justify-center mt-12">
      <div className="relative w-full max-w-[330px] sm:max-w-[380px] rounded-[16px] sm:rounded-[30px] h-[420px] sm:h-[460px] overflow-hidden">
        <Card className="w-full max-w-[320px] sm:max-w-[340px] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-[0px_8px_16px_rgba(0,0,0,0.08)]">
          <CardContent className="p-0">
            <div className="relative w-full h-[320px] sm:h-[370px]">
              {isPlaying ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedProduct.videoUrl}?autoplay=1`}
                  title={brandName}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <Image
                    src={selectedProduct.thumbnailUrl}
                    alt={`Thumbnail for ${brandName}`}
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
                {brandName}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    )}
    </>
    
  )
}
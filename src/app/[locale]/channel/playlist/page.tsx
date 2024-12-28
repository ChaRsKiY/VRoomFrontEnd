'use client'

import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Play, Pause } from 'lucide-react'

// Placeholder data
const playlistData = {
  title: "My Awesome Playlist",
  description: "A collection of my favorite videos",
  videos: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Video ${i + 1}`,
    thumbnail: `/placeholder.svg?height=90&width=160`,
    duration: "10:30",
  }))
}

export default function PlaylistView() {
  const [currentVideo, setCurrentVideo] = useState(playlistData.videos[0])
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar with video list */}
      <div className="w-full md:w-96 border-r">
        <Card className="h-full rounded-none">
          <CardHeader>
            <CardTitle>{playlistData.title}</CardTitle>
            {/* <CardDescription>{playlistData.description}</CardDescription> */}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)] md:h-[calc(100vh-180px)]">
              {playlistData.videos.map((video, index) => (
                <Button
                  key={video.id}
                  variant={currentVideo.id === video.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-2 py-4 h-auto"
                  onClick={() => setCurrentVideo(video)}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-4 flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-left line-clamp-2">{video.title}</p>
                    </div>
                    <span className="text-muted-foreground text-sm ml-2">
                      {index + 1}
                    </span>
                  </div>
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="flex-grow p-6">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="outline" onClick={() => {
            const currentIndex = playlistData.videos.findIndex(v => v.id === currentVideo.id)
            const prevVideo = playlistData.videos[currentIndex - 1]
            if (prevVideo) setCurrentVideo(prevVideo)
          }}>
            <ChevronUp className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" onClick={() => {
            const currentIndex = playlistData.videos.findIndex(v => v.id === currentVideo.id)
            const nextVideo = playlistData.videos[currentIndex + 1]
            if (nextVideo) setCurrentVideo(nextVideo)
          }}>
            <ChevronDown className="mr-2 h-4 w-4" />
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, Shuffle, MoreVertical, Clock, Share2 } from 'lucide-react'
import { PiQueue } from "react-icons/pi"
import { FaRegBookmark } from "react-icons/fa"
import { IoTrashOutline } from "react-icons/io5"
import { GoReport } from "react-icons/go"
import { IVideo } from "@/types/videoinfo.interface"
import api from "@/services/axiosApi"

export default function PlaylistContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const playlistId = searchParams.get('playlistId')
  const [playlistData, setPlaylistData] = useState<{
    title: string
    description: string
    videos: IVideo[]
    channelName: string
    totalVideos: number
    totalViews: number
  } | null>(null)

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return
      
      try {
        const response = await api.get(`/PlayList/${playlistId}`)
        console.log('API Response:', response.data) // Для дебагу
        
        const data = response.data
        if (data && typeof data === 'object') {
          setPlaylistData({
            title: data.title || 'Untitled Playlist',
            description: data.description || '',
            videos: data.videos || [],
            channelName: data.channelName || 'Unknown Channel',
            totalVideos: data.videos?.length || 0,
            totalViews: data.totalViews || 0
          })
        }
      } catch (error) {
        console.error('Error fetching playlist:', error)
      }
    }

    fetchPlaylist()
  }, [playlistId])

  if (!playlistData) {
    return <div className="pl-[250px]">Завантаження...</div>
  }

  return (
    <div className="pl-[250px]">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4"> {/* Змінено на 4 колонки і збільшено gap */}
      {/* Ліва панель з інформацією про плейлист */}
      <div className="md:col-span-1">
        <Card className="h-fit sticky top-4">
          <CardContent className="p-6"> 
              <div className="relative aspect-video mb-4 select-none">
                {playlistData.videos.length > 0 && (
                  <Image
                    src={`data:image/jpeg;base64,${playlistData.videos[0].cover}`}
                    alt={playlistData.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg pointer-events-none"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none rounded-lg">
                  <p className="text-white text-2xl font-bold">{playlistData.totalVideos} відео</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">{playlistData.title}</h1>
              <p className="text-sm text-muted-foreground mb-4">{playlistData.description}</p>
              <p className="text-sm font-medium mb-1">{playlistData.channelName}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {playlistData.totalViews.toLocaleString()} переглядів
              </p>
              <div className="flex flex-col space-y-2">
  <Button className="w-full py-2 text-sm"> {/* Зменшено padding і розмір тексту */}
    <Play className="mr-2 h-4 w-4" /> {/* Зменшено розмір іконки */}
    Відтворити все
  </Button>
  <Button variant="outline" className="w-full py-2 text-sm"> {/* Зменшено padding і розмір тексту */}
    <Shuffle className="mr-2 h-4 w-4" /> {/* Зменшено розмір іконки */}
    Перемішати
  </Button>
</div>
            </CardContent>
          </Card>
        </div>

        {/* Права панель зі списком відео */}
        <div className="md:col-span-3"> {/* Змінено на 3 колонки */}
        <Card className="h-[calc(100vh-32px)]">
          <CardContent className="p-6"> {/* Збільшено padding */}
            <ScrollArea className="h-[calc(100vh-64px)]">
              <div className="space-y-6"> {/* Збільшено відступ між відео */}
                  {playlistData.videos.map((video) => (
                    <div 
                      key={video.id} 
                      className="group relative hover:bg-accent rounded-lg transition-colors p-2"
                    >
                      <div 
                        className="flex gap-4 cursor-pointer"
                        onClick={() => router.push(`/watch?v=${video.id}`)}
                      >
                        <div className="w-48 flex-shrink-0">
                          <Image
                            src={`data:image/jpeg;base64,${video.cover}`}
                            alt={video.tittle}
                            width={320}
                            height={180}
                            className="rounded-lg aspect-video object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold mb-2 line-clamp-2">{video.tittle}</h3>
                          <p className="text-sm text-muted-foreground">{video.channelName}</p>
                          <p className="text-sm text-muted-foreground">
                            {video.viewCount?.toLocaleString()} переглядів
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <PiQueue className="mr-2 h-4 w-4" />
                            Додати до черги
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Дивитися пізніше
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FaRegBookmark className="mr-2 h-4 w-4" />
                            Зберегти в плейлист
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Поділитися
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IoTrashOutline className="mr-2 h-4 w-4" />
                            Видалити з плейлиста
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <GoReport className="mr-2 h-4 w-4" />
                            Поскаржитися
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
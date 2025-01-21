'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/clerk-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MoreVertical, Share2, PlaySquare, ChevronRight } from 'lucide-react'
import { PiQueue } from "react-icons/pi"
import { FaRegBookmark } from "react-icons/fa"
import { IoTrashOutline } from "react-icons/io5"
import { GoReport } from "react-icons/go"
import api from "@/services/axiosApi"
import { VideoHistoryItem } from "@/types/VideoHistoryItem"
import { base64ToUint8Array, byteArrayToBase64 } from "@/utils/base64Functions"
import { formatNumber } from "@/utils/format"
import ShortChannelBlock from "@/components/pages/channel/aside/shortChannelBlock"

export default function ChannelPage() {
  const [shortHistory, setShortHistory] = useState<VideoHistoryItem[]>([])
  const [playlists, setPlaylists] = useState<any[]>([])
  const [expandedView, setExpandedView] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const response = await api.get(`/HistoryOfBrowsing/getlatestvideohistorybyuseridpaginated/${user.id}`)
          if (response.status === 200) {
            setShortHistory(response.data)
          }
        } catch (error) {
          console.error('Error fetching history:', error)
        }
      }

      const fetchPlaylists = async () => {
        try {
          const response = await api.get(`/PlayList/getbyuserid/${user.id}`)
          if (response.status === 200) {
            setPlaylists(response.data)
          }
        } catch (error) {
          console.error('Error fetching playlists:', error)
        }
      }

      fetchHistory()
      fetchPlaylists()
    }
  }, [user])

  if (!isSignedIn) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center text-center p-10 pt-30">
        <PlaySquare className="h-16 w-16 text-gray-400 mb-6" />
        <h1 className="text-xl font-semibold">Войдите в аккаунт</h1>
        <p className="text-gray-500 mt-2">Здесь вы увидите сохраненные видео и те, которые вам понравились.</p>
        <Button asChild className="mt-4">
          <Link href="/auth/signin">
            Войти
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl"> {/* Updated opening div */}
      <ShortChannelBlock />

      {/* History Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">История</h2>
          <Button variant="link" asChild>
            <Link href="/history">Посмотреть все</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shortHistory?.map((item) => (
            <div key={item.id} className="group relative">
              <div
                className="cursor-pointer"
                onClick={() => router.push(item.vRoomVideoUrl)}
              >
                <Image
                  src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                  alt={item.videoTitle}
                  width={320}
                  height={180}
                  className="rounded-lg w-full aspect-video object-cover"
                />
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-2">{item.videoTitle}</h3>
                  <p className="text-sm text-gray-600">{item.channelName}</p>
                  <p className="text-sm text-gray-600">{formatNumber(item.viewCount)} просмотров</p>
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
                    Добавить в очередь
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Clock className="mr-2 h-4 w-4" />
                    Смотреть позже
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaRegBookmark className="mr-2 h-4 w-4" />
                    Сохранить в плейлист
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IoTrashOutline className="mr-2 h-4 w-4" />
                    Удалить из истории
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <GoReport className="mr-2 h-4 w-4" />
                    Пожаловаться
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists Section */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Плейлисты</h2>
          {playlists.length > 4 && (
            <Button variant="link" onClick={() => setExpandedView(!expandedView)}>
              {expandedView ? 'Свернуть' : 'Посмотреть все'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.slice(0, expandedView ? playlists.length : 4).map((playlist) => (
            <Link
              key={playlist.id}
              href={`/channel/playlist?playlistId=${playlist.id}`}
              className="block group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={playlist.thumbnail || '/placeholder.svg'}
                      alt={playlist.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {playlist.videoCount} видео
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {playlist.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Посмотреть полный плейлист
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {!expandedView && playlists.length > 4 && (
            <Card
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setExpandedView(true)}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-6">
                <PlaySquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Посмотреть все плейлисты
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
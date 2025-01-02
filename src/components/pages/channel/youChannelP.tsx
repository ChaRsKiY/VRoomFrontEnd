"use client"

import React, {useEffect, useState} from 'react'
import {useUser} from "@clerk/clerk-react";
import ShortChannelBlock from "@/components/pages/channel/aside/shortChannelBlock";
import Link from "next/link";
import api from "@/services/axiosApi";
import {VideoHistoryItem} from "@/types/VideoHistoryItem";
import Image from "next/image";
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {formatNumber} from "@/utils/format";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Clock, MoreVertical, Share2} from "lucide-react";
import {PiQueue} from "react-icons/pi";
import {FaRegBookmark} from "react-icons/fa";
import {IoTrashOutline} from "react-icons/io5";
import {GoReport} from "react-icons/go";
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PlaySquare, ChevronRight } from 'lucide-react'

const YouChannelP = () => {
    const [shortHistory, setShortHistory] = useState<VideoHistoryItem[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]); // New state for playlists
    const [expandedView, setExpandedView] = useState(false); // State for toggling view
    const { isSignedIn, user } = useUser();
    const router = useRouter();
  
    // Function to toggle the playlist view
    const toggleView = () => setExpandedView(!expandedView);
  
    useEffect(() => {
      if (user) {
        // Fetch history
        const fetchHistory = async () => {
          const response = await api.get(`/HistoryOfBrowsing/getlatestvideohistorybyuseridpaginated/1/4/${user.id}`);
          if (response.status === 200) {
            const hist = await response.data;
            setShortHistory(hist);
          }
        };
  
        // Fetch playlists
        const fetchPlaylists = async () => {
          const response = await api.get(`/PlayList/getbyuserid/${user.id}`); // Assuming there's an endpoint for playlists
          if (response.status === 200) {
            const playlistsData = await response.data;
            setPlaylists(playlistsData);
          }
        };
  
        fetchHistory();
        fetchPlaylists();
      }
    }, [user]);
  
    if (!isSignedIn) {
      return (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-10 pt-30">
          <i className="fas fa-play-circle text-7xl text-gray-400 mb-6"></i>
          <h1 className="text-1xl font-semibold">Войдите в аккаунт</h1>
          <p className="text-gray-500 mt-2">Здесь вы увидите сохраненные видео и те, которые вам понравились.</p>
          <Link href="/auth/signin" className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            Войти
          </Link>
        </div>
      );
    }
  
    return (
      <div className="pl-[20.5%] ml-2 max-lg:pl-[11%] max-sm:pl-0 pt-10">
        <ShortChannelBlock />
        <div className="mt-8">
          <h2 className="text-xl font-bold">История</h2>
          <div className="flex justify-between items-center mt-4">
            {shortHistory?.map((item) => (
              <div className="pr-1.5" key={item.id}>
                <div className="flex flex-col mb-4 cursor-pointer w-max">
                  <Image
                    onClick={() => router.push(item.vRoomVideoUrl)}
                    src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                    alt={item.videoTitle}
                    className="rounded-[8px] aspect-video p-0.5"
                    width={210}
                    height={120}
                  />
                  <div className="flex flex-col relative" style={{ marginLeft: '10px' }}>
                    <h1 className="text-[20px] font-semibold">{item.videoTitle}</h1>
                    <p className="text-[14px] text-gray-600">{item.channelName}</p>
                    <p className="text-[14px] text-gray-600">{formatNumber(item.viewCount)} views</p>
                    <div className="absolute flex flex-row items-center top-0 right-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="mm" className="ml-auto">
                            <MoreVertical className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <PiQueue className="mr-2 h-4 w-4" /> Add to queue
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" /> Save to Watch later
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FaRegBookmark className="mr-2 h-4 w-4" /> Save to playlist
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IoTrashOutline className="mr-2 h-4 w-4" /> Delete from view history
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <GoReport className="mr-2 h-4 w-4" /> Send feedback
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col mb-4 cursor-pointer">
              <Link href="/history" className="text-blue-600 w-48 block p-7">
                Посмотреть все
              </Link>
            </div>
          </div>
        </div>
  
        <div className="pl-[20.5%] ml-2 max-lg:pl-[11%] max-sm:pl-0 pt-10">
  <div className="mt-8 w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Плейлисты</h2>
      <Button variant="link" className="text-primary" onClick={toggleView}>
        {expandedView ? 'Свернуть' : 'Посмотреть все'}
      </Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {playlists.slice(0, expandedView ? playlists.length : 4).map((playlist) => (
        <Link key={playlist.id} href={`/channel/playlist/${playlist.id}`} passHref>
          <Card className="cursor-pointer">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="object-cover rounded-t-lg"
                  width={200}
                  height={120}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                  {playlist.videoCount} видео
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-sm line-clamp-2">{playlist.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Посмотреть полный плейлист</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {!expandedView && (
        <Card className="flex items-center justify-center">
          <CardContent className="p-4 text-center">
            <PlaySquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Посмотреть все плейлисты</p>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
</div>
</div>
    );
  };
  
  export default YouChannelP;
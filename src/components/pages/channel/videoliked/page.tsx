// import React, { FC } from "react";
// import initTranslations from "@/app/i18n";
// import { data } from "@/testdata/videos";
// import AsideHome from "@/components/pages/home/aside/aside";
// import HeaderHome from "@/components/pages/home/header/header";
// import LikedVideos from "@/components/pages/home/main/liked-video-block";
// import { RiShuffleFill, RiSlideshow3Line } from "react-icons/ri";

// interface IHomeProps {
//   params: {
//     locale: string;
//   };
// }

// const Home: FC<IHomeProps> = async ({ params: { locale } }) => {
//     const { t } = await initTranslations(locale, ['common', 'categories']);
//     const firstVideo = data[0];
//     return (
//         <>
//           <HeaderHome t={t} /> 
//           <div className="flex pt-20 overflow-hidden h-screen"> 

//             <AsideHome t={t} /> 
    
//             <div className="sticky top-[80px] ml-[20%] w-1/3 bg-gray-400 text-white p-5 rounded-lg h-[calc(100vh-80px)] flex flex-col justify-start z-10"> 
//               <img
//                 src={firstVideo.cover}
//                 alt={firstVideo.title}
//                 className="w-full h-auto object-cover rounded-lg mb-4"
//               />
//               <h2 className="text-2xl font-bold mb-2">{t('liked video')}</h2>
//               <p className="mb-4">{firstVideo.title}</p>
//               <div className="flex space-x-4">
//                 <button className="bg-blue-500 text-white px-16 py-2 rounded-lg">
//                   <RiSlideshow3Line /> {t('Play')}
//                 </button>
//                 <button className="bg-gray-700 text-white px-6 py-2 rounded-lg">
//                   <RiShuffleFill /> {t('Shuffle')}
//                 </button>
//               </div>
//             </div>

//             <main className="flex-grow overflow-y-scroll h-[calc(100vh-80px)] pl-10"> 
//               <div className="flex-grow p-5">
//                 <LikedVideos t={t} /> 
//               </div>
//             </main>
//           </div>
//         </>
//       );
//     };
    
  
//   export default Home;
"use client"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlayCircle, MoreVertical, Plus, ListPlus, Share2, Users, Settings, Trash2, ChevronDown, Clock, List, ArrowUpToLine, ArrowDownToLine, Image } from "lucide-react"

export default function PlaylistInterface() {
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_5-DtWGpay1YycZKGb7cE8hFnJo8NDmE9.png"
              alt="Playlist Thumbnail"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h1 className="text-2xl font-bold mb-2">Meet real TF2 mercenaries</h1>
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Life Hater" />
                  <AvatarFallback>LH</AvatarFallback>
                </Avatar>
                <span className="text-sm">Life Hater</span>
              </div>
              <p className="text-sm opacity-80">Playlist • Private • 2 videos • 333 views</p>
              <p className="text-sm opacity-80 mt-2">
                Meet the TF2 Sniper, one of many amazing Voice Actors behind Team Fortress 2! Make sure to get an autograp...
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button className="bg-white text-black hover:bg-gray-100">
              <PlayCircle className="mr-2 h-4 w-4" /> Play all
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" /> Add videos
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListPlus className="mr-2 h-4 w-4" /> Add all to...
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" /> Collaborate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Playlist settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm">
                  Sort <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Date added (newest)</DropdownMenuItem>
                <DropdownMenuItem>Date added (oldest)</DropdownMenuItem>
                <DropdownMenuItem>Most popular</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {[
            { title: "Meet the REAL Sniper (TF2 Voice Actor)", views: "1M", time: "5 months ago" },
            { title: "Meet the REAL Heavy", views: "2.4M", time: "1 year ago" }
          ].map((video, index) => (
            <div key={index} className="flex items-start space-x-4 mb-4">
              <div className="relative flex-shrink-0">
                <img
                  src={`/placeholder.svg?height=90&width=160&text=Video ${index + 1}`}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                  {index === 0 ? "3:54" : "4:02"}
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-500">
                  {video.views} views • {video.time}
                </p>
                <p className="text-sm text-gray-500">Added by Life Hater</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ListPlus className="mr-2 h-4 w-4" /> Add to queue
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Clock className="mr-2 h-4 w-4" /> Save to Watch later
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <List className="mr-2 h-4 w-4" /> Save to playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpToLine className="mr-2 h-4 w-4" /> Move to top
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowDownToLine className="mr-2 h-4 w-4" /> Move to bottom
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Image className="mr-2 h-4 w-4" /> Set as playlist thumbnail
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
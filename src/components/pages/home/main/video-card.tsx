import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";
import {Button} from '@/components/ui/button';
import PlayListInterface from "@/components/pages/watch/playlist-block"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    PlayCircle, MoreVertical, Plus, ListPlus, Share2, Clock, List, ArrowUpToLine, ArrowDownToLine,
    Image as LucideImage
} from 'lucide-react';
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";

interface IVideoCardProps {
    el: IVideo;

}


const VideoCard: React.FC<IVideoCardProps> = async ({el}: IVideoCardProps) => {
    const coverArray = base64ToUint8Array(el.cover);
    const coverBase64 = byteArrayToBase64(coverArray);
    return (
        <div className="space-y-2.5">
            {/* Лінк для переходу на сторінку перегляду */}
            <Link href={`${el.vRoomVideoUrl}`} className="block">
                <Image
                    src={`data:image/jpeg;base64,${coverBase64}`}
                    alt={el.tittle}
                    width={1000}
                    height={1000}
                    className="rounded-xl aspect-[16/9]"
                />
            </Link>

            {/* Інформація про відео */}
            <div className="flex space-x-2.5">
                <Image
                    src={el.channelProfilePhoto}
                    alt={el.channelName}
                    width={35}
                    height={35}
                    className="rounded-full w-9 h-9"
                />
                <div className="flex-1">
                    <Link href={`${el.vRoomVideoUrl}`} className="block">
                        <div
                            className="font-bold mb-0.5"
                            style={{maxHeight: '50px', overflow: 'hidden'}}
                        >
                            {el.tittle}
                        </div>
                    </Link>
                    <div className="text-neutral-500 text-[0.9rem]">{el.channelNikName}</div>
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        {formatNumber(el.viewCount)} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {formatTimeAgo(new Date(el.uploadDate))}
                    </div>
                </div>

                {/* Меню дій */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-auto">
                            <MoreVertical className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            {el && <PlayListInterface userId={el.id}/>} Add to queue
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4"/> Save to Watch later
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <List className="mr-2 h-4 w-4"/> Save to playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4"/> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ArrowUpToLine className="mr-2 h-4 w-4"/> Move to top
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ArrowDownToLine className="mr-2 h-4 w-4"/> Move to bottom
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LucideImage className="mr-2 h-4 w-4"/> Set as playlist thumbnail
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
export default VideoCard
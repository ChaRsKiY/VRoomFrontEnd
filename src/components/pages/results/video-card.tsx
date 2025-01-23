import React, {useEffect, useState, FC} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    PlayCircle, MoreVertical, Plus, ListPlus, Share2, Users, Settings,
    Trash2, ChevronDown, Clock, List, ArrowUpToLine, ArrowDownToLine,
    Image as LucideImage
} from 'lucide-react';
import initTranslations from '@/app/i18n';
import AsideHome from '@/components/pages/home/aside/aside';
import HeaderHome from '@/components/pages/home/header/header';
import {formatNumber, formatTimeAgo} from '@/utils/format';
import {IVideo} from '@/types/videoinfo.interface';
import {formatDuration} from "@/utils/dateformat";

// Тип для параметрів
interface IHomeProps {
    params: {
        locale: string;
    };
}

interface IVideoCardProps {
    el: IVideo;
}

const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const byteArrayToBase64 = (byteArray: Uint8Array) => {
    let binary = '';
    byteArray.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
};
const VideoCard: FC<IVideoCardProps> = ({el}) => {
    const coverArray = base64ToUint8Array(el.cover);
    const coverBase64 = byteArrayToBase64(coverArray);

    return (
        <div className="flex items-start space-x-4 mb-4">
            <Link href={`/watch/${el.id}`} className="flex w-full max-sm:flex-col max-sm:px-[5%]">
                <div className={'relative'}>
                    <Image
                        src={`data:image/jpeg;base64,${coverBase64}`}
                        alt={el.tittle}
                        width={600}
                        height={600}
                        className="w-2/3 mr-4 rounded-xl aspect-[16/9] max-sm:w-full"
                        style={{minWidth: '65%', maxWidth: '65%'}}
                    />
                    <div
                        className="bg-black px-1 text-[0.785rem] text-white rounded w-max absolute bottom-1.5 right-1.5">
                        {formatDuration(el.duration)}
                    </div>
                </div>
                <div className="flex space-x-2.5 max-sm:w-full max-sm:mt-2">
                    <div>
                        <div className="font-bold mb-0.5">{el.tittle}</div>
                        <div className="text-neutral-500 text-[0.9rem] flex items-center">
                            {formatNumber(el.viewCount)} views
                            <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                            {formatTimeAgo(new Date(el.uploadDate))}
                        </div>
                        <div className="flex items-center space-x-2 my-1">
                            <Image
                                src={el.channelBanner}
                                alt={el.channelName}
                                width={30}
                                height={30}
                                className="rounded-full w-9 h-9"
                            />
                            <div className="text-neutral-500 text-[0.9rem]">{el.channelName}</div>
                        </div>
                    </div>
                    <div className="lg:w-1/3">
                        <div className="flex items-start space-x-4 mb-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <ListPlus className="mr-2 h-4 w-4"/> Add to queue
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
                </div>
            </Link>
        </div>
    );
};
export default VideoCard;
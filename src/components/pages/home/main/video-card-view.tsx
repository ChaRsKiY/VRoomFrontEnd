import React from 'react';
import Image from "next/image";
import { IPresentedVideo } from "@/types/video.interface";
import Link from "next/link";
import { formatNumber, formatTimeAgo } from "@/utils/format";
import { RiMore2Fill } from "react-icons/ri"; // Іконка для трьох крапок

interface IVideoCardProps {
    el: IPresentedVideo;
    index: number; // Додаємо індекс для номера відео
}

const VideoCard: React.FC<IVideoCardProps> = ({ el, index }) => {
    return (
        <Link href={"/watch/" + el.href} className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg">

            <div className="text-neutral-500 font-bold text-lg w-8 text-center">{index + 1}</div>
            <Image src={el.cover} alt={el.title} width={300} height={170} className="rounded-md aspect-[16/9]" />

            <div className="flex-grow flex flex-col pl-4">
                <div className="flex justify-between items-center w-full">
                    <div className="font-bold text-lg text-black dark:text-white truncate w-full pr-8">{el.title}</div>

                    <RiMore2Fill className="text-neutral-500 text-2xl cursor-pointer" />
                </div>
                <div className="text-neutral-500 text-sm">{el.channel.name}</div>
                <div className="text-neutral-500 text-sm flex items-center">
                    {formatNumber(el.views)} views
                    <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2" />
                    {formatTimeAgo(el.posted)}
                </div>
            </div>
        </Link>
    );
}
export default VideoCard;

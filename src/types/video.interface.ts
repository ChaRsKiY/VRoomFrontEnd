import {IPresentedChannel} from "@/types/channel.interface";

export interface IPresentedVideo {
    id: number,
    title: string,
    views: number,
    posted: Date,
    cover: string,
    channel: IPresentedChannel,
    href: string,
    
}
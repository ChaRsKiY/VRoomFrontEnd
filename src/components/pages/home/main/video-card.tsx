import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatTimeAgo } from "@/utils/format";
import { IVideo } from "@/types/videoinfo.interface";


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
const VideoCard: React.FC<IVideoCardProps> = async ({ el }: IVideoCardProps) => {

    const coverArray = base64ToUint8Array(el.cover);
    const coverBase64 = byteArrayToBase64(coverArray);
    return (
        <div>
            <Link href={"/watch/" + el.id} className="space-y-2.5">
                <Image src={`data:image/jpeg;base64,${coverBase64}`} alt={el.tittle} width={1000} height={1000} className="rounded-xl aspect-[16/9]" />
                <div className="flex space-x-2.5">
                    <Image src={el.channelProfilePhoto} alt={el.channelName} width={35} height={35}
                        className="rounded-full w-9 h-9" />
                    <div>
                        <div className="font-bold mb-0.5" style={{ maxHeight: '50px', overflow: 'hidden' }}>{el.tittle}</div>
                        <div className="text-neutral-500 text-[0.9rem]">{el.channelNikName}</div>
                        <div className="text-neutral-500 text-[0.9rem] flex items-center">
                            {formatNumber(el.viewCount)} views
                            <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2" />
                            {formatTimeAgo(new Date(el.uploadDate))}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default VideoCard
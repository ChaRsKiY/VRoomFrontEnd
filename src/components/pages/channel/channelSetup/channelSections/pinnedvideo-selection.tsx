'use client'

import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import VideoSelectionDialog from "./pinnedvideo-selection";
import {
    fetchAllVideosByChannelId,
    fetchShortsOrVideosByChannelId
} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import {IVideo} from "@/types/videoinfo.interface";
import {base64ToUint8Array, byteArrayToBase64, stringToBase64} from "@/utils/base64Functions";
import Image from "next/image";
import {IoIosSearch} from "react-icons/io";
import {MdOutlineClose} from "react-icons/md";
import {formatNumber, formatTimeAgo} from "@/utils/format";


interface IPinnedVideoSectionProps {
    channelId: number;
    selectedVideo: IVideo | null;
    onVideoSelect: (video: IVideo | null) => void;
    isDialogOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const PinnedVideoSection: React.FC<IPinnedVideoSectionProps> = ({
                                                                    channelId, selectedVideo, isDialogOpen,
                                                                    onVideoSelect, onClose, onOpen
                                                                }) => {

    const [videos, setVideos] = useState<IVideo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log(channelId);
        const fetchHistory = async () => {
            setVideos(await fetchAllVideosByChannelId(channelId));
        };

        fetchHistory();
    }, [channelId]);

    const filteredVideos = videos.filter((video) =>
        video.tittle.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
            <div style={{cursor: "pointer"}}>
                {selectedVideo ? (
                    <div className={'flex flex-row'}>
                        <Image alt={selectedVideo.tittle} width={125} height={110}
                               src={`data:image/jpeg;base64,${stringToBase64(selectedVideo.cover)}`}
                               className="aspect-video  object-cover rounded-md"/>
                        <div className={'flex flex-col pl-2.5'}>
                            <h3 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{selectedVideo.tittle}</h3>
                            <div className="text-neutral-500 text-[0.8rem] flex items-center">
                                {formatNumber(selectedVideo.viewCount)} views
                                <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                                {formatTimeAgo(new Date(selectedVideo.uploadDate))}
                            </div>
                        </div>
                    </div>
                ) : (<span onClick={onOpen} className="text-gray-500 cursor-pointer">Выберите видео</span>)}
            </div>
            {isDialogOpen &&
                ReactDOM.createPortal(
                    <div
                        className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black/50">
                        <dialog style={{minWidth: '620px', minHeight: '530px'}}
                                className={'bg-[#fff] p-5 rounded-xl w-3/5 min-w-[650px] h-3/4 flex'}>
                            <div className="flex flex-col w-full relative">
                                <div className='flex justify-between absolute top-0 left-0 right-0'>
                                    <h2 className="text-lg font-semibold">Выберите видео</h2>
                                    <MdOutlineClose size={34} onClick={onClose} className="cursor-pointer"/>
                                </div>

                                <hr/>
                                <div className="flex flex-row mt-10 mb-8 gap-2">
                                    <IoIosSearch size={22}/>
                                    <input type="text" className={'w-full'} placeholder="Найти свои видео"/>
                                </div>

                                <div className="grid grid-cols-5 gap-8 gap-y-8 w-full pl-7 pr-7">
                                    {filteredVideos.map((video) => (
                                        <div key={video.id} onClick={() => onVideoSelect(video)}
                                             className={'h-max'}>
                                            <Image
                                                src={`data:image/jpeg;base64,${stringToBase64(video.cover)}`}
                                                alt={video.tittle} width={115} height={115}
                                                className=" h-14 object-cover rounded-md aspect-video"/>
                                            <p className="flex-1 text-[14px] ('…') text-nowrap overflow-hidden">{video.tittle}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </dialog>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default PinnedVideoSection;

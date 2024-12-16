'use client'

import React, { useEffect, useState } from 'react'
import { IContentVideo } from "@/types/videoDTO.interface";
import VideoCard from "@/components/pages/channel/subtitle/videocard";
import api from '@/services/axiosApi';
import FoulCopySubtitleEditor from "@/components/pages/channel/subtitle/foulsubtitleeditor";
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import '@/styles/modalsubtitles.css';
import { ISubtitle } from "@/types/subtitle.interface";
import Image from "next/image";
import { base64ToUint8Array, byteArrayToBase64 } from "@/utils/base64Functions";
import { BiFile, BiPencil } from 'react-icons/bi';
import { formatDate } from "@/utils/dateformat";


const FoulCopySubtitlelist = () => {

    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<IChannel>();
    const [videoId, setVideoId] = useState(0);
    const { user } = useUser();
    const [urlSubtitle, setUrlSubtitle] = useState<string>("");

    const openSubtitlesEditor = (id: number, url: string) => {
        setUrlSubtitle(url);
        setVideoId(id);
        setOpen(!open);
    }
    const closeSubtitlesEditor = () => {
        setVideoId(0);
        setOpen(false);
    }

    const getUser = async () => {
        try {
            if (user) {
                const response = await api.get('/ChannelSettings/getbyownerid/' + user?.id);

                if (response.status === 200) {
                    const data: IChannel = await response.data;
                    setChannel(data);
                } else {
                    console.error('Ошибка при получении пользователя:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const [moreVideos, setMoreVideos] = useState<IContentVideo[]>([]);

    const getVideos = async () => {
        try {
            if (channel) {
                const response = await api.get('/Video/getvideosbychannelid/' + channel.id);

                if (response.status === 200) {
                    const mydata: IContentVideo[] = await response.data;
                    const videosWithSubtitles: IContentVideo[] = await Promise.all(
                        mydata.map(async (video) => {
                            const subtitles = await api.get<ISubtitle[]>(`/Subtitle/getnotpublishsubtitles/${video.id}`);
                            return { ...video, subtitles: subtitles.data };
                        })
                    );
                    setMoreVideos(videosWithSubtitles);
                } else {
                    console.error('Ошибка получения видео:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getVideos();
    }, [user]);


    return (
        <div style={{ margin: '20px' }}>

            {open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FoulCopySubtitleEditor videoId={videoId} onClose={closeSubtitlesEditor}
                            subtitleUrl={urlSubtitle} />
                    </div>
                </div>
            )}
            <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                    <tr className="text-left">

                        <th className="py-3 px-3 ">Video</th>
                        <th className="py-3 px-3 ">Subtitle drafts</th>

                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">

                    {moreVideos.length > 0 ? (moreVideos.map((el, key) => (
                        <>
                            {el.subtitles ? (<>
                                {el.subtitles.length > 0 ? (<>
                                    <tr key={el.id} data-index={key} className={"border-b border-gray-200 hover:bg-gray-100 text-left"}
                                    >
                                        <td className="py-3 px-3  flex ">
                                            <Image src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(el.cover))}`}
                                                width={115} height={100}
                                                alt="Video Thumbnail"
                                                className="mr-1.5 rounded-lg" />
                                            <div key={el.id} className="relative w-full">
                                                <div className="w-full h-full p-1 flex flex-col">
                                                    <span>{el.tittle}</span>
                                                </div>

                                            </div>
                                        </td>
                                        <td className="py-3 px-3 ">
                                            <div className="flex" style={{ flexDirection: "column" }}>
                                                <span>{el.subtitles ? el.subtitles.length : 0}</span>
                                                {el.subtitles?.map((subtitle, key) => (
                                                    <div  title='Edit subtitle'
                                                        key={key}
                                                        onClick={() => openSubtitlesEditor(
                                                            subtitle.id, subtitle.puthToFile ? subtitle.puthToFile : "")}
                                                        style={{ cursor: "pointer", padding: "10px" }}
                                                    >
                                                        <BiFile />
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                    </tr>
                                </>) : <></>}
                            </>) : <><tr>
                                <td colSpan={2} className="text-center py-4" > </td>
                            </tr></>}
                        </>
                    ))) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4" style={{ cursor: 'pointer' }}>
                                <div onClick={() => openSubtitlesEditor(1, "")}>
                                    TestFoulCopySubtitlesEditor
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>



        </div>
    )
}

export default FoulCopySubtitlelist
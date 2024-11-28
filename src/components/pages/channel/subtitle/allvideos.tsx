'use client'

import React, { useEffect, useState } from 'react'
import { IVideo } from "@/types/videoinfo.interface";
import VideoCard from "@/components/pages/home/main/video-card";
import api from '@/services/axiosApi';
import VideoSubtitleEditor from "@/components/pages/channel/subtitle/VideoSubtitleEditor";
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import '@/styles/modalsubtitles.css';



const AllVideolist = () => {

    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<IChannel>();
    const [videoId, setVideoId] = useState(0);
    const { user } = useUser();

    const openSubtitlesEditor = (id: number) => {
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

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);

    const getVideos = async () => {
        try {
            if (channel) {
                const response = await api.get('/Video/getvideosbychannelid/' + channel.id);

                if (response.status === 200) {
                    const mydata: IVideo[] = await response.data;
                    console.log('успешный list of video', mydata);
                    setMoreVideos(mydata);
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
        <div>
            <div onClick={() => openSubtitlesEditor(1)}>
                TestSubtitlesEditor
            </div>
            {open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                       <VideoSubtitleEditor videoId={videoId}  onClose ={closeSubtitlesEditor}/>
                    </div>
                </div>
            )}
            <div style={{ marginTop: '100px', }}>
                {moreVideos.map((el, key) => (
                    <div key={key} onClick={() => openSubtitlesEditor(el.id)}>
                        <VideoCard el={el} />
                    </div>
                ))}
                {moreVideos.length == 0 ? (<div   >
                    You do not have the playlist yet...
                </div>) : <></>}
            </div>

        </div>
    )
}

export default AllVideolist
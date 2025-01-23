
'use client'

import React, { useEffect, useState } from 'react'
import { IContentVideo } from "@/types/videoDTO.interface";
import VideoCard from "@/components/pages/channel/subtitle/videocard";
import api from '@/services/axiosApi';
import VideoSubtitleEditor from "@/components/pages/channel/subtitle/VideoSubtitleEditor";
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import '@/styles/modalsubtitles.css';
import { ISubtitle } from "@/types/subtitle.interface";
import Image from "next/image";
import { base64ToUint8Array, byteArrayToBase64 } from "@/utils/base64Functions";
import { formatDate } from "@/utils/dateformat";
import initTranslations from "@/app/i18n";
import { useTranslation } from 'react-i18next';

interface Props {
    params: {
        locale: string;
    }
}



const AllVideolist: React.FC<Props> = ({ params: { locale } }: Props) => {

    // const { t } = await initTranslations(locale, ['subtitles']);
    const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
    //const {t}= useTranslation();

    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<IChannel>();
    const [videoId, setVideoId] = useState(0);
    const [videoText, setVideoText] = useState('');
    const [langText, setLangText] = useState('');
    const [dateText, setDateText] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const loadTranslations = async () => {
            const { t } = await initTranslations(locale, ['subtitles']);
            setT(() => t);
            setVideoText(t('video'));
            setLangText(t('lang'));
            setDateText(t('date'));
        };
        loadTranslations();
    }, [locale]);

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

    const [moreVideos, setMoreVideos] = useState<IContentVideo[]>([]);

    const getVideos = async () => {
        try {
            if (channel) {
                const response = await api.get('/Video/getchannelvideos/' + channel.id);

                if (response.status === 200) {
                    const mydata: IContentVideo[] = await response.data;
                    const videosWithSubtitles: IContentVideo[] = await Promise.all(
                        mydata.map(async (video) => {
                            const subtitles = await api.get<ISubtitle[]>(`/Subtitle/getpublishsubtitles/${video.id}`);
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
    }, [channel]);


    return (
        <div style={{ margin: '20px' }}>

            {open && { t } && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <VideoSubtitleEditor videoId={videoId} onClose={closeSubtitlesEditor} params= {{ locale }}/>
                    </div>
                </div>
            )}
            <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                    <tr className="text-left">

                        <th className="py-3 px-3 ">{t('subtitles:video')}</th>
                        <th className="py-3 px-3 ">{langText}</th>
                        <th className="py-3 px-3 ">{dateText}</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">

                    {moreVideos.length > 0 ? (moreVideos.map((el, key) => (
                        <tr key={el.id} data-index={key} className={"border-b border-gray-200 hover:bg-gray-100 text-left"}
                            onClick={() => openSubtitlesEditor(el.id)} style={{ cursor: 'pointer' }} title='Add subtitles'
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

                            <td className="py-3 px-3 " style={{ paddingLeft: '40px' }}>{el.subtitles ? el.subtitles.length : 0}</td>

                            <td className="py-3 px-3 ">{formatDate(new Date(el.uploadDate))}</td>
                        </tr>
                    ))) : (
                        <tr onClick={() => openSubtitlesEditor(1)} style={{ cursor: 'pointer' }}>
                            <td colSpan={3} className="text-center py-4">

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>



        </div>
    )
}

export default AllVideolist


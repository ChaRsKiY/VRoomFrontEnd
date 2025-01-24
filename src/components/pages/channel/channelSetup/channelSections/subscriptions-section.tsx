"use client";//

import React, {useState, useEffect} from 'react'
import Image from "next/image";
import {IVideo} from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {fetchShortsOrVideosByChannelId} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import {formatDuration} from "@/utils/dateformat";
import {IChannel} from "@/types/channelinfo.interface";
import Link from "next/link";

interface ISubscriptionsProps {
    channelId: number;
    sectionName: string;
}

const SubscriptionsSection: React.FC<ISubscriptionsProps> = ({channelId, sectionName}) => {
    const [mentors, setMentors] = useState<IChannel[]>([]);
    const [mentor, setMentor] = useState<IChannel | null>(null);

    const getMentions = async () => {
        try {

            const response = await api.get('/ChannelSettings/' + channelId);

            if (response.status === 200) {
                const data: IChannel = await response.data;
                setMentor(data);
                setMentors((prevMentors) => {
                    const isDuplicate = prevMentors.some((mentor) => mentor.id === data.id);
                    if (isDuplicate) {
                        return prevMentors;
                    } else {
                        return [...prevMentors, data];
                    }
                });
            } else {
                console.error('Ошибка при получении channel:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    useEffect(() => {
        getMentions();
    }, [channelId]);

    return (
        <><h2
            className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{`${sectionName}: (${mentors.length > 0 ? mentors.length : 0})`}</h2>
            <div className="flex items-center h-max">
                {mentors.length > 0 ? mentors.map((el, key) => (
                        <div key={key} className="px-3 mb-2.5 space-y-2.5">
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <Image
                                        src={el.channelProfilePhoto} alt="Banner Image"
                                        width={60}
                                        height={60}
                                        className='rounded-full'
                                        style={{minHeight: '60px', maxHeight: '60px'}}/>
                                </div>
                            </div>
                        </div>
                    )) :
                    (<div>
                        <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                            This section displays all subscriptions</p>
                    </div>)}

            </div>
        </>


    )
}

export default SubscriptionsSection


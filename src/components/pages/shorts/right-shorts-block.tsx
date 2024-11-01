"use client"


import {BiSolidDislike, BiSolidLike} from 'react-icons/bi';
import {MdInsertComment} from 'react-icons/md';
import {RiShareForwardFill} from 'react-icons/ri';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {useUser} from "@clerk/nextjs";
import React, {useEffect, useState} from "react";
import {IVideo} from "@/types/videoinfo.interface";
import {signalRService} from "@/services/signalr.service";
import ShareComponent from "@/components/pages/watch/share";
import {formatNumber} from "@/utils/format";
import {IContentVideo} from "@/types/videoDTO.interface";
import ShareDialogComponent from "@/components/pages/shorts/share-dialog";
import OpenShareDialogButton from "@/components/pages/shorts/share-button";
import OpenCommentsDialogButton from "@/components/pages/shorts/comments/comments-button";

interface IRightShortBlockProps {
    short: IVideo;

}

const RightShortBlock: React.FC<IRightShortBlockProps> = ({short}: IRightShortBlockProps) => {
    const {user} = useUser();
    const [newVideo, setVideo] = useState<IVideo>();
    const [displayR, setDisplayR] = useState('none');
    const [isFolowed, setIsFolowed] = useState(false);

    const dislike = async (id: number) => {
        if (user) {
            try {

                const response = await fetch('https://localhost:7154/api/Video/dislike/' + id + '/' + user.id, {
                    method: 'PUT',
                });

                if (response.ok) {
                    console.log('дизлайк');
                } else {
                    console.error('Ошибка при dislike:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }

    }

    const like = async (id: number) => {
        if (user) {
            try {
                const response = await fetch('https://localhost:7154/api/Video/like/' + id + '/' + user.id, {
                    method: 'PUT',
                });

                if (response.ok) {
                    console.log('лайк');
                } else {
                    console.error('Ошибка при like:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };


    useEffect(() => {
        const handleMessage = (messageType: string, payload: any) => {
            console.log('Сообщение от SignalR сервера:', messageType, payload);

            if (messageType === 'up_video') {
                const i = payload;
                setVideo(i);
            }
        };

        signalRService.onMessageReceived(handleMessage);

        // Очистка подписки при размонтировании компонента
        return () => {
            signalRService.offMessageReceived(handleMessage);
        };
    }, [short]);

    useEffect(() => {
        setVideo(short);

    }, [short]);

    const openReport = () => {
        setDisplayR('block');
    };

    const closeReport = () => {
        setDisplayR('none');
        console.log('closing report');

    };


    useEffect(() => {
        console.log('Текущее значение displayR:', displayR);
    }, [displayR]);
    return (<>
            {newVideo ? (
                <div className="flex flex-col gap-7 p-2 justify-items-center items-center">
                    <div className="flex flex-col items-center space-x-2.5">
                        <BiSolidLike onClick={() => like(newVideo.id)} size={24} className="cursor-pointer"/>
                        <div className="font-[300]"
                             title={newVideo.likeCount.toString()}>{formatNumber(newVideo.likeCount)}</div>
                    </div>
                    <div className="flex flex-col items-center space-x-2.5">
                        <BiSolidDislike onClick={() => dislike(newVideo.id)} size={24} className="cursor-pointer"/>
                        <div className="font-[300]"
                             title={newVideo.dislikeCount.toString()}>{formatNumber(newVideo.dislikeCount)}</div>
                    </div>
                    <OpenCommentsDialogButton video={newVideo}/>
                    {/* <div className="flex flex-col items-center space-x-2.5">
                        <MdInsertComment size={24} className="cursor-pointer"/>
                        <div className="font-[300]"
                             title={newVideo.commentCount.toString()}>{newVideo.commentCount}</div>
                    </div>*/}
                    {/*<div className="flex flex-col items-center space-x-2.5">*/}
                    <OpenShareDialogButton URL={newVideo.vRoomVideoUrl}/>
                    {/*<ShareDialogComponent URL={newVideo.videoUrl}/>
                        <div className="flex flex-col items-center space-x-2.5" onClick={toggleShareWindow}>
                            <RiShareForwardFill size={24}/>
                            <div className="font-[300] cursor-pointer">Share</div>
                        </div>
                    </div>*/}
                    <div className="flex flex-col items-center space-x-2.5">
                        <BsThreeDotsVertical size={24} className="cursor-pointer"/>
                        <div className="font-[300]"></div>
                    </div>
                </div>) : <></>}</>
    );


};

export default RightShortBlock;

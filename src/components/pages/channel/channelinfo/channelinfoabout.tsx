"use client"
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import { IVideo } from '@/types/videoinfo.interface'
import Image from 'next/image';
import LinkList from "./linkslist";
import '@/styles/channelmodul.css';
import FolowComponent from '../../watch/folowblock';
import LinkBlock from './linksblock';
import Link from 'next/link';
import api from '@/services/axiosApi';



interface IProps {

    channelid: number;
}


const ChannelInfoAboutComponent: React.FC<IProps> = ({ channelid }) => {

    const [channel, setChannel] = useState<IChannel | null>(null);
    const [isFolowed, setIsFolowed] = useState(false);
    const [videos, setVideos] = useState<IVideo[]>([]);
    const { user } = useUser();

    const getChannelVideos = async () => {
        try {
            const response = await api.get(`/Video/getchannelvideos/${channelid}`);

            if (response.status === 200) {
                const data: IVideo[] = response.data;
                setVideos(data);
                console.log(data);
            } else {
                console.error('Ошибка при получении videos:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const checkIsFolowed = async () => {
        if (user) {
            try {
                const response = await api.get('/Subscription/isfolowed/' + channelid + '/' + user.id);


                if (response.status === 200) {
                    setIsFolowed(true);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
    const addSubscription = async () => {
        if (user) {
            try {
                const response = await api.post('/Subscription/add/' + channelid + '/' + user.id);


                if (response.status === 200) {
                    setIsFolowed(true);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };

    const deleteSubscription = async () => {
        if (user) {
            try {
                const response = await api.delete('/Subscription/delete/' + channelid + '/' + user.id);


                if (response.status === 200) {
                    setIsFolowed(false);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };


    const getChannel = async () => {
        try {

            const response = await api.get('/ChannelSettings/' + channelid);


            if (response.status = 200) {
                const data: IChannel = await response.data;
                setChannel(data);
            } else {
                console.error('Ошибка при получении channel:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };



    useEffect(() => {
        getChannelVideos();
        getChannel();
        checkIsFolowed();
    }, [channelid]);

    return (
        <>
            {channel ? (<>
                <div style={{ width: '100%' }} className='container' >
                    <div style={{ marginBottom: '100px', width: '100%' }}  >

                        <div className='backgroundImage'>
                            <Image src={channel?.channelBanner} alt="Banner Image" width={800} height={600}
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                        </div>
                        <div className='content' style={{ width: '100%' }}>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', maxHeight: '100px' }}>
                                <div className='flex' style={{ width: '100%', padding: "10px" }}>
                                    <Image src={channel?.channelProfilePhoto} alt="Banner Image" width={80} height={80}
                                        className='rounded-full' style={{ minHeight: '80px', maxHeight: '80px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', justifyContent: 'space-around' }}>
                                        <div style={{ fontWeight: 'bold' }}>{channel?.channelNikName}</div>
                                        <div>{channel.subscriptionCount} followers</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', padding: '10px', justifyContent: 'space-around',
                                        borderLeft: '1px solid lightgray', borderRight: '1px solid lightgray', paddingRight: '20px'
                                    }}>
                                        <FolowComponent isfolowed={isFolowed} onDelete={deleteSubscription} onAdd={addSubscription} />
                                    </div>
                                    <LinkBlock ch={channel} />
                                </div>
                            </div>

                            <Link href={"/gotochannel/" + channelid} style={{
                                padding: '5px',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Main
                            </Link>
                            <Link href={"/channelvideos/" + channelid} style={{
                                padding: '5px', marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Video</Link>
                            <Link href={"/channellives/" + channelid} style={{
                                padding: '5px', marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Lives</Link>
                            {isFolowed ? (
                                <Link href={"/channelposts/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0',
                                }}>Posts</Link>) : <></>}
                            <Link href={"/channelplaylist/" + channelid} style={{
                                padding: '5px', marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Playlists</Link>
                            <Link href={"/channelinfoabout/" + channelid} style={{
                                padding: '5px', fontWeight: 'bold', paddingBottom: '0',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", borderBottom: '3px solid black', marginBottom: '0',
                            }}>About</Link>
                            <hr />
                            <div style={{ marginTop: '20px' }} >
                                <div className='flex' style={{ justifyContent: 'space-between' }}>
                                    <div >
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Description:</div>
                                        <div>{channel?.description}</div>
                                    </div>
                                    <LinkList ch={channel} v={videos.length} />
                                </div>
                            </div>

                        </div>



                    </div>
                </div>
            </>
            ) : <></>}

        </>
    );
};

export default ChannelInfoAboutComponent;
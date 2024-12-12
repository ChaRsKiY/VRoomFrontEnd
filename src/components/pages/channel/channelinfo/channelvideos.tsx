"use client"
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import { IVideo } from '@/types/videoinfo.interface';
import Image from 'next/image';
import VideoCard from './video-card';
import '@/styles/channelmodul.css';
import FolowComponent from '../../watch/folowblock';
import LinkBlock from './linksblock';
import Link from 'next/link';
import api from '@/services/axiosApi';


interface IProps {

    channelid: number;

}


const ChannelVideosComponent: React.FC<IProps> = ({ channelid }) => {

    const [channel, setChannel] = useState<IChannel | null>(null);
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [videosAll, setVideosAll] = useState<IVideo[]>([]);
    const [videosAll2, setVideosAll2] = useState<IVideo[]>([]);
    const [isFolowed, setIsFolowed] = useState(false);
    const { user } = useUser();
    const [color7, setColor7] = useState('black');
    const [color8, setColor8] = useState('white');
    const [color3, setColor3] = useState('lightgray');
    const [color4, setColor4] = useState('black');
    const [color5, setColor5] = useState('lightgray');
    const [color6, setColor6] = useState('black');
    const [color1, setColor1] = useState('lightgray');
    const [color2, setColor2] = useState('black');



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



    const getChannelVideos = async () => {
        try {
            const response = await api.get(`/Video/getchannelvideos/${channelid}`);

            if (response.status === 200) {
                const data: IVideo[] = response.data;
                setVideos(data);
                setVideosAll2(data.filter((video: any) => video.isShort === false));
                setVideosAll(data.filter((video: any) => video.isShort === false));
                console.log(data);
            } else {
                console.error('Ошибка при получении videos:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };


    const chooseAll = () => {
        setVideosAll(videosAll2);
    }

    const breackColors = () => {
        setColor1('lightgray');
        setColor2('black');
        setColor3('lightgray');
        setColor4('black');
        setColor5('lightgray');
        setColor6('black');
        setColor7('lightgray');
        setColor8('black');
    }




    const showLatest = () => {
        breackColors();
        setColor1('black');
        setColor2('white');
        setVideosAll(videosAll.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
    }
    const showOldest = () => {
        breackColors();
        setColor3('black');
        setColor4('white');
        setVideosAll(videosAll.sort((a: any, b: any) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()));
    }

    const showAlls = () => {
        breackColors();
        setColor7('black');
        setColor8('white');
        setVideosAll(videosAll2);
    }

    const showPop = () => {
        breackColors();
        setColor5('black');
        setColor6('white');
        setVideosAll(videosAll.sort((a: any, b: any) => b.viewCount - a.viewCount));
    }

    useEffect(() => {

        getChannel();
        getChannelVideos();
        checkIsFolowed();
    }, [channelid]);

    useEffect(() => {
        chooseAll();
    }, [videos]);

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
                                padding: '5px', fontWeight: 'bold', paddingBottom: '0',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", borderBottom: '3px solid black', marginBottom: '0',
                            }}>Video</Link>
                            <Link href={"/channellives/" + channelid} style={{
                                padding: '5px',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Lives</Link>
                            {isFolowed ? (
                                <Link href={"/channelposts/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0',
                                }}>Posts</Link>) : <></>}
                            <Link href={"/channelplaylist/" + channelid} style={{
                                padding: '5px',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>Playlists</Link>
                            <Link href={"/channelinfoabout/" + channelid} style={{
                                padding: '5px',
                                marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                            }}>About</Link>
                            <hr />


                            <div style={{ marginTop: '20px' }} >
                                <div>
                                    <button onClick={showAlls} style={{
                                        padding: '5px', borderRadius: '5px',
                                        marginLeft: '20px', margin: '2px', fontSize: "16px",
                                        backgroundColor: color7, color: color8
                                    }}>All
                                    </button>
                                    <button onClick={showLatest} style={{
                                        padding: '5px', borderRadius: '5px',
                                        marginLeft: '20px', margin: '2px', fontSize: "16px",
                                        backgroundColor: color1, color: color2
                                    }}>Latest
                                    </button>
                                    <button onClick={showOldest} style={{
                                        padding: '5px', borderRadius: '5px',
                                        marginLeft: '20px', margin: '2px', fontSize: "16px",
                                        backgroundColor: color3, color: color4
                                    }}>Oldest</button>
                                    <button onClick={showPop} style={{
                                        padding: '5px', borderRadius: '5px',
                                        marginLeft: '20px', margin: '2px', fontSize: "16px",
                                        backgroundColor: color5, color: color6
                                    }}>Popular</button>

                                </div>
                                <br />
                                <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                    {videosAll.map((el, key) => (
                                        <div key={key} className="px-3 mb-8 space-y-2.5" >
                                            <VideoCard el={el} />
                                        </div>
                                    ))}
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

export default ChannelVideosComponent;
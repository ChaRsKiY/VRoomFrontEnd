"use client"
import {useState, useEffect} from 'react';
import {useUser} from '@clerk/nextjs';
import {IChannel} from '@/types/channelinfo.interface';
import {IVideo} from '@/types/videoinfo.interface'
import Image from 'next/image';
import LinkList from "./linkslist";
import '@/styles/channelmodul.css';
import FolowComponent from '../../watch/folowblock';
import LinkBlock from './linksblock';
import Link from 'next/link';
import api from '@/services/axiosApi';
import {ChannelSection, ChannelSectionWithUrl} from "@/types/channelsections.interfaces";
import {linksArray} from "@/components/pages/channel/channelinfo/channel-sections_links_array";
import {PiPencilSimpleLight} from "react-icons/pi";
import {IUser} from "@/types/user.interface";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";


interface IProps {

    channelid: number;
}


const ChannelInfoAboutComponent: React.FC<IProps> = ({channelid}) => {
    const {t}: { t: ITranslationFunction } = useTranslation();
    const [channel, setChannel] = useState<IChannel | null>(null);
    const [isFolowed, setIsFolowed] = useState(false);
    const [videos, setVideos] = useState<IVideo[]>([]);
    const {user} = useUser();
    const [sectionsWithUrl, setSectionsWithUrl] = useState<ChannelSectionWithUrl[]>([]);
    const [owner, setOwner] = useState<IUser | null>(null);


    const findOwner = async (id: number) => {
        try {

            const response = await api.get('/ChannelSettings/getinfobychannelid/' + id);

            if (response.status === 200) {
                const data: IUser = await response.data;
                setOwner(data);
            } else {
                console.error('Ошибка при получении пользователя:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };
    const getChannelSections = async () => {
        try {
            if (user) {
                const response = await api.get<ChannelSection[]>(`/ChannelSections/channelid/${channelid}`);
                const data: ChannelSection[] = response.data;


                if (response.status == 200) {
                    const sectionsWithUrls = data.map(section => {
                        // Найти URL для текущего title
                        const matchingLink = linksArray.find(link => link.title === section.title);

                        return {
                            ...section,
                            urlType: section.title,// Формируем URL, только если совпадает title
                            url: matchingLink ? `${matchingLink.url}${section.channel_SettingsId}` : "",
                        };
                    });
                    setSectionsWithUrl(sectionsWithUrls.sort((a, b) => a.order - b.order)); // Сортируем по порядку
                } else {
                    console.error('Ошибка при получении channel:', response.statusText);
                }
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
                // const response = await api.get('/Subscription/isfolowed/' + channelid + '/' + user.id);
                const response = await api.get('/Subscription/isfolowedbool/' + channelid + '/' + user.id);

                if (response.status === 200) {
                    //setIsFolowed(true);
                    setIsFolowed(response.data != null ? response.data : false);
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
        findOwner(channelid);
        getChannel();
        getChannelSections();
        getChannelVideos();
        checkIsFolowed();
    }, [channelid]);

    return (
        <>
            {channel ? (<>
                    <div style={{width: '100%'}} className='container'>
                        <div style={{marginBottom: '100px', width: '100%'}}>

                            <div className='backgroundImage'>
                                <Image src={channel?.channelBanner} alt="Banner Image" width={800} height={600}
                                       style={{width: '100%', height: 'auto', objectFit: 'cover'}}/>
                            </div>
                            <div className='content' style={{width: '100%'}}>

                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    maxHeight: '100px'
                                }}>
                                    <div className='flex' style={{width: '100%', padding: "10px"}}>
                                        <Image src={channel?.channelProfilePhoto} alt="Banner Image" width={80}
                                               height={80}
                                               className='rounded-full' style={{minHeight: '80px', maxHeight: '80px'}}/>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '10px',
                                            justifyContent: 'space-around'
                                        }}>
                                            <div style={{fontWeight: 'bold'}}>{channel?.channelNikName}</div>
                                            <div>{channel.subscriptionCount} followers</div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '10px',
                                            justifyContent: 'space-around',
                                            borderLeft: '1px solid lightgray',
                                            borderRight: '1px solid lightgray',
                                            paddingRight: '20px'
                                        }}>
                                            {user && user?.id === owner?.clerk_Id ? (
                                                <div className={'flex flex-row gap-1 items-center justify-center'}>
                                                    <PiPencilSimpleLight size={21}/>
                                                    <Link target={'_blank'} href={"/channel/editing"}
                                                          className="block pl-0 pr-0.5 py-2 rounded-full">Edit
                                                        channel</Link></div>) : (
                                                <FolowComponent isfolowed={isFolowed} onDelete={deleteSubscription}
                                                                onAdd={addSubscription}/>)}
                                        </div>
                                        <LinkBlock ch={channel}/>
                                    </div>
                                </div>

                                <div className={'w-[30.3125rem] h-[1.625rem]'}>
                                    {sectionsWithUrl.filter((cs) => cs.isVisible && !((cs.title == "PinnedVideoSection" || cs.title == "subscriptionsSection" || cs.title == "ForYou" || cs.title == "HighRaitingVideos"))).map((el, key) => (
                                        <Link
                                            className={el.title === 'about' ? 'border-b-black border-2 font-bold text-[#000] p-1.5 font-Inter text-[1rem] font-not-italic leading-normal' : 'text-[#000] p-1.5 font-Inter text-[1rem] font-not-italic leading-normal'}
                                            href={el.url} key={key}>{t(`сhannel:${el.title}`)}</Link>
                                    ))}
                                </div>
                                {/*<Link href={"/gotochannel/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
                                }}>Main
                                </Link>
                                <Link href={"/channelvideos/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    marginBottom: '0'
                                }}>Video</Link>
                                <Link href={"/channellives/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    marginBottom: '0'
                                }}>Lives</Link>
                                {isFolowed ? (
                                    <Link href={"/channelposts/" + channelid} style={{
                                        padding: '5px',
                                        marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0',
                                    }}>Posts</Link>) : <></>}
                                <Link href={"/channelplaylist/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    marginBottom: '0'
                                }}>Playlists</Link>
                                <Link href={"/channelinfoabout/" + channelid} style={{
                                    padding: '5px',
                                    fontWeight: 'bold',
                                    paddingBottom: '0',
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: '3px solid black',
                                    marginBottom: '0',
                                }}>About</Link>*/}
                                <hr/>
                                <div style={{marginTop: '20px'}}>
                                    <div className='flex' style={{justifyContent: 'space-between'}}>
                                        <div>
                                            <div style={{fontSize: '20px', fontWeight: 'bold'}}>Description:</div>
                                            <div>{channel?.description}</div>
                                        </div>
                                        <LinkList ch={channel} v={videos.length}/>
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
"use client"
import React, {useState, useEffect} from 'react';
import {useUser} from '@clerk/nextjs';
import {IChannel} from '@/types/channelinfo.interface';
import {IVideo} from '@/types/videoinfo.interface';
import Image from 'next/image';
import VideoCard from './video-card';
import '@/styles/channelmodul.css';
import FolowComponent from '../../watch/folowblock';
import LinkBlock from './linksblock';
import VideoCardLast from './video_card_last';
import {FaPlay} from 'react-icons/fa';
import Link from 'next/link';
import api from '@/services/axiosApi';

import {linksArray} from "@/components/pages/channel/channelinfo/channel-sections_links_array";
import {ChannelSection, ChannelSectionWithUrl} from "@/types/channelsections.interfaces";
import {IUser} from "@/types/user.interface";
import {PiPencilSimple, PiPencilSimpleLight} from "react-icons/pi";


interface IProps {
    channelid: number;
}


const ChannelInfoComponent: React.FC<IProps> = ({channelid}) => {

    const [channel, setChannel] = useState<IChannel | null>(null);
    const [mentors, setMentors] = useState<IChannel[]>([]);
    const [mentor, setMentor] = useState<IChannel | null>(null);
    const [videos, setVideos] = useState<IVideo[]>([]);
    // const [videosNew,setVideosNew]=useState<IVideo[]>([]);
    const [videosNew, setVideosNew] = useState<IVideo | null>(null);
    const [videosPopular, setVideosPopular] = useState<IVideo[]>([]);
    const [videosShorts, setVideosShorts] = useState<IVideo[]>([]);
    const [videosLiked, setVideosLiked] = useState<IVideo[]>([]);
    const [videosAll, setVideosAll] = useState<IVideo[]>([]);
    const [videosAll2, setVideosAll2] = useState<IVideo[]>([]);
    const [display1, setDisplay1] = useState('block');
    const [display2, setDisplay2] = useState('block');
    const [display3, setDisplay3] = useState('block');
    const [display4, setDisplay4] = useState('block');
    const [display1a, setDisplay1a] = useState('none');
    const [display2a, setDisplay2a] = useState('none');
    const [display3a, setDisplay3a] = useState('none');
    const [display4a, setDisplay4a] = useState('none');


    const [isFollowed, setIsFollowed] = useState(false);
    const {user} = useUser();
    const [owner, setOwner] = useState<IUser | null>(null);
    const [sectionsWithUrl, setSectionsWithUrl] = useState<ChannelSectionWithUrl[]>([]);

    const checkIsFolowed = async () => {
        if (user) {
            try {
                // const response = await api.get('/Subscription/isfolowed/' + channelid + '/' + user.id);
                const response = await api.get('/Subscription/isfolowedbool/' + channelid + '/' + user.id);

                if (response.status === 200) {
                    //setIsFolowed(true);
                    setIsFollowed(response.data != null ? response.data : false);
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
                    setIsFollowed(true);
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
                    setIsFollowed(false);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
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

    const getChannel = async () => {
        try {

            const response = await api.get('/ChannelSettings/' + channelid);


            if (response.status == 200) {
                const data: IChannel = await response.data;
                setChannel(data);
                getMentions();
            } else {
                console.error('Ошибка при получении channel:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };


    const getChannelSections = async () => {
        try {
            //if (user) {
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
            //}
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };


    const getMentions = async () => {
        try {

            const response = await api.get('/ChannelSettings/' + channelid);

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

    const chooseShorts = () => {
        setVideosShorts(videos.filter((video: any) => video.isShort === true));
    }

    const chooseNewOnce = () => {
        const latestVideo = [...videos].sort((a, b) => {
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        })[0];
        setVideosNew(latestVideo);
    }

    const chooseMoreViwed = () => {
        setVideosPopular(videos.sort((a: any, b: any) => b.viewCount - a.viewCount));
    }

    const chooseMoreLiked = () => {
        setVideosLiked(videos.sort((a: any, b: any) => b.likeCount - a.likeCount));
    }
    const chooseAll = () => {
        setVideosAll(videosAll2);
    }

    const showAllShorts = () => {
        setDisplay4('none');
        setDisplay4a('block');
    }
    const showAllNewOnce = () => {
        setDisplay1('none');
        setDisplay1a('block');
    }
    const showAllViwed = () => {
        setDisplay2('none');
        setDisplay2a('block');
    }
    const showAllLiked = () => {
        setDisplay3('none');
        setDisplay3a('block');
    }


    useEffect(() => {
        findOwner(channelid);
        getChannel();
        getChannelSections();
        getChannelVideos();
        checkIsFolowed();
    }, [channelid]);

    useEffect(() => {
        chooseShorts();
        chooseNewOnce();
        chooseMoreViwed();
        chooseMoreLiked();
        chooseAll();
    }, [videos]);


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
                                                <FolowComponent isfolowed={isFollowed} onDelete={deleteSubscription}
                                                                onAdd={addSubscription}/>)}
                                        </div>
                                        <LinkBlock ch={channel}/>
                                    </div>
                                </div>

                                <div className={'w-[30.3125rem] h-[1.625rem]'}>
                                    {sectionsWithUrl.filter((cs) => cs.isVisible && !((cs.title == "PinnedVideoSection" || cs.title == "subscriptionsSection"))).map((el, key) => (

                                        <Link
                                            className={el.title === 'home' ? 'border-b-black border-2 font-bold text-[#000] p-1.5 font-Inter text-[1rem] font-not-italic leading-normal' : 'text-[#000] p-1.5 font-Inter text-[1rem] font-not-italic leading-normal'}
                                            href={el.url} key={key}>{el.title}</Link>
                                    ))}
                                </div>
                                {/*<Link href={"/gotochannel/" + channelid} style={{
                                    padding: '5px',
                                    fontWeight: 'bold',
                                    paddingBottom: '0',
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: '3px solid black',
                                    marginBottom: '0',
                                }}>Main
                                </Link>
                                <Link href={"/channelvideos/" + channelid} style={{
                                    padding: '5px',
                                    marginLeft: '20px', margin: '2px', fontSize: "16px", marginBottom: '0'
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
                                }}>About</Link>*/}
                                <hr/>
                                <div>
                                    <div>
                                        {sectionsWithUrl.find(cs => cs.title === 'PinnedVideoSection' && cs.isVisible) &&
                                            <div
                                                className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                                {videosNew ? (
                                                    <div style={{display: display1}}>
                                                        <VideoCardLast el={videosNew}/>
                                                    </div>) : <></>}
                                            </div>}
                                        <hr/>
                                        <button style={{padding: "20px", fontSize: '20px', fontWeight: 'bold'}}
                                                onClick={showAllViwed}>For you &nbsp;&nbsp;
                                            <FaPlay size={12} className="text-black-600 cursor-pointer"
                                                    title='All popular' style={{display: 'inline'}}/></button>
                                        <div
                                            className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                            {videosPopular.slice(0, 4).map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display2}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                            {videosPopular.map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display2a}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                        </div>
                                        <hr/>
                                        <button style={{padding: "20px", fontSize: '20px', fontWeight: 'bold'}}
                                                onClick={showAllLiked}>High raiting videos&nbsp;&nbsp;
                                            <FaPlay size={12} className="text-black-600 cursor-pointer"
                                                    title='All popular' style={{display: 'inline'}}/></button>
                                        <div
                                            className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                            {videosLiked.slice(0, 4).map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display3}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                            {videosLiked.map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display3a}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                        </div>
                                        <hr/>
                                        <button style={{padding: "20px", fontSize: '20px', fontWeight: 'bold'}}
                                                onClick={showAllShorts}>Shorts&nbsp;&nbsp;
                                            <FaPlay size={12} className="text-black-600 cursor-pointer"
                                                    title='All popular' style={{display: 'inline'}}/></button>
                                        <div
                                            className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                            {videosShorts.slice(0, 4).map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display4}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                            {videosShorts.slice(0, 4).map((el, key) => (
                                                <div key={key} className="px-3 mb-8 space-y-2.5"
                                                     style={{display: display4a}}>
                                                    <VideoCard el={el}/>
                                                </div>
                                            ))}
                                            <hr/>

                                        </div>
                                    </div>

                                    {sectionsWithUrl.find(cs => cs.title === 'subscriptionsSection' && cs.isVisible) &&
                                        (<>
                                            <div style={{
                                                padding: "10px",
                                                fontSize: '20px',
                                                fontWeight: 'bold'
                                            }}>Honourable
                                                mentions
                                            </div>
                                            <div className='flex'>
                                                {mentors.map((el, key) => (
                                                    <div key={key} className="px-3 mb-8 space-y-2.5">
                                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                                <Image
                                                                    src={el.channelProfilePhoto} alt="Banner Image"
                                                                    width={60}
                                                                    height={60}
                                                                    className='rounded-full'
                                                                    style={{minHeight: '60px', maxHeight: '60px'}}/>
                                                            </div>
                                                            <div style={{fontSize: '12px'}}>{el.channelNikName}</div>
                                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                                <Link href={el.channel_URL} style={{
                                                                    padding: '2px',
                                                                    backgroundColor: 'lightgray',
                                                                    paddingLeft: '10px',
                                                                    paddingRight: '10px',
                                                                    borderRadius: '5px',
                                                                    marginTop: '5px'
                                                                }}>Follow</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>)}

                                </div>

                                {/* <div onClick={showAll} style={{ display: display7, marginTop: '20px' }} > */}
                                {/* <div>
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

                </div> */}
                                {/* <br />
                <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                  {videosAll.map((el, key) => (
                    <div key={key} className="px-3 mb-8 space-y-2.5" >
                      <VideoCard el={el} />
                    </div>
                  ))}
                </div>
              </div> */}


                            </div>


                        </div>
                    </div>
                </>
            ) : <></>}

        </>
    );
};

export default ChannelInfoComponent;

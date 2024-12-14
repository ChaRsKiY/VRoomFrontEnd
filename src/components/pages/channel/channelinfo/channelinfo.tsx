"use client"
import {useState, useEffect} from 'react';
import {useUser} from '@clerk/nextjs';
import {IChannel} from '@/types/channelinfo.interface';
import {IVideo} from '@/types/videoinfo.interface'
import Image from 'next/image';
import VideoCard from './video-card';
import PostList from '@/components/pages/posts/posts';
import LinkList from "./linkslist";
import '@/styles/channelmodul.css';
import FolowComponent from '../../watch/folowblock';
import LinkBlock from './linksblock';
import VideoCardLast from './video_card_last';
import {FaPlay} from 'react-icons/fa';
import Link from 'next/link';
import api from '@/services/axiosApi';


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
    const [display5, setDisplay5] = useState('none');
    const [display6, setDisplay6] = useState('block');
    const [display7, setDisplay7] = useState('none');
    const [display8, setDisplay8] = useState('none');
    const [display9, setDisplay9] = useState('none');
    const [display10, setDisplay10] = useState('none');
    const [display11, setDisplay11] = useState('block');
    const [font1, setFont1] = useState('lightgray');
    const [font2, setFont2] = useState('white');
    const [font3, setFont3] = useState('white');
    const [font5, setFont5] = useState('white');
    const [font4, setFont4] = useState('white');
    const [font6, setFont6] = useState('white');
    const [border1, setBorder1] = useState('3px solid black');
    const [border2, setBorder2] = useState('');
    const [border3, setBorder3] = useState('');
    const [border4, setBorder4] = useState('');
    const [border5, setBorder5] = useState('');
    const [border6, setBorder6] = useState('');
    const [isFolowed, setIsFolowed] = useState(false);
    const {user} = useUser();
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
                getMentions();
            } else {
                console.error('Ошибка при получении channel:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const getMentions = async () => {
        try {

            const response = await api.get('/ChannelSettings/1');

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
    const breackFontsWeight = () => {
        setFont3('');
        setFont2('');
        setFont1('');
        setFont4('');
        setFont5('');
        setFont6('');
    }
    const breackBorders = () => {
        setBorder3('');
        setBorder2('');
        setBorder1('');
        setBorder4('');
        setBorder5('');
        setBorder6('');
    }
    const breackDisplays = () => {
        setDisplay10('none');
        setDisplay9('none');
        setDisplay5('none');
        setDisplay6('none');
        setDisplay7('none');
        setDisplay8('none');
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
    const showPosts = () => {
        breackDisplays();
        setDisplay5('block');
        breackFontsWeight();
        breackBorders();
        setFont3('bold');
        setBorder3('3px solid black');

    }
    const showAll = () => {
        breackDisplays();
        setDisplay7('block');
        breackFontsWeight();
        breackBorders();
        setFont2('bold');
        setBorder2('3px solid black');

    }
    const showMain = () => {
        breackDisplays();
        setDisplay6('block');
        breackFontsWeight();
        breackBorders();
        setFont1('bold');
        setBorder1('3px solid black');
    }
    const showAbout = () => {
        breackDisplays();
        setDisplay8('block');
        breackFontsWeight();
        breackBorders();
        setFont4('bold');
        setBorder4('3px solid black');
    }
    const showLives = () => {
        breackDisplays();
        setDisplay9('block');
        breackFontsWeight();
        breackBorders();
        setFont5('bold');
        setBorder5('3px solid black');
    }
    const showPlaylists = () => {
        breackDisplays();
        setDisplay10('block');
        breackFontsWeight();
        breackBorders();
        setFont6('bold');
        setBorder6('3px solid black');
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

        if (channelid === 0) {

        } else
            getChannel();
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
                                            <FolowComponent isfolowed={isFolowed} onDelete={deleteSubscription}
                                                            onAdd={addSubscription}/>
                                        </div>
                                        <LinkBlock ch={channel}/>
                                    </div>
                                </div>
                                <button onClick={showMain} style={{
                                    padding: '5px',
                                    fontWeight: font1,
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: border1,
                                    marginBottom: '0'
                                }}>Main
                                </button>
                                <button onClick={showAll} style={{
                                    padding: '5px',
                                    fontWeight: font2,
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: border2,
                                    marginBottom: '0'
                                }}>Video
                                </button>
                                <button onClick={showLives} style={{
                                    padding: '5px',
                                    fontWeight: font5,
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: border5,
                                    marginBottom: '0'
                                }}>Lives
                                </button>
                                {isFolowed ? (
                                    <button onClick={showPosts} style={{
                                        padding: '5px',
                                        fontWeight: font3,
                                        marginLeft: '20px',
                                        margin: '2px',
                                        fontSize: "16px",
                                        borderBottom: border3,
                                        marginBottom: '0'
                                    }}>Posts</button>) : <></>}
                                <button onClick={showPlaylists} style={{
                                    padding: '5px',
                                    fontWeight: font6,
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: border6,
                                    marginBottom: '0'
                                }}>Playlists
                                </button>
                                <button onClick={showAbout} style={{
                                    padding: '5px',
                                    fontWeight: font4,
                                    marginLeft: '20px',
                                    margin: '2px',
                                    fontSize: "16px",
                                    borderBottom: border4,
                                    marginBottom: '0'
                                }}>About
                                </button>
                                <hr/>
                                <div style={{display: display6}}>
                                    <div>

                                        <div
                                            className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                            {videosNew ? (
                                                <div style={{display: display1}}>
                                                    <VideoCardLast el={videosNew}/>
                                                </div>) : <></>}
                                        </div>
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

                                    <div style={{padding: "10px", fontSize: '20px', fontWeight: 'bold'}}>Honourable
                                        mentions
                                    </div>
                                    <div className='flex'>
                                        {mentors.map((el, key) => (
                                            <div key={key} className="px-3 mb-8 space-y-2.5">
                                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                                    <div style={{display: 'flex', justifyContent: 'center'}}><Image
                                                        src={el.channelProfilePhoto} alt="Banner Image" width={60}
                                                        height={60}
                                                        className='rounded-full'
                                                        style={{minHeight: '60px', maxHeight: '60px'}}/></div>
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

                                </div>

                                <div onClick={showPosts} style={{display: display5}}>
                                    <PostList channelId={channelid}/>
                                </div>

                                <div onClick={showAll} style={{display: display7, marginTop: '20px'}}>
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
                                        }}>Oldest
                                        </button>
                                        <button onClick={showPop} style={{
                                            padding: '5px', borderRadius: '5px',
                                            marginLeft: '20px', margin: '2px', fontSize: "16px",
                                            backgroundColor: color5, color: color6
                                        }}>Popular
                                        </button>

                                    </div>
                                    <br/>
                                    <div
                                        className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
                                        {videosAll.map((el, key) => (
                                            <div key={key} className="px-3 mb-8 space-y-2.5">
                                                <VideoCard el={el}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div onClick={showAbout} style={{display: display8, marginTop: '20px'}}>
                                    <div className='flex' style={{justifyContent: 'space-between'}}>
                                        <div>
                                            <div style={{fontSize: '20px', fontWeight: 'bold'}}>Description:</div>
                                            <div>{channel?.description}</div>
                                        </div>
                                        <LinkList ch={channel} v={videos.length}/>
                                    </div>
                                </div>

                                <div onClick={showPlaylists} style={{display: display10}}>
                                    PlayList
                                </div>
                                <div onClick={showLives} style={{display: display9}}>
                                    Lives
                                </div>

                            </div>


                        </div>
                    </div>
                </>
            ) : <></>}

        </>
    );
};

export default ChannelInfoComponent;

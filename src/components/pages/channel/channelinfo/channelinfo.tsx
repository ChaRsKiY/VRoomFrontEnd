"use client"
import { useState, useEffect } from 'react';
import { IChannel } from '@/types/channelinfo.interface';
import {IVideo} from '@/types/videoinfo.interface'
import Image from 'next/image';
import VideoCard from '../../home/main/video-card';

interface IProps{

    channelid:number;
}


const ChannelInfoComponent : React.FC<IProps> =({ channelid }) => {

    const [channel,setChannel]=useState<IChannel |null>(null);
    const [videos,setVideos]=useState<IVideo[]>([]);
    const [videosNew,setVideosNew]=useState<IVideo[]>([]);
    const [videosPopular,setVideosPopular]=useState<IVideo[]>([]);
    const [videosShorts,setVideosShorts]=useState<IVideo[]>([]);
    const [videosLiked,setVideosLiked]=useState<IVideo[]>([]);
    const [display1,setDisplay1] =useState('block');
    const [display2,setDisplay2] =useState('block');
    const [display3,setDisplay3] =useState('block');
    const [display4,setDisplay4] =useState('block');
    const [display1a,setDisplay1a] =useState('none');
    const [display2a,setDisplay2a] =useState('none');
    const [display3a,setDisplay3a] =useState('none');
    const [display4a,setDisplay4a] =useState('none');
    

    const getChannel = async () => {
        try {
          
                const response = await fetch('https://localhost:7154/api/ChannelSettings/' + channelid, {
                    method: 'GET',
                });
      
                if (response.ok) {
                    const data: IChannel = await response.json();
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
          
                const response = await fetch('https://localhost:7154/api/Videos/getchannelvideos/' + channelid, {
                    method: 'GET',
                });
      
                if (response.ok) {
                    const data: IVideo[] = await response.json();
                    setVideos(data);
                } else {
                    console.error('Ошибка при получении videos:', response.statusText);
                 }
            } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
      };

       const chooseShorts = ()=>{     
        setVideosShorts(  videos.filter((video: any) => video.isShort === true)) ;       
       }

       const chooseNewOnce = ()=>{         
        setVideosNew(  videos.filter((video: any) => {
            const uploadDate = new Date(video.uploadDate);
            return uploadDate.getMonth() === new Date().getMonth();}) ) ;  
        }  
        
        const chooseMoreViwed = ()=>{     
            setVideosPopular(  videos.sort((a: any, b: any) => b.viewCount - a.viewCount)) ;       
           }
        
       const chooseMoreLiked = ()=>{     
            setVideosLiked(  videos.sort((a: any, b: any) => b.likeCount - a.likeCount)) ;       
           }

        const showAllShorts = ()=>{     
              setDisplay4('none');
              setDisplay4a('block');  
           } 
        const showAllNewOnce = ()=>{     
            setDisplay1('none');
            setDisplay1a('block');     
        }
        const showAllViwed = ()=>{     
            setDisplay2('none');
              setDisplay2a('block');      
           }
        const showAllLiked = ()=>{     
            setDisplay3('none');
            setDisplay3a('block');    
        }       
      

      useEffect(() => {

        getChannel();
        getChannelVideos();
        chooseShorts();
        chooseNewOnce();
        chooseMoreViwed();
        chooseMoreLiked();
    
      }, [channelid]);

    return (
        <div style={{marginBottom:'100px'}}>
          {channel? ( <>
            <div style={{ maxHeight: '120px', overflow: 'hidden' }}>
             <Image src={channel?.channelBanner} alt="Banner Image" width={800} height={100}
             style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
           
            </div>

            <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                <div className='flex' style={{padding:"10px"}}>
            <Image src={channel?.channelProfilePhoto} alt="Banner Image" width={160} height={160 } 
            className='rounded-full' style={{minHeight:'160px'}}/>
              <div style={{display:'flex', flexDirection:'column',padding:'20px',justifyContent:'space-around'}}>
              <div style={{fontSize:"20px", fontWeight:'bold'}}>{channel?.channelNikName}</div>
              <div>{channel.description}</div>
              </div>
            </div>
            </div>
            <div>              
                <button style={{paddingTop:"20px",paddingLeft:'100px',fontSize:'20px',fontWeight:'bold', }}>Last videos</button>
            <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {videosNew.slice(0,4).map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display1}}>
                    <VideoCard el={el} />
                </div>
            ))}
            {videosNew.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display1a}}>
                    <VideoCard el={el} />
                </div>
            ))}
        </div>
        <button style={{ paddingTop:"20px", paddingLeft:'100px',fontSize:'20px',fontWeight:'bold'}}>Popular videos</button>
            <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {videosPopular.slice(0,4).map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display2}}>
                    <VideoCard el={el} />
                </div>
            ))}
            {videosPopular.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display2a}}>
                    <VideoCard el={el} />
                </div>
            ))}
        </div>
        <button style={{paddingTop:"20px",paddingLeft:'100px',fontSize:'20px',fontWeight:'bold'}}>High raiting videos</button>
            <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {videosLiked.slice(0,4).map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display3}}>
                    <VideoCard el={el} />
                </div>
            ))}
            {videosLiked.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display3a}}>
                    <VideoCard el={el} />
                </div>
            ))}
        </div>
        <button style={{paddingTop:"20px",paddingLeft:'100px',fontSize:'20px',fontWeight:'bold'}}>Shorts</button>
            <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {videosShorts.slice(0,4).map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display4}}>
                    <VideoCard el={el} />
                </div>
            ))}
            {videosShorts.slice(0,4).map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" style={{display:display4a}}>
                    <VideoCard el={el} />
                </div>
            ))}
       
            </div>
            </div>
            </>
        ):<></>}
          
        </div>
    
      );
    };
    
    export default ChannelInfoComponent;

"use client"
import { useState, useEffect } from 'react';
import { IChannel } from '@/types/channelinfo.interface';
import {IVideo} from '@/types/videoinfo.interface'
import Image from 'next/image';
import VideoCard from './video-card';
import PostList from '@/components/pages/posts/posts';
import {buttonCancelStyles} from '@/styles/buttonstyles/buttonCancelStyles'

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
    const [videosAll,setVideosAll]=useState<IVideo[]>([]);
    const [subscribers, setSubscribers] = useState<number>();
    const [display1,setDisplay1] =useState('block');
    const [display2,setDisplay2] =useState('block');
    const [display3,setDisplay3] =useState('block');
    const [display4,setDisplay4] =useState('block');
    const [display1a,setDisplay1a] =useState('none');
    const [display2a,setDisplay2a] =useState('none');
    const [display3a,setDisplay3a] =useState('none');
    const [display4a,setDisplay4a] =useState('none');
    const [display5,setDisplay5] =useState('none');
    const [display6,setDisplay6] =useState('block');
    const [display7,setDisplay7] =useState('none');
    const [color1,setColor1] =useState('lightgray');
    const [color2,setColor2] =useState('white');
    const [color3,setColor3] =useState('white');
    

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
      const getSubscribers = async (): Promise<number> => {
       
    
        try {
          const response = await fetch(`https://localhost:7154/api/Subscription/countbychannelid/${channelid}`, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            setSubscribers(data);
            return data;
          } else {
            console.error('Ошибка при получении подписчиков:', response.statusText);
            return 0;
          }
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
          return 0;
        }
      };

      const getChannelVideos = async () => {
        try {
          
                const response = await fetch('https://localhost:7154/api/Video/getchannelvideos/' + channelid, {
                    method: 'GET',
                });
      
                if (response.ok) {
                    const data: IVideo[] = await response.json();
                    setVideos(data);
                    console.log(data);
                    
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
           const chooseAll = ()=>{     
            setVideosAll(  videos.filter((video: any) => video.isShort === false)) ;     
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
        const showPosts = ()=>{     
            setDisplay6('none'); 
            setDisplay7('none');
            setDisplay5('block');  
            setColor3('lightgray') ;
            setColor2('white');  
            setColor1('white');   
        }  
        const showAll = ()=>{     
            setDisplay6('none'); 
            setDisplay7('block');
            setDisplay5('none'); 
            setColor2('lightgray') ;
            setColor1('white');  
            setColor3('white');    
        }  
        const showMain = ()=>{     
            setDisplay5('none'); 
            setDisplay6('block');
            setDisplay7('none'); 
            setColor1('lightgray') ;
            setColor2('white');  
            setColor3('white'); 
        } 

      useEffect(() => {

        getChannel();
        getChannelVideos();
        getSubscribers();
       
      }, [channelid]);

      useEffect(() => {
        chooseShorts();
        chooseNewOnce();
        chooseMoreViwed();
        chooseMoreLiked();
        chooseAll();
      }, [videos]);

    return (
        <div>
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
              <div>{subscribers} subscribers</div>
              <div>{videos.length} videos</div>
              <div>{channel.description}</div>
              </div>
            </div>
            </div>
            <button onClick={showMain} style={{padding:'5px',backgroundColor:color1,borderRadius:'5px',
                margin:'2px',fontSize:"20px"}}>Main</button>
            <button onClick={showAll} style={{padding:'5px',backgroundColor:color2,
                borderRadius:'5px',margin:'2px',fontSize:"20px"}}>Video</button>
            <button onClick={showPosts} style={{padding:'5px',backgroundColor:color3,
                borderRadius:'5px',margin:'2px',fontSize:"20px"}}>Communities</button>
            <hr />
            <div style={{display:display6}}>
            <div>              
                <button style={{padding:"20px",fontSize:'20px',fontWeight:'bold', }}
                onClick={showAllNewOnce}>Last videos</button>
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
        <hr />
        <button style={{ padding:"20px", fontSize:'20px',fontWeight:'bold'}}
        onClick={showAllViwed}>Popular videos</button>
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
        <hr />
        <button style={{padding:"20px",fontSize:'20px',fontWeight:'bold'}}
        onClick={showAllLiked}>High raiting videos</button>
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
        <hr />
        <button style={{padding:"20px",fontSize:'20px',fontWeight:'bold'}}
        onClick={showAllShorts}>Shorts</button>
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
             <hr />
            </div>
            </div>
            </div>
            </>
        ):<></>}

        </div>

        <div onClick={showPosts} style={{display:display5,marginTop:'-70px'}}>
          <PostList channelId={channelid} />
        </div>
        <div onClick={showAll} style={{display:display7 }}>
        <div className="grid pr-[2%] grid-cols-4 grid-rows-1 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
        {videosAll.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5" >
                    <VideoCard el={el} />
                </div>
            ))}
        </div>
        </div>

        </div>
      );
    };
    
    export default ChannelInfoComponent;

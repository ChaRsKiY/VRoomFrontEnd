'use client';

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {SlDislike, SlLike} from "react-icons/sl";
import {RiPlayListAddFill} from "react-icons/ri";
import {HiOutlineFlag} from "react-icons/hi2";
import {IVideo} from "@/types/videoinfo.interface";
import{formatNumber} from "@/utils/format";
import { useUser } from '@clerk/nextjs';
import { signalRService } from '@/services/signalr.service';
import RadioButtonList from '@/components/pages/watch/report';
import ShareComponent  from './share'; 
import FolowComponent from "./folowblock";


interface IUnderVideoBlockProps {
    video: IVideo;

}

const UnderVideoBlock: React.FC<IUnderVideoBlockProps> = ({ video }: IUnderVideoBlockProps) => {
    const {user}=useUser();
    const[newVideo,setVideo]=useState<IVideo>();
    const [displayR, setDisplayR] = useState('none'); 
    const [isFolowed, setIsFolowed] = useState(false);  

    const  dislike= async (id: number )=>{
        if(user){ 
        try {
          
          const response = await fetch('https://localhost:7154/api/Video/dislike/'+id +'/'+ user.id , {
            method: 'PUT',
          });
    
          if (response.ok) {
           console.log('дизлайк');
          } else {
            console.error('Ошибка при dislike:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
            
      }

      const like = async (id: number ) => {
        if(user){ 
        try {     
          const response = await fetch('https://localhost:7154/api/Video/like/'+id +'/'+ user.id , {
            method: 'PUT',
          });
    
          if (response.ok) {
           console.log('лайк');
          } else {
            console.error('Ошибка при like:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
      }; 

      const checkIsFolowed = async ( ) => {
        if(user){ 
        try {     
          const response = await fetch('https://localhost:7154/api/Subscription/isfolowed/'+video.channelSettingsId +'/'+ user.id , {
            method: 'GET',
          });
    
          if (response.ok) {
                 setIsFolowed(true);
          } else {
            console.error('Ошибка при isfolowed:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
      }; 
      const addSubscription = async ( ) => {
        if(user){ 
        try {     
          const response = await fetch('https://localhost:7154/api/Subscription/add/'+video.channelSettingsId +'/'+ user.id , {
            method: 'POST',
          });
    
          if (response.ok) {
                 setIsFolowed(true);
          } else {
            console.error('Ошибка при isfolowed:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
      }; 

      const deleteSubscription = async ( ) => {
        if(user){ 
        try {     
          const response = await fetch('https://localhost:7154/api/Subscription/delete/'+video.channelSettingsId +'/'+ user.id , {
            method: 'POST',
          });
    
          if (response.ok) {
                 setIsFolowed(false);
          } else {
            console.error('Ошибка при isfolowed:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
      }; 

      useEffect(() => {
        const handleMessage = (messageType: string, payload: any) => {
          console.log('Сообщение от SignalR сервера:', messageType,payload);
    
          if (messageType === 'up_video') {
            const i= payload;
            setVideo(i);
          }
        };
    
        signalRService.onMessageReceived(handleMessage);

    // Очистка подписки при размонтировании компонента
    return () => {
        signalRService.offMessageReceived(handleMessage);
    };
      }, [video]);

      useEffect(() => {
          setVideo(video); 
          checkIsFolowed();                  
      }, [video]);

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

    return (
        <div >
            {newVideo? (<>  
            <div className="py-2 text-xl font-[500]">{newVideo.tittle}</div>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Image src={newVideo.channelBanner} alt={newVideo.channelName} width={40} height={40} 
                    style={{minHeight:'40px'}} className="rounded-full" />
                    <div className="flex flex-col pl-3.5">
                        <div className="font-[500]">{newVideo.channelName}</div>
                    </div>

                    {/* <button className="px-2 py-0.5 rounded bg-neutral-400 text-white ml-5">Follow</button> */}
                    <FolowComponent isfolowed={isFolowed} onDelete={deleteSubscription} onAdd={addSubscription}/>

                    <div className="ml-5 text-neutral-600" title={newVideo.viewCount.toString()}>{formatNumber(newVideo.viewCount)} views</div>
                </div>
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2.5" >
                        <SlLike size={22} onClick={() => like(newVideo.id )}/>
                        <div className="font-[300]" title={newVideo.likeCount.toString()}>{formatNumber(newVideo.likeCount)}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike size={22} onClick={() => dislike(newVideo.id )}/>
                        <div className="font-[300]" title={newVideo.dislikeCount.toString()}>{formatNumber(newVideo.dislikeCount)}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <RiPlayListAddFill size={22} />
                        <div className="font-[300]">Add to playlist</div>
                    </div>
                    <button className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2"
                    style={{padding:'10px', display:displayR, marginLeft:'-15px',backgroundColor:'white',
                       marginTop:'25px',fontWeight:'bold',fontSize:'20px' }}  onClick={() => closeReport()}>
                        X Close report
                    </button>
                     <div className="flex items-center space-x-2.5">
                        <ShareComponent URL={newVideo.videoUrl} />
                       
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <RadioButtonList userName={newVideo.tittle}  />  
                    </div>
                </div>
            </div></>):<></>} 
        </div>
    )
}

export default UnderVideoBlock
'use client';

import React, {useEffect, useState} from 'react'
import {IPresentedVideo} from "@/types/video.interface";
import Image from "next/image";
import {SlDislike, SlLike} from "react-icons/sl";
import {RiPlayListAddFill} from "react-icons/ri";
import {BsShare} from "react-icons/bs";
import {HiOutlineFlag} from "react-icons/hi2";
import {IVideo} from "@/types/videoinfo.interface";
import{formatNumber} from "@/utils/format";
import { useUser } from '@clerk/nextjs';
import { signalRService } from '@/services/signalr.service';
import RadioButtonList from '@/components/pages/comments/report';
import ShareComponent  from './share'; 

// interface IUnderVideoBlockProps {
//     video: IPresentedVideo
// }

// const UnderVideoBlock: React.FC<IUnderVideoBlockProps> = ({ video }: IUnderVideoBlockProps) => {
//     return (
//         <div>
//             <div className="py-2 text-xl font-[500]">{video.title}</div>
//             <div className="flex justify-between">
//                 <div className="flex items-center">
//                     <Image src={video.channel.avatar} alt={video.channel.name} width={40} height={40} className="rounded-full" />
//                     <div className="flex flex-col pl-3.5">
//                         <div className="font-[500]">{video.channel.name}</div>
//                     </div>
//                     <button className="px-2 py-0.5 rounded bg-neutral-400 text-white ml-5">Follow</button>
//                     <div className="ml-5 text-neutral-600">{video.views} views</div>
//                 </div>
//                 <div className="flex items-center space-x-8">
//                     <div className="flex items-center space-x-2.5">
//                         <SlLike size={22}/>
//                         <div className="font-[300]">289k</div>
//                     </div>
//                     <div className="flex items-center space-x-2.5">
//                         <SlDislike size={22}/>
//                         <div className="font-[300]">18k</div>
//                     </div>
//                     <div className="flex items-center space-x-2.5">
//                         <RiPlayListAddFill size={22} />
//                         <div className="font-[300]">Add to playlist</div>
//                     </div>
//                     <div className="flex items-center space-x-2.5">
//                         <BsShare size={22} />
//                         <div className="font-[300]">Share</div>
//                     </div>
//                     <div className="flex items-center space-x-2.5">
//                         <HiOutlineFlag size={22} />
//                         <div className="font-[300]">Report</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UnderVideoBlock

interface IUnderVideoBlockProps {
    video: IVideo
}

const UnderVideoBlock: React.FC<IUnderVideoBlockProps> = ({ video }: IUnderVideoBlockProps) => {
    const {user}=useUser();
    const[newVideo,setVideo]=useState<IVideo>();
    const [displayR, setDisplayR] = useState('none');  

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
                    <button className="px-2 py-0.5 rounded bg-neutral-400 text-white ml-5">Follow</button>
                    <div className="ml-5 text-neutral-600" title={newVideo.viewCount.toString()}>{formatNumber(newVideo.viewCount)} views</div>
                </div>
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2.5" onClick={() => closeReport()}>
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
                    {/* <div className="flex items-center space-x-2.5">
                        <BsShare size={22} />
                        <div className="font-[300]">Share</div>
                    </div> */}
                     <div className="flex items-center space-x-2.5">
                        <ShareComponent URL={newVideo.videoUrl} />
                    </div>
                    <div className="flex items-center space-x-2.5"  onClick={() => openReport()}>
                        <HiOutlineFlag size={22} />
                        <div className="font-[300]">Report</div>
                        {user? (
                        <div
              className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                position: 'absolute',
               marginTop:'-150px',
               marginLeft:'-300px',
               display: displayR,
               maxWidth: '400px',
               minWidth:'300px',
               borderRadius:'20px',
               backgroundColor:'white',
               zIndex: 100,
              }}
            >            
                <RadioButtonList userName={newVideo.tittle} onClose={closeReport}/>
         
            </div>):<></>}
                    </div>
                </div>
            </div></>):<></>}
        </div>
    )
}

export default UnderVideoBlock
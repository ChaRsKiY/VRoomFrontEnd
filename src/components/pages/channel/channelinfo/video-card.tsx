import React ,{useState} from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";
import { MdMoreVert } from 'react-icons/md'; 
import MenuBlock from './videocardmenu';


interface IVideoCardProps {
    el: IVideo;
   
}

const VideoCard: React.FC<IVideoCardProps> =  ({ el }: IVideoCardProps) => {
    const [display1, setDisplay1] = useState('none'); 
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = ( event: React.MouseEvent) => {

        event.stopPropagation(); 
        setIsMenuVisible((prev) => !prev);
      };
  

    return (
        <div>

        <Link href={"/watch/" + el.id} className="space-y-2.5">
            <Image src={el.cover} alt={el.tittle} width={1000} height={1000} className="rounded-xl aspect-[16/9]"/>
        </Link>
            <div className='flex' style={{justifyContent:'space-between'}}>
            <div style={{maxHeight:'50px',overflow:'hidden'}}>
                    {el.description}
                </div>
                
                <div> <div key={el.id} className="relative">
          <button onClick={(event) => toggleMenu( event)} className="flex pl-10 pt-2 space-x-2" >
            <MdMoreVert size={20} color="black" />
          </button></div></div>
          </div>
            <div className="flex space-x-2.5">
                
                <div>
                    
                    <div className="text-neutral-500 text-[0.8rem] flex items-center">
                        {formatNumber(el.viewCount)} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {formatTimeAgo(new Date(el.uploadDate))}
                    </div>
                 </div>
                
            </div>
             {isMenuVisible && (
        <div
          className="absolute bg-white border  rounded-md shadow-lg z-10"
          style={{
            width: '180px',
            position: 'absolute',
            marginTop: '-20px',
           marginLeft: '80px'
          }}
        >
          <MenuBlock video={el} />
        </div>
      )}
       
        </div>
    )
}

export default VideoCard
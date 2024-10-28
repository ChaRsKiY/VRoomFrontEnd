'use client';

import React, {useState,useEffect} from 'react';
import {IPresentedVideo} from "@/types/video.interface";
import VideoCard from "@/components/pages/results/video-card";
import ClientScrollBlock from "@/components/pages/results/client-scroll-block";
import {IVideo} from "@/types/videoinfo.interface";
import { HiOutlineChevronDown } from 'react-icons/hi';
import { FaFilter } from 'react-icons/fa';


// interface IUnlimitedScrollBlockProps {
//     data: IPresentedVideo[]
// }

// const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
//     return (
//         <div className="pr-[2%] max-sm:pr-0 flex-1">
//             {data.map((el, key) => (
//                 <div key={key} className="px-3 mb-8 space-y-2.5">
//                     <VideoCard el={el} />
//                 </div>
//             ))}

//             <ClientScrollBlock />
//         </div>
//     )
// }

// export default UnlimitedScrollBlock



// interface IUnlimitedScrollBlockProps {
//     data: IVideo[]
// }

// const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
//     const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
//     const [visibleCount, setVisibleCount] = useState(2);

//     useEffect(() => {
//         setMoreVideos(data);
//     }, [data]);

//     const loadMore = () => {
//         setVisibleCount((prevCount) => prevCount + 2); // добавляем два новых элемента
//     };

//     return (
//         <div className="pr-[2%] max-sm:pr-0 flex-1" style={{marginTop:'100px',marginBottom:'100px'}}>
//              {moreVideos.slice(0, visibleCount).map((el, key) => (
//                 <div key={key} className="px-3 mb-8 space-y-2.5">
//                     <VideoCard el={el} />
//                 </div>
//             ))}
//              {visibleCount < moreVideos.length && (
//                 <button onClick={loadMore} className="load-more-button" style={{paddingLeft:'50px'}}>
//                   <div className='flex' style={{color:'blue'}}> <HiOutlineChevronDown size={24} color="blue"  /> 
//                    &nbsp;Show more</div>
//                 </button>
//             )}
//         </div>
//     )
// }

// export default UnlimitedScrollBlock


interface IUnlimitedScrollBlockProps {
    data: IVideo[]
}

const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
    
    
    
    return (
        <div  >
        <div className="pr-[2%] max-sm:pr-0 flex-1">
            {data.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5">
                    <VideoCard el={el} />
                </div>
            ))}
            {data.length==0? ( <div className="px-3 mb-8 space-y-2.5"  >
                No results were found...
            </div> ):<></>}

             {/* <ClientScrollBlock v={data}/>  */}
        </div>
        </div>
    )
}

export default UnlimitedScrollBlock
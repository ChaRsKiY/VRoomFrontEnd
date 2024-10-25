import React from 'react'
import VideoCard from "@/components/pages/home/main/video-card";
import ClientScrollBlock from "@/components/pages/home/main/client-scroll-block";
import {IVideo} from "@/types/videoinfo.interface";


interface IUnlimitedScrollBlockProps {
    data: IVideo[]
}

const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
    return (
        <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {data.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5">
                    <VideoCard el={el} />
                </div>
            ))}

            <ClientScrollBlock videolist={data}/>
        </div>
    )
}

export default UnlimitedScrollBlock





// const UnlimitedScrollBlock: React.FC = () => {

//     const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
   
//     const getVideos = async () => {
//       try {
//         const response = await fetch('https://localhost:7154/api/Video', {
//           method: 'GET',
//         });
  
//         if (response.ok) {
//           const mydata: IVideo[] = await response.json();
//           console.log('успешный list of video', mydata);
//           setMoreVideos(mydata);
//         } else {
//           console.error('Ошибка получения видео:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Ошибка при подключении к серверу:', error);
//       }
//     };
  
//     useEffect(() => {
     
//       getVideos();
//     }, []);

//     return (
//         <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0" style={{marginTop:'100px'}}>
//             {moreVideos.map((el, key) => (
//                 <div key={key} className="px-3 mb-8 space-y-2.5">
//                     <VideoCard el={el} />
//                 </div>
//             ))}

          
//         </div>
//     )
// }

// export default UnlimitedScrollBlock
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { IContentVideo } from "@/types/videoDTO.interface";
// import VideoCard from "@/components/pages/channel/subtitle/videocard";
// import api from '@/services/axiosApi';
// import PublishSubtitleEditor from "@/components/pages/channel/subtitle/publishedSubtitleEditor";
// import { useUser } from '@clerk/nextjs';
// import { IChannel } from '@/types/channelinfo.interface';
// import '@/styles/modalsubtitles.css';
// import { ISubtitle } from "@/types/subtitle.interface";
// import Image from "next/image";
// import { base64ToUint8Array, byteArrayToBase64 } from "@/utils/base64Functions";
// import { BiFile, BiPencil } from 'react-icons/bi';
// import { formatDate } from "@/utils/dateformat";



// const PublishedSubtitleslist = () => {

//     const [open, setOpen] = useState(false);
//     const [channel, setChannel] = useState<IChannel>();
//     const [videoId, setVideoId] = useState(0);
//     const { user } = useUser();
//     const [urlSubtitle, setUrlSubtitle] = useState<string>("");

//     const openSubtitlesEditor = (id: number, url: string) => {
//         setUrlSubtitle(url);
//         setVideoId(id);
//         setOpen(!open);
//     }
//     const closeSubtitlesEditor = () => {
//         setVideoId(0);
//         setOpen(false);
//     }

//     const getUser = async () => {
//         try {
//             if (user) {
//                 const response = await api.get('/ChannelSettings/getbyownerid/' + user?.id);

//                 if (response.status === 200) {
//                     const data: IChannel = await response.data;
//                     setChannel(data);
//                 } else {
//                     console.error('Ошибка при получении пользователя:', response.statusText);
//                 }
//             }
//         } catch (error) {
//             console.error('Ошибка при подключении к серверу:', error);
//         }
//     };

//     const [moreVideos, setMoreVideos] = useState<IContentVideo[]>([]);

//     const getVideos = async () => {
//         try {
//             if (channel) {
//                 const response = await api.get('/Video/getvideosbychannelid/' + channel.id);

//                 if (response.status === 200) {
//                     const mydata: IContentVideo[] = await response.data;
//                     const videosWithSubtitles: IContentVideo[] = await Promise.all(
//                         mydata.map(async (video) => {
//                             const subtitles = await api.get<ISubtitle[]>(`/Subtitle/getpublishsubtitles/${video.id}`);
//                             return { ...video, subtitles: subtitles.data };
//                         })
//                     );
//                     setMoreVideos(videosWithSubtitles);
//                 } else {
//                     console.error('Ошибка получения видео:', response.statusText);
//                 }
//             }
//         } catch (error) {
//             console.error('Ошибка при подключении к серверу:', error);
//         }
//     };

//     useEffect(() => {
//         getUser();
//     }, []);

//     useEffect(() => {
//         getVideos();
//     }, [channel]);

//     return (
//         <div style={{ margin: '20px' }}>

//             {open && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <PublishSubtitleEditor videoId={videoId} onClose={closeSubtitlesEditor}
//                             subtitleUrl={urlSubtitle} />
//                     </div>
//                 </div>
//             )}
//             <table className="table-auto w-full bg-white shadow-md rounded-lg ">
//                 <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
//                     <tr className="text-left">

//                         <th className="py-3 px-3 ">Video</th>
//                         <th className="py-3 px-3 ">Published subtitles</th>

//                     </tr>
//                 </thead>
//                 <tbody className="text-gray-700 text-sm">

//                     {moreVideos.length > 0 ? (moreVideos.map((el, key) => (
//                         <>
//                             {el.subtitles ? (<>
//                                 {el.subtitles.length > 0 ? (<>
//                                     <tr key={el.id} data-index={key} className={"border-b border-gray-200 hover:bg-gray-100 text-left"}
//                                     >
//                                         <td className="py-3 px-3  flex ">
//                                             <Image src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(el.cover))}`}
//                                                 width={115} height={100}
//                                                 alt="Video Thumbnail"
//                                                 className="mr-1.5 rounded-lg" />
//                                             <div key={el.id} className="relative w-full">
//                                                 <div className="w-full h-full p-1 flex flex-col">
//                                                     <span>{el.tittle}</span>
//                                                 </div>

//                                             </div>
//                                         </td>
//                                         <td className="py-3 px-3 ">
//                                             <div className="flex" style={{ flexDirection: "column" }}>
//                                                 <span>{el.subtitles ? el.subtitles.length : 0}</span>
//                                                 {el.subtitles?.map((subtitle, key) => (
//                                                     <div title='Edit subtitle'
//                                                         key={key}
//                                                         onClick={() => openSubtitlesEditor(
//                                                             el.id, subtitle.puthToFile ? subtitle.puthToFile : "")}
//                                                         style={{ cursor: "pointer", padding: "10px" }}
//                                                     >
//                                                         <BiFile />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </td>

//                                     </tr>
//                                 </>) : <></>}
//                             </>) : <><tr>
//                                 <td colSpan={2} className="text-center py-4" > </td>
//                             </tr></>}
//                         </>
//                     ))) : (
//                         <tr>
//                             <td colSpan={2} className="text-center py-4" style={{ cursor: 'pointer' }}>
//                                 <div onClick={() => openSubtitlesEditor(1, "")}>
//                                     {/* TestPublishedSubtitlesEditor */}
//                                 </div>
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>



//         </div>
//     )
// }

// export default PublishedSubtitleslist


'use client'

import React, { useEffect, useState } from 'react'
import { IContentVideo } from "@/types/videoDTO.interface";
import VideoCard from "@/components/pages/channel/subtitle/videocard";
import api from '@/services/axiosApi';
import FoulCopySubtitleEditor from "@/components/pages/channel/subtitle/foulsubtitleeditor";
import { useUser } from '@clerk/nextjs';
import { IChannel } from '@/types/channelinfo.interface';
import '@/styles/modalsubtitles.css';
import { ISubtitle } from "@/types/subtitle.interface";
import Image from "next/image";
import { base64ToUint8Array, byteArrayToBase64 } from "@/utils/base64Functions";
import { BiFile, BiPencil, BiTrash } from 'react-icons/bi';
import { formatDate } from "@/utils/dateformat";



const PublishedSubtitleslist = () => {

    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<IChannel>();
    const [videoId, setVideoId] = useState(0);
    const { user } = useUser();
    const [urlSubtitle, setUrlSubtitle] = useState<string>("");
    const [deleteMenuOpenIndex, setDeleteMenuOpenIndex] = useState<number | null>(null);
    const [deleteMenuOpenKey, setDeleteMenuOpenKey] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
      const [langCode, setLangCode] = useState<string>("");
        const [langName, setLangName] = useState<string>("");

        const openSubtitlesEditor = (id: number, url: string, lc: string, ln: string) => {
            setUrlSubtitle(url);
            setVideoId(id);
            setLangCode(lc);
            setLangName(ln);
            setOpen(!open);
        }
    const closeSubtitlesEditor = () => {
        setVideoId(0);
        setOpen(false);
    }
    const toggleDeleteMenu = (index: number, key: number, event: React.MouseEvent) => {
        if (deleteMenuOpenIndex === index && deleteMenuOpenKey === key) {
            setDeleteMenuOpenIndex(null);
            setDeleteMenuOpenKey(null);
        } else {
            setDeleteMenuOpenIndex(index);
            setDeleteMenuOpenKey(key);
            setIsOpen(true);
        }
    };


    const closeDelete = () => {
        if (isOpen) {
            setDeleteMenuOpenIndex(null);
            setDeleteMenuOpenKey(null);
            setIsOpen(false);
        }
    };

    const getUser = async () => {
        try {
            if (user) {
                const response = await api.get('/ChannelSettings/getbyownerid/' + user?.id);

                if (response.status === 200) {
                    const data: IChannel = await response.data;
                    setChannel(data);
                } else {
                    console.error('Ошибка при получении пользователя:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const deleteSubtitle = async (id: number) => {
        try {
            if (user) {
                const response = await api.delete('/Subtitle/delete/' + id);

                if (response.status === 200) {
                    console.log("subtitle deleted");
                } else {
                    console.error('Ошибка при получении пользователя:', response.statusText);
                }

                setMoreVideos((prevVideos) =>
                    prevVideos.map((video) => ({
                        ...video,
                        subtitles: video.subtitles?.filter(
                            (subtitle) => subtitle.id !== id
                        ),
                    }))
                );
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const [moreVideos, setMoreVideos] = useState<IContentVideo[]>([]);

    const getVideos = async () => {
        try {
            if (channel) {
                const response = await api.get('/Video/getvideosbychannelid/' + channel.id);

                if (response.status === 200) {
                    const mydata: IContentVideo[] = await response.data;
                    const videosWithSubtitles: IContentVideo[] = await Promise.all(
                        mydata.map(async (video) => {
                            const subtitles = await api.get<ISubtitle[]>(`/Subtitle/getpublishsubtitles/${video.id}`);
                            return { ...video, subtitles: subtitles.data };
                        })
                    );
                    setMoreVideos(videosWithSubtitles);
                } else {
                    console.error('Ошибка получения видео:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getVideos();
    }, [channel]);


    return (
        <div style={{ margin: '20px' }}>

            {open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FoulCopySubtitleEditor videoId={videoId} onClose={closeSubtitlesEditor}
                            subtitleUrl={urlSubtitle} langCode={langCode} langName={langName} />
                    </div>
                </div>
            )}
            <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                    <tr className="text-left">

                        <th className="py-3 px-3 ">Video</th>
                        <th className="py-3 px-3 ">Published</th>

                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">

                    {moreVideos.length > 0 ? (moreVideos.map((el, index) => (
                        <>
                            {el.subtitles ? (<>
                                {el.subtitles.length > 0 ? (<>
                                    <tr key={el.id} data-index={index} className={"border-b border-gray-200 hover:bg-gray-100 text-left"}
                                    >
                                        <td className="py-3 px-3  flex ">
                                            <Image src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(el.cover))}`}
                                                width={115} height={100}
                                                alt="Video Thumbnail"
                                                className="mr-1.5 rounded-lg" />
                                            <div key={el.id} className="relative w-full">
                                                <div className="w-full h-full p-1 flex flex-col">
                                                    <span>{el.tittle}</span>
                                                </div>

                                            </div>
                                        </td>
                                        <td className="py-3 px-3 ">
                                            <div className="flex" style={{ flexDirection: "column" }}>

                                                {el.subtitles?.map((subtitle, key) => (
                                                    <div className="flex" style={{ padding: '5px', paddingLeft: "20px" }}>
                                                        <div className="flex" style={{ flexDirection: "column", justifyContent: 'space-around' }}>
                                                            <span>{key + 1}</span> </div>
                                                        <div className="flex" style={{ flexDirection: "column", justifyContent: 'space-around' }}>
                                                            <div title='Edit subtitle'
                                                                key={key}
                                                                onClick={() => openSubtitlesEditor(
                                                                    el.id, subtitle.puthToFile ? subtitle.puthToFile : "",
                                                                subtitle.languageCode, subtitle.languageName)}
                                                                style={{ cursor: "pointer", padding: "10px" }}
                                                            >
                                                                <BiFile size={20} />
                                                            </div>
                                                        </div>
                                                        <div className="flex" style={{ flexDirection: "column", justifyContent: 'space-around' }}>
                                                            <div  >
                                                                {subtitle.languageCode}
                                                            </div>
                                                        </div>
                                                        <div className="flex" style={{ flexDirection: "column", justifyContent: 'space-around' }}>
                                                            <div style={{ padding: '5px', marginLeft: "50px", cursor: 'pointer' }}
                                                                onClick={(event) => toggleDeleteMenu(index, key, event)} title='Delete'>
                                                                <BiTrash />
                                                                {deleteMenuOpenIndex === index && deleteMenuOpenKey === key ? (
                                                                    <div
                                                                        className=" bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[160px] subtitle-editor"
                                                                        style={{
                                                                            marginTop: '-30px',
                                                                            paddingBottom: '4px',
                                                                            position: 'relative',
                                                                            borderRadius: '3px',
                                                                            backgroundColor: 'lightgrey',
                                                                            border: '1px solid #212f3c',

                                                                        }}
                                                                    >
                                                                        <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-red-300"
                                                                            style={{ display: 'flex', justifyContent: 'center', color: 'red', fontWeight: 'bold' }}
                                                                            onClick={() => deleteSubtitle(subtitle.id)}>
                                                                            <span >Delete #{key + 1}</span></div>


                                                                        <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-gray-300"
                                                                            style={{ display: 'flex', justifyContent: 'center' }}
                                                                            onClick={closeDelete}>
                                                                            <span >Cancel</span></div>
                                                                    </div>
                                                                ) : (<></>)}
                                                            </div>
                                                        </div> </div>
                                                ))}
                                            </div>
                                        </td>

                                    </tr>
                                </>) : <></>}
                            </>) : <><tr>
                                <td colSpan={2} className="text-center py-4" > </td>
                            </tr></>}
                        </>
                    ))) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4" style={{ cursor: 'pointer' }}>
                                <div onClick={() => openSubtitlesEditor(1, "","","")}>
                                    {/* TestPublishSubtitlesEditor */}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>



        </div>
    )
}
export default PublishedSubtitleslist
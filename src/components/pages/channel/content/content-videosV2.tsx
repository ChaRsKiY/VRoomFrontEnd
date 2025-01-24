"use client";

import React, {useState, useEffect, useRef} from 'react';
import ContentTable from "@/components/pages/channel/content/content-table";
import FilterDialog from "@/components/pages/channel/filter/filter-dialog";
import {IContentVideo} from "@/types/videoDTO.interface";
import {Filters} from "@/types/filters.interface";
import {useUser} from "@clerk/nextjs";
import {FaFilter} from "react-icons/fa";
import {fetchVideos} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import Image from "next/image";
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {MdOutlineAnalytics, MdOutlineInsertComment, MdOutlineModeEditOutline} from "react-icons/md";
import {RiYoutubeLine} from "react-icons/ri";
import {BsThreeDotsVertical} from "react-icons/bs";
import {IoMdArrowDropdown} from "react-icons/io";
import {formatDate, formatDuration} from "@/utils/dateformat";
import api from "@/services/axiosApi";

interface IContentVideoProps {
    isShort: boolean;
}

const ContentVideo: React.FC<IContentVideoProps> = ({isShort}) => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [videos, setVideos] = useState<IContentVideo[]>([]);
    const [filters, setFilters] = useState<Filters>({
        copyright: '', ageRestriction: '', audience: '',
        access: '', title: '', description: '',
        minViews: 0, maxViews: 0,
    });
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [activeId, setActiveId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const allSelected = selectedIds.size === videos.length && videos.length > 0;
    const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if (user && isLoading) {
            const fetchData = async () => {
                const result = await fetchVideos(user.id, isShort, filters);
                setVideos(result);
            };
            fetchData();
        }
        setIsLoading(false);
    }, [user, isLoading, filters]);

    const applyFilters = async (newFilters: any) => {
        setFilters(newFilters);
        if (user) {
            setVideos(await fetchVideos(user.id, isShort, newFilters));
        }
        setIsFilterDialogOpen(false);
    };

    const handleClick = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };


    // Обновляем состояние чекбокса в заголовке
    useEffect(() => {
        setHeaderCheckboxChecked(selectedIds.size > 0);
    }, [selectedIds]);


    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedIds((prev) => {
            const updated = new Set(prev);
            if (checked) {
                updated.add(id);
            } else {
                updated.delete(id);
            }
            return updated;
        });
    };

    const handleDelete = async () => {
        try {
            if (user) {
                const idsToDelete = Array.from(selectedIds);

                // Запрос к API для удаления
                const response = await api.delete("Video/deleterangevideo", {
                    data: idsToDelete,
                    headers: {"Content-Type": "application/json"},
                });

                if (response.data?.NotFoundIds) {
                    console.warn(response.data.Message);
                }
                // Удаление из локального состояния
                setVideos(videos.filter((video) => !selectedIds.has(video.id)));
                setSelectedIds(new Set());
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const handleCancel = () => {
        setSelectedIds(new Set());
    };

    const handleSelectAllChange = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(videos.map((video) => video.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const headerCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate =
                selectedIds.size > 0 && selectedIds.size < videos.length;
        }
    }, [selectedIds]);
    if (isLoading)
        return <div>Загрузка...</div>;

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6 my-3">
                <button onClick={() => setIsFilterDialogOpen(true)}
                        className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                    <FaFilter className="pr-0.5"/> Filter
                </button>
                {selectedIds.size > 0 && (
                    <div
                        className={`w-full flex items-center gap-4 text-black px-6 py-1 rounded transition-all duration-300 ease-in-out ${
                            selectedIds.size > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                        }`}>
                        <span className=" text-black">{`Selected: ${selectedIds.size}`}</span>
                        <button className="bg-red-500 text-white px-4 py-0.5 rounded hover:bg-red-600"
                                onClick={handleDelete}>Delete
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-4 py-0.5 rounded hover:bg-gray-400"
                                onClick={handleCancel}>Cancel
                        </button>
                    </div>
                )}
            </div>

            <FilterDialog isOpen={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}
                          onApplyFilters={applyFilters}/>


            <table className="table-auto w-full bg-white shadow-md rounded-lg ">
                <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                <tr className="text-left">
                    <th className="py-3 px-3 "><input type="checkbox" className="w-5 h-5" ref={headerCheckboxRef}
                                                      checked={selectedIds.size === videos.length}
                                                      onChange={(e) => handleSelectAllChange(e.target.checked)}/></th>
                    <th className="py-3 px-3 ">{isShort ? 'Shorts':'Video'}</th>
                    <th className="py-3 px-3 ">Visibility</th>
                    <th className="py-3 px-3 ">Date</th>
                    <th className="py-3 px-3 ">Views</th>
                    <th className="py-3 px-3 ">Comments</th>
                    <th className="py-3 px-3 ">Likes</th>
                    <th className="py-3 px-3 ">Dislikes</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">

                {videos.length > 0 ? (videos.map((el, key) => (
                    <tr key={el.id} data-index={key} className={"border-b border-gray-200 hover:bg-gray-100 text-left"}>
                        <td className="py-3 px-3">
                            <input type="checkbox" className="w-5 h-5"
                                   checked={selectedIds.has(el.id)}
                                   onChange={(e) =>
                                       handleCheckboxChange(el.id, e.target.checked)
                                   }/>

                        </td>
                        <td className="py-3 px-3  flex ">
                            <div className={'relative'}>
                                <Image src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(el.cover))}`}
                                       width={120} height={105}
                                       alt="Video Thumbnail"
                                       className={`mr-1.5 rounded-lg aspect-video`}/>
                                <div
                                    className="bg-black px-1 py-[-0.5px] text-[0.625rem] text-white rounded w-max absolute bottom-1 right-0.5">
                                    {formatDuration(el.duration)}
                                </div>
                            </div>
                            <div key={el.id} className="relative w-full">
                                <div className="w-full h-full p-1 flex flex-col">
                                    <span>{el.tittle}</span>
                                    <span>{el.description}</span>
                                </div>

                                {/*{activeId === el.id && (
                                    <div className="absolute top-0 left-0 bg-white w-full h-full p-1">
                                        <span>{el.tittle}</span>
                                        <div className="flex flex-row items-center justify-center mt-2">
                                            <MdOutlineModeEditOutline
                                                onClick={() => alert(el.tittle + " / " + el.id)}
                                                title="Edit"
                                                className="w-1/4 h-7 cursor-pointer"/>
                                            <MdOutlineAnalytics title="Analitics"
                                                                className="w-1/4 h-7 cursor-pointer"/>
                                            <MdOutlineInsertComment title="Comments"
                                                                    className="w-1/4 h-7 cursor-pointer"/>
                                            <RiYoutubeLine title="Video" className="w-1/4 h-7 cursor-pointer"/>
                                            <BsThreeDotsVertical title="All" className="w-1/4 h-7 cursor-pointer"/>
                                        </div>
                                    </div>
                                )}*/}

                            </div>
                           {/* <div className="flex">
                                <IoMdArrowDropdown className="w-[1.8rem] h-[1.8rem] cursor-pointer" key={el.id}
                                                   onClick={() => handleClick(el.id)}/>
                            </div>*/}
                        </td>
                        {el?.visibility === true && (<td className="py-3 px-3 ">Public</td>)}
                        {el?.visibility === false && (<td className="py-3 px-3 ">Private</td>)}
                        <td className="py-3 px-3 ">{formatDate(new Date(el.uploadDate))} <br/>Published</td>
                        <td className="py-3 px-3 ">{el.viewCount}</td>
                        <td className="py-3 px-3 ">{el.commentVideoIds?.length}</td>
                        <td className="py-3 px-3 ">{el.likeCount}</td>
                        <td className="py-3 px-3 ">{el.dislikeCount}</td>
                    </tr>
                ))) : (
                    <tr>
                        <td colSpan={6} className="text-center py-4">
                            No data to display
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};
export default ContentVideo;
"use client";

import React, {useEffect, useRef, useState} from 'react';
import {useUser} from "@clerk/nextjs";
import Image from "next/image";
import {IContentVideo} from "@/types/videoDTO.interface";
import api from '@/services/axiosApi';
import {CgPlayList} from "react-icons/cg";
import {IPlayList} from "@/types/playlist.interface";
import {formatDate} from "@/utils/dateformat";
import FilterDialog from "@/components/pages/channel/filter/filter-dialog";
import {fetchVideos} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import {Filters} from "@/types/filters.interface";
import {FaFilter} from "react-icons/fa";

const ContentPlaylists = () => {
    const {user} = useUser();
    const [playLists, setPlayLists] = useState<IPlayList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        copyright: '', ageRestriction: '', audience: '',
        access: '', title: '', description: '',
        minViews: 0, maxViews: 0,
    });
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const allSelected = selectedIds.size === playLists.length && playLists.length > 0;
    const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(false);
    useEffect(() => {
        if (user && isLoading) {
            fetchChannel1(user.id);
        }
    }, [user, isLoading]);

    const applyFilters = async (newFilters: any) => {
        setFilters(newFilters);
        // if (user) {
        //     setPlayLists(await fetchVideos(user.id, isShort, newFilters));
        // }
        setIsFilterDialogOpen(false);
    };
    const fetchChannel1 = async (userId: string) => {
        try {
            const firstResponse = await api.get(`/PlayList/getbyuserid/${userId}`);
            setPlayLists(firstResponse.data);
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
        } finally {
            setIsLoading(false);
        }
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
                setPlayLists(playLists.filter((video) => !selectedIds.has(video.id)));
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
            setSelectedIds(new Set(playLists.map((playList) => playList.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const headerCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate =
                selectedIds.size > 0 && selectedIds.size < playLists.length;
        }
    }, [selectedIds]);
    if (isLoading) return <div>Загрузка...</div>;

    if (playLists.length == 0) {
        return (<div className="flex flex-col items-center justify-center h-96">
            <img src="https://placehold.co/120x120" alt="No content illustration" className="mb-4"/>
            <p className="text-gray-500">Здесь пока ничего нет.</p>
            <button className="bg-black text-white px-6 py-2 rounded-md mt-4">Добавить плейлист</button>
        </div>);
    } else
        return (
            <>
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
                            <span className=" text-black">{`Выделено: ${selectedIds.size}`}</span>
                            <button className="bg-red-500 text-white px-4 py-0.5 rounded hover:bg-red-600"
                                    onClick={handleDelete}>Удалить
                            </button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-0.5 rounded hover:bg-gray-400"
                                    onClick={handleCancel}>Отменить
                            </button>
                        </div>
                    )}
                </div>

                <FilterDialog isOpen={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}
                              onApplyFilters={applyFilters}/>

                <table className="table-auto w-full  bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                    <tr className=" text-left">
                        <th className="py-3 px-3"><input type="checkbox" className="w-5 h-5" ref={headerCheckboxRef}
                                                         checked={selectedIds.size === playLists.length}
                                                         onChange={(e) => handleSelectAllChange(e.target.checked)}/>
                        </th>
                        <th className="py-3 px-3 ">PlayList</th>
                        <th className="py-3 px-3 ">Type</th>
                        <th className="py-3 px-3 ">Visibility</th>
                        <th className="py-3 px-3 ">Date</th>
                        <th className="py-3 px-3 ">Video count</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">

                    {playLists.map((el, key) => (
                        <tr key={el.id} data-index={key}
                            className="border-b text-left border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-3"><input type="checkbox" className="w-5 h-5"
                                                             checked={selectedIds.has(el.id)}
                                                             onChange={(e) =>
                                                                 handleCheckboxChange(el.id, e.target.checked)
                                                             }/></td>
                            <td className="py-3 px-3  flex items-center">
                                <div className="relative w-max">
                                    <Image src="https://placehold.co/125x70" alt="Playlist thumbnail"
                                           className="w-full h-auto object-cover rounded-lg"/>
                                    <div
                                        className="absolute top-0 right-0 h-full w-1/2 bg-black bg-opacity-50 flex-col items-center justify-center rounded-r-lg">
                                        <p className="text-white text-lg mt-3 font-normal w-full text-center">10</p>
                                        <CgPlayList className="h-9 w-9 mt-[-0.35rem] ml-4 text-white "/>
                                    </div>
                                </div>
                                <span className="pl-2">{el.title}</span>
                            </td>
                            <td className="py-3 px-3 "></td>
                            {el?.access === true && (<td className="py-3 px-3 ">Public</td>)}
                            {el?.access === false && (<td className="py-3 px-3 ">Private</td>)}
                            <td className="py-3 px-3 ">{formatDate(new Date(el.date))} <br/>Published</td>
                            <td className="py-3 px-3 ">{el.videosId?.length}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>
        );
};

export default ContentPlaylists;

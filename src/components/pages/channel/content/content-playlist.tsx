"use client";

import React, {useEffect, useState} from 'react';
import {useUser} from "@clerk/nextjs";
import Image from "next/image";
import {IContentVideo} from "@/types/videoDTO.interface";
import axios from "axios";
import {CgPlayList} from "react-icons/cg";
import {IPlayList} from "@/types/playlist.interface";
import {formatDate} from "@/utils/dateformat";

const ContentPlaylists = () => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [data, setData] = useState<IPlayList[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Новое состояние для отслеживания загрузки

    useEffect(() => {
        // Если пользователь существует и данные еще не загружены
        if (user && isLoading) {
            fetchChannel1(user.id);
        }
    }, [user, isLoading]); // Добавляем зависимость от isLoading

    const fetchChannel1 = async (userId: string) => {
        try {
            const firstResponse = await axios.get(`https://localhost:7154/api/PlayList/getbyuserid/${userId}`);
            // Используем данные из первого запроса для второго запроса
            //const secondResponse = await axios.get(`https://localhost:7154/api/Video/getbyuserid/${firstResponse.data.[id]}`);

            setData(firstResponse.data); // Сохраняем данные в состоянии
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
        } finally {
            setIsLoading(false); // Устанавливаем флаг, что данные загружены
        }
    };

    if (isLoading) return <div>Загрузка...</div>; // Показываем индикатор загрузки

    if (data.length == 0) {
        return (<div className="flex flex-col items-center justify-center h-96">
            <img src="https://placehold.co/120x120" alt="No content illustration" className="mb-4"/>
            <p className="text-gray-500">Здесь пока ничего нет.</p>
            <button className="bg-black text-white px-6 py-2 rounded-md mt-4">Добавить плейлист</button>
        </div>);
    } else
        return (
            <>
                <div className="flex items-center space-x-4 mb-6 my-3">
                    <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                        <i className="fas fa-filter mr-2"></i> Filter
                    </button>
                </div>
                <table className="table-auto w-full  bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                    <tr className=" text-left">
                        <th className="py-3 px-3"><input type="checkbox" className="w-5 h-5"/></th>
                        <th className="py-3 px-3 ">PlayList</th>
                        <th className="py-3 px-3 ">Visibility</th>
                        <th className="py-3 px-3 ">Date</th>
                        <th className="py-3 px-3 ">Video count</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">

                    {data.map((el, key) => (
                        <tr key={key} className="border-b text-left border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-3"><input type="checkbox" className="w-5 h-5"/></td>
                            <td className="py-3 px-3  flex items-center">
                                <div className="relative w-max">
                                    <img src="https://placehold.co/125x70" alt="Playlist thumbnail"
                                         className="w-full h-auto object-cover rounded-lg"/>
                                    <div
                                        className="absolute top-0 right-0 h-full w-1/2 bg-black bg-opacity-50 flex-col items-center justify-center rounded-r-lg">
                                        <p className="text-white text-lg mt-3 font-normal w-full text-center">10</p>
                                        <CgPlayList className="h-9 w-9 mt-[-0.35rem] ml-4 text-white "/>
                                    </div>
                                </div>
                                <span className="pl-2">{el.title}</span>
                            </td>
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

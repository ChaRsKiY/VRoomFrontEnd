"use client";

import React, {useEffect, useState} from 'react';
import {useUser} from "@clerk/nextjs";
import Image from "next/image";
import {IContentVideo} from "@/types/videoDTO.interface";
import axios from "axios";
import {formatDate} from "@/utils/dateformat";

const ContentShortVideos = () => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [data, setData] = useState<IContentVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && isLoading) {// Если пользователь существует и данные еще не загружены
            fetchChannel1(user.id);
        }
    }, [user, isLoading]);

    const fetchChannel1 = async (userId: string) => {
        try {
            const firstResponse = await axios.get(`https://localhost:7154/api/ChannelSettings/getbyownerid/${userId}`);
            console.log('Первый запрос:', firstResponse.data);

            // Используем данные из первого запроса для второго запроса
            const secondResponse = await axios.get(`https://localhost:7154/api/Video/getshortvideobychannelid/${firstResponse.data.id}`);
            console.log('Второй запрос:', secondResponse.data);

            setData(secondResponse.data); // Сохраняем данные в состоянии
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
        } finally {
            setIsLoading(false); // Устанавливаем флаг, что данные загружены
        }
    };

    if (isLoading)
        return <div>Загрузка...</div>; // Показываем индикатор загрузки

    if (data.length == 0) {
        return (<div className="flex flex-col items-center justify-center h-96">
            <img src="https://placehold.co/120x120" alt="No content illustration" className="mb-4"/>
            <p className="text-gray-500">Здесь пока ничего нет.</p>
            <button className="bg-black text-white px-6 py-2 rounded-md mt-4">Добавить короткое видео</button>
        </div>);
    } else
        return (<>
                <div className="flex items-center space-x-4 mb-6 mt-3">
                    <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                        <i className="fas fa-filter mr-2"></i> Filter
                    </button>
                </div>
                <table className="table-auto w-full  bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200 text-gray-600 text-sm leading-normal">
                    <tr className=" text-left">
                        <th className="py-3 px-3 "><input type="checkbox" className="w-5 h-5"/></th>
                        <th className="py-3 px-3 ">Short video</th>
                        <th className="py-3 px-3 ">Visibility</th>
                        <th className="py-3 px-3 ">Date</th>
                        <th className="py-3 px-3 ">Views</th>
                        <th className="py-3 px-3 ">Comments</th>
                        <th className="py-3 px-3 ">Likes</th>
                        <th className="py-3 px-3 ">Dislikes</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                    {data.map((el, key) => (
                        <tr key={key} className="border-b text-left border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-3 text-left"><input type="checkbox" className="w-5 h-5"/></td>
                            <td className="py-3 px-3  flex items-center">
                                <Image src={el.cover} width={115} height={100} alt="Video Thumbnail" className="mr-4"/>
                                <span>{el.tittle}</span>
                            </td>
                            {el?.visibility === true && (<td className="py-3 px-3 ">Public</td>)}
                            {el?.visibility === false && (<td className="py-3 px-3 ">Private</td>)}
                            <td className="py-3 px-3 ">{formatDate(new Date(el.uploadDate))} <br/>Published</td>
                            <td className="py-3 px-3 ">{el.viewCount}</td>
                            <td className="py-3 px-3 ">{el.commentVideoIds?.length}</td>
                            <td className="py-3 px-3 ">{el.likeCount}</td>
                            <td className="py-3 px-3 ">{el.dislikeCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>
        );
};

export default ContentShortVideos;

// components/ContentTable.js
import React, { useState } from 'react';
import { MdOutlineAnalytics, MdOutlineInsertComment, MdOutlineModeEditOutline } from "react-icons/md";
import { RiYoutubeLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { formatDate } from "@/utils/dateformat";
import { IContentVideo } from "@/types/videoDTO.interface";
import Image from "next/image";

interface ContentTableProps {
    videos: IContentVideo[];
}

const ContentTable: React.FC<ContentTableProps> = ({ videos }) => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const handleClick = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };
    return (
        <table className="table-auto w-full bg-white shadow-md rounded-lg ">
            <thead className="bg-gray-200 text-gray-600  text-sm leading-normal">
                <tr className="text-left">
                    <th className="py-3 px-3 "><input type="checkbox" className="w-5 h-5" /></th>
                    <th className="py-3 px-3 ">Video</th>
                    <th className="py-3 px-3 ">Visibility</th>
                    <th className="py-3 px-3 ">Date</th>
                    <th className="py-3 px-3 ">Views</th>
                    <th className="py-3 px-3 ">Comments</th>
                    <th className="py-3 px-3 ">Likes</th>
                    <th className="py-3 px-3 ">Dislikes</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">

                {videos.length > 0 ? (videos.map(el => (
                    <tr className={"border-b border-gray-200 hover:bg-gray-100 text-left"}>
                        <td className="py-3 px-3"><input type="checkbox" className="w-5 h-5" /></td>
                        <td className="py-3 px-3  flex ">
                            <Image src={el.cover} width={115} height={100} alt="Video Thumbnail"
                                className="mr-1.5 rounded-lg" />

                            <div key={el.id} className="relative w-full">
                                <div className="w-full h-full p-1 flex flex-col">
                                    <span>{el.tittle}</span>
                                    <span>{el.description}</span>
                                </div>

                                {activeId === el.id && (
                                    <div className="absolute top-0 left-0 bg-white w-full h-full p-1">
                                        <span>{el.tittle}</span>
                                        <div className="flex flex-row items-center justify-center mt-2">
                                            <MdOutlineModeEditOutline onClick={() => alert(el.tittle + " / " + el.id)}
                                                title="Edit" className="w-1/4 h-7 cursor-pointer" />
                                            <MdOutlineAnalytics title="Analitics" className="w-1/4 h-7 cursor-pointer" />
                                            <MdOutlineInsertComment title="Comments" className="w-1/4 h-7 cursor-pointer" />
                                            <RiYoutubeLine title="Video" className="w-1/4 h-7 cursor-pointer" />
                                            <BsThreeDotsVertical title="All" className="w-1/4 h-7 cursor-pointer" />
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="flex">
                                <IoMdArrowDropdown className="w-[1.8rem] h-[1.8rem] cursor-pointer" key={el.id}
                                    onClick={() => handleClick(el.id)} />
                            </div>
                        </td>
                        {el?.visibility === true && (<td className="py-3 px-3 ">Public</td>)}
                        {el?.visibility === false && (<td className="py-3 px-3 ">Private</td>)}
                        <td className="py-3 px-3 ">{formatDate(new Date(el.uploadDate))} <br />Published</td>
                        <td className="py-3 px-3 ">{el.viewCount}</td>
                        <td className="py-3 px-3 ">{el.commentVideoIds?.length}</td>
                        <td className="py-3 px-3 ">{el.likeCount}</td>
                        <td className="py-3 px-3 ">{el.dislikeCount}</td>
                    </tr>
                ))) : (
                    <tr>
                        <td colSpan={6} className="text-center py-4">
                            Нет данных для отображения
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ContentTable;

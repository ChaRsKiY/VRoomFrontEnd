"use client"

import {useUser} from "@clerk/nextjs";
import React, {useEffect, useState} from "react";
import api from "@/services/axiosApi";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ITranslationFunction} from "@/types/translation.interface";
import {MoreVertical} from "lucide-react";
import {IoTrashOutline} from "react-icons/io5";
import {RxDragHandleDots2} from "react-icons/rx";
import Link from "next/link";
import {IUser} from "@/types/user.interface";


interface ISectionsSettingsProps {
    t: ITranslationFunction
}


export interface ChSection {
    id: number;
    title: string;
}

export interface ChannelSection {
    id: number;
    channel_SettingsId: number;
    title: string;
    chSectionId: number;
    order: number;
    isVisible: boolean;
}

const MAX_SECTIONS = 8;

const SectionsSettings: React.FC<ISectionsSettingsProps> = ({t}: ISectionsSettingsProps) => {
    const {user} = useUser();
    const [sections, setSections] = useState<ChSection[]>([]);
    const [channelSections, setChannelSections] = useState<ChannelSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [channelInfo, setChannelInfo] = useState<IUser | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);


    const fetchData = async (userId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const [chInfo, sectionsRes, channelSectionsRes] = await Promise.all([
                api.get<IUser>(`/ChannelSettings/getinfochannel/${userId}`),
                api.get<ChSection[]>(`/ChannelSections/getallglobalchannelsection`),
                api.get<ChannelSection[]>(`/ChannelSections/user/${userId}`),

            ]);
            setChannelInfo(chInfo.data);
            setSections(sectionsRes.data);
            setChannelSections(channelSectionsRes.data);


        } catch (err) {
            setError("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData(user.id);
        }
    }, [user]);

    const handleButtonClick = () => {
        if (user) {
            fetchData(user.id);
        }
    };

    const handleAddSection = (sectionId: number) => {
        setChannelSections((prevSections) => {
            return prevSections.map((section) =>
                section.chSectionId === sectionId
                    ? {...section, isVisible: true, order: prevSections.filter((s) => s.isVisible).length}
                    : section
            );
        });
        setShowDialog(false);
    };

    const handleRemoveSection = (id: number) => {
        setChannelSections((prevSections) => {
            return prevSections.map((section) =>
                section.id === id ? {...section, isVisible: false, order: 0} : section
            );
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (user) {
                const formData = new FormData();
                formData.append('clerkId', user.id);
                formData.append('chs', JSON.stringify(channelSections));
                await api.put("/ChannelSections/update", formData, {
                    headers: {"Content-Type": false},
                });
                alert("Sections saved successfully!");
            }
        } catch (err) {
            setError("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
        e.preventDefault();

        if (draggingIndex === null || draggingIndex === targetIndex) return;

        setChannelSections((prevSections) => {
            // Извлекаем видимые секции
            const visibleSections = prevSections.filter((s) => s.isVisible);

            // Элемент, который перетаскиваем
            const draggedItem = visibleSections[draggingIndex];

            // Перемещаем элемент
            visibleSections.splice(draggingIndex, 1);
            visibleSections.splice(targetIndex, 0, draggedItem);

            // Пересчитываем `order` для видимых секций
            visibleSections.forEach((section, index) => {
                section.order = index + 1;
            });

            // Обновляем состояние, объединяя измененные и неизмененные секции
            return prevSections.map((section) => {
                const updatedSection = visibleSections.find((s) => s.id === section.id);
                return updatedSection || section;
            });
        });

        // Обновляем индекс перетаскиваемого элемента
        setDraggingIndex(targetIndex);
    };


    const handleDragEnd = () => {
        setDraggingIndex(null);
    };

    return (
        <>
            <div className=" flex justify-between sticky  border pb-4 pt-4 bg-white">
                <div className="flex mr-14 justify-start">
                    <p className="mr-4 text-gray-800 border-b-2 border-gray-800 pb-2">Profile</p>
                    <Link target={'_self'} href={"/channel/editing/channel_setup/hometab"}
                          className="text-gray-500 hover:text-gray-800 pb-2">Tab "main"</Link>
                </div>
                <div className="flex space-x-4">
                    {channelInfo &&
                        <Link target={'_self'}
                              href={channelInfo.channel_URL}
                              className="text-gray-700 pt-1 hover:text-gray-800 ">Перейти на канал</Link>}
                    <button type="button" onClick={handleButtonClick}
                            className="bg-gray-200 px-4 py-1 rounded">Отмена
                    </button>
                    <button onClick={handleSave} disabled={isLoading}
                            className="px-[0.9375rem] py-[7px] justify-center items-center gap-[0.595rem] rounded-[0.3125rem] bg-blue-500 hover:bg-blue-800 text-[#FFF] font-Inter text-[0.9rem] font-not-italic font-500 leading-normal"
                    >Save changes
                    </button>
                </div>
            </div>
            <div className="flex flex-row w-full">
                <div className={'flex-col'}>
                    <h2 className="text-[#000] font-Inter text-[1.3rem] font-bold font-not-italic font-500 leading-normal">Layout</h2>
                    <p className="text-[#000] font-Inter text-[0.885rem] font-not-italic font-400 leading-normal">
                        Customize the layout of your channel homepage with up to 8 sections
                    </p>
                </div>
                <div className={'flex w-[21%]'}></div>
                <div className={'flex flex-row items-end gap-2'}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="inline-flex px-[0.9375rem] justify-center items-center gap-[0.595rem] rounded-[0.3125rem] bg-[#0EA2DE] hover:bg-[#0a7cab] text-[#FFF] font-Inter text-[0.9rem] font-not-italic font-500 leading-normal"
                                disabled={channelSections.filter((cs) => cs.isVisible).length >= MAX_SECTIONS}
                            >
                                Add Section
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" style={{maxHeight: '16rem'}}
                                             className={'shadow-md shadow-black overflow-y-scroll min-h-[12rem] border-t-[1px] border-t-slate-500'}>
                            {sections.map((section) => {
                                const isAdded = channelSections.some((cs) => cs.chSectionId === section.id && cs.isVisible);
                                return (
                                    <DropdownMenuItem
                                        className={'disabled:text-gray-500 font-semibold enabled:text-black'}
                                        key={section.id} disabled={isAdded}
                                        onClick={() => !isAdded && handleAddSection(section.id)}>
                                        {t(section.title)}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="pt-6 pb-6 pr-6 bg-gray-100 min-h-screen">
                <div className="mb-6">
                    <ul className="space-y-2 w-10/12">
                        {channelSections.filter((cs) => cs.isVisible)
                            .sort((a, b) => a.order - b.order)
                            .map((section, index) => (
                                <li
                                    key={section.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex flex-row h-[5.6875rem] w-full items-center gap-5 p-4 border-b ${draggingIndex === index ? "border-blue-500" : "border-gray-300"} bg-white shadow`}
                                >
                                    <RxDragHandleDots2 size={30}/>
                                    <div>
                                        <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{section.title}</h2>
                                        <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                            VRoom recommends fresh content based on your viewers' interests. This is
                                            only visible to your viewers when you have enough content. More Settings
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="mm" className="ml-auto">
                                                    <MoreVertical className="h-6 w-6"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleRemoveSection(section.id)}>
                                                    <IoTrashOutline className="mr-2 h-4 w-4"/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SectionsSettings;
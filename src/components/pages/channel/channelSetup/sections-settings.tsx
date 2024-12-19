"use client"

import {useUser} from "@clerk/nextjs";
import React, {useEffect, useRef, useState} from "react";
import api from "@/services/axiosApi";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ITranslationFunction} from "@/types/translation.interface";
import {MoreVertical} from "lucide-react";
import {IoTrashOutline} from "react-icons/io5";
import {RxDragHandleDots2} from "react-icons/rx";
import Link from "next/link";
import {IUser} from "@/types/user.interface";
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';


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
    const channelSectionsRef = useRef<ChannelSection[]>([]); // Хранит актуальное состояние
    const [chsetid, setChsetid] = useState<number>(0);

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
            setChannelSections(channelSectionsRes.data.filter((cs) => cs.isVisible).sort((a, b) => a.order - b.order));
            setChsetid(channelSections[0].channel_SettingsId);
            channelSectionsRef.current = channelSectionsRes.data; // Сохраняем начальное состояние в ref

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
            // setChannelSections(channelSectionsRef.current);
            fetchData(user.id);
        }
    };

    const handleAddSection = (sectionId: number) => {
        setChannelSections((prevSections) => {
            // Проверяем, существует ли уже секция с таким id и она видимая
            const sectionExists = prevSections.some((section) => section.chSectionId === sectionId && section.isVisible);

            if (sectionExists) {
                return prevSections; // Если секция уже добавлена, ничего не меняем
            }

            // Находим новый раздел
            const newSection = {
                id: 0, // Генерация уникального ID для новой секции, можно заменить на подходящий ID
                channel_SettingsId: chsetid, // ID пользователя (если это необходимо)
                title: sections.find(section => section.id === sectionId)?.title || 'New Section', // Заголовок секции
                chSectionId: sectionId,
                order: prevSections.filter((s) => s.isVisible).length + 1,
                isVisible: true,
            };

            // Добавляем новый раздел в начало массива
            const updatedSections = [...prevSections, newSection];

            return updatedSections;
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

    const handleDragEnd = (result: any) => {
        const {source, destination} = result;

        if (!destination) return; // Если элемент не перемещен
        if (destination.index === source.index) return; // Если элемент остался на месте

        const reorderedSections = [...channelSections];
        const [movedItem] = reorderedSections.splice(source.index, 1);
        reorderedSections.splice(destination.index, 0, movedItem);

        // Обновляем порядок в массиве
        const updatedSections = reorderedSections.filter((cs) => cs.isVisible).map((section, index) => ({
            ...section,
            order: index + 1,
        }));

        setChannelSections(updatedSections); // Обновляем состояние
    };

    return (
        <>
            <div className=" flex justify-between sticky  border pb-4 pt-4 bg-white">
                <div className="flex mr-14 justify-start">
                    <Link target={'_self'} href={"/channel/editing/channel_setup/profile"}
                          className="text-gray-500 hover:text-gray-800 pb-2">Profile</Link>
                    <p className="ml-4 text-gray-800 border-b-2 border-gray-800 pb-2">Tab "main"</p>
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
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 w-10/12">

                                    {channelSections.filter((cs) => cs.isVisible)
                                        .map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id.toString()}
                                                       index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`flex flex-row h-[5.6875rem] w-full items-center gap-5 p-4 border-b ${draggingIndex === index ? "border-blue-500" : "border-gray-300"} bg-white shadow`}
                                                    >
                                                        <RxDragHandleDots2 size={30}/>
                                                        <div>
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{section.title}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                VRoom recommends fresh content based on your viewers'
                                                                interests.
                                                                This is
                                                                only visible to your viewers when you have enough
                                                                content. More
                                                                Settings
                                                            </p>
                                                        </div>
                                                        <div className="space-x-2">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="mm"
                                                                            className="ml-auto">
                                                                        <MoreVertical className="h-6 w-6"/>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleRemoveSection(section.id)}>
                                                                        <IoTrashOutline
                                                                            className="mr-2 h-4 w-4"/> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}{provided.placeholder}
                                </ul>)}

                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </>
    );
};

export default SectionsSettings;

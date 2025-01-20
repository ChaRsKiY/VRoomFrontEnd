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
import {ChannelSection, ChSection} from "@/types/channelsections.interfaces";
import VideosSection from "@/components/pages/channel/channelSetup/channelSections/videos-section";
import {
    fetchPinnedVideoByChannelId,
    fetchPinnedVideoOrNullByChannelId
} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import PinnedVideoSection from "@/components/pages/channel/channelSetup/channelSections/pinnedvideo-selection";
import {IVideo} from "@/types/videoinfo.interface";
import SubscriptionsSection from "@/components/pages/channel/channelSetup/channelSections/subscriptions-section";
import {IPinnedVideo} from "@/types/pinned-video.interface";
import {HistoryOfBrowsing} from "@/types/history-of-browsing";
import {Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport} from "@/components/ui/toast";


interface ISectionsSettingsProps {
    t: ITranslationFunction
}

const MAX_SECTIONS = 10;

const SectionsSettings: React.FC<ISectionsSettingsProps> = ({t}: ISectionsSettingsProps) => {
    const {user} = useUser();
    const [sections, setSections] = useState<ChSection[]>([]);
    const [channelSections, setChannelSections] = useState<ChannelSection[]>([]);
    const channelSectionsRef = useRef<ChannelSection[]>([]); // Хранит актуальное состояние
    const [channelInfo, setChannelInfo] = useState<IUser | null>(null);
    const [chsetid, setChsetid] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
    const [pinnedVideo, setPinnedVideo] = useState<IPinnedVideo | null>(null);
    const selectedVideoRef = useRef<IVideo | null>(null); // Хранит актуальное состояние
    const [openToast, setOpenToast] = useState(false);

    const fetchData = async (userId: string) => {
        setIsLoading(true);
        try {
            const [chInfo, sectionsRes, channelSectionsRes] = await Promise.all([
                api.get<IUser>(`/ChannelSettings/getinfochannel/${userId}`),
                api.get<ChSection[]>(`/ChannelSections/getallglobalchannelsection`),
                api.get<ChannelSection[]>(`/ChannelSections/user/${userId}`),]);
            setChannelInfo(chInfo.data);
            setChsetid(chInfo.data.channel_Id);
            setSections(sectionsRes.data);
            setChannelSections(channelSectionsRes.data.filter((cs) => cs.isVisible).sort((a, b) => a.order - b.order));
            channelSectionsRef.current = channelSectionsRes.data.filter((cs) => cs.isVisible).sort((a, b) => a.order - b.order); // Сохраняем начальное состояние в ref
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const haveSectionsChanged = (initial: ChannelSection[], current: ChannelSection[]) => {
        if (initial.length !== current.length) return true;

        return initial.some(
            (video, index) =>
                video.id !== current[index].id || video.order !== current[index].order || video.isVisible !== current[index].isVisible
        );
    };

    const hasSectionsChanged = haveSectionsChanged(channelSectionsRef.current, channelSections);
    const hasVideoChanged = selectedVideo !== selectedVideoRef.current;
    const hasChanged = hasVideoChanged || hasSectionsChanged;

    const handleResetChanges = () => {
        if (user) {
            setChannelSections([...channelSectionsRef.current]);
            setSelectedVideo(selectedVideoRef.current);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData(user.id);
        }
    }, [user]);

    useEffect(() => {
        const fetchPinned = async () => {
            const pinnedVideoInfo = await fetchPinnedVideoOrNullByChannelId(chsetid);

            setSelectedVideo(pinnedVideoInfo);
            selectedVideoRef.current = pinnedVideoInfo;
        };
        const isAdded = channelSections.some((cs) => cs.title === "PinnedVideoSection" && cs.isVisible);
        if (isAdded && chsetid > 0) {
            fetchPinned();
        }
    }, [chsetid]);


    const handleAddSection = (sectionId: number) => {
        setChannelSections((prevSections) => {// Проверяем, существует ли уже секция с таким id и она видимая
            const sectionExists = prevSections.some((section) => section.sectionId === sectionId && section.isVisible);
            if (sectionExists) {
                return prevSections;// Если секция уже добавлена, ничего не меняем
            }

            const newSection = { // Находим новый раздел
                id: 0, // Генерация уникального ID для новой секции, можно заменить на подходящий ID
                channel_SettingsId: chsetid, // ID пользователя (если это необходимо)
                title: sections.find(section => section.id === sectionId)?.title || 'New Section', // Заголовок секции
                sectionId: sectionId,
                order: prevSections.filter((s) => s.isVisible).length + 1,
                isVisible: true,
            };

            const updatedSections = [...prevSections, newSection];// Добавляем новый раздел в начало массива
            return updatedSections;
        });
        setShowDialog(false);
        // Открываем диалог, если секция имеет нужный title
        const addedSection = sections.find((section) => section.id === sectionId);
        if (addedSection?.title === "PinnedVideoSection") {
            setIsDialogOpen(true);
        }
    };

    const handleRemoveSection = (id: number) => {
        setChannelSections((prevSections) => {
            const updatedSections = prevSections
                .map((section) =>
                    section.id === id && section.title !== "home" ? {...section, isVisible: false, order: 0} : section
                )
                .filter((section) => section.isVisible)
                .map((section, index) => ({...section, order: index + 1}));
            return updatedSections;
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (user) {
                const formData = new FormData();
                formData.append('clerkId', user.id);
                formData.append('chs', JSON.stringify(channelSections));
                await api.put("/ChannelSections/update", formData, {
                    headers: {"Content-Type": false},
                });

                //проверка если закрепленное видео есть
                const response = await fetchPinnedVideoByChannelId(chsetid);

                if (selectedVideo) {
                    const request: IPinnedVideo = {
                        id: 0,
                        videoId: selectedVideo.id,
                        channelSettingsId: chsetid,
                    };


                    if (response != null) {
                        request.id = response.id;
                        await api.put("/PinnedVideo/update", request, {
                            headers: {"Content-Type": 'application/json'},
                        });
                        console.log('update');
                    } else {
                        await api.post("/PinnedVideo/add", request, {
                            headers: {"Content-Type": 'application/json'},
                        });
                        console.log('add');
                    }
                } else {
                    if (response)
                        await api.delete('/PinnedVideo/' + response.id);
                }
                setOpenToast(true);
                setTimeout(() => setOpenToast(false), 4000); // Закрыть автоматически через 3 секунды
                // alert("Sections saved successfully!");
                channelSectionsRef.current = channelSections.filter((cs) => cs.isVisible).sort((a, b) => a.order - b.order);
                selectedVideoRef.current = selectedVideo;
            }
        } catch (err) {
            console.error("Failed to save changes");
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

        const updatedSections = reorderedSections.filter((cs) => cs.isVisible).map((section, index) => ({
            ...section,// Обновляем порядок в массиве
            order: index + 1,
        }));
        setChannelSections(updatedSections); // Обновляем состояние
    };

    const handleVideoSelect = (video: IVideo | null) => {
        setSelectedVideo(video);
        alert(video?.id);
        setIsDialogOpen(false);
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };
    return (
        <>
            <div className=" flex justify-between sticky  border pb-4 pt-4 bg-white">
                <div className="flex mr-14 justify-start">
                    <Link target={'_self'} href={"/channel/editing/channel_setup/profile"}
                          className="text-gray-500 hover:text-gray-800 pb-2">Profile</Link>
                    <p className="ml-4 text-gray-800 border-b-2 border-gray-800 pb-2">Tab "main"</p>
                </div>
                <div className="flex space-x-2">
                    {channelInfo &&
                        <Link target={'_self'}
                              href={channelInfo.channel_URL}
                              className="text-gray-700 pt-1 font-semibold hover:text-gray-800 ">Перейти на канал</Link>}
                    <button type="button" disabled={!hasChanged} onClick={handleResetChanges}
                            className="bg-gray-200 px-4 py-1 font-semibold rounded disabled:text-gray-500">Отмена
                    </button>
                    <button onClick={handleSave} disabled={isLoading || !hasChanged}
                            className="bg-gray-200 px-4 py-1 font-semibold rounded disabled:text-gray-500"
                    >Опубликовать
                    </button>
                </div>
            </div>
            <div className="flex flex-row w-full">
                <div className={'flex-col'}>
                    <h2 className="text-[#000] font-Inter text-[1.3rem] font-bold font-not-italic font-500 leading-normal">Layout</h2>
                    <p className="text-[#000] font-Inter text-[0.885rem] font-not-italic font-400 leading-normal">
                        Customize the layout of your channel homepage with up to {MAX_SECTIONS} sections
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
                                const isAdded = channelSections.some((cs) => cs.sectionId === section.id && cs.isVisible);
                                return (
                                    <DropdownMenuItem
                                        className={'disabled:text-gray-500 font-semibold enabled:text-black'}
                                        key={section.id} disabled={isAdded}
                                        onClick={() => !isAdded && handleAddSection(section.id)}>
                                        {t(`сhannel:${section.title}`)}
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

                                    {channelSections.map((section, index) => (
                                        <Draggable key={section.id} draggableId={section.id.toString()}
                                                   index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`flex flex-row h-[5.7575rem] w-full justify-center items-center gap-5 p-6 pb-9 border-b ${draggingIndex === index ? "border-blue-500" : "border-gray-300"} bg-white shadow`}
                                                >
                                                    <div className="flex-shrink-0 p-2">
                                                        <RxDragHandleDots2 size={30}/>
                                                    </div>
                                                    {section.title === "Video" && (<div className="flex-1 px-4 pt-2.5">
                                                        <VideosSection sectionName={t(`channel:${section.title}`)}
                                                                       channelId={chsetid} isShort={false}/>
                                                    </div>)}
                                                    {section.title === "shorts" && (<div className="flex-1 px-4 pt-2.5">
                                                        <VideosSection sectionName={t(`channel:${section.title}`)}
                                                                       channelId={chsetid} isShort={true}/>
                                                    </div>)}
                                                    {section.title === "subscriptionsSection" && (
                                                        <div className="flex-1 px-4 pt-2.5">
                                                            <SubscriptionsSection
                                                                sectionName={t(`channel:${section.title}`)}
                                                                channelId={chsetid}/>
                                                        </div>)}
                                                    {section.title === "PinnedVideoSection" && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`channel:${section.title}`)}</h2>
                                                            <PinnedVideoSection channelId={chsetid}
                                                                                onClose={closeDialog}
                                                                                onOpen={openDialog}
                                                                                isDialogOpen={isDialogOpen}
                                                                                selectedVideo={selectedVideo}
                                                                                onVideoSelect={handleVideoSelect}/>
                                                        </div>
                                                    )}

                                                    {(section.title === "ForYou") && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                VRoom recommends fresh content based on your
                                                                viewers' interests. This is only visible to your
                                                                viewers when you have enough content. More Settings
                                                            </p>
                                                        </div>)}

                                                    {(section.title === "home") && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображается закрепленное видео, контент
                                                                для вас и тд.
                                                            </p>
                                                        </div>)}

                                                    {(section.title === "HighRaitingVideos") && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображаются самые популярные видео
                                                                канала
                                                            </p>
                                                        </div>)}
                                                    {section.title === "playlists" && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображаются плейлисты канала </p>
                                                        </div>)}
                                                    {section.title === "posts" && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображаются посты канала. Может быть
                                                                пустым если нет постов </p>
                                                        </div>)}
                                                    {section.title === "about" && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображается информация канала такая как:
                                                                дата создания, описание канала и тд. </p>
                                                        </div>)}
                                                    {section.title === "Broadcasts" && (
                                                        <div className="flex-1 px-4">
                                                            <h2 className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{t(`сhannel:${section.title}`)}</h2>
                                                            <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                                                                В этом разделе отображаются стримы канала. Может быть
                                                                пустым если нет стримов </p>
                                                        </div>)}
                                                    <div className="flex-shrink-0.5 p-2 space-x-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="mm"
                                                                        className="ml-auto">
                                                                    <MoreVertical className="h-6 w-6"/>
                                                                </Button>
                                                            </DropdownMenuTrigger>


                                                            {section.title !== "PinnedVideoSection" ? (
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleRemoveSection(section.id)}>
                                                                            <IoTrashOutline
                                                                                className="mr-2 h-4 w-4"/> Delete
                                                                        </DropdownMenuItem></DropdownMenuContent>
                                                                ) :
                                                                (<DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() => openDialog()}>
                                                                        <IoTrashOutline
                                                                            className="mr-2 h-4 w-4"/> Edit video
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            handleRemoveSection(section.id);
                                                                            handleVideoSelect(null);
                                                                        }}>
                                                                        <IoTrashOutline
                                                                            className="mr-2 h-4 w-4"/> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>)}

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
            <ToastProvider>
                <ToastViewport/>
                <Toast open={openToast} onOpenChange={setOpenToast} className={'bg-gray-500 text-white'}>
                    <div>
                        <ToastTitle>Успех!</ToastTitle>
                        <ToastDescription>Разделы успешно сохранены!</ToastDescription>
                    </div>
                    <ToastClose/>
                </Toast>
            </ToastProvider>
        </>
    );
};

export default SectionsSettings;

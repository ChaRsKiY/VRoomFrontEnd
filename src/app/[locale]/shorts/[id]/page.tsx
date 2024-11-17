'use client';
import React, {useEffect, useReducer, useRef} from 'react';

import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import {fetchPaginatedShorts} from "@/components/pages/shorts/fetch-paginated-shorts";
import {IVideo} from "@/types/videoinfo.interface";
import ShortCard from "@/components/pages/shorts/shorts-card";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";

interface State {
    videos: IVideo[];
    currentIndex: number;
    page: number;
    isLoading: boolean;
}

type Action =
    | { type: 'ADD_VIDEOS'; videos: IVideo[] }
    | { type: 'SET_CURRENT_INDEX'; index: number }
    | { type: 'SET_LOADING'; isLoading: boolean }
    | { type: 'SET_PAGE'; page: number };

const initialState: State = {
    videos: [],
    currentIndex: 0,
    page: 1,
    isLoading: false,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_VIDEOS':
            const uniqueVideos = action.videos.filter(
                (newVideo) => !state.videos.some((existingVideo) => existingVideo.id === newVideo.id)
            );
            const updatedVideos = [...state.videos, ...uniqueVideos];
            //console.log('Reducer - Updated videos:', updatedVideos);  Лог после обновления
            return {...state, videos: updatedVideos, isLoading: false};
        case 'SET_CURRENT_INDEX':
            return {...state, currentIndex: action.index};
        case 'SET_LOADING':
            return {...state, isLoading: action.isLoading};
        case 'SET_PAGE':
            return {...state, page: action.page};
        default:
            return state;
    }
};

const ShortsPage = ({params}: { params: { id?: string } }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {videos, currentIndex, page, isLoading} = state;
    const observerRef = useRef<IntersectionObserver | null>(null);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const videosRef = useRef<IVideo[]>(videos);


    const addIdToUrl = (id: string) => {// метод обновление URL при смене текущего видео
        const basePath = '/ru/shorts'; // Базовый путь, который остаётся неизменным
        const newPath = `${basePath}/${id}`; // Формируем новый путь
        window.history.pushState({}, '', newPath); // Обновляем URL в браузере
        document.body.focus();//убираем выделение URL в браузере
    };
    useEffect(() => {// Обновление URL при смене текущего видео
        if (videos[currentIndex]) {
            const currentVideoId = videos[currentIndex].id;
            addIdToUrl(currentVideoId.toString());
        }
    }, [currentIndex, videos, params.id]);


    useEffect(() => {// Устанавливаем текущий индекс на основе id из URL
        if (params.id) {
            const videoId = Number(params.id);
            const foundIndex = videos.findIndex((video) => video.id === videoId);

            if (videoId && foundIndex !== -1) {
                dispatch({type: 'SET_CURRENT_INDEX', index: foundIndex});
            }
        }
    }, [params.id, videos]);


    useEffect(() => {// Логика синхронизации URL
        if (params.id) {
            const videoId = Number(params.id);
            const foundIndex = videos.findIndex((video) => video.id === videoId);

            if (foundIndex !== -1) {
                dispatch({type: 'SET_CURRENT_INDEX', index: foundIndex});// Устанавливаем текущий индекс, если нашли ID
            }/* else if (!isLoading) {
                // Загружаем больше данных, если ID отсутствует
                dispatch({type: 'SET_PAGE', page: page + 1});
            }, isLoading, page*/
        }
    }, [params.id, videos]);


    const loadVideos = async (id: number) => {// Загрузка видео
        if (isLoading) return;

        dispatch({type: 'SET_LOADING', isLoading: true});
        try {//количество видео нужно увеличить когда будет много видео
            const newVideos = await fetchPaginatedShorts(page, 3, id);
            const uniqueVideos = newVideos.filter(// Проверяем на дубли и только потом добавляем
                (video: IVideo) => !videos.some((v) => v.id === video.id)
            );

            if (uniqueVideos.length > 0) {
                dispatch({type: 'ADD_VIDEOS', videos: uniqueVideos});
            }
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
        } finally {
            dispatch({type: 'SET_LOADING', isLoading: false});
        }
    };

    useEffect(() => {
        if (params.id) {
            loadVideos(Number(params.id));
        }
    }, [page]);


    const handleNextVideo = () => {
        if (currentIndex < videos.length - 1) {
            dispatch({type: 'SET_CURRENT_INDEX', index: currentIndex + 1});
            if (!isLoading && currentIndex == videos.length - 1) {
                setTimeout(() => {
                    dispatch({type: 'SET_PAGE', page: page + 1});// Загружаем следующую страницу, если достигли конца
                }, 500);// dispatch({type: 'SET_CURRENT_INDEX', index: currentIndex + 1});
            }
        }// else
    };

    const handlePrevVideo = () => {
        if (currentIndex > 0) {
            dispatch({type: 'SET_CURRENT_INDEX', index: currentIndex - 1});
        }
    };
    useEffect(() => {
        if (videoRefs.current[currentIndex]) {
            videoRefs.current[currentIndex]?.scrollIntoView({
                behavior: 'smooth', // Плавная прокрутка
                block: 'center',    // Размещает элемент в центре экрана
            });
        }
    }, [currentIndex]);

    useEffect(() => {// IntersectionObserver для перехода к видео при прокрутке
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const index = videoRefs.current.findIndex((ref) => ref === entry.target);
                        // console.log('Observer triggered: Index:', index, 'Videos length:', videosRef.current.length);

                        if (entry.isIntersecting && index !== -1) {
                            dispatch({type: 'SET_CURRENT_INDEX', index});

                            if (index === videosRef.current.length - 1 && !isLoading) {
                                // console.log('Loading next page...');
                                dispatch({type: 'SET_PAGE', page: page + 1});
                            }
                        }
                    });
                },
                {threshold: 0.7}
            );
        }

        videoRefs.current.forEach((ref) => {
            if (ref) observerRef.current?.observe(ref);
        });

        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref) observerRef.current?.unobserve(ref);
            });
        };
    }, [isLoading, page]);


    useEffect(() => {
        videosRef.current = videos; // Обновляем реф при изменении videos
    }, [videos]);


    const {t}: { t: ITranslationFunction } = useTranslation();
    return (
        <>
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div
                className="video-feed flex pl-[20%] max-lg:pl-[12%] items-center text-sm lg:flex w-full pt-[4.03rem]">
                <div
                    className={'video-feed h-[89.6vh] w-full overflow-y-scroll snap-y snap-mandatory relative pt-19'}>
                    {videos.map((video, index) => (
                        <div key={video.id} data-index={index} className="video-section h-[89vh] snap-start"
                             ref={(el) => {
                                 videoRefs.current[index] = el;
                             }}>
                            <ShortCard video={video} isActive={index === currentIndex}/>
                        </div>
                    ))}

                    <div className="fixed flex flex-col gap-2 top-1/2 right-1 transform -translate-y-1/2 z-10">
                        {currentIndex != 0 ? <button onClick={handlePrevVideo} disabled={currentIndex == 0}
                                                     className="bg-[#aeaeae] text-white p-2 rounded disabled:hidden enabled:hover:bg-[#7f7f7f]">
                            <FaArrowUp size={22}/>
                        </button> : <div className={'pt-[19px] pb-[19px]'}></div>}
                        <button onClick={handleNextVideo}
                                className="bg-[#aeaeae] text-white p-2 rounded enabled:hover:bg-[#7f7f7f]">
                            <FaArrowDown size={22}/>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ShortsPage;

"use client"

import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent, KeyboardEvent } from "react";
import "@/styles/videojsplayer.css";
import { PiPictureInPicture, PiScreencast } from "react-icons/pi";
import { TbLayersSubtract } from "react-icons/tb";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import Hls from 'hls.js';
import api from '@/services/axiosApi';
import { HistoryOfBrowsing } from "@/types/history-of-browsing";
import { useUser } from '@clerk/nextjs';
import { usePathname } from "next/navigation";
import { ISubtitle } from "@/types/subtitle.interface";
import { useRouter } from "next/navigation";
import { BiMove, BiSupport } from "react-icons/bi";
import { Switch } from "@/components/ui/switchsubtitle";


class WatchHistory {
    constructor(public videoId: number, public lastViewedPosition: number) {
    }
}

interface IVideoPlayerProps {
    src: string;
    id: number;
}


const VideoPlayer: React.FC<IVideoPlayerProps> = ({ src, id }) => {
    const { isSignedIn, user } = useUser();
    // Refs
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const timelineContainerRef = useRef<HTMLDivElement | null>(null);
    const volumeSliderRef = useRef<HTMLInputElement | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const [isHistoryUpdateInProgress, setIsHistoryUpdateInProgress] = useState(false);
    const hasAddedToHistory = useRef(false); // Флаг с useRef

    // State
    // const { user } = useUser();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
    const [wasPaused, setWasPaused] = useState<boolean>(false);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false);
    const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
    const [viewed, setViewed] = useState(false);
    const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [realWatchTime, setRealWatchTime] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const pathname = usePathname();
    const [previousPath, setPreviousPath] = useState("");
    const [filesSubtitles, setFilesSubtitles] = useState<File[]>([]);
    const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);
    const [encodedUrl, setEncodedUrl] = useState("");
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState(0);
    const [display, setDisplay] = useState("none");
    const [checked, setChecked] = useState(false);
    const [fileSub, setFileSub] = useState<File>();

    const addVideoToViewHistory = async () => {
        try {
            if (!isSignedIn || isHistoryUpdateInProgress) return; // Проверяем авторизацию и статус запроса

            // Проверяем, есть ли видео уже в истории
            const existingHistory = watchHistory.find(history => history.videoId === id);
            if (existingHistory) return;

            setIsHistoryUpdateInProgress(true); // Устанавливаем флаг перед началом запроса

            const request: HistoryOfBrowsing = {
                id: 0, // ID задаётся сервером
                userId: user.id,
                videoId: id,
                date: new Date(),
                timeCode: Math.floor(currentTime),
                channelSettingsId: 0, // задаётся сервером
            };

            const response = await api.post(`/HistoryOfBrowsing/add`, request, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setWatchHistory(prev => [...prev, new WatchHistory(id, Math.floor(currentTime))]);
                console.log(`Видео ${id} успешно добавлено в историю просмотра.`);
            } else {
                console.error(`Ошибка при добавлении видео ${id} в историю просмотра.`);
            }
        } catch (error) {
            console.error("Ошибка при добавлении видео в историю:", error);
        } finally {
            setIsHistoryUpdateInProgress(false); // Сбрасываем флаг после завершения запроса
        }
    };

    const fetchSubtitleFiles = async (subtitles: ISubtitle[]): Promise<File[]> => {
        console.log("Загрузка файлов:");
        const filePromises = subtitles.map(async (subtitle) => {
            if (subtitle.puthToFile != undefined) {
                setEncodedUrl(encodeURIComponent(subtitle.puthToFile));
            }
            else setEncodedUrl("");
            const response = await api.get('/Subtitle/getsubtitlefile/' + encodedUrl, {
                responseType: "blob",
            });

            if (response.status !== 200) {
                throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
            }
            console.log("Ответ на загрузку файла:", response);
            const blob = response.data;
            console.log("blob", blob);
            return new File([blob], `${subtitle.videoId}_${subtitle.languageCode}_subtitle.vtt`, { type: blob.type });

        });

        return await Promise.all(filePromises);

    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/Video/${id}`);
                if (response.status != 200) {
                    throw new Error("Failed to fetch video data");
                }
                const videoData = await response.data;
                console.log("vide0000**", videoData);
                videoData.subtitles = await api.get<ISubtitle[]>(`/Subtitle/getpublishsubtitles/${id}`);
                setSubtitles(videoData.subtitles.data);
                console.log("*/*/!!", videoData.subtitles.data);
                if (videoData && videoData.VideoStream) {
                    const videoUrl = videoData.VideoStream.endsWith('720.m3u8')
                        ? videoData.VideoStream
                        : `${videoData.VideoStream}/720.m3u8`;
                    setVideoSrc(videoUrl);
                } else {
                    setVideoError("Video stream not available");
                }
            } catch (error) {
                setVideoError("Error fetching video");
            }
        };

        fetchVideo();
    }, [id]);
    

    useEffect(() => {
        const loadSubtitleFiles = async () => {
            try {
                if (subtitles.length > 0) {
                    const files = await fetchSubtitleFiles(subtitles);
                    setFilesSubtitles(files);
                    console.log("*/*/!!files", files);
                }
            } catch (error) {
                console.error("Ошибка загрузки файлов субтитров:", error);
            }
        };

        loadSubtitleFiles();
    }, [subtitles]);

    useEffect(() => {
        
        console.log("*/*/!!filesAfterSet", filesSubtitles);
              
    }, [filesSubtitles]);

    useEffect(() => {
        const video = videoRef.current;

        if (video && videoSrc && videoSrc.endsWith('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (video) {
                        setDuration(video.duration);
                    }
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS error:", data);
                    setVideoError("Error playing video");
                });
                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
                video.addEventListener('loadedmetadata', () => {
                    setDuration(video.duration);
                });
            }
        } else if (video && videoSrc) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', () => {
                setDuration(video.duration);
            });
        }
    }, [videoSrc]);


    useEffect(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    // const handleTimeUpdate = () => {
    //     if (videoRef.current) {
    //         setCurrentTime(videoRef.current.currentTime);

    //     }
    // };
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            const percentagePlayed = ((videoRef.current.currentTime / videoRef.current.duration) * 100);

            if (percentagePlayed >= 5 && isSignedIn && !hasAddedToHistory.current) {
                hasAddedToHistory.current = true; // Устанавливаем флаг (useRef)
                console.log(`Видео добавляется в историю: ${id}`);
                addVideoToViewHistory(); // Добавляем в историю просмотра
            }

            const delta = currentTime - lastUpdateTime;
            if (isPlaying && delta > 0 && delta < 5) { // Исключаем большие скачки ( перемотку)
                setRealWatchTime((prevTime) => prevTime + delta);
            }

            if (realWatchTime / duration > 0.6 && !viewed) {
                setViewed(true);
                increaseViewCount();
            }
            setLastUpdateTime(videoRef.current.currentTime);
        }
    };

    useEffect(() => {

        if (duration > 0 && currentTime / duration > 0.75 && !viewed) {

            setViewed(true);
            increaseViewCount();
        }

    }, [currentTime]);


    const handlePauseOrSeek = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const delta = currentTime - lastUpdateTime;

            if (delta > 0 && delta < 5) {
                setRealWatchTime((prevTime) => prevTime + delta);
            }

            setLastUpdateTime(currentTime);
        }
    };

    const saveWatchHistory = () => {
        if (videoRef.current) {
            const lastViewedPosition = videoRef.current.currentTime;

            // Добавляем или обновляем историю просмотра
            setWatchHistory(prevHistory => {
                const existingVideo = prevHistory.find(history => history.videoId === id);

                if (existingVideo) {
                    // Обновляем время последнего просмотра
                    return prevHistory.map(history =>
                        history.videoId === id
                            ? { ...history, lastViewedPosition }
                            : history
                    );
                } else {
                    // Добавляем новое видео в историю
                    return [...prevHistory, new WatchHistory(id, lastViewedPosition)];
                }
            });

            console.log(`Видео ${id} остановлено на ${lastViewedPosition} секундах`);
        }
    };

    const handleVideoPauseOrEnd = () => {
        saveWatchHistory();
    };

    const SaveViewDuration = async () => {
        if (videoRef.current && videoRef.current.currentTime > 1) {
            const formData = new FormData();
            const language = navigator.language;
            language.split('-')[0];

            if (user)
                formData.append('clerkId', user.id);
            else
                formData.append('clerkId', "***");
            formData.append('videoId', id + '');
            formData.append('location', language);
            formData.append('duration', videoRef.current.currentTime + "");
            formData.append('date', new Date().toISOString());

            console.log("saveDurationVew", formData);

            await api.post("/Video/viewingduration", formData);
        }
    }


    // Обработка закрытия вкладки или перезагрузки страницы
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            SaveViewDuration();
            addVideoToViewHistory();
        };

        if (videoRef.current) {
            const video = videoRef.current;

            // Подписка на события видео
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('pause', handleVideoPauseOrEnd);
            video.addEventListener('ended', handleVideoPauseOrEnd);
            video.addEventListener("pause", handlePauseOrSeek);
            video.addEventListener("seeked", handlePauseOrSeek);
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Очистка событий при размонтировании
        return () => {
            if (videoRef.current) {
                const video = videoRef.current;
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('pause', handleVideoPauseOrEnd);
                video.removeEventListener('ended', handleVideoPauseOrEnd);
                video.removeEventListener("pause", handlePauseOrSeek);
                video.removeEventListener("seeked", handlePauseOrSeek);
            }

            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    const increaseViewCount = () => {

        Viewed(id);
    };

    const Viewed = async (id: number) => {
        try {
            const response = await api.put('/Video/view/' + id);

            if (response.status === 200) {
                console.log('просмотр добавлен к счетчику');
            } else {
                console.error('Ошибка при view:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    // Effects
    useEffect(() => {
        const video = videoRef.current;

        if (video) {

            const handleLoadedMetadata = () => {
                setDuration(video.duration);
            };
            const handleVolumeChange = () => {
                setVolume(video.volume);
                setIsMuted(video.muted);
            };

            video.addEventListener("loadedmetadata", handleLoadedMetadata);
            handleLoadedMetadata();
            video.addEventListener("volumechange", handleVolumeChange);

            return () => {
                if (video) {
                    video.removeEventListener("loadedmetadata", handleLoadedMetadata);
                    video.removeEventListener("volumechange", handleVolumeChange);
                }
            };
        }
    }, []);


    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;

        const handleEnterPictureInPicture = () => setIsMiniPlayer(true);
        const handleLeavePictureInPicture = () => setIsMiniPlayer(false);

        if (video) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            video.addEventListener("enterpictureinpicture", handleEnterPictureInPicture);
            video.addEventListener("leavepictureinpicture", handleLeavePictureInPicture);
        }

        document.addEventListener("keydown", handleKeyDown as EventListener);

        return () => {
            if (video) {
                video.removeEventListener("enterpictureinpicture", handleEnterPictureInPicture);
                video.removeEventListener("leavepictureinpicture", handleLeavePictureInPicture);
            }
            document.removeEventListener("keydown", handleKeyDown as EventListener);
        };
    }, []);

    // useEffect(() => {
    //     setPreviousPath(pathname);
    // }, []);

    // useEffect(() => {

    //     if (previousPath && previousPath !== pathname) {
    //         console.log(`Смена маршрута с ${previousPath} на ${pathname}`);
    //         SaveViewDuration();
    //         addVideoToViewHistory();
    //     }

    //     setPreviousPath(pathname);

    // }, [pathname]);

    useEffect(() => {
        console.log("Компонент смонтирован");

        return () => {
            console.log(`Смена маршрута `);
            SaveViewDuration();
            addVideoToViewHistory();
        };
    }, []);


    // Event Handlers
    const handleKeyDown: any = (e: KeyboardEvent) => {
        const tagName = document.activeElement?.tagName.toLowerCase();
        if (tagName === "input" || tagName === "button") return;

        e.preventDefault();

        switch (e.key.toLowerCase()) {
            case " ":
            case "k":
                alert("mo ist huso")
                togglePlayPause();
                break;
            case "f":
                toggleFullScreen();
                break;
            case "t":
                toggleTheaterMode();
                break;
            case "i":
                toggleMiniPlayerMode();
                break;
            case "m":
                toggleMute();
                break;
            case "arrowleft":
            case "j":
                skip(-5);
                break;
            case "arrowright":
            case "l":
                skip(5);
                break;
            case "c":
                toggleCaptions();
                break;
            default:
                break;
        }
    };

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    const toggleFullScreen = () => {
        const videoContainer = videoContainerRef.current;
        if (videoContainer) {
            if (!document.fullscreenElement) {
                videoContainer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode(!isTheaterMode);
    };

    const toggleMiniPlayerMode = () => {
        const video = videoRef.current;
        if (video) {
            if (isMiniPlayer) {
                document.exitPictureInPicture();
            } else {
                video.requestPictureInPicture();
            }
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (video) {
            const newVolume = parseFloat(e.target.value);
            video.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const skip = (duration: number) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime += duration;
        }
    };

    const toggleCaptions = () => {
        const video = videoRef.current;
        if (video) {
            const tracks = video.textTracks[0];
            tracks.mode = captionsEnabled ? "hidden" : "showing";
            setCaptionsEnabled(!captionsEnabled);
        }
    };

    const handlePlaybackRateChange = () => {
        const video = videoRef.current;
        if (video) {
            let newRate = playbackRate + 0.25;
            if (newRate > 2) newRate = 0.25;
            video.playbackRate = newRate;
            setPlaybackRate(newRate);
        }
    };

    const handleTimelineUpdate = (e: MouseEvent) => {
        const timelineContainer = timelineContainerRef.current;
        const video = videoRef.current;
        if (timelineContainer && video) {
            const rect = timelineContainer.getBoundingClientRect();
            const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;

            if (isScrubbing) {
                e.preventDefault();
                timelineContainer.style.setProperty("--progress-position", `${percent * 100}%`);
            }
        }
    };

    const formatDuration = (time: number): string => {
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        if (hours === 0) {
            return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
        } else {
            return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
        }
    };

    // const handleSubtitleChange = (key: number) => {
    //     const video = videoRef.current;

    //     if (video) {
    //         setSelectedLang(key);
    //         handleSubtitleOpen();
    //     }
    // };

    const handleSubtitleChange = (selectedKey: number) => {
        const video = videoRef.current;
        setSelectedLang(selectedKey);
        if (video) {
            // for (let i = 0; i < video.textTracks.length; i++) {
            //     video.textTracks[i].mode = "disabled";
            // }

            // if (selectedKey >= 0 && selectedKey < video.textTracks.length) {
            //     video.textTracks[selectedKey].mode = "showing";
            // }
           
            handleSubtitleOpen();
        }
    };

     useEffect(() => {
        const video = videoRef.current;
        if (video) {
            for (let i = 0; i < video.textTracks.length; i++) {
                video.textTracks[i].mode = "disabled";
            }
            if (selectedLang >= 0 && selectedLang < video.textTracks.length) {
                video.textTracks[selectedLang].mode = "showing";
                console.log("key", selectedLang);
            }
          // setFileSub(filesSubtitles[selectedLang]);
        }
    }, [selectedLang, checked]);
    
    useEffect(() => {
        
        setFileSub(filesSubtitles[selectedLang]);
    }, [checked]);

    const handleSubtitleOpen = () => {
        if (display == "none")
            setDisplay("block");
        else
            setDisplay('none');
    };

    const CheckedSubtitles = () => {
        setChecked(!checked);
        setTimeout(() => {
            handleSubtitleOpen();
        }, 500);
    };

    // Render
    return (
        <div
            ref={videoContainerRef}
            className={`video-container ${isPlaying ? "playing" : "paused"} ${isTheaterMode ? "theater" : ""} ${isFullScreen ? "full-screen" : ""} ${isMiniPlayer ? "mini-player" : ""}`}
            data-volume-level={volume > 0.5 ? "high" : volume > 0 ? "low" : "muted"}
        >
            <div className="video-controls-container">
                <div ref={timelineContainerRef} className="timeline-container" onMouseMove={handleTimelineUpdate}>
                    <input
                        type="range"
                        className="timeline"
                        min="0"
                        max="100"
                        step="1"
                        value={(currentTime / duration) * 100}
                        onMouseDown={() => {
                            videoRef.current?.pause()
                        }}
                        onMouseUp={() => {
                            isPlaying && videoRef.current?.play()
                        }}
                        onChange={(e) => {
                            videoRef.current && (videoRef.current.currentTime = (parseFloat(e.target.value) / 100) * duration)
                        }}
                    />
                </div>
                <div className="controls">
                    <button className="play-pause-btn" onClick={togglePlayPause}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6 19h4V5H6v14zM14 5v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                    <div className="volume-container">
                        <button className="mute-btn" onClick={toggleMute}>
                            {isMuted ? (
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M16.5 12l4.5 4.5-1.41 1.41L15 13.41l-4.5 4.5-1.41-1.41L13.59 12l-4.5-4.5 1.41-1.41L15 10.59l4.5-4.5 1.41 1.41z" />
                                </svg>
                            ) : (
                                <>
                                    <svg className="volume-high-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                                    </svg>
                                    <svg className="volume-low-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                                    </svg>
                                    <svg className="volume-muted-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                                    </svg>
                                </>
                            )}
                        </button>
                        <input
                            ref={volumeSliderRef}
                            className="volume-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                    <div className="duration-container">
                        <span className="current-time">{formatDuration(currentTime)}</span>
                        <span> / </span>
                        <span className="total-time">{formatDuration(duration)}</span>
                    </div>
                    <div className="captions-btn" onClick={toggleCaptions}>
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                        </svg>
                    </div>
                    <button className="cursor-pointer mr-2" onClick={handlePlaybackRateChange}>{playbackRate}x</button>
                    <div className="theater-btn flex justify-center items-center cursor-pointer"
                        onClick={toggleTheaterMode}>
                        <TbLayersSubtract size={24} />
                    </div>
                    <div className="mini-player-btn flex justify-center items-center cursor-pointer"
                        onClick={toggleMiniPlayerMode}>
                        <PiPictureInPicture size={26} />
                    </div>
                    <div className="mini-player-btn cursor-pointer">
                        <PiScreencast size={25} />
                    </div>
                    <div className="full-screen-btn mr-2 cursor-pointer" onClick={toggleFullScreen}>
                        {isFullScreen ? (
                            <RxExitFullScreen size={23} />
                        ) : (
                            <RxEnterFullScreen size={23} />
                        )}
                    </div>
                    <div>
                        <BiMove onClick={handleSubtitleOpen} />
                    </div>
                    <div style={{
                        padding: '20px', border: '1px solid white', borderRadius: "8px",
                        marginTop: "-100px", marginLeft: '85%', display: display, paddingTop: '10px', paddingBottom: '5px',
                        backgroundColor: 'black', zIndex: '2000', position: 'absolute',
                    }}>
                        <div className="flex " style={{ height: '10px', justifyContent: 'end' }}>
                            <Switch defaultChecked={checked} onCheckedChange={CheckedSubtitles} />

                        </div>
                        <div><small>Subtitles:&nbsp;</small>{!checked && (<small>off</small>)}</div>
                        {filesSubtitles.length > 0 && checked && (subtitles?.map((subtitle, key) => (
                            <div>
                            <button  key={key} onClick={() => handleSubtitleChange(key)}
                                style={{ color: selectedLang === key ? "lightgreen" : "white" }}>{subtitle.languageName}</button>
                                </div>
                        )))}
                    </div>
                </div>

            </div>
            <video
                ref={videoRef}
                className="video"
                onClick={togglePlayPause}
                muted={isMuted}
                controls={false}
                preload="metadata"
            >
                {filesSubtitles.length > 0 && checked &&  (subtitles?.map((subtitle, key) => (
                  
                    <track  key={key} kind="subtitles" srcLang={subtitle.languageCode} src={URL.createObjectURL(filesSubtitles[key])}
                        label={subtitle.languageName}  default={selectedLang==key}/>
                  
                )))}
                
                  {/* {fileSub&&  (
                    <track   kind="subtitles" srcLang={subtitles[selectedLang].languageCode} src={URL.createObjectURL(fileSub)}
                        label={subtitles[selectedLang].languageName} default />
                )} */}

            </video>

        </div>
    );
};

export default VideoPlayer;

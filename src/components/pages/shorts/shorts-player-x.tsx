"use client"

import React, {useState, useRef, useEffect, MouseEvent, ChangeEvent, KeyboardEvent} from "react";
import "@/styles/videojsplayer.css";
import "@/styles/shortjsplayer.css";
import Hls from 'hls.js';
import api from '@/services/axiosApi';
import {IoEyeOutline} from "react-icons/io5";
import {formatNumber} from "@/utils/format";
import {BsThreeDotsVertical} from "react-icons/bs";
import {traceSegment} from "@jridgewell/trace-mapping";
import {IAnswerCommentVideo} from "@/types/answercommentvideo.interface";
import {HistoryOfBrowsing} from "@/types/history-of-browsing";
import {useUser} from "@clerk/nextjs";

class WatchHistory {
    constructor(public videoId: number, public lastViewedPosition: number) {
    }
}

interface IShortsPlayerXProps {
    src: string;
    videoId: number;
    viewCount: number;
    isActive: boolean;
}

const ShortsPlayerX: React.FC<IShortsPlayerXProps> = ({src, videoId, viewCount, isActive}) => {
    const {isSignedIn, user} = useUser();
    // Refs
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const timelineContainerRef = useRef<HTMLDivElement | null>(null);
    const volumeSliderRef = useRef<HTMLInputElement | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const [isHistoryUpdateInProgress, setIsHistoryUpdateInProgress] = useState(false);
    const hasAddedToHistory = useRef(false); // Флаг с useRef

    // State
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


    const addVideoToViewHistory = async () => {
        try {
            if (!isSignedIn || isHistoryUpdateInProgress) return; // Проверяем авторизацию и статус запроса

            // Проверяем, есть ли видео уже в истории
            const existingHistory = watchHistory.find(history => history.videoId === videoId);
            if (existingHistory) return;

            setIsHistoryUpdateInProgress(true); // Устанавливаем флаг перед началом запроса

            const request: HistoryOfBrowsing = {
                id: 0, // ID задаётся сервером
                userId: user.id,
                videoId: videoId,
                date: new Date(),
                timeCode: Math.floor(currentTime),
                channelSettingsId: 0,// задаётся сервером
            };

            const response = await api.post(`/HistoryOfBrowsing/add`, request, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setWatchHistory(prev => [...prev, new WatchHistory(videoId, Math.floor(currentTime))]);
                console.log(`Видео ${videoId} успешно добавлено в историю просмотра.`);
            } else {
                console.error(`Ошибка при добавлении видео ${videoId} в историю просмотра.`);
            }
        } catch (error) {
            console.error("Ошибка при добавлении видео в историю:", error);
        } finally {
            setIsHistoryUpdateInProgress(false); // Сбрасываем флаг после завершения запроса
        }
    };


    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`/api/Video/${videoId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch video data");
                }
                const videoData = await response.json();
                alert(`res=${videoData}`);
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
    }, [videoId]);

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

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            const percentagePlayed = ((videoRef.current.currentTime / videoRef.current.duration) * 100);


            if (percentagePlayed >= 5 && isSignedIn && !hasAddedToHistory.current) {
                hasAddedToHistory.current = true; // Устанавливаем флаг (useRef)
                console.log(`Видео добавляется в историю: ${videoId}`);
                addVideoToViewHistory(); // Добавляем в историю просмотра
            }
            if (percentagePlayed > 60 && !viewed) {
                setViewed(true);
                increaseViewCount(); // Увеличиваем счётчик просмотров
            }
            if (isPlaying) {
                const delta = videoRef.current.currentTime - lastUpdateTime;
                setRealWatchTime((prevTime) => prevTime + delta);
            }
            setLastUpdateTime(videoRef.current.currentTime);
        }
    };

    const saveWatchHistory = () => {
        if (videoRef.current) {
            const lastViewedPosition = videoRef.current.currentTime;

            // Добавляем или обновляем историю просмотра
            setWatchHistory(prevHistory => {
                const existingVideo = prevHistory.find(history => history.videoId === videoId);

                if (existingVideo) {
                    // Обновляем время последнего просмотра
                    return prevHistory.map(history =>
                        history.videoId === videoId
                            ? {...history, lastViewedPosition}
                            : history
                    );
                } else {
                    // Добавляем новое видео в историю
                    return [...prevHistory, new WatchHistory(videoId, lastViewedPosition)];
                }
            });

            console.log(`Видео ${videoId} остановлено на ${lastViewedPosition} секундах`);
        }
    };

    const handleVideoPauseOrEnd = () => {
        saveWatchHistory();
    };

    // Обработка закрытия вкладки или перезагрузки страницы
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            saveWatchHistory(); // Сохраняем историю перед закрытием вкладки
            event.preventDefault(); // Браузер может показать предупреждение перед закрытием (в зависимости от настроек)
        };

        if (videoRef.current) {
            const video = videoRef.current;

            // Подписка на события видео
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('pause', handleVideoPauseOrEnd);
            video.addEventListener('ended', handleVideoPauseOrEnd);
        }

        // Подписка на событие закрытия вкладки
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Очистка событий при размонтировании
        return () => {
            if (videoRef.current) {
                const video = videoRef.current;
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('pause', handleVideoPauseOrEnd);
                video.removeEventListener('ended', handleVideoPauseOrEnd);
            }

            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [videoId]);


    const increaseViewCount = () => {
        // alert("Просмотр засчитан!");
        Viewed(videoId);
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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

            // Убираем обработчик при размонтировании компонента
            return () => {
                videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [viewed, videoId]);

    // Effects
    useEffect(() => {
        const video = videoRef.current;

        if (video) {

            const handleLoadedMetadata = () => {
                setDuration(video.duration);
            };
            const handleTimeUpdate = () => {
                setCurrentTime(video.currentTime);
            };
            const handleVolumeChange = () => {
                setVolume(video.volume);
                setIsMuted(video.muted);
            };

            video.addEventListener("loadedmetadata", handleLoadedMetadata);
            handleLoadedMetadata();
            video.addEventListener("timeupdate", handleTimeUpdate);
            video.addEventListener("volumechange", handleVolumeChange);

            return () => {
                if (video) {
                    video.removeEventListener("loadedmetadata", handleLoadedMetadata);
                    video.removeEventListener("timeupdate", handleTimeUpdate);
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
            /* case "f":
                 toggleFullScreen();
                 break;
             case "t":
                 toggleTheaterMode();
                 break;
             case "i":
                 toggleMiniPlayerMode();
                 break;*/
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

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (isActive) {
                video.play(); // Воспроизводим текущее видео
            } else {
                video.pause(); // Ставим остальные на паузу
            }
        }
    }, [isActive]); // Перезапускаем эффект при изменении isActive

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
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2});
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        if (hours === 0) {
            return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
        } else {
            return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
        }
    };
    // Функция для начала воспроизведения видео
    const handlePlay = () => {
        setIsPlaying(true);
    };
    // Render
    return (
        <div
            ref={videoContainerRef} style={{overflowY: "auto", height: "90vh"}}
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
                <div className="controlsV2">
                    <button className="play-pause-btn" onClick={togglePlayPause}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6 19h4V5H6v14zM14 5v14h4V5h-4z"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                    <div className="volume-containerV2">
                        <button className="mute-btn" onClick={toggleMute}>
                            {isMuted ? (
                                <svg viewBox="0 0 15 15">
                                    <path fill="currentColor"
                                          d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
                                </svg>
                            ) : (
                                <>
                                    <svg className="volume-high-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                                    </svg>
                                    <svg className="volume-low-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"/>
                                    </svg>
                                    <svg className="volume-muted-icon" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
                                    </svg>
                                </>
                            )}
                        </button>
                        <input
                            ref={volumeSliderRef}
                            className="volume-sliderV2"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                    <div className="duration-container text-[12.5px]">
                        <span className="current-time">{formatDuration(currentTime)}</span>
                        <span> / </span>
                        <span className="total-time">{formatDuration(duration)}</span>
                    </div>
                    <div className="captions-btn" onClick={toggleCaptions}>
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"/>
                        </svg>
                    </div>

                    <div className={'flex items-center gap-[0.3125rem]'}>
                        <IoEyeOutline size={22}/>
                        {formatNumber(viewCount)}
                    </div>
                    <button className="play-pause-btn">
                        <BsThreeDotsVertical/>
                    </button>
                </div>
            </div>
            <video ref={videoRef} className="videoV2 aspect-[9/16]"
                   onClick={togglePlayPause} muted
                   controls={false} preload="metadata" autoPlay loop={true}
                   onPlay={handlePlay}>
                <track kind="subtitles" srcLang="en" src="subtitles.vtt" label="Russian" default/>
            </video>
        </div>
    );
};

export default ShortsPlayerX;

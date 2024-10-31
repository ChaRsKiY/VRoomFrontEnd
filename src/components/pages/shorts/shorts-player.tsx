"use client"

import React, {useRef, useState, useEffect, ChangeEvent, MouseEvent} from 'react';
import '../../../styles/shortjsplayer.css';

// import '../globals.css';

interface IShortsPlayerProps {
    src: string;
    id: number;
}

const ShortsPlayer: React.FC<IShortsPlayerProps> = ({src, id}) => {
    // Refs
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const timelineContainerRef = useRef<HTMLDivElement | null>(null);
    const volumeSliderRef = useRef<HTMLInputElement | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);

    // State
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
    const [wasPaused, setWasPaused] = useState<boolean>(false);
    const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
    const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
    const [viewed, setViewed] = useState(false);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            const percentagePlayed = (videoRef.current.currentTime / videoRef.current.duration) * 100;

            // Если пользователь просмотрел более 40% и просмотр ещё не был засчитан
            if (percentagePlayed > 40 && !viewed) {
                setViewed(true); // Устанавливаем флаг, что просмотр был засчитан
                increaseViewCount(); // Увеличиваем счётчик просмотров
            }
        }
    };

    const increaseViewCount = () => {
        alert("Просмотр засчитан!");
        Viewed(id);
    };

    const Viewed = async (id: number) => {
        try {
            const response = await fetch('https://localhost:7154/api/Video/view/' + id, {
                method: 'PUT',
            });

            if (response.ok) {
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
    }, [viewed, id]);

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };
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

    // Event Handlers
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

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (video) {
            const newVolume = parseFloat(e.target.value);
            video.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
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
    // Render
    return (
        <div style={{border: 'solid 1px red'}}
             ref={videoContainerRef}
             className={`shorts-container ${isPlaying ? "playing" : "paused"} ${isTheaterMode ? "theater" : ""}`}
             data-volume-level={volume > 0.5 ? "high" : volume > 0 ? "low" : "muted"}
        >
            {/* Кнопки управления (пауза и звук) */}
            <div className="controls-top-left">
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
                <div className="shorts-volume-container">
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
                        className="shorts-volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>

            {/* Видео */}
            <video
                ref={videoRef}
                className="shorts"
                src={src}
                onClick={togglePlayPause}
                muted={isMuted}
                controls={false}
                preload="metadata"
            >
                <track kind="subtitles" srcLang="en" src="subtitles.vtt" label="Russian" default/>
            </video>

            {/* Прогресс-бар внизу  shorts-thumb-indicator*/}
            <div className="shorts-controls justify-start w-full">
                <div ref={timelineContainerRef} className="shorts-timeline-container w-full"
                     onMouseMove={handleTimelineUpdate}>
                    <input
                        type="range"
                        className="shorts-timeline"
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
            </div>
        </div>
    );


};

export default ShortsPlayer;

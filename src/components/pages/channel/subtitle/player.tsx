"use client"

import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent, KeyboardEvent } from "react";
import "@/styles/videoplayerforsubtitles.css";
import { PiPictureInPicture, PiScreencast } from "react-icons/pi";
import { TbLayersSubtract } from "react-icons/tb";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import Hls from 'hls.js';
import api from '@/services/axiosApi';
import { HistoryOfBrowsing } from "@/types/history-of-browsing";
//import {useUser} from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';
import { usePathname } from "next/navigation";


class WatchHistory {
    constructor(public videoId: number, public lastViewedPosition: number) {
    }
}

interface IVideoPlayerProps {
    src: string;
    id: number;
    fileSubtitle: File | undefined;
}


const VideoPlayer: React.FC<IVideoPlayerProps> = ({ src, id, fileSubtitle }) => {
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

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/Video/${id}`);
                if (response.status != 200) {
                    throw new Error("Failed to fetch video data");
                }
                const videoData = await response.data;
                console.log("vide0000**", videoData);
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

            const delta = currentTime - lastUpdateTime;
            if (isPlaying && delta > 0 && delta < 5) { // Исключаем большие скачки ( перемотку)
                setRealWatchTime((prevTime) => prevTime + delta);
            }

            if (realWatchTime / duration > 0.6 && !viewed) {
                setViewed(true);
                // increaseViewCount();
            }
            setLastUpdateTime(videoRef.current.currentTime);
        }
    };
    const handlePauseOrSeek = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const delta = currentTime - lastUpdateTime;

            // Учитываем реальное время только для небольших изменений
            if (delta > 0 && delta < 5) {
                setRealWatchTime((prevTime) => prevTime + delta);
            }

            setLastUpdateTime(currentTime);
        }
    };


    const SaveViewDuration = async () => {
        if (realWatchTime > 0) {
            const formData = new FormData();
            const language = navigator.language;
            language.split('-')[0];

            if (user)
                formData.append('clerkId', user.id);
            else
                formData.append('clerkId', "***");
            formData.append('videoId', id + '');
            formData.append('location', language);
            formData.append('duration', realWatchTime + "");
            formData.append('date', new Date().toString());

            await api.post("/Video/viewingduration", formData);
        }
    }

    useEffect(() => {

        if (videoRef.current) {
            const video = videoRef.current;
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener("pause", handlePauseOrSeek);
            video.addEventListener("seeked", handlePauseOrSeek);
        }

        return () => {
            if (videoRef.current) {
                const video = videoRef.current;
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener("pause", handlePauseOrSeek);
                video.removeEventListener("seeked", handlePauseOrSeek);
            }

        };
    }, [id, user, realWatchTime]);


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [id]);


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

        return () => {
            if (video) {
                video.removeEventListener("enterpictureinpicture", handleEnterPictureInPicture);
                video.removeEventListener("leavepictureinpicture", handleLeavePictureInPicture);
            }
        };
    }, []);

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


        return () => {
            if (video) {
                video.removeEventListener("enterpictureinpicture", handleEnterPictureInPicture);
                video.removeEventListener("leavepictureinpicture", handleLeavePictureInPicture);
            }
        };
    }, []);

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
                {fileSubtitle && (
                    <track
                        src={URL.createObjectURL(fileSubtitle)} // Создаём временный URL для файла
                        kind="subtitles"
                        srcLang="ru"
                        label="Русский"
                        default

                    />
                )}
            </video>
        </div>
    );
};

export default VideoPlayer;

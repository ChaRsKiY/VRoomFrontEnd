'use client';

import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import "video.js/dist/video-js.css"
import "@videojs/themes/dist/sea/index.css"
import "@/styles/videojsplayer.css"

const VideoPlayer = ({ src }) => {
    const videoJsOptions = {
        autoplay: true,
        controls: true,
        preload: "auto",
        defaultPlaybackRate: 1,
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
            hotkeys: true
        },
        controlBar: {
            skipButtons: {
                backward: 10,
                forward: 10
            }
        },
        sources: [
            {
                src: src,
                type: 'video/mp4',
            },
        ],
    };


    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const player = playerRef.current;

        if (!player) {
            const videoElement = videoRef.current;

            if(!videoElement) return ;

            playerRef.current = videojs(videoElement, videoJsOptions);
        };

        return () => {
            // Cleanup Video.js player on component unmount
            if (player) {
                //player.dispose();
                //playerRef.current = null;
            }
        };
    }, [videoJsOptions, videoRef, playerRef]);

    return (
        <div data-vjs-player className="w-full">
            <video ref={videoRef} className={"w-full h-auto aspect-video rounded-xl vjs-big-play-centered video-js"} />
        </div>
    );
};

export default VideoPlayer;

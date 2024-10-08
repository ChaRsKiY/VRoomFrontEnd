import React from 'react'
import VideoPlayer from "@/components/pages/watch/player";
import UnderVideoBlock from "@/components/pages/watch/under-video-block";
import {IPresentedVideo} from "@/types/video.interface";
import UnderLine from "@/components/pages/watch/underline";
import DescriptionBlock from "@/components/pages/watch/description-block";
import {str} from "video.js";
import CommentsBlock from "@/components/pages/watch/comments-block";

const WatchPage: React.FC = ({ params }) => {
    const { id } = params;

    const testVideo = {
        id: 1,
        title: "Cyberpunk 2077 - Official Trailer 2022",
        views: 223000,
        description: "Hello this is my new video about cars",
        channel: {
            avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
            name: "Mr Beast"
        }
    } as IPresentedVideo

    return (
        <div className="flex w-full">
            <div className="w-3/4 px-8">
                <VideoPlayer src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'} />
                <UnderVideoBlock video={testVideo} />
                <UnderLine />
                <DescriptionBlock description={testVideo.description} />
                <UnderLine />
                <CommentsBlock />
            </div>
            <div>

            </div>
        </div>
    )
}

export default WatchPage
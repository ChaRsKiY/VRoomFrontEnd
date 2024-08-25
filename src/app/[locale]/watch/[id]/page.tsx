import React from 'react'
import VideoPlayer from "@/components/pages/watch/player";

const WatchPage: React.FC = ({ params }) => {
    const { id } = params;

    return (
        <div className="w-3/4 px-8">
            <VideoPlayer src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'} />
        </div>
    )
}

export default WatchPage
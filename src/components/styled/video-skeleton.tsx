import { Skeleton } from "@/components/ui/skeleton"
import React from "react";

const VideoSkeleton = () => {
    return (
        <div className="px-3 mb-8 space-y-2.5">
            <Skeleton className="h-full w-full rounded-xl aspect-video"/>
            <div className="flex space-x-2.5 w-full">
                <Skeleton className="h-9 w-9 rounded-full"/>
                <div className="flex-1">
                    <Skeleton className="h-4 w-[75%]"/>
                    <Skeleton className="h-3 w-[25%] mt-2"/>
                    <div className="flex items-center">
                        <Skeleton className="h-3 w-[15%] mt-2 mr-2"/>
                        <Skeleton className="h-3 w-[25%] mt-2"/>
                    </div>
                </div>
            </div>
        </div>
)
}

export default VideoSkeleton
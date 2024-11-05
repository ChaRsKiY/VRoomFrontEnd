import { Skeleton } from "@/components/ui/skeleton"
import React from "react";

const ResultsVideoSkeleton = () => {
    return (
        <div className="flex w-full max-sm:flex-col max-sm:px-[5%]">
            <Skeleton className="w-2/3 mr-4 rounded-xl aspect-[16/9] max-sm:w-full" />
            <div className="flex space-x-2.5 w-1/3 max-sm:w-full max-sm:mt-3">
                <div className="w-full">
                    <Skeleton className="h-4 w-[85%]" />
                    <div className="flex items-center space-x-2 my-1">
                        <Skeleton className="h-9 w-9 my-1 rounded-full" />
                        <Skeleton className="h-3 w-[25%]" />
                    </div>
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        <Skeleton className="h-3 w-[15%] mt-1 mr-2" />
                        <Skeleton className="h-3 w-[25%] mt-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultsVideoSkeleton
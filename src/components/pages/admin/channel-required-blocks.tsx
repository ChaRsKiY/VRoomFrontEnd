"use client"

import React, {useState} from 'react'
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import VideoViewDuration from "@/components/pages/admin/video-duration-view";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";

const ChannelRequiredBlocks: React.FC = () => {
    const [channelId, setChannelId] = useState<number | null>(null)
    const ref = React.useRef<HTMLInputElement>(null)

    const handleSearch = () => {
        if (ref.current) {
            if (isNaN(parseInt(ref.current.value))) {
                toast({
                    title: 'Error',
                    description: 'Invalid channel id.',
                    className: 'bg-red-200 text-red-800'
                })
                return;
            }

            setChannelId(parseInt(ref.current.value))
        }
    }

    return (
        <div className="">
            <h1 className="text-2xl mb-3"
            >Channel Required Blocks</h1>
            <Label>Enter Channel Id:</Label>
            <div className="flex space-x-1.5 mb-6">
                <Input ref={ref} type="number" placeholder="Channel Id" className="max-w-64" />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {channelId != null && <VideoViewDuration channelId={channelId} />}
        </div>
    )
}

export default ChannelRequiredBlocks
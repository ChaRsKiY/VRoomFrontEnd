"use client"

import React, {useState} from 'react'
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import VideoViewDuration from "@/components/pages/admin/video-duration-view";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "next-i18next";

const ChannelRequiredBlocks: React.FC = () => {
    const [channelId, setChannelId] = useState<number | null>(null)
    const ref = React.useRef<HTMLInputElement>(null)

    const { t } = useTranslation()

    const handleSearch = () => {
        if (ref.current) {
            if (isNaN(parseInt(ref.current.value))) {
                toast({
                    title: 'Error',
                    description: 'Invalid channel.json id.',
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
            >{t("admin-main:channel.json-required-blocks")}</h1>
            <Label>{t("admin-main:enter-channel.json-id")}</Label>
            <div className="flex space-x-1.5 mb-6">
                <Input ref={ref} type="number" placeholder={t("admin-main:channel.json-id")} className="max-w-64" />
                <Button onClick={handleSearch}>{t("admin-main:search")}</Button>
            </div>

            {channelId != null && <VideoViewDuration channelId={channelId} />}
        </div>
    )
}

export default ChannelRequiredBlocks
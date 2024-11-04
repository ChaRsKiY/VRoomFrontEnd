import React from 'react'
import Link from "next/link";
import { IoReturnDownBack } from "react-icons/io5";
import DragAndDropInput from "@/components/pages/channel/video/drag-and-drop-input";
import { Button } from "@/components/ui/button";

const AddVideoStageOne: React.FC<any> = ({ setData, videoFile, setStage }: any) => {
    const handleContinue = () => {
        if (videoFile) {
            setStage(2)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="text-center text-xl">Upload new video</div>
                <Link href="/channel"><IoReturnDownBack size={25} /></Link>
            </div>

            <div className="rounded-full bg-neutral-200 h-[1px] w-full mt-3 mb-4" />
            <DragAndDropInput setVideoFile={setData} videoFile={videoFile} />

            <Button className="mt-4 w-full" onClick={handleContinue}>Continue</Button>
        </>
    )
}

export default AddVideoStageOne
"use client"

import React, { useEffect, useState } from 'react'
import StageOne from "@/components/pages/channel/video/stage-one";
import StageTwo from "@/components/pages/channel/video/stage-two";

interface CreateVideo {
    videoFile: File | null,
}

const AddVideoForm: React.FC = () => {
    const [data, setData] = useState<CreateVideo>({
        videoFile: null,
    });
    const [stage, setStage] = useState(1)

    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <div className="p-5 shadow-2xl rounded-xl min-w-96 max-w-[600px]">
            {stage === 1 && <StageOne setData={setData} videoFile={data.videoFile} setStage={setStage} />}
            {stage === 2 && <StageTwo setData={setData} videoFile={data.videoFile} setStage={setStage} />}
        </div>
    )
}

export default AddVideoForm
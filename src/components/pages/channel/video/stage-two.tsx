"use client"

import React from 'react'
import { IoReturnDownBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AddVideoStageTwo: React.FC<any> = ({ setData, videoFile, setStage }: any) => {
    const handleContinue = () => {
        if (videoFile) {
            setStage(2)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="text-center text-xl">Information</div>
                <div onClick={() => setStage(1)}><IoReturnDownBack size={25} /></div>
            </div>

            <div className="rounded-full bg-neutral-200 h-[1px] w-full mt-3 mb-4" />

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
            </div>

            <Button className="mt-4 w-full" onClick={handleContinue}>Continue</Button>
        </>
    )
}

export default AddVideoStageTwo
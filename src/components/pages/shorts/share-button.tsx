"use client"

import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {CiSettings} from "react-icons/ci";
import Link from "next/link";
import ShareDialog from "@/components/pages/shorts/share-dialog";
import {RiShareForwardFill} from "react-icons/ri";

interface IProps {
    URL: string;
}

const OpenShareDialogButton: React.FC<IProps> = (URL) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div onClick={openDialog}
             className="cursor-pointer flex-col items-center space-x-2.5">

            <div className="flex flex-col items-center space-x-2.5">
                <RiShareForwardFill size={24}/>
                <div className="text-center text-xs">Share</div>
            </div>
            <ShareDialog isOpen={isDialogOpen} onClose={closeDialog} URL={URL}/>
        </div>
    );
}
export default OpenShareDialogButton;
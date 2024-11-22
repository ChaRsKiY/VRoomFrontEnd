"use client"

import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {CiSettings, CiShare2} from "react-icons/ci";
import Link from "next/link";
import ShareDialog from "@/components/pages/shorts/share-dialog";
import {RiShareForwardFill} from "react-icons/ri";
import {IoShareSocialOutline} from "react-icons/io5";

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
                <IoShareSocialOutline size={24}/>
            </div>
            <ShareDialog isOpen={isDialogOpen} onClose={closeDialog} URL={URL}/>
        </div>
    );
}
export default OpenShareDialogButton;
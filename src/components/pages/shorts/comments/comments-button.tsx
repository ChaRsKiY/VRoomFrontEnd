"use client"

import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {CiSettings} from "react-icons/ci";
import Link from "next/link";
import ShareDialog from "@/components/pages/shorts/share-dialog";
import {RiShareForwardFill} from "react-icons/ri";
import Comments from "@/components/pages/comments/comments";
import CommentsDialog from "@/components/pages/shorts/comments/comments-dialog";
import {MdInsertComment} from "react-icons/md";
import {IVideo} from "@/types/videoinfo.interface";

interface IProps {
    video: IVideo;
}

const OpenCommentsDialogButton: React.FC<IProps> = ({video}) => {
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
                <MdInsertComment size={24} className="cursor-pointer"/>
                <div className="font-[300]"
                     title={video.commentCount.toString()}>{video.commentCount}</div>
            </div>
            <CommentsDialog isOpen={isDialogOpen} onClose={closeDialog} videoId={video.id}/>
        </div>
    );
}
export default OpenCommentsDialogButton;
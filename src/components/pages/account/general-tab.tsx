import React from 'react'
import {currentUser, User} from "@clerk/nextjs/server";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

const GeneralTab: React.FC = async () => {
    const user: User | null = await currentUser()

    return (
        <div>
            <div className="font-[600]">General</div>
            <div className="text-3xl mt-4">Hello <span
                className="font-[600]">{user?.firstName ? user.firstName : user?.username}</span></div>
            <div className="mt-1.5 text-[0.9rem]">Add information about yourself and set up access to VRoom
                features
            </div>

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl">Your YouTube channel</div>
            <div className="mt-1.5 text-[0.9rem]">This is your public presence on VRoom. You need a channel to upload
                your own videos, comment on videos, or create playlists.
            </div>
            <div className="flex mt-5">
                <div className="mr-12">Your channel</div>
                <div>
                    <div className="flex space-x-3 items-center">
                        <Avatar>
                            <AvatarImage src={user?.imageUrl} alt={user?.username || ""}/>
                            <AvatarFallback>FR</AvatarFallback>
                        </Avatar>
                        <div>{user?.username}</div>
                    </div>
                    <div className="mt-3 flex flex-col">
                        <Link href="/" className="text-blue-400">Channel status and features</Link>
                        <Link href="/" className="text-blue-400">View advanced settings</Link>
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-neutral-300 my-8"/>



        </div>
    )
}

export default GeneralTab
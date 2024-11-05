"use client"

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResource } from "@clerk/types";
import Link from "next/link";

const UserDataInBurgerMenu: React.FC<{ user: UserResource | undefined | null }> = ({ user }: { user: UserResource | undefined | null }) => {
    return (
        <div>
            <div className="flex space-x-3">
                <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user ? user?.username?.slice(0, 2) : "VR"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="font-[500] text-[1.1rem]">{user?.username}</div>
                    <div className="">{user?.fullName}</div>
                    <Link href="/channel" className="mt-2.5 text-blue-400">View channel</Link>
                </div>

            </div>
        </div>
    )
}

export default UserDataInBurgerMenu
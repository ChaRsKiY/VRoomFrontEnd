"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React from "react";
import {HiOutlineSwitchHorizontal} from "react-icons/hi";
import {useClerk, useSession} from "@clerk/nextjs";
import {SessionResource} from "@clerk/types";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RiLogoutCircleRLine} from "react-icons/ri";

export function AccountSwitch() {
    const { client, setActive } = useClerk()
    const currentSession = useSession()
    const { push } = useRouter()

    const availableSessions: SessionResource[] = client.sessions

    const endSession = async (session: SessionResource) => {
        await session.end()

        if (session.id === currentSession.session?.id) {
            const newAvailableSessions: SessionResource[] = client.sessions
            await setActive({ session: newAvailableSessions[0].id })
        }
    }

    const switchAccount = async (session: SessionResource) => {
        if (session.id === currentSession.session?.id) return;
        await setActive({ session: session.id })
        window.location.reload()
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-[0.5rem] flex items-center p-2 text-[1.075rem] space-x-3">
                    <HiOutlineSwitchHorizontal size={23}/>
                    <div>Switch account</div>
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Switch account</SheetTitle>
                    <SheetDescription>
                        Switch to another account to manage your profile.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    {availableSessions && availableSessions.filter(session => session.status === "active").map((session) => (
                        <div onClick={() => switchAccount(session)} id={session.id} className="flex items-center rounded-[0.5rem] hover:bg-neutral-100 p-2 cursor-pointer justify-between">
                            <div className="flex space-x-3">
                                <Avatar className="self-center">
                                    <AvatarImage src={session.user?.imageUrl} />
                                    <AvatarFallback>{session.user ? session.user?.username?.slice(0, 2) : "VR"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-[500] text-[1.075rem]">{session.user?.username}</div>
                                    <div>{session.user?.fullName}</div>
                                    {currentSession.session?.id === session.id && (
                                        <div className="text-neutral-500 text-[0.85rem]">Current</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button onClick={() => endSession(session)} className="p-2 hover:bg-red-300 rounded-full group"><RiLogoutCircleRLine size={24} className="group-hover:text-white" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button onClick={() => push("/auth/signin")} className="text-blue-400">Add new user</button>
                </div>
            </SheetContent>
        </Sheet>
    )
}


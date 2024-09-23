"use client";

import React, {useState} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useClerk, useUser} from "@clerk/nextjs";
import {IoMenu} from "react-icons/io5";
import NotificationButtonMenu from "@/components/pages/home/header/notification-button-in-menu";
import UserDataInBurgerMenu from "@/components/pages/home/header/userdata-burgermenu";
import {CiLogin, CiLogout} from "react-icons/ci";
import HeaderMenuButton from "@/components/pages/home/header/menu-button";
import {useRouter} from "next/navigation";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const { push } = useRouter()

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="self-center relative">
            {!user ? (
                <button className="flex items-center" onClick={handleOpen}><IoMenu className="cursor-pointer h-8 w-8 text-neutral-500" /></button>
            ) : (
                <Avatar className="cursor-pointer h-8 w-8" onClick={handleOpen}>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user ? user?.username?.slice(0, 2) : "VR"}</AvatarFallback>
                </Avatar>
            )}

            {isOpen && (
                <div
                    className="absolute top-10 min-w-64 right-0 bg-white dark:bg-neutral-950 shadow-2xl rounded-lg p-4 flex flex-col">
                    {isLoaded && user ? (
                        <>
                            <UserDataInBurgerMenu user={user}/>
                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                            <HeaderMenuButton icon={<CiLogout size={23} />} text="Logout" action={signOut} />
                        </>
                    ) : (
                        <>
                            <HeaderMenuButton icon={<CiLogin size={23}/>} text="Sign in" action={() => push("/auth/signin")} />

                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                        </>
                    )}
                    <NotificationButtonMenu/>
                </div>)}
        </div>
    )
}

export default BurgerMenu
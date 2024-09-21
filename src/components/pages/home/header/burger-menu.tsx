"use client";

import React, {useState} from 'react'
import {RxHamburgerMenu} from "react-icons/rx";
import NotificationButton from "@/components/pages/home/header/notitification-button";
import SettingsButton from "@/components/pages/home/header/settings-button";
import {CiLogin} from "react-icons/ci";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="hidden max-sm:block self-center relative">
            <RxHamburgerMenu size={27} className="cursor-pointer" onClick={handleOpen} />
            {isOpen && (
                <div
                    className="absolute top-10 right-0 w-40 h-40 bg-white dark:bg-neutral-950 shadow-2xl rounded-lg p-4 flex flex-col">
                    <div className="relative flex justify-between">
                        <NotificationButton/>
                    </div>
                    <div className="pt-2 pb-1 border-t border-neutral-300"><CiLogin />Sign in</div>
                </div>)}
        </div>
    )
}

export default BurgerMenu
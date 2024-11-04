"use client"

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Dialog from './dialog-settings';
import { CiSettings } from "react-icons/ci";
import Link from "next/link";

export default function OpenDialogButton() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedPage, setSelectedPage] = useState('page-channel-basic-info');  // Какая страница выбрана

    // Динамическая загрузка страниц
    const PageComponent = dynamic(() => import(`@/components/pages/channel/dialogsettings/${selectedPage}`), {
        ssr: false,
    });

    const handleSelect = (key: string) => {
        setSelectedPage(key);
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedPage('page-channel-basic-info');
    };

    return (
        <div onClick={openDialog}
            className={"cursor-pointer flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
            <div className="text-2xl">
                <CiSettings width={26} height={26} />
            </div>
            <div>Settings</div>
            <Dialog isOpen={isDialogOpen} onClose={closeDialog} onSelect={handleSelect}>
                <PageComponent />
            </Dialog>
        </div>
    );
}

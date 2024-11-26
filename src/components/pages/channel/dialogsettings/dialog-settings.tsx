"use client"

import React, { ReactElement, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import { ITranslationFunction } from "@/types/translation.interface";
import { useTranslation } from "next-i18next";

interface DialogSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (key: string) => void;
    children: ReactElement<{ onSelect: (key: string) => void }>;    //содержимое диалогового окна
}


const DialogSettings: React.FC<DialogSettingsProps> = ({ isOpen, onClose, onSelect, children }) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (isOpen && dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, [isOpen]);

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        onClose();
    };

    const { t }: { t: ITranslationFunction } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-20">
            <dialog ref={dialogRef} onClose={closeDialog} className=" bg-white w-4/6 h-5/6 flex rounded-lg p-8">

                <Sidebar onSelect={onSelect} t={t} />
                <div className="flex flex-col w-full">
                    {/* Основное содержимое диалогового окна */}
                    <div className="flex-grow overflow-auto p-4">
                        {/* Передаем функцию onSelect в содержимое */}
                        {React.cloneElement(children, { onSelect })}
                    </div>
                    <div className="flex flex-row self-end">
                        <button className="self-end p-2 text-black">Save
                        </button>
                        <button className="self-end p-2 text-black"
                            onClick={closeDialog}>Close
                        </button>
                    </div>

                </div>
            </dialog>
        </div>
    );
};

export default DialogSettings;

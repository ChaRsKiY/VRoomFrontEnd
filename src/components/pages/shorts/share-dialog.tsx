"use client"

import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import {MdOutlineClose} from "react-icons/md";
import {FaFacebook, FaTelegram, FaTwitter, FaWhatsapp} from "react-icons/fa";
import {UrlObject} from "node:url";
import * as Url from "node:url";


interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;   //содержимое диалогового окна
    URL: any;
}


const ShareDialog: React.FC<ShareDialogProps> = ({isOpen, onClose, URL}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hrefFB, setHrefFB] = useState('');
    const [hrefTW, setHrefTW] = useState('');
    const [hrefT, setHrefT] = useState('');
    const [hrefW, setHrefW] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(URL.URL);
        setHrefFB("https://www.facebook.com/sharer/sharer.php?u=" + url);
        setHrefTW("https://twitter.com/intent/tweet?url=" + url);
        setHrefT("https://telegram.me/share/url?url=" + url);
        setHrefW("https://api.whatsapp.com/send?text=" + url);
    }, [URL]);

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
    const handleCopy = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value)
                .then(() => {
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 2800); // Убираем всплывающее окно через 2 секунды
                })
                .catch((error) => {
                    console.error('Ошибка копирования: ', error);
                });
        }
    };
    const {t}: { t: ITranslationFunction } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-20">
            <dialog ref={dialogRef} onClose={closeDialog}
                    className=" bg-white w-2/5 h-2/4 flex rounded-lg p-5">

                <div className="flex flex-col w-full relative">

                    <div className='flex justify-between absolute top-0 left-0 right-0'>
                        <h2 className="text-lg font-semibold">Share</h2>
                        <MdOutlineClose size={34} onClick={closeDialog} className="cursor-pointer"/>
                    </div>
                    {/* Основное содержимое диалогового окна */}
                    <div className="flex gap-x-8 gap-y-4 overflow-auto p-4 mt-6">
                        {/* Передаем функцию onSelect в содержимое */}
                        <div className="text-center text-xs">
                            <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={60} className="text-blue-600 cursor-pointer"
                                            title='Share on Facebook'/></a>Facebook
                        </div>
                        <div className="text-center text-xs">
                            <a href={hrefTW} target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={60} className="text-blue-400 cursor-pointer" title='Share on Twitter'/>
                            </a>Twitter
                        </div>
                        <div className="text-center text-xs">
                            <a href={hrefT} target="_blank" rel="noopener noreferrer">
                                <FaTelegram size={60} className="text-blue-500 cursor-pointer"
                                            title='Share on Telegram'/>
                            </a>Telegram
                        </div>
                        <div className="text-center text-xs">
                            <a href={hrefW} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={60} className="text-green-500 cursor-pointer"
                                            title='Share on Whatsapp'/>
                            </a>Whatsapp
                        </div>
                    </div>
                    <div className="w-full flex flex-row p-2 absolute bottom-1 left-0 right-0"
                         style={{wordWrap: 'break-word'}}>
                        <input ref={inputRef} className=" w-[70%] border" type="text" value={url} readOnly={true}/>
                        <button className="ml-3 pl-4 pr-4 pt-2 pb-2 bg-blue-500 rounded-3xl text-white font-bold"
                                onClick={handleCopy}>Копировать
                        </button>
                    </div>
                </div>

            </dialog>
            {showPopup && (
                <div style={{
                    position: 'absolute',
                    bottom: '4%',
                    left: '12%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: '5px',
                    fontSize: '16px',
                }}>Ссылка скопирована в буфер обмена</div>
            )}
        </div>
    );
};

export default ShareDialog;

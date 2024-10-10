"use client"

import React, {useEffect, useRef, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import axios from "axios";

const ChannelEditBlock = () => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [id, setId] = useState(0);


    const [channelBanner, setChannelBanner] = useState<File | null>();
    const [channelBannerPreview, setChannelBannerPreview] = useState<string>('https://placehold.co/150x100.svg');
    const [chBannerPrevOld, setChBannerPrevOld] = useState<string>("");
    const chBInputRef = useRef<HTMLInputElement | null>(null);

    const [profilePhoto, setProfilePhoto] = useState<File | null>();
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('https://placehold.co/120x80.svg');
    const [profPhotoPrevOld, setProfPhotoPrevOld] = useState<string>("");
    const profPhInputRef = useRef<HTMLInputElement | null>(null);

    const [channelNickName, setChannelNickName] = useState<string>("");
    const [channelNickNameValid, setChannelNickNameValid] = useState(true);
    const validateChannelNickName = (channelNickName: string) => channelNickName.length > 3;

    const [channelName, setChannelName] = useState<string>("");
    const [channelNameValid, setChannelNameValid] = useState(true);
    const validateChannelName = (channelName: string) => channelName.length > 3;

    const [channelDescription, setChannelDescription] = useState<string>("");


    useEffect(() => {
        if (user) {
            fetchChannel(user.id);
        }
    }, [user]);
    const fetchChannel = async (userId: string) => {
        try {
            const response = await fetch(`https://localhost:7154/api/ChannelSettings/getbyownerid/` + userId, {
                method: 'GET'
            });

            const data: any = await response.json();
            console.log(data.channelName);

            if (data.channelBanner == null) {
                setChannelBannerPreview('https://placehold.co/150x100.svg');
            }

            setId(data.id);
            setChannelBannerPreview(data.channelBanner);
            setChBannerPrevOld(data.channelBanner);
            setProfilePhotoPreview(data.channelPlofilePhoto);
            setProfPhotoPrevOld(data.channelPlofilePhoto);
            setChannelName(data.channelName);
            setChannelNameValid(true);
            setChannelDescription(data.description);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
alert('error');
        if (channelNameValid) {

            const formData = new FormData();

            if (channelBanner) {
                formData.append('channelBanner', channelBanner);// Добавляем изображение
            }
            if (profilePhoto) {
                formData.append('profilePhoto', profilePhoto);// Добавляем изображение
            }

            formData.append('id', id + '');
            formData.append('ChannelName', channelName);
            formData.append('Description', channelDescription);
            axios({
                url: "https://localhost:7154/api/ChannelSettings/updateShort",
                method: "PUT",
                headers: {"Content-Type": false},
                data: formData,
            }).then(function () {
                location.reload();
            }).catch(function (error) {
                alert(error.message);
            });

        }
    };
// Функция для открытия окна выбора файла для первого поля
    const handleButtonClick1 = () => {
        if (chBInputRef.current) {
            chBInputRef.current.click();
        }
    };

    const handleButtonClick2 = () => {
        if (profPhInputRef.current) {
            profPhInputRef.current.click();
        }
    };


    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inpId = event.target.id;

        const file = event.target.files?.[0];

        if (inpId == "file1") {
            if (file) {
                setChannelBanner(file);
                setChannelBannerPreview(URL.createObjectURL(file));
            } else setChannelBannerPreview(chBannerPrevOld);
        }

        if (inpId == "file2") {
            if (file) {
                setProfilePhoto(file);
                setProfilePhotoPreview(URL.createObjectURL(file));
            } else setProfilePhotoPreview(profPhotoPrevOld);
        }

    };

    const {t}: { t: ITranslationFunction } = useTranslation();

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="top-7 right-0 flex justify-between sticky  border pb-4 pt-4 bg-white">
                    <div className="flex mr-14 justify-start">
                        <p className="mr-4 text-gray-800 border-b-2 border-gray-800 pb-2">Profile</p>
                        <Link target={'_self'} href={"/channel/editing/channel_setup/hometab"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Tab "main"</Link>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-gray-200 px-4 py-1 rounded">Перейти на канал</button>
                        <button className="bg-gray-200 px-4 py-1 rounded">Отмена</button>
                        <input type="submit" className="bg-blue-500 hover:bg-blue-800 text-white  px-4 py-1 rounded"
                               value="Опубликовать"/>
                    </div>
                </div>
                <div className="w-[62.5rem] h-[12.25rem] shrink-0">
                    <h2 className="text-[#000] font-bold text-[1rem] font-not-italic font-500 leading-normal">Banner</h2>
                    <p className="text-[#000] mt-2 font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">This
                        image is shown at the top channel pages. </p>
                    <div className="flex items-center">
                        <Image src={channelBannerPreview} alt="Banner Image" width={150} height={100}
                               className="w-[6.25rem] h-[6.25rem] shrink-0 rounded-[6.25rem]"/>
                        <div
                            className="w-[56.5rem] h-[8.75rem] shrink-0 rounded-[0.625rem] border-[0.0625rem] border-solid border-[#E6E6E6]">
                            <p className="w-[46.5rem] mt-6 ml-6 text-[#000] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">To
                                make the channel look attractive on
                                all devices We recommend uploading an image of at least 2048 x 1152 pixels. Size
                                file - no more than 6 MB.</p>
                            <input type="file" className="hidden mt-3 ml-6  w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" id="file1"
                                   onChange={handleAvatarChange} ref={chBInputRef}/>
                            <button type="button"
                                className=" mt-3 ml-6 inline-flex text-[#FFF] font-Inter text-[0.93rem] font-not-italic font-500 leading-normal px-[0.9375rem] py-[5px] justify-center items-center gap-[0.625rem] rounded-[0.3125rem] bg-[#0EA2DE]"
                                onClick={handleButtonClick1}>Update channel banner
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-[62.5rem] h-[12.25rem] shrink-0">
                    <h2 className="text-[#000]  font-bold text-[1rem] font-not-italic font-500 leading-normal">Profile
                        photo</h2>
                    <p className="text-[#000] mt-2 font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">The
                        profile photo is shown, for example, next to
                        your video or comments on YouTube.</p>
                    <div className="flex items-center">
                        <Image className="w-[6.25rem] h-[6.25rem] shrink-0 rounded-[6.25rem] " width={180} height={120}
                               src={profilePhotoPreview} alt="Banner Image"/>
                        <div
                            className="w-[56.5rem] h-[8.75rem] shrink-0 rounded-[0.625rem] border-[0.0625rem] border-solid border-[#E6E6E6]">
                            <p className="w-[46.5rem] mt-6 ml-6 text-[#000] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">We
                                recommend using an image
                                At least 98 x 98 pixels in size in PNG or GIF format. Animated pictures
                                upload it is forbidden. File size: no more than 4 MB. Remember that the image
                                must comply with the rules YouTube community. </p>
                            <input type="file" className="hidden mt-3 ml-6 w-full text-sm text-gray-500
        file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white
        hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" id="file2"
                                   onChange={handleAvatarChange} ref={profPhInputRef}/>
                            <button type="button"
                                    className=" mt-3 ml-6 inline-flex text-[#FFF] font-Inter text-[0.93rem] font-not-italic font-500 leading-normal px-[0.9375rem] py-[5px] justify-center items-center gap-[0.625rem] rounded-[0.3125rem] bg-[#0EA2DE]"
                                    onClick={handleButtonClick2}>Update profile picture
                            </button>

                        </div>
                    </div>
                </div>

                <div className="w-[62.5rem] h-[7rem] shrink-0">
                    <h2 className="text-[#000] font-bold text-[1rem] font-not-italic font-500 leading-normal">Channel
                        name</h2>
                    <p className="text-[#000] max-w-[51.5rem] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">Come
                        up with a channel name that will represent
                        you and your content. If you provide a different name or change your profile photo,
                        these changes will will visible only on YouTube and not across all Google services. You can
                        change your name twice within 14 days.</p>
                    <input type="text"
                           className="mt-4 pl-1 w-[51.5rem] h-[3.0625rem] shrink-0 rounded-[0.625rem] border-[0.0625rem] border-gray-400 "
                           value={channelName}
                           onChange={(e) => {
                               setChannelName(e.target.value);
                               setChannelNameValid(validateChannelName(e.target.value));
                           }}/>
                    {!channelNameValid && <span className="span_error">Некорректное название</span>}
                </div>

                <div className="mt-8 w-[62.5rem] h-[7rem] shrink-0">
                    <h2 className="text-[#000] font-bold text-[1rem] font-not-italic font-500 leading-normal">Nickname</h2>
                    <p className="text-[#000] max-w-[51.5rem] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">Create
                        a unique username using letters and numbers.
                        You can return your previous nickname within 14 days. Nicknames can be changed twice
                        every 14 days.</p>
                    <input type="text"
                           className="mt-4 pl-1 w-[51.5rem] h-[3.0625rem] shrink-0 rounded-[0.625rem] border-[0.0625rem] border-gray-400"
                           value={channelNickName} onChange={(e) => {
                        setChannelNickName(e.target.value);
                        setChannelNickNameValid(validateChannelNickName(e.target.value));
                    }}/>
                    {!channelNameValid && <span className="span_error">Некорректное название</span>}
                </div>
                <div className="w-[62.5rem] h-[7rem] shrink-0 mt-8">
                    <h2 className="block font-semibold">Channel description</h2>
                    <textarea className=" w-[51.5rem] mt-2 p-2 border rounded h-24 border-gray-400"
                              value={channelDescription} onChange={(e) => setChannelDescription(e.target.value)}
                              placeholder="Tell your audience about your channel. The description will appear in different sections of YouTube, including the About tab and search results."></textarea>
                </div>
                <div className="w-[62.5rem] h-[7rem] shrink-0  mt-8">
                    <h2 className="block font-semibold">Channel URL</h2>
                    <input type="text" className=" w-[51.5rem] mt-2 p-2 border rounded border-gray-400"
                           value=""/>
                    <br/>
                    <button className="mt-2 text-blue-600 hover:underline">copy</button>
                </div>
                <div className="w-[62.5rem] h-[7rem] shrink-0">
                    <h2 className="block font-semibold">Link</h2>
                    <button className="text-blue-600 hover:underline">Add link</button>
                </div>
                <div className="w-[62.5rem] h-[7rem] shrink-0">
                    <h2 className="block font-semibold">Contact information</h2>
                    <p className="text-sm text-gray-500 mt-1">Indicate how to contact you with questions
                        cooperation. Viewers can see the email address in the 'About' tab.</p>
                    <input type="email" className=" w-[51.5rem] mt-2 p-2 border rounded border-gray-400"
                           placeholder="Email address"/>

                </div>
            </form>
        </>
    )
}

export default ChannelEditBlock;
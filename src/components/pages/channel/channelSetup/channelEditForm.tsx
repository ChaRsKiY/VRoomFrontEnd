"use client"

import React, {useEffect, useState} from 'react'
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

    const [profilePhoto, setProfilePhoto] = useState<File | null>();
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('https://placehold.co/120x80.svg');

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
            const response = await fetch(`https://localhost:7154/api/ChannelSettings/getbyownerid/${userId}`);
            const data: any = await response.json();

            if (data.channelBanner == null) {
                setChannelBannerPreview('https://placehold.co/150x100.svg');
            }

            setId(data.id);
            setChannelBannerPreview(data.channelBanner);
            setProfilePhotoPreview(data.channelPlofilePhoto);
            setChannelName(data.channelName);
            setChannelNameValid(true);
            setChannelDescription(data.description);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                location. reload();
            }).catch(function (error) {
                alert(error);
            });


        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inpId = event.target.id;
        console.log('id=' + inpId);
        const file = event.target.files?.[0];
        if (file) {
            if (inpId == "file1") {
                setChannelBanner(file);
                setChannelBannerPreview(URL.createObjectURL(file));
            }
            if (inpId == "file2") {
                setProfilePhoto(file);
                setProfilePhotoPreview(URL.createObjectURL(file));
            }
        } else {
            if (user) {
                fetchChannel(user.id);
            }
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
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Banner</h2>
                    <p className="text-sm text-gray-600">This image is shown at the top channel pages. </p>
                    <div className="flex items-center">
                        <Image src={channelBannerPreview} alt="Banner Image" width={150} height={100}
                               className="w-35 h-25 bg-gray-200 mr-6 mt-2"/>
                        <div>
                            <p className="text-sm text-gray-600 mt-2">To make the channel look attractive on
                                all devices We recommend uploading an image of at least 2048 x 1152 pixels. Size
                                file - no more than 6 MB.</p>
                            <input type="file" className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" id="file1"
                                   onChange={handleAvatarChange}
                            />{/*Download*/}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Profile photo</h2>
                    <p className="text-sm text-gray-600">The profile photo is shown, for example, next to
                        your video or comments on YouTube.</p>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Image className="w-120 h-100 mx-auto mr-2 rounded-full mt-3" width={180} height={120}
                                   src={profilePhotoPreview} alt="Banner Image"/>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 mt-2">We recommend using an image
                                    At least 98 x 98 pixels in size in PNG or GIF format. Animated pictures
                                    upload it is forbidden. File size: no more than 4 MB. Remember that the image
                                    must
                                    comply with the rules YouTube community. </p>
                                <div className="mt-4 space-x-2">
                                    <input type="file" className="mt-3 block w-full text-sm text-gray-500
        file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white
        hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" id="file2"
                                           onChange={handleAvatarChange}/>{/*Change</button>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Channel name</h2>
                    <p className="text-sm text-gray-600">Come up with a channel name that will represent
                        you and your content. If you provide a different name or change your profile photo,
                        these changes will will visible only on YouTube and not across all Google services. You can
                        change your name twice within 14 days.</p>
                    <input type="text" className="mt-4 p-3 w-full border rounded-lg border-gray-400"
                           value={channelName}
                           onChange={(e) => {
                               setChannelName(e.target.value);
                               setChannelNameValid(validateChannelName(e.target.value));
                           }}/>
                    {!channelNameValid && <span className="span_error">Некорректное название</span>}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Nickname</h2>
                    <p className="text-sm text-gray-600">Create a unique username using letters and numbers.
                        You can return your previous nickname within 14 days. Nicknames can be changed twice
                        every 14 days.</p>
                    <input type="text" className="mt-4 p-3 w-full border rounded-lg border-gray-400"
                           value={channelNickName} onChange={(e) => {
                        setChannelNickName(e.target.value);
                        setChannelNickNameValid(validateChannelNickName(e.target.value));
                    }}/>
                    {!channelNameValid && <span className="span_error">Некорректное название</span>}

                    <div className="mt-6">
                        <label className="block font-semibold">Channel description</label>
                        <textarea className="w-full mt-2 p-2 border rounded h-24 border-gray-400"
                                  value={channelDescription} onChange={(e) => setChannelDescription(e.target.value)}
                                  placeholder="Tell your audience about your channel. The description will appear in different sections of YouTube, including the About tab and search results."></textarea>
                    </div>

                    <div className="mt-3">
                        <label className="block font-semibold">Channel URL</label>
                        <input type="text" className="w-full mt-2 p-2 border rounded border-gray-400"
                               value="" readOnly/>
                        <button className="mt-2 text-blue-600 hover:underline">copy</button>
                    </div>

                    <div>
                        <label className="block font-semibold">link</label>
                        <button className="text-blue-600 hover:underline">+ Add link</button>
                    </div>

                    <div>
                        <label className="block font-semibold">Contact information</label>
                        <p className="text-sm text-gray-500 mt-1">Indicate how to contact you with questions
                            cooperation. Viewers can see the email address in the 'About' tab.</p>
                        <input type="email" className="w-full mt-2 p-2 border rounded border-gray-400"
                               placeholder="Email address"/>
                    </div>

                    {/*<div className="mt-3">
                    <label className="block font-semibold">Channel logo</label>
                    <div className="border p-4 rounded mt-2">
                        <div className="flex items-center justify-center bg-gray-100 h-24 rounded mb-2">
                            <img src="https://placehold.co/150x150" alt="Channel logo placeholder"/>
                        </div>
                        <p className="text-sm text-gray-500">It is recommended to upload an image size of
                            150 x 150 pixels in PNG, GIF, BMP or JPEG format. Animated pictures to download
                            it is forbidden. File size - no more than 1 MB.</p>
                        <button className="mt-2 bg-gray-200 text-black px-4 py-2 rounded">Download</button>
                    </div>
                </div>*/}
                </div>
            </form>
        </>
    )
}

export default ChannelEditBlock;
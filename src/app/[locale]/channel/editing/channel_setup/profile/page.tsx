import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import Image from "next/image";
import Link from "next/link";
import ProfilePhotoBlock from "@/components/pages/channel/channelSetup/profilePhoto";
import ChannelEditBlock from "@/components/pages/channel/channelSetup/channelEditForm";

const channelPage = async ({params: {locale}}) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>

            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden pl-[6.75%] max-sm:pl-0">
                <h1 className="text-2xl font-bold pl-3">Channel settings<br/></h1>

                <div className="flex-1 pt-0 pb-6 pl-6 pr-6">

                    {/*<div className="mb-6"><br/>*/}

                    {/* <div className="flex mt-2">
                            <a href="#" className="mr-4 text-gray-800 border-b-2 border-gray-800 pb-2">Profile</a>
                            <Link target={'_self'} href={"/channel/editing/channel_setup/hometab"}
                                  className="text-gray-500 hover:text-gray-800 pb-2">Tab "main"</Link>
                        </div>*/}

                    {/*<div className="top-7 right-0 flex justify-between sticky  border pb-4 pt-4 bg-white">
                        <div className="flex mr-14 justify-start">
                            <a href="#" className="mr-4 text-gray-800 border-b-2 border-gray-800 pb-2">Profile</a>
                            <Link target={'_self'} href={"/channel/editing/channel_setup/hometab"}
                                  className="text-gray-500 hover:text-gray-800 pb-2">Tab "main"</Link>
                            <button className="text-gray-600 border-b-2 border-black mr-4">Профиль</button>
                                <button className="text-gray-600 hover:text-gray-800">Вкладка "Главная"</button>
                        </div>
                        <div className="flex space-x-4">
                            <button className="bg-gray-200 px-4 py-1 rounded">Перейти на канал</button>
                            <button className="bg-gray-200 px-4 py-1 rounded">Отмена</button>
                            <button className="bg-blue-200 text-white px-4 py-1 rounded">Опубликовать</button>
                        </div>
                    </div>*/}
                    {/*</div>*/}
                    <ChannelEditBlock/>
                    {/*<div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Banner</h2>
                        <p className="text-sm text-gray-600">This image is shown at the top channel pages. </p>
                        <div className="flex items-center">
                            <img src="https://placehold.co/150x100" alt="Banner Image"
                                 className="w-35 h-25 bg-gray-200 mr-6"/>
                            <div>
                                <p className="text-sm text-gray-600 mt-2">To make the channel look attractive on
                                    all devices We recommend uploading an image of at least 2048 x 1152 pixels. Size
                                    file - no more than 6 MB.</p>
                                <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded">Download
                                </button>
                            </div>
                        </div>
                    </div>
                    <ProfilePhotoBlock/>*/}
                    {/*<div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Profile photo</h2>

                        <div className="flex items-center">
                            <img className="w-32 h-20 bg-gray-200 mr-6" src="https://placehold.co/80x80" width={80}
                                 height={80} alt="Avatar"/>
                            <div>
                                <p className="text-sm text-gray-600">The profile photo is shown, for example, next to
                                    your video or
                                    comments on YouTube.</p>
                                <p className="text-sm text-gray-600 mt-2">We recommend using an image
                                    At least 98 x 98 pixels in size in PNG or GIF format. Animated pictures
                                    upload
                                    it is forbidden. File size: no more than 4 MB. Remember that the image must
                                    comply with the rules
                                    YouTube community.
                                </p>
                                <div className="mt-4 space-x-2">
                                    <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">Change
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">delete</button>
                                </div>
                            </div>
                        </div>
                    </div>*/}

                    {/*<div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Channel name</h2>
                        <p className="text-sm text-gray-600">Come up with a channel name that will represent
                            you and your content. If you provide a different name or change your profile photo,
                            these changes will will visible only on YouTube and not across all Google services. You can
                            change your name twice within 14 days.</p>
                        <input type="text" className="mt-4 p-3 w-full border rounded-lg border-gray-400" value=""/>
                    </div>*/}

                    {/*<div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Nickname</h2>
                        <p className="text-sm text-gray-600">Create a unique username using letters and numbers.
                            You can return your previous nickname within 14 days. Nicknames can be changed twice
                            every 14 days.</p>
                        <input type="text" className="mt-4 p-3 w-full border rounded-lg border-gray-400"/>

                        <div>
                            <label className="block font-semibold">Channel description</label>
                            <textarea className="w-full mt-2 p-2 border rounded h-24 border-gray-400"
                                      placeholder="Tell your audience about your channel. The description will appear in different sections of YouTube, including the About tab and search results."></textarea>
                        </div>

                        <div>
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
                        <div>
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
                        </div>
                    </div>*/}
                </div>
            </div>
        </>
    );
}
export default channelPage;
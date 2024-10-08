"use client";

import { useEffect, useState } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import { FC } from 'react';
import "@/app/[locale]/channel/uploadvideo/style.css";
import initTranslations from "@/app/i18n";
import { useRouter } from 'next/navigation';

interface IHomeProps {
    params: {
        locale: string;
    };
}


const VideoDetail: FC<IHomeProps> = ({ params: { locale } }) => {
    const router = useRouter();
    const [t, setT] = useState<any>(null); 
    const [loading, setLoading] = useState(true); 

    // Video metadata states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoCategory, setVideoCategory] = useState('people_and_blogs');
    const [isForKids, setIsForKids] = useState(false);
    const [isAgeRestricted, setIsAgeRestricted] = useState(false);
    const [fileURL, setFileURL] = useState<string | null>(null); 

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setter(e.target.value);
    };

    const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setter(e.target.files[0]);
        }
    };

    const handleBooleanChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value === 'yes');
    };

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const { t } = await initTranslations(locale, ['common', 'categories']);
                setT(() => t);
            } catch (error) {
                console.error('Error loading translations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTranslations();
    }, [locale]);

    useEffect(() => {
        const storedFileURL = sessionStorage.getItem('fileURL');
        if (storedFileURL) {
            setFileURL(storedFileURL); 
        }
    }, []);

    interface VideoData {
        id: number;
        objectID: number;
        channelSettingsId: number;
        tittle: string;
        description: string;
        uploadDate: string;
        duration: number;
        videoUrl: string;
        viewCount: number;
        likeCount: number;
        dislikeCount: number;
        isShort: boolean;
        cover: string;
        lastViewedPosition: string;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!videoFile) {
            alert(t?.common?.upload_video); 
            return;
        }
    
        const videoData: VideoData = {
            id: 0,
            objectID: 1,
            channelSettingsId: 4,
            tittle: title,
            description: description,
            uploadDate: new Date().toISOString(),
            duration: 55,
            videoUrl: "none", 
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            isShort: false,
            cover: thumbnail ? URL.createObjectURL(thumbnail) : "",
            lastViewedPosition: "11",
        };
    
        try {
            const formData = new FormData();
            formData.append('file', videoFile); 

            (Object.keys(videoData) as (keyof VideoData)[]).forEach(key => {
                const value = videoData[key];
        
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value)); 
                } else if (typeof value === 'boolean') {
                    formData.append(key, value.toString()); 
                } else {
                    formData.append(key, String(value)); 
                }
            });

            const videoUploadResponse = await fetch('https://localhost:7154/api/Video/add', {
                method: 'POST',
                body: formData,
            });
    
            if (videoUploadResponse.ok) {
                const result = await videoUploadResponse.json();
                console.log('Video uploaded successfully', result);
                router.push('/video/edit'); 
            } else {
                console.error('Failed to upload video', await videoUploadResponse.text());
            }
        } catch (error) {
            console.error('Error occurred during upload:', error);
        }
    };

    if (loading) {
        return <div>Loading translations...</div>;
    }

    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
                <main className="pl-[25%] ml-[-5%] max-lg:pl-[10%] max-sm:pl-0">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold mb-6">Video Upload</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={title}
                                    onChange={handleInputChange(setTitle)}
                                    placeholder="Enter your title..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    rows={8}
                                    value={description}
                                    onChange={handleInputChange(setDescription)}
                                    placeholder="Enter your description..."
                                />
                            </div>

                            {/* Visibility */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Visibility</label>
                                <select
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    value={visibility}
                                    onChange={handleInputChange(setVisibility)}
                                >
                                    <option value="private">Private</option>
                                    <option value="unlisted">Unlisted</option>
                                    <option value="public">Public</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Choose a Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange(setVideoFile)}
                                    className="border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Choose a Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange(setThumbnail)}
                                    className="border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                <select
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                    value={videoCategory}
                                    onChange={handleInputChange(setVideoCategory)}
                                >
                                    <option value="people_and_blogs">People & Blogs</option>
                                    <option value="education">Education</option>
                                    <option value="entertainment">Entertainment</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Is this video for kids?</label>
                                <div className="flex">
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            name="kids"
                                            value="yes"
                                            checked={isForKids}
                                            onChange={handleBooleanChange(setIsForKids)}
                                            className="mr-2"
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="kids"
                                            value="no"
                                            checked={!isForKids}
                                            onChange={handleBooleanChange(setIsForKids)}
                                            className="mr-2"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Age Restriction</label>
                                <div className="flex">
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            name="ageRestriction"
                                            value="true"
                                            checked={isAgeRestricted}
                                            onChange={handleBooleanChange(setIsAgeRestricted)}
                                            className="mr-2"
                                        />
                                        Yes, restrict to viewers over 18
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="ageRestriction"
                                            value="false"
                                            checked={!isAgeRestricted}
                                            onChange={handleBooleanChange(setIsAgeRestricted)}
                                            className="mr-2"
                                        />
                                        No, don't restrict
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="bg-green-500 text-white rounded-md px-4 py-2">
                                Save
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default VideoDetail;



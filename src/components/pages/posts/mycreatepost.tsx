'use client'

import React from 'react'
import Image from "next/image";
import {FaImage, FaVideo, FaVoteYea} from 'react-icons/fa';
import {useEffect, useState, useRef} from 'react';
import {buttonCancelStyles} from '@/styles/buttonstyles/buttonCancelStyles';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import {IPost} from "@/types/post.interface";
import PostList from "@/components/pages/posts/posts";
import {IChannel} from "@/types/channelinfo.interface"
import {useUser} from '@clerk/nextjs';
import {IVideo} from '@/types/videoinfo.interface';
import {FaEye} from 'react-icons/fa';
import api from '@/services/axiosApi';
import '@/styles/modalsubtitles.css';


const CreatePost: React.FC = () => {
    // const idTest=1;
    const {t}: { t: ITranslationFunction } = useTranslation()

    const [lineColor, setLineColor] = useState('lightgray');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [text, setText] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [isHovered5, setIsHovered5] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileImageRef = useRef<HTMLInputElement | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null); // Состояние для ссылки на видео
    const fileVideoRef = useRef<HTMLInputElement | null>(null);
    const [display, setDisplay] = useState('none');
    const [display2, setDisplay2] = useState('block');
    const [display1, setDisplay1] = useState('none');
    const [display3, setDisplay3] = useState('block');
    const [display4, setDisplay4] = useState('none');
    const [display5, setDisplay5] = useState('none');
    const [displayVideoMenu, setDisplayVideoMenu] = useState('none');
    const [postOwner, setPostOwner] = useState<IChannel | null>(null);
    const [videoPost, setVideoPost] = useState<IVideo | null>(null);
    const {user} = useUser();
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']); // Изначально два пустых варианта для опроса
    const [postType, setPostType] = useState<'text' | 'poll' | 'vote'>('text'); // Тип поста
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const findOwner = async (id: string) => {
        try {

            const response = await api.get('/ChannelSettings/getbyownerid/' + id);

            if (response.status === 200) {
                const data: IChannel = await response.data;
                setPostOwner(data);
            } else {
                console.error('Ошибка при получении пользователя:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));

        }
    };
    const handleVideoLinkChange = (value: string) => {

        setLink(value);
    };

    const previewVideoLink = () => {
        getVideobyLink(link);
    }

    const getVideobyLink = async (link2: string) => {
        const url = encodeURIComponent(link2);
        try {
            const response = await api.get('/Video/getvideoinfobyvideourl/' + url);

            if (response.status === 200) {
                const data: IVideo = await response.data;
                setVideoPost(data);
            } else {
                console.error('Ошибка при получении video:', response.statusText);
            }

        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }

    }


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

        setText(event.target.value);
        autoResize();
    };


    const handleFocus = () => {
        setLineColor('black');
    };

    const handleBlur = () => {
        setLineColor('lightgray');
    };

    const addImage = () => {
        setDisplay('block');
        setDisplayVideoMenu('none');
        setDisplay3('none');
    };
    const addVideo = () => {
        setDisplay1('block');
        setDisplayVideoMenu('none');
        setDisplay2('none');
    };
    const addVideoLink = () => {
        setDisplay4('block');
        setDisplayVideoMenu('none');
        setDisplay2('none');
    };

    const openVideoMenu = () => {
        if (displayVideoMenu === 'none' && display4 === 'block') {
            setDisplayVideoMenu('block');
            setDisplay4('none');
        } else if (displayVideoMenu === 'block') {
            setDisplayVideoMenu('none');
            if (display4 === 'none')
                setDisplay2('block');
        } else if (displayVideoMenu === 'none' && display1 === 'block') {
            setDisplay1('none');
            setDisplay2('block');
            setDisplay3('block');
        } else {
            setDisplayVideoMenu('block');
            setDisplay2('none');
        }
    };
    const closeMenuVideo = () => {
        setDisplayVideoMenu('none');
        setDisplay3('block');
        setDisplay2('block');
    };

    useEffect(() => {
        if (user) {
            setLineColor('lightgray');
            findOwner(user.id);
        }
    }, [user]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleCancelImg = () => {
        setImage(null);
        setImagePreview('');
        if (fileImageRef.current) {
            fileImageRef.current.value = '';
        }
        setDisplay('none');
        setDisplay2('block');
        setDisplay3('block');
    };
    const handleCancelVideo = () => {
        setDisplay2('block');
        setVideo(null);
        setVideoPreview(null);
        if (videoPost != null) {
            setVideoPost(null);
            setLink('');
        } else {
            setDisplay4('none');
        }
        if (fileVideoRef.current) {
            fileVideoRef.current.value = '';
        }
        setDisplay1('none');
        setDisplay3('block');
    };

    const handleAddOption = () => setPollOptions([...pollOptions, '']);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleSubmit2 = async () => {
        if (text != '') {
            if (postType === 'poll' || postType === 'vote') {
                const op = pollOptions.filter(option => option.trim() !== '');
                const joinedOptions = op.join(', ');
                const formData = new FormData();
                formData.append('text', text);
                formData.append('id', postOwner?.id + '');
                formData.append('type', 'vote');
                formData.append('options', joinedOptions)
                if (image) formData.append('img', image);
                if (video) formData.append('video', video);
                const r = video?.size
                const res = await api.post('/Post/add', formData);

                if (res.status === 200) {
                } else {
                    alert('Ошибка при сохранении данных');
                    alert(res.statusText);
                }
            } else {
                const formData = new FormData();
                formData.append('text', text);
                formData.append('id', postOwner?.id + '');
                console.log("formdata", formData)
                if (videoPost != null) {
                    formData.append('type', 'videolink');
                    formData.append('videolink', link);
                } else
                    formData.append('type', 'text');
                if (image) formData.append('img', image);
                if (video) formData.append('video', video);
                const res = await api.post('/Post/add', formData);

                if (res.status === 200) {
                   // alert('Данные успешно сохранены');
                    handleCancelImg();
                    handleCancelVideo();
                    setText('');
                } else {
                    alert('Ошибка при сохранении данных regular-post');
                    alert(res.statusText);
                }
            }
        } else {
            alert('Add a post description! Text field cannot be empty !')
        }
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div>
            <div className={'mt-3'}>

                <div className="w-full  ">
                    <div className="w-3/4 px-8"
                         style={{border: '2px solid rgba(0, 128, 0, 0.5)', padding: '10px', borderRadius: '5px'}}>

                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <small style={{textAlign: 'center', color: 'grey', fontWeight: 'bold'}}>Select post
                                type:</small>
                            <select value={postType}
                                    onChange={(e) => setPostType(e.target.value as 'text' | 'poll' | 'vote')}
                                    style={{
                                        padding: '10px'
                                    }}>
                                <option value="text">Regular post</option>
                                <option value="vote">Post-voting</option>

                            </select>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleChange}
                            placeholder="Enter the text"
                            style={{
                                border: "none",
                                borderBottom: "2px solid gray",
                                outline: "none",
                                width: "100%",
                                resize: "none",
                                overflow: "hidden",
                                padding: "5px",
                                minHeight: "30px",
                                boxSizing: "border-box",
                            }}
                        />


                        {postType === 'vote' && (
                            <div>
                                <small style={{color: 'grey', fontWeight: 'bold'}}>Add vote options:</small>
                                {pollOptions.map((option, index) => (
                                    <div key={index} style={{display: 'flex', marginBottom: '5px'}}>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            style={{
                                                flex: 1,
                                                padding: '5px',
                                                border: '1px solid lightgray',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </div>
                                ))}
                                <button onClick={handleAddOption} style={{marginTop: '5px'}}>
                                    Add an option
                                </button>
                            </div>
                        )}

                        {postType === 'text' && (
                            <div className=" w-full ">

                                <div className='flex' style={{justifyContent: 'space-around'}}>
                                    <div onClick={addImage} style={{display: display2}}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="max-sm:hidden">
                                                    <FaImage size={40} color="grey"/>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>add image</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div style={{
                                        border: '2px solid gray',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        margin: '10px',
                                        display
                                    }}>
                                        <label>Add image:</label>
                                        {imagePreview != '' && (
                                            <Image src={imagePreview} alt="Banner Image" width={200} height={150}
                                                   className="w-35 h-25 bg-gray-200 mr-6 mt-2"/>)}
                                        <div>
                                            <input type="file" ref={fileImageRef}
                                                   className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-[#087ba6] file:text-white hover:file:bg-[#0ea2de] file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
                                                   onChange={handleImageChange}
                                            />
                                            <button onClick={handleCancelImg} className='modal-button'
                                                    style={{
                                                        borderRadius: '6px',
                                                        paddingLeft: '25px',
                                                        paddingRight: '30px',
                                                        paddingBottom: '6px',
                                                        marginLeft: "2px"
                                                    }}>Cancel
                                            </button>
                                        </div>
                                    </div>
                                    <div onClick={openVideoMenu} style={{display: display3}}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="max-sm:hidden">

                                                    <FaVideo size={40} color="grey"/>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>add video or video-link</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div style={{display: display4}}>
                                        <input type='text' name='videolink'
                                               value={link}
                                               onChange={(e) => handleVideoLinkChange(e.target.value)}
                                               placeholder={`video-link`}
                                               style={{
                                                   flex: 1,
                                                   padding: '5px',
                                                   border: '1px solid lightgray',
                                                   borderRadius: '5px',
                                                   minWidth: '300px'
                                               }}></input>
                                        <button onClick={previewVideoLink} style={{padding: '10px'}}>
                                            <FaEye style={{display: 'inline'}}/><small>&nbsp;Preview</small></button>
                                        <button onClick={handleCancelVideo} title='Cancel'
                                                style={{padding: '10px'}}>X
                                        </button>
                                        {videoPost ? (
                                            <div className="mt-4">
                                                <video controls width="400" autoPlay muted loop>
                                                    <source src={videoPost?.videoUrl} type="video/mp4"/>
                                                    Ваш браузер не поддерживает просмотр видео.
                                                </video>


                                            </div>
                                        ) : <></>}
                                    </div>
                                    <div style={{display: displayVideoMenu}}>
                                        <div style={{display: 'flex'}}>
                                            <div>
                                                <div onClick={addVideoLink} className='modal-button'>
                                                    <p>Add the video-link</p></div>
                                                <div onClick={addVideo} className='modal-button'>
                                                    <p>Upload new video</p></div>
                                            </div>
                                            <div>
                                                <button
                                                    style={{paddingRight: '10px', color: 'gray', fontWeight: "bold"}}
                                                    onClick={closeMenuVideo}
                                                    title='Close'>
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        border: '2px solid gray',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        display: display1
                                    }}>
                                        <label>Add video:</label>

                                        {videoPreview && (
                                            <div className="mt-4">
                                                <video controls width="400" autoPlay muted loop>
                                                    <source src={videoPreview} type="video/mp4"/>
                                                    Ваш браузер не поддерживает просмотр видео.
                                                </video>

                                            </div>
                                        )}

                                        <input type="file" ref={fileVideoRef}
                                               className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-[#087ba6] file:text-white hover:file:bg-[#0ea2de] file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"

                                               onChange={handleVideoChange}
                                        />

                                        <button onClick={handleCancelVideo} className='modal-button'
                                                style={{
                                                    borderRadius: '6px',
                                                    paddingLeft: '25px',
                                                    paddingRight: '30px',
                                                    paddingBottom: '6px',
                                                    marginLeft: "2px"
                                                }}>
                                            Cancel
                                        </button>
                                    </div>

                                </div>

                            </div>

                        )}

                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <button onClick={handleSubmit2} className='modal-button'>
                                Publish
                            </button>
                        </div>
                    </div>


                </div>

            </div>

            {postOwner && (
                <div>
                    <PostList channelId={postOwner.id}/>
                </div>
            )}
        </div>
    );
};

export default CreatePost;
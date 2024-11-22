'use client'
import {useEffect, useState} from 'react';
import {useUser} from '@clerk/nextjs';
import Link from "next/link";
import {FaSmile} from 'react-icons/fa';
import React, {useRef} from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface'
import {IUser} from '@/types/user.interface';
import {buttonSubmitStyles} from '@/styles/buttonstyles/buttonSubmitStyles';
import {buttonCancelStyles} from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';
import {buttonCancelLowPaddingStyles} from "@/styles/buttonstyles/buttonCancelLowPaddingStyles";
import Image from "next/image";

interface ShortsMyCommentProps {
    videoId: number;
    amuser: IUser;
}

const ShortsMyComment: React.FC<ShortsMyCommentProps> = ({videoId, amuser}) => {

    const [avatarUrl, setAvatarUrl] = useState('');
    const [fullName, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [display, setDisplay] = useState('');
    const [display2, setDisplay2] = useState('');
    const [displayMain, setDisplayMain] = useState('block');
    const [write, setWrite] = useState('Write a comment...');
    const [inputValue, setInputValue] = useState('');
    const [lineColor, setLineColor] = useState('lightgray');
    const [isHovered, setIsHovered] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [videoid, setVideoId] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const textAreaRef2 = useRef<HTMLTextAreaElement | null>(null);


    const handleFocus = () => {
        setLineColor('black');
    };

    const handleBlur = () => {
        setLineColor('lightgray');
    };

    // const handleChange2 = () => {
    //   const value = textAreaRef2.current?.value || '';  
    //   setInputValue(value);
    //   if (value === '') {
    //     setDisabled(true);
    //   } else {
    //     setDisabled(false);
    //   }
    // };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        if (inputValue == '' || event.target.value == '')
            setDisabled(true);
        else
            setDisabled(false);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.stopPropagation();

        setInputValue(event.target.value);
        if (inputValue == '' || event.target.value == '')
            setDisabled(true);
        else
            setDisabled(false);
    };

    const handleSubmit = async () => {

        const comment: ICommentVideo = {
            id: 0,
            userId: userId,
            videoId: videoid,
            channelBanner: avatarUrl,
            comment: inputValue,
            date: new Date(),
            likeCount: 0,
            dislikeCount: 0,
            isPinned: false,
            isEdited: false,
            userName: fullName
        };
        try {
            const response = await api.post('/CommentVideo/add', comment, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setWrite('comment sent successfully, write new here');
                setInputValue('');
                setDisplay('none');
                setDisplay2('block');
                const data = await response.data;
                console.log('Комментарий успешно отправлен:', data);


            } else {
                setWrite('error sending');
                console.error('Ошибка при отправке комментария:', response.statusText);
            }
        } catch (error) {
            setWrite('error sending');
            console.error('Ошибка при подключении к серверу:', error);
        }
    };


    const handleCancel = () => {
        setInputValue('');
        setDisplay('none');
        setDisplay2('block');
        setWrite('Write a comment...');
    };

    const toWrite = () => {
        setDisplay('block');
        setDisplay2('none');
        setTimeout(() => {
            inputRef.current?.focus(); // Переводим фокус на input
        }, 0);
    };

    useEffect(() => {
        try {
            if (amuser) {
                setVideoId(videoId);
                setDisplay('none');
                setDisplay2('block');
                setWrite('Write a comment...');
                setUserId(amuser.clerk_Id);
                setAvatarUrl(amuser.channelProfilePhoto);
                setName(amuser.channelName);
            } else {
                setDisplayMain('none');
            }

        } catch (error) {
            console.error('???Ошибка при получении профиля пользователя:', error);
        }

    }, [videoId, amuser]);


    return (
        <div style={{display: displayMain}} className={'absolute right-0 left-0 bg-white'}>
            <div style={{display}}>
                You are writing a comment in account:
            </div>
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>

                {avatarUrl ? (
                    <Image width={24} height={24}
                           src={avatarUrl}
                           alt="User Avatar"
                           style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px'}}
                    />
                ) : (
                    <p>Аватарка не найдена</p>
                )}
                <span style={{display, fontWeight: 'bolder'}}>{fullName}&nbsp;&nbsp;</span>
                <div onClick={toWrite} style={{
                    display: display2, width: '100%', border: 'none', background: 'lightgray',
                    padding: '5px', borderBottom: `2px solid ${lineColor}`, borderRadius: '10px'
                }}>
                    <span> {write}</span>
                </div>
            </div>
            <div style={{display}}>
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={inputRef}
                        style={{
                            border: 'none',
                            borderBottom: `2px solid ${lineColor}`,
                            outline: 'none',
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginTop: '10px',
                        }}
                    />

                </div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '5px'}}>

                    <div className={'mt-1.5'}>
                        <button onClick={handleCancel}
                                style={isHovered ? {...buttonCancelLowPaddingStyles.baseplus, ...buttonCancelLowPaddingStyles.hover} : buttonCancelLowPaddingStyles.baseplus}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}>Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={disabled}
                                style={!disabled ? {...buttonSubmitStyles.baselowpadding} : buttonSubmitStyles.disablowpadding}>Send
                            Comment
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default ShortsMyComment;



    
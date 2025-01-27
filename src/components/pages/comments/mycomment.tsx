'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from "next/link";
import { FaSmile } from 'react-icons/fa';
import React, { useRef } from 'react';
import { ICommentVideo } from '@/types/commentvideo.interface'
import { IUser } from '@/types/user.interface';
import { buttonSubmitStyles } from '@/styles/buttonstyles/buttonSubmitStyles';
import { buttonCancelStyles } from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MyCommentProps {
    videoId: number;
    amuser: IUser;
}

const MyComment: React.FC<MyCommentProps> = ({ videoId, amuser }) => {

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const handleFocus = () => {
        setLineColor('black');
    };

    const handleBlur = () => {
        setLineColor('lightgray');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setDisabled(event.target.value.trim() === "");
    };

    const handleEmojiClick = (emoji: EmojiClickData) => {
        setInputValue((prev) => prev + emoji.emoji);
        setDisabled(false); // Активируем кнопку, если добавлен смайлик
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
            const response = await api.post('/CommentVideo/add', comment);
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
            inputRef.current?.focus();
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
        <div style={{ display: displayMain }}>
            <div style={{ display }}>
                You are writing a comment in account:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                    />
                ) : (
                    <p>Аватарка не найдена</p>
                )}
                <span style={{ display, fontWeight: 'bolder' }}>{fullName}&nbsp;&nbsp;</span>
                <div onClick={toWrite} style={{
                    display: display2, width: '100%', border: 'none', background: 'lightgray',
                    padding: '5px', borderBottom: `2px solid ${lineColor}`, borderRadius: '10px'
                }}>
                    <span> {write}</span>
                </div>
            </div>
            <div style={{ display }}>
                <div style={{ position: "relative" }}>
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
                            marginLeft: '50px',

                        }}
                    />
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ margin: '5px', marginLeft: '50px', position: "relative" }}>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}  >
                                <FaSmile size={25} color="lightgray" />
                            </button>
                            {showEmojiPicker && (
                                <div style={{ position: "absolute", top: "5px", left: "50px", zIndex: 10 }}>
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <div style={{ fontSize: '11px', paddingTop: '5px', marginBottom: '-5px' }}>By sending a
                                comment, you agree to
                            </div>
                            <Link href="/terms" passHref target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'blue', fontSize: '11px' }}>
                                VRoom's Terms of Service.</Link>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div>
                        <button onClick={handleCancel}
                            style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={disabled}
                            style={!disabled ? { ...buttonSubmitStyles.base } : buttonSubmitStyles.disab}>Send Comment
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default MyComment;



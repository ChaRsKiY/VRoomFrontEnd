'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import React, { useRef } from 'react';
import { IAnswerCommentPost } from '@/types//answercommentpost.interface';
import { IUser } from '@/types/user.interface';
import { buttonSubmitStyles } from '@/styles/buttonstyles/buttonSubmitStyles';
import { buttonCancelStyles } from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';
import { FaSmile } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface AnsCommentProps {
  commentId: number;
  onCancel: () => void;
}

const MyAnswerCommentPost: React.FC<AnsCommentProps> = ({ commentId, onCancel }) => {

  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [display, setDisplay] = useState('');
  const [display2, setDisplay2] = useState('');
  const [displayMain, setDisplayMain] = useState('block');
  const [inputValue, setInputValue] = useState('');
  const [lineColor, setLineColor] = useState('lightgray');
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [comid, setCommentId] = useState(0);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const { user } = useUser();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getUser = async () => {

    try {
      if (user) {
        const response = await api.get('/ChannelSettings/getinfochannel/' + user?.id);

        if (response.status === 200) {
          const data: IUser = await response.data;
          setUser(data);
          setUserId(data.clerk_Id);
          setAvatarUrl(data.channelProfilePhoto);
          setName(data.channelName);

        } else {
          console.error('Ошибка при получении пользователя:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

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

    const answer: IAnswerCommentPost = {
      id: 0,
      userId: userId,
      commentPost_Id: comid,
      channelBanner: avatarUrl,
      text: inputValue,
      answerDate: new Date(),
      likeCount: 0,
      dislikeCount: 0,
      isEdited: false,
      userName: fullName
    };
    try {
      const response = await api.post('/AnswerPost/add', answer, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status == 200) {

        setInputValue('');
        setDisplay('none');
        const data = await response.data;

      } else {
        console.error('Ошибка при отправке комментария:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }

  };

  const handleCancel = () => {
    setInputValue('');
    onCancel();
  };


  useEffect(() => {
    setCommentId(commentId);
    getUser();
    setTimeout(() => {
      inputRef2.current?.focus(); // Переводим фокус на input
    }, 0);
  }, [commentId]);



  return (

    <div style={{ display }} >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginLeft: '100px' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            style={{ width: '25px', height: '25px', borderRadius: '50%', marginRight: '10px' }}
          />
        ) : (
          <p>Аватарка не найдена</p>
        )}
        <span style={{ fontWeight: 'bolder', fontSize: '12pxs' }}>{fullName}&nbsp;&nbsp;</span>

      </div>
      <div >
        <div style={{ paddingLeft: '50px' }}>
          <div >
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef2}
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
          </div></div>

        <div style={{ display: 'flex', width: '100%', fontSize: '12px', marginLeft: '100px' }}>
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
          <button onClick={handleSubmit} disabled={disabled} style={!disabled ? { ...buttonSubmitStyles.base } : buttonSubmitStyles.disab}>Answer</button>
          <button onClick={handleCancel} style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>Cancel</button>

        </div>
      </div>

    </div>
  );
};



export default MyAnswerCommentPost;
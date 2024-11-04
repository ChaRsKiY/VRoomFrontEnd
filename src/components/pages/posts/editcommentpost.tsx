'use client'
import { useEffect, useState } from 'react';
import React, { useRef } from 'react';
import { ICommentPost } from '@/types/commentpost.interface';
import { buttonSubmitStyles } from '@/styles/buttonstyles/buttonSubmitStyles';
import { buttonCancelStyles } from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';

interface MyCommentProps {
  comment: ICommentPost;
  onClose: () => void;
}

const EditCommentPost: React.FC<MyCommentProps> = ({ comment, onClose }) => {

  const [inputValue, setInputValue] = useState(comment.comment);
  const [lineColor, setLineColor] = useState('lightgray');
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [com, setComment] = useState<ICommentPost>();


  const handleFocus = () => {
    setLineColor('black');
  };

  const handleBlur = () => {
    setLineColor('lightgray');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (inputValue == '' || event.target.value == '')
      setDisabled(true);
    else
      setDisabled(false);
  };

  const handleSubmit = async () => {
    if (com != null) {
      const comment2: ICommentPost = {

        id: com?.id,
        userId: com?.userId,
        postId: com?.postId,
        channelBanner: com?.channelBanner,
        comment: inputValue,
        date: com?.date,
        likeCount: com?.likeCount,
        dislikeCount: com?.dislikeCount,
        isPinned: com?.isPinned,
        isEdited: true,
        userName: com?.userName
      };
      try {
        const response = await api.put('/CommentPost/update', comment2, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          onClose();
          const data = await response.data;
          console.log('Комментарий успешно изменен:', data);
        } else {
          console.error('Ошибка при отправке комментария:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus(); // Переводим фокус на input
    }, 0);
    setComment(comment);
  }, [comment]);



  return (
    <div  >


      <div >
        <div >
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
              paddingLeft: '10px',

            }}
          />


        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>

          <div >
            <button onClick={onClose} style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>Cancel</button>
            <button onClick={handleSubmit} disabled={disabled} style={!disabled ? { ...buttonSubmitStyles.base } : buttonSubmitStyles.disab}>Edit Comment</button>
          </div>
        </div>
      </div>

    </div>
  );
};



export default EditCommentPost;
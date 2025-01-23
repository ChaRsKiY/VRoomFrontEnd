'use client'
import {useEffect, useState} from 'react';
import React, {useRef} from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface';
import {buttonSubmitStyles} from '@/styles/buttonstyles/buttonSubmitStyles';
import {buttonCancelStyles} from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';

interface MyCommentProps {
    commentId: number;
    onClose: () => void;
}

const DeleteComment: React.FC<MyCommentProps> = ({commentId, onClose}) => {

    const [comment_Id, setComment_Id] = useState(commentId);
    const [lineColor, setLineColor] = useState('lightgray');
    const [isHovered, setIsHovered] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);


    const handleFocus = () => {
        setLineColor('black');
    };

    const handleBlur = () => {
        setLineColor('lightgray');
    };

    const handleSubmit = async () => {

        try {
            const response = await api.delete('/CommentVideo/' + comment_Id);

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
    };


    return (
        <div>

            <div>
                <div>
                    <p className={'text-lg px-1.5 text-center font-bold'}>
                    Are you sure you want to delete this comment and its replies?
                    </p>
                </div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>

                    <div>
                        <button onClick={onClose}
                                style={isHovered ? {...buttonCancelStyles.base, ...buttonCancelStyles.hover} : buttonCancelStyles.base}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}>Cancel
                        </button>
                        <button onClick={handleSubmit}
                                style={!isHovered ? {...buttonSubmitStyles.base, ...buttonSubmitStyles.hover} : buttonSubmitStyles.base}>Delete
                            Comment
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default DeleteComment;


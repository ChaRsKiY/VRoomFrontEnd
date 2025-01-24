'use client'

import {useEffect, useState} from 'react';
import React, {useRef} from 'react';
import {IAnswerCommentVideo} from '@/types/answercommentvideo.interface';
import {buttonSubmitStyles} from '@/styles/buttonstyles/buttonSubmitStyles';
import {buttonCancelStyles} from '@/styles/buttonstyles/buttonCancelStyles';
import api from '@/services/axiosApi';
import {a} from "@react-spring/web";

interface MyCommentProps {
    answerId: number;
    onClose: () => void;
}

const DeleteAnswer: React.FC<MyCommentProps> = ({answerId, onClose}) => {

    const [answer_Id, setAnswer_Id] = useState(answerId);
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
            const response = await api.delete('/AnswerVideo/' + answer_Id);

            if (response.status === 200) {
                onClose();
                console.log('Комментарий успешно изменен:', response.data);
            } else {
                console.error('Ошибка при отправке комментария:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }

    };

    // useEffect(() => {
    //     setAnswer_Id(answerId);
    // }, [answerId]);


    return (
        <div>


            <div>
                <div>
                    <p className={'text-lg px-1.5 text-center font-bold'}>
                        Are you sure you want to delete this reply to the comment?
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


export default DeleteAnswer;

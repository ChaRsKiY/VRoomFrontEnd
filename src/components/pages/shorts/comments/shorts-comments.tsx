'use client'
import React from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface';
import {useEffect, useState} from 'react';
import Link from "next/link";
import {SlDislike, SlLike} from "react-icons/sl";
import {useUser} from '@clerk/nextjs';
import {FiCornerDownRight} from 'react-icons/fi';
import {FiFlag} from 'react-icons/fi';
import MyAnswerComment from '@/components/pages/comments/myanswercomment'
import {formatTimeAgo} from "@/utils/format";
import {useRef} from 'react';
import {IUser} from '@/types/user.interface';
import AnswersComments from './answers-short-comment';
import {IAnswerCommentVideo} from '@/types/answercommentvideo.interface';
import {MdMoreVert} from 'react-icons/md';
import RadioButtonList from '@/components/pages/comments/report';
import EditComment from '@/components/pages/comments/editcomment';
import {FaThumbtack} from 'react-icons/fa';
import {MdPushPin} from 'react-icons/md';
import {ISimpleUser} from '@/types/simpleuser.interface';
import {FaPen} from 'react-icons/fa';
import MyAnswersShortComment from "@/components/pages/shorts/comments/my-answers-short-comment";
import AnswersShortsComments from "./answers-short-comment";
import api from '@/services/axiosApi';
import {RiDeleteBinLine} from "react-icons/ri";
import DeleteComment from "@/components/pages/comments/deletecomment";

interface ShortsCommentsProps {
    comments: ICommentVideo[];
    answers: { [key: number]: IAnswerCommentVideo[] };
    id: number;
}


const ShortsComments: React.FC<ShortsCommentsProps> = ({comments, answers, id}) => {

    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
    const {user} = useUser();
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
    const [lineColor, setLineColor] = useState('lightgray');
    const [isExpanded, setIsExpanded] = useState(false); // Состояние для управления раскрытием поля
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(comments.length).fill(false));
    const [rows, setRows] = useState(1);
    // const [iAmUser, setUser] = useState<IUser | null>(null);
    const [videoOwner, setVideoOwner] = useState<ISimpleUser | null>(null);
    const [visibleInput, setVisibleInput] = useState<number | null>(null);
    const [visibleInput2, setVisibleInput2] = useState<number | null>(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState<boolean[]>([]);
    const textAreasRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [display2, setDisplay2] = useState('none');
    const [display1, setDisplay1] = useState('block');
    const [display4, setDisplay4] = useState('none');
    const [display5, setDisplay5] = useState('none');
    const [reportMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null); // Индекс активного меню

    const editComment = (index: number) => {
        setVisibleInput2(visibleInput2 === index ? null : index);
    };
    const deleteComment = (index: number) => {
        setVisibleInput2(visibleInput2 === index ? null : index);
    };

    const handleFocus = () => {
        setLineColor('black');
    };

    const handleBlur = () => {
        setLineColor('lightgray');
    };

    const handleInputChange = (index: number, value: string) => {
        setInputValues({[index]: value}); // Обновляем значение конкретного поля
    };

    const handleCancel = () => {
        setVisibleInput(null); // Скрываем текущее текстовое поле
    };
    const handleReplayClick = (index: number) => {
        setVisibleInput(visibleInput === index ? null : index); // Переключаем видимость конкретного поля
    };


    const dislike = async (id: number, userid: string) => {
        if (user) {
            try {

                const response = await api.put('/CommentVideo/dislike/' + id + '/' + user.id + '/' + userid);
                if (response.status === 200) {
                    console.log('успешный лайк');
                } else {
                    console.error('Ошибка при like:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }

    }
    const like = async (id: number, userid: string) => {
        if (user) {
            try {
                const response = await api.put('/CommentVideo/like/' + id + '/' + user.id + '/' + userid);
                if (response.status === 200) {
                    console.log('успешный лайк');
                } else {
                    console.error('Ошибка при like:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
    const toPin = async (id: number) => {
        if (user) {
            try {
                const response = await api.put('/CommentVideo/topin/' + id);

                if (response.status === 200) {
                    console.log('успешный pin');
                } else {
                    console.error('Ошибка при pin:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
    const unPin = async (id: number) => {
        if (user && videoOwner?.clerk_Id == user?.id) {
            try {
                const response = await api.put('/CommentVideo/unpin/' + id);

                if (response.status === 200) {
                    console.log('успешный unpin');
                } else {
                    console.error('Ошибка при unpin:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
    const findOwner = async (id: number) => {
        if (user) {
            try {
                const response = await api.get('/User/getbyvideoid/' + id);

                if (response.status === 200) {

                    const data: ISimpleUser = await response.data;
                    console.log('успешный ownerVideo', data);
                    setVideoOwner(data);

                } else {
                    console.error('ownerVideo:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };

    const toggleExpand = (index: number) => {
        setDisplay2('none');
        setDisplay1('block');
        setDisplay4('none');
        setDisplay5('none');
        setExpandedStates((prevState) =>
            prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
        );
        setReportMenuOpenIndex(null);
    };


    const openReport = () => {
        setDisplay2('block');
        setDisplay1('none');
    };

    const closeReport = () => {
        setDisplay1('block');
        setDisplay2('none');
        setReportMenuOpenIndex(null);
    };

    const openEdit = () => {
        setDisplay4('block');
        setDisplay1('none');
    };

    const closeEdit = () => {
        setDisplay1('block');
        setDisplay4('none');
        setReportMenuOpenIndex(null);
    };

    const openDelete = () => {
        setDisplay5('block');
        setDisplay1('none');
    };

    const closeDelete = () => {
        setDisplay5('block');
        setDisplay4('none');
        setReportMenuOpenIndex(null);
    };
    useEffect(() => {
        setExpandedStates(Array(comments.length).fill(false));
        findOwner(id);

    }, [comments, id]);

    useEffect(() => {
        // Проверяем, все ли текстовые области помещают текст
        const overflowStatuses = textAreasRefs.current.map((textarea) => {
            if (textarea) {
                return textarea.scrollHeight > textarea.clientHeight; // Возвращает true, если есть скролл
            }
            return false;
        });
        setIsTextOverflowing(overflowStatuses); // Обновляем состояние
    }, [comments]);

    const toggleReportMenu = (index: number, event: React.MouseEvent) => {

        setDisplay2('none');
        setDisplay4('none');
        setDisplay5('none');
        setDisplay1('block');
        if (reportMenuOpenIndex === index) {
            setReportMenuOpenIndex(null); // Закрываем, если уже открыто
        } else {
            setReportMenuOpenIndex(index); // Открываем для конкретного элемента
        }
    };

    return (

        <div style={{width: '99.5%'}}>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div style={{display: 'flex'}}>
                        <div style={{width: '100%'}}>
                            <div key={comment.videoId} style={{display: 'flex'}}>
                                <div>
                                    <img
                                        src={avatars[comment.userId] || comment.channelBanner}
                                        alt=""
                                        width="40px"
                                        height="40px"
                                        style={{borderRadius: '50%', marginRight: '10px', minHeight: '40px'}}
                                    /></div>
                                <div style={{width: '100%'}}>
                                    <div style={{paddingLeft: '0px'}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            borderBottom: comment.isPinned ? '2px solid lightgray' : 'none'
                                        }}>
                                            <div>
                                                <Link href={"/gotochannel/" + comment.channelId} style={{
                                                    paddingRight: '20px',
                                                    fontWeight: 'bolder'
                                                }}>@{comment.userName}</Link>
                                                <small>{formatTimeAgo(new Date(comment.date))}</small>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', marginLeft: '50px'}}>
                                                {comment.isPinned && <FaThumbtack size={14} color="brown"
                                                                                  onClick={() => unPin(comment.id)}
                                                                                  title="Unpin comment"/>} {/* Иконка булавки */}
                                            </div>
                                        </div>
                                    </div>
                                    <div key={index} style={{marginBottom: '20px'}}>
                                        <textarea
                                            ref={(el) => {
                                                textAreasRefs.current[index] = el; // Присваиваем реф каждому textarea
                                            }}
                                            style={{
                                                border: 'none',
                                                fontSize: '16px',
                                                padding: '5px',
                                                paddingBottom: '0px',
                                                resize: 'none',
                                                display: expandedStates[index] ? 'none' : 'block',
                                                overflow: expandedStates[index] ? 'auto' : 'hidden', // Скроллинг при раскрытии
                                                wordWrap: 'break-word',
                                                width: '100%',
                                                backgroundColor: 'white',
                                                maxHeight: '50px',
                                                marginBottom: '-20px'
                                            }}
                                            disabled
                                            value={comment.comment}
                                            readOnly
                                            rows={1}
                                        />
                                    </div>
                                    <p style={{display: expandedStates[index] ? 'block' : 'none'}}>
                                        {comment.comment}
                                    </p>
                                    <div style={{fontWeight: 'bold', paddingLeft: '15px', color: 'gray'}}>
                                        {isTextOverflowing[index] &&
                                            !expandedStates[index] && (
                                                <button onClick={() => toggleExpand(index)}>
                                                    Read more
                                                </button>
                                            )}

                                        {isTextOverflowing[index] && expandedStates[index] && (
                                            <button onClick={() => toggleExpand(index)}>
                                                Collapse
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <div className="flex items-center space-x-8" style={{paddingLeft: "55px"}}>
                                <div className="flex items-center space-x-2.5">
                                    <SlLike onClick={() => like(comment.id, comment.userId)} size={15}/>
                                    <div style={{fontSize: "14px"}}>{comment.likeCount !== 0 && comment.likeCount}</div>
                                </div>
                                <div className="flex items-center space-x-2.5">
                                    <SlDislike onClick={() => dislike(comment.id, comment.userId)} size={15}/>
                                    <div
                                        style={{fontSize: "14px"}}>{comment.dislikeCount !== 0 && comment.dislikeCount}</div>
                                </div>

                                <div className="flex items-center space-x-2" onClick={() => handleReplayClick(index)}>
                                    <FiCornerDownRight size={18}/>
                                    <span style={{fontSize: "14px"}}>Replay</span>
                                </div>

                                {videoOwner?.clerk_Id === user?.id && !comment.isPinned && (
                                    <>
                                        <button onClick={() => toPin(comment.id)}>
                                            <MdPushPin size={18} color="gray" title="Pin comment"/>
                                        </button>
                                    </>)}
                                {comment.isEdited && (
                                    <>

                                        <div style={{fontSize: '11px', color: 'brown'}}> Edited</div>
                                    </>)}

                            </div>

                            {visibleInput === index && user && (
                                <>
                                    <br/>
                                    <MyAnswersShortComment commentId={comment.id} onCancel={handleCancel}/>
                                </>
                            )}

                            <AnswersShortsComments commentId={comment.id} ans={answers[comment.id] || []}/>
                            <br/>

                        </div>
                        <div key={comment.id} className="relative">
                            <button onClick={(event) => toggleReportMenu(index, event)}
                                    className="flex pl-10 pt-2 space-x-2">
                                <MdMoreVert size={24} color="black"/>
                            </button>


                            {/* Меню появляется только для выбранного элемента */}
                            {reportMenuOpenIndex === index && (
                                <div>
                                    <div
                                        className="absolute pt-1 pb-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[180px] right-0"
                                        style={{display: display1,}}>
                                        <div onClick={() => openReport()}
                                             className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                             style={{display: 'flex', justifyContent: 'center'}}>
                                            <div>
                                                <FiFlag size={15}/></div>
                                            <div>
                                                <span style={{fontSize: '18px'}}>Report</span></div>
                                        </div>

                                        {comment.userId === user?.id && (
                                            <>
                                                <div onClick={() => openEdit()}
                                                     className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                                     style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div>
                                                        <FaPen size={15} color="blue"/></div>
                                                    <div>
                                                        <span style={{fontSize: '18px'}}>Edit comment</span></div>
                                                </div>
                                            </>)}
                                        {comment.userId === user?.id && (
                                            <>
                                                <div onClick={() => openDelete()}
                                                     className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                                     style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div>
                                                        <RiDeleteBinLine size={15} color="blue"/></div>
                                                    <div>
                                                        <span style={{fontSize: '18px'}}>Delete comment</span></div>
                                                </div>
                                            </>)}
                                    </div>


                                    <div
                                        className="absolute mt-[-150px] ml-[-300px] pt-[10px] tb-[10px] max-w-[400px] min-w-[300px] rounded-[20px] bg-white border border-gray-300 shadow-lg z-10"
                                        style={{

                                            display: display2,
                                        }}
                                    >
                                        <RadioButtonList userName={comment.userName} onClose={closeReport}/>

                                    </div>
                                    <div
                                        className="absolute top-16 bg-white border border-gray-300 rounded-md shadow-lg z-15 right-[3px]"
                                        style={{
                                            paddingTop: '5px',
                                            paddingBottom: '5px',
                                            position: 'absolute',
                                            marginTop: '-50px',
                                            display: display4,
                                            width: '80%',
                                            minWidth: '375px',
                                            borderRadius: '16px',
                                            border: '2px solid gray',

                                        }}
                                    >
                                        <EditComment comment={comment} onClose={closeEdit}/>

                                    </div>
                                    <div
                                        className="absolute top-16 bg-white border border-gray-300 rounded-md shadow-lg z-15 right-[3px]"
                                        style={{
                                            paddingTop: '5px',
                                            paddingBottom: '5px',
                                            position: 'absolute',
                                            marginTop: '-50px',
                                            display: display5,
                                            width: '80%',
                                            minWidth: '375px',
                                            borderRadius: '16px',
                                            border: '2px solid gray',

                                        }}
                                    >
                                        <DeleteComment commentId={comment.id} onClose={closeDelete}/>

                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                ))
            ) : (
                <p className="text-center">No comments</p>
            )}
        </div>


    );
}

export default ShortsComments;



'use client'
import React from 'react';
import {useEffect, useState} from 'react';
import Link from "next/link";
import {SlDislike, SlLike} from "react-icons/sl";
import {useUser} from '@clerk/nextjs';
import {FiFlag} from 'react-icons/fi';
import {IAnswerCommentVideo} from '@/types/answercommentvideo.interface';
import {HiOutlineChevronUp, HiOutlineChevronDown} from 'react-icons/hi';
import {MdMoreVert} from 'react-icons/md';
import RadioButtonList from '@/components/pages/comments/report';
import EditAnswer from '@/components/pages/comments/editanswer';
import {FaPen} from 'react-icons/fa';
import {formatTimeAgo} from "@/utils/format";
import {signalRService} from '@/services/signalr.service';
import api from '@/services/axiosApi'
import {RiDeleteBinLine} from "react-icons/ri";
import DeleteAnswer from "@/components/pages/comments/deleteanswer";

interface ShortsCommentsProps {
    commentId: number;
    ans: IAnswerCommentVideo[]
}

const AnswersShortsComments: React.FC<ShortsCommentsProps> = ({commentId, ans}) => {

    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
    const {user} = useUser();
    const [display, setDisplay] = useState('none');
    const [display2, setDisplay2] = useState('block');
    const [visibleInput, setVisibleInput] = useState<number | null>(null);
    const [answers, setAnswers] = useState<IAnswerCommentVideo[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [allAnswers, setAllAnswers] = useState(0);
    const [display3, setDisplay3] = useState('none');
    const [display1, setDisplay1] = useState('block');
    const [reportMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null);
    const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(answers.length).fill(false));
    const [display4, setDisplay4] = useState('none');
    const [display5, setDisplay5] = useState('none');

    const handleReplayClick = (index: number) => {
        setVisibleInput(visibleInput === index ? null : index); // Переключаем видимость конкретного поля
    };


    const dislike = async (id: number, userid: string) => {
        if (user) {
            try {

                const response = await api.put('/AnswerVideo/dislike/' + id + '/' + user.id + '/' + userid);

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
                const response = await api.put('/AnswerVideo/like/' + id + '/' + user.id + '/' + userid);

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

    useEffect(() => {
        try {
            setAnswers(ans);
            setAllAnswers(ans.length);
            setDisplay('none');
            setDisplay2('blok');

        } catch (error) {
            console.error('Ошибка при получении профиля пользователя:', error);
        }

    }, [commentId, ans]);


    useEffect(() => {

        const handleMessage = (messageType: string, payload: any) => {
            console.log('Сообщение от SignalR сервера:', messageType);

            if (messageType === "new_answer") {
                const a: IAnswerCommentVideo = payload;
                if (a.commentVideo_Id === commentId) {
                    setAnswers((prevAnswers) => {
                        // Проверка, если ответ уже существует
                        const isAnswerExists = prevAnswers.some(
                            (answer) => answer.id === a.id
                        );
                        if (!isAnswerExists) {
                            setAllAnswers((prev) => prev + 1);
                            return [...prevAnswers, a];
                        }
                        return prevAnswers;
                    });

                }
            }

            if (messageType === 'like_answer') {
                const likedAnswer = payload;
                console.log('*/*/*/*=', likedAnswer);
                setAnswers((prevAnswers) =>
                    prevAnswers.map((answer) =>
                        answer.id === likedAnswer.id
                            ? {...answer, likeCount: likedAnswer.likeCount} // Обновляем количество лайков
                            : answer
                    )
                );
            }
            if (messageType === 'dislike_answer') {
                const likedAnswer = payload;
                console.log('*/*/*/*=', likedAnswer);
                setAnswers((prevAnswers) =>
                    prevAnswers.map((answer) =>
                        answer.id === likedAnswer.id
                            ? {...answer, dislikeCount: likedAnswer.dislikeCount} // Обновляем количество лайков
                            : answer
                    )
                );
            }
            if (messageType === 'update_answer') {
                const upAnswer = payload;
                setAnswers((prevAnswers) =>
                    prevAnswers.map((answer) =>
                        answer.id === upAnswer.id
                            ? {...answer, text: upAnswer.text, isEdited: upAnswer.isEdited} // Обновляем количество лайков
                            : answer
                    )
                );
            }
            if (messageType === "delete_answer") {
                const a: IAnswerCommentVideo = payload;
                if (a.commentVideo_Id === commentId) {
                    setAnswers((prevAnswers) => {
                        // Проверка, если ответ существует для удаления
                        const isAnswerExists = prevAnswers.some((answer) => answer.id === a.id);
                        if (isAnswerExists) {
                            setAllAnswers((prev) => Math.max(prev - 1, 0)); // Уменьшаем счетчик ответов, но не ниже 0
                            return prevAnswers.filter((answer) => answer.id !== a.id);
                        }
                        return prevAnswers;
                    });
                }
            }

        };

        signalRService.onMessageReceived(handleMessage);

        return () => {
            signalRService.offMessageReceived(handleMessage);
        };
    }, [ans, commentId]);

    const openReport = () => {
        setDisplay3('block');
        setDisplay1('none');
    };

    const closeReport = () => {
        setDisplay1('block');
        setDisplay3('none');
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
        setDisplay1('block');
        setDisplay5('none');
        setReportMenuOpenIndex(null);
    };
    useEffect(() => {
        setExpandedStates(Array(answers.length).fill(false));

    }, [answers]);

    const toggleReportMenu = (index: number, event: React.MouseEvent) => {
        setDisplay3('none');
        setDisplay4('none');
        setDisplay5('none');
        setDisplay1('block');
        if (reportMenuOpenIndex === index) {
            setReportMenuOpenIndex(null); // Закрываем, если уже открыто
        } else {
            setReportMenuOpenIndex(index); // Открываем для конкретного элемента
        }
    };

    const toggleExpand = (index: number) => {
        setDisplay3('none');
        setDisplay1('block');
        setDisplay4('none');
        setDisplay5('none');
        setExpandedStates((prevState) =>
            prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
        );
        setReportMenuOpenIndex(null);
    };

    return (


        <div style={{width: '100%'}}>
            <div style={{paddingLeft: '50px'}}>
                {allAnswers > 0 ? (<div onClick={() => {
                    if (display === 'none') {
                        setDisplay('block');
                        setDisplay2('none');
                    } else {
                        setDisplay('none');
                        setDisplay2('block');
                    }
                }}
                                        style={{display: 'inline-block', width: 'auto'}}>

                    <div style={{display: 'flex'}}>
                        <HiOutlineChevronUp size={24} color="blue" style={{display}}/>
                        <HiOutlineChevronDown size={24} color="blue" style={{display: display2}}/>
                        <button style={{marginBottom: '5px', color: 'blue'}}>
                            {allAnswers}&nbsp;Answers
                        </button>
                    </div>
                </div>) : <></>}
                <div style={{width: '100%', display: 'flex'}}>

                    <div style={{display, width: '100%'}}>
                        {answers.length > 0 ? (
                            answers.map((comment, index) => (

                                <div style={{width: '100%', display: 'flex'}}>

                                    <div key={comment.commentVideo_Id} style={{display: 'flex', width: '100%'}}>
                                        <div>

                                            <img
                                                src={avatars[comment.userId] || comment.channelBanner}
                                                alt=""
                                                width="25px"
                                                height="25px"
                                                style={{borderRadius: '50%', marginRight: '10px'}}
                                            /></div>
                                        <div style={{width: '100%'}}>

                                            <div style={{paddingLeft: '0px', width: '100%'}}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: '100%'
                                                }}>
                                                    <div>
                                                        <Link href={"/gotochannel/" + comment.channelId} style={{
                                                            paddingRight: '20px',
                                                            fontWeight: 'bolder',
                                                            fontSize: '14px'
                                                        }}>@{comment.userName}</Link>
                                                        <small>{formatTimeAgo(new Date(comment.answerDate))}</small>
                                                    </div>
                                                    <div key={comment.id} className="relative"
                                                         style={{marginRight: '-65px'}}>

                                                        <button onClick={(event) => toggleReportMenu(index, event)}
                                                                className="flex pl-10 pt-2 space-x-2"
                                                                style={{position: 'relative', zIndex: 10}}>
                                                            <MdMoreVert size={24} color="black"/>
                                                        </button>

                                                        {reportMenuOpenIndex === index && (
                                                            <div>
                                                                <div
                                                                    className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg w-[180px] right-0"
                                                                    style={{
                                                                        paddingTop: '4px',
                                                                        paddingBottom: '4px',
                                                                        position: 'absolute',
                                                                        display: display1,
                                                                    }}
                                                                >
                                                                    <div onClick={() => openReport()}
                                                                         className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                                                         style={{
                                                                             display: 'flex',
                                                                             justifyContent: 'center'
                                                                         }}>
                                                                        <div>
                                                                            <FiFlag size={16}/></div>
                                                                        <div>
                                                                            <span
                                                                                style={{fontSize: '20px'}}>Report</span>
                                                                        </div>
                                                                    </div>
                                                                    {comment.userId === user?.id && (
                                                                        <>
                                                                            <div onClick={() => openEdit()}
                                                                                 className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                                                                 style={{
                                                                                     display: 'flex',
                                                                                     justifyContent: 'center'
                                                                                 }}>
                                                                                <div>
                                                                                    <FaPen size={15} color="blue"/>
                                                                                </div>
                                                                                <div>
                                                                                    <span style={{fontSize: '18px'}}>Edit answer</span>
                                                                                </div>
                                                                            </div>
                                                                        </>)}
                                                                    {comment.userId === user?.id && (
                                                                        <>
                                                                            <div onClick={() => openDelete()}
                                                                                 className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300"
                                                                                 style={{
                                                                                     display: 'flex',
                                                                                     justifyContent: 'center'
                                                                                 }}>
                                                                                <div>
                                                                                    <RiDeleteBinLine size={15}
                                                                                                     color="blue"/>
                                                                                </div>
                                                                                <div>
                                                                                    <span style={{fontSize: '18px'}}>Delete answer</span>
                                                                                </div>
                                                                            </div>
                                                                        </>)}
                                                                </div>


                                                                <div
                                                                    className="absolute top-16 bg-white border border-gray-300 rounded-md shadow-lg z-20 right-[3px]"
                                                                    style={{
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        position: 'absolute',
                                                                        marginTop: '-50px',
                                                                        display: display4,
                                                                        width: '80%',
                                                                        minWidth: '375px',
                                                                        borderRadius: '16px',
                                                                        border: '2px solid gray',

                                                                    }}
                                                                >
                                                                    <EditAnswer answer={comment}
                                                                                onClose={closeEdit}/>

                                                                </div>
                                                                <div
                                                                    className="absolute top-16 bg-white border border-gray-300 rounded-md shadow-lg z-20 right-[3px]"
                                                                    style={{
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        position: 'absolute',
                                                                        marginTop: '-50px',
                                                                        display: display5,
                                                                        width: '80%',
                                                                        minWidth: '375px',
                                                                        borderRadius: '16px',
                                                                        border: '2px solid gray',

                                                                    }}
                                                                >
                                                                    <DeleteAnswer answerId={comment.id}
                                                                                  onClose={closeDelete}/>

                                                                </div>
                                                                <div
                                                                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
                                                                    style={{
                                                                        paddingTop: '10px',
                                                                        paddingBottom: '10px',
                                                                        position: 'absolute',
                                                                        marginTop: '-150px',
                                                                        marginLeft: '-300px',
                                                                        display: display3,
                                                                        maxWidth: '400px',
                                                                        minWidth: '300px',
                                                                        borderRadius: '20px'
                                                                    }}
                                                                >
                                                                    <RadioButtonList userName={comment.userName}
                                                                                     onClose={closeReport}/>

                                                                </div>

                                                            </div>


                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                            <div>
                                                <div>
                                                    <textarea
                                                        style={{
                                                            border: 'none',
                                                            fontSize: '16px',
                                                            padding: '5px',
                                                            height: 'auto',
                                                            resize: 'none',
                                                            wordWrap: 'break-word',
                                                            width: '100%',
                                                            backgroundColor: 'white',

                                                        }}
                                                        disabled
                                                        value={comment.text}
                                                        readOnly
                                                        rows={1} // Минимальное количество строк
                                                    />

                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-8">
                                                <div className="flex items-center space-x-2.5">
                                                    <SlLike onClick={() => like(comment.id, comment.userId)} size={15}/>
                                                    <div
                                                        style={{fontSize: "14px"}}>{comment.likeCount !== 0 && comment.likeCount}</div>
                                                </div>
                                                <div className="flex items-center space-x-2.5">
                                                    <SlDislike onClick={() => dislike(comment.id, comment.userId)}
                                                               size={15}/>
                                                    <div
                                                        style={{fontSize: "14px"}}>{comment.dislikeCount !== 0 && comment.dislikeCount}</div>
                                                </div>

                                                {comment.isEdited && (
                                                    <>

                                                        <div style={{fontSize: '11px', color: 'brown'}}> Edited</div>
                                                    </>)}
                                            </div>
                                            <br/>

                                        </div>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnswersShortsComments;




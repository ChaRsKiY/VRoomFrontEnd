'use client';

import React, {useEffect, useState} from 'react';
import {GoSortDesc} from 'react-icons/go';
import MyComment from '../../comments/mycomment';
import Comments from '@/components/pages/comments/comments';
import {ICommentVideo} from '@/types/commentvideo.interface';
import {useUser} from '@clerk/nextjs';
import {IUser} from '@/types/user.interface';
import {IAnswerCommentVideo} from '@/types/answercommentvideo.interface';
import {signalRService} from '@/services/signalr.service';
import api from '@/services/axiosApi';
import ShortsMyComment from "@/components/pages/shorts/comments/shorts-mycomment";
import ShortsComments from "@/components/pages/shorts/comments/shorts-comments";

interface MyProps {
    videoid: number;

}


const ShortCommentsBlock: React.FC<MyProps> = ({videoid}) => {

    const {user} = useUser();
    const [comments, setComments] = useState<ICommentVideo[]>([]);
    const [allComments, setAllComments] = useState(0);
    const [iAmUser, setUser] = useState<IUser | null>(null);
    const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
    const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('date'); // Состояние для метода сортировки
    const [answersByComment, setAnswersByComment] = useState<{ [key: number]: IAnswerCommentVideo[] }>({});
    // const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket состояние

    // Получение текущего пользователя
    const getUser = async (user: any, setUser: (prev: IUser) => void) => {
        try {
            if (user) {
                const response = await api.get('/ChannelSettings/getinfochannel/' + user?.id);

                if (response.status === 200) {
                    const data: IUser = await response.data;
                    setUser(data);
                } else {
                    console.error('Ошибка при получении пользователя:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    const getAnswers = async (commentId: number) => {
        try {
            const response = await api.get('/AnswerVideo/getbycommentid/' + commentId);

            if (response.status === 200) {
                const data: IAnswerCommentVideo[] = await response.data;
                setAnswersByComment((prevAnswers) => ({
                    ...prevAnswers,
                    [commentId]: data,
                }));


                console.log('answers успешно получены:', data);
                console.log('*****' + answersByComment);
            } else if (response.status === 404) {
                // Если ответов нет (404), устанавливаем пустой массив для этого комментария
                setAnswersByComment((prevAnswers) => ({
                    ...prevAnswers,
                    [commentId]: [],
                }));
                console.log(`Ответов для комментария ${commentId} не найдено (404).`);
                console.log('*****' + answersByComment);
            } else {
                console.error('Ошибка при получении списка ответов:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    // Получение комментариев с сервера через обычный HTTP запрос
    const getComments = async () => {
        try {
            const response = await api.get('/CommentVideo/getbyvideoid/' + videoid);

            if (response.status === 200) {
                const data: ICommentVideo[] = await response.data;

                setAllComments(data.length);

                // Сортируем сначала по закрепленным комментариям (isPinned), затем по методу сортировки
                const sortedData = data.sort((a, b) => {
                    // Сначала сортируем по полю isPinned
                    if (a.isPinned && !b.isPinned) {
                        return -1;
                    }
                    if (!a.isPinned && b.isPinned) {
                        return 1;
                    }
                    // Если оба комментария либо закреплены, либо не закреплены, сортируем по выбранному методу
                    if (sortMethod === 'date') {
                        return sortByDate([a, b])[0] === a ? -1 : 1; // Сортировка по дате
                    } else if (sortMethod === 'likes') {
                        return sortByLikes([a, b])[0] === a ? -1 : 1; // Сортировка по количеству лайков
                    }
                    return 0; // Если нет метода сортировки, ничего не меняем
                });

                // Устанавливаем отсортированные комментарии
                setComments(sortedData);
                console.log('Комментарии успешно получены:', data);
            } else {
                console.error('Ошибка при получении комментариев:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    // Сортировка по дате
    const sortByDate = (comments: ICommentVideo[]) => {
        return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Сортировка по количеству лайков
    const sortByLikes = (comments: ICommentVideo[]) => {
        return [...comments].sort((a, b) => b.likeCount - a.likeCount);
    };

    // Выполняем сортировку на основе выбранного метода
    const handleSortMethodChange = (method: 'date' | 'likes') => {
        setSortMethod(method);
        const sortedData = comments.sort((a, b) => {
            // Сначала сортируем по полю isPinned
            if (a.isPinned && !b.isPinned) {
                return -1;
            }
            if (!a.isPinned && b.isPinned) {
                return 1;
            }
            if (sortMethod === 'date') {
                return sortByDate([a, b])[0] === a ? -1 : 1;
            } else if (sortMethod === 'likes') {
                return sortByLikes([a, b])[0] === a ? -1 : 1;
            }
            return 0; // Если нет метода сортировки, ничего не меняем
        });
        setComments(sortedData);
    };


    useEffect(() => {
        // Обработчик сообщений
        const handleMessage = (messageType: string, payload: any) => {
            console.log('Сообщение от SignalR сервера:', messageType);

            if (messageType === 'new_comment') {

                getComments();

                comments.forEach((comment) => {
                    getAnswers(comment.id);
                    console.log('получаю ответы****!!!', answersByComment);// Загружаем ответы для каждого комментария автоматически
                })
            }
            if (messageType === 'update_comment') {
                const upComment = payload;
                setComments((prevComments) =>
                    prevComments.map((com) =>
                        com.id === upComment.id
                            ? {...com, isEdited: upComment.isEdited, comment: upComment.text} // Обновляем количество лайков
                            : com
                    )
                );
            }
        };

        signalRService.onMessageReceived(handleMessage);

        // Очистка подписки при размонтировании компонента
        return () => {
            signalRService.offMessageReceived(handleMessage);
        };
    }, [videoid, comments]);

    // Получаем комментарии при загрузке компонента
    useEffect(() => {
        getUser(user, setUser);
        getComments();

    }, [videoid, user, sortMethod]);

    useEffect(() => {
        comments.forEach((comment) => {
            getAnswers(comment.id);
        });

        console.log('ответы------:', answersByComment);

    }, [comments]);

    return (
        <div onClick={() => {
            if (isSortMenuOpen) {
                setSortMenuOpen(false);
            }
        }}>
            <div className="flex items-center space-x-8">
                <div className="font-[500]">{allComments} Comments</div>
                <div
                    className="flex space-x-1 relative mt-1"
                    onClick={() => setSortMenuOpen(!isSortMenuOpen)}
                >
                    <GoSortDesc size={22}/>
                    <div className="text-[0.9rem] font-[500]">Sort</div>
                    {!isSortMenuOpen && (
                        <div
                            className="absolute left-14 top-0 z-20 ml-2 p-1 rounded-md shadow-lg bg-gray-500 text-white hidden hover-tooltip w-[120px]"
                            style={{textAlign: 'center'}}>
                            select sorting
                        </div>
                    )}
                    <style jsx>{`
                        .hover-tooltip {
                            display: none;
                        }

                        .relative:hover .hover-tooltip {
                            display: block;
                        }
                    `}</style>

                    {isSortMenuOpen && (
                        <div
                            className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full mt-2 z-15 w-[200px]"
                            style={{paddingTop: '6px', paddingBottom: '6px'}}>
                            <div style={{textAlign: 'center'}}
                                 onClick={() => handleSortMethodChange('likes')}
                                 className={`cursor-pointer p-2 ${sortMethod === 'likes' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
                                By rating
                            </div>
                            <div style={{textAlign: 'center'}}
                                 onClick={() => handleSortMethodChange('date')}
                                 className={`cursor-pointer p-2 ${sortMethod === 'date' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
                                New first
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <br/>
            <div className={'w-auto overflow-x-none'}>
                <div className={'relative z-10'}>
                    {iAmUser ? <ShortsMyComment videoId={videoid} amuser={iAmUser}/> : <p></p>}
                </div>
                <br/>
                <div className={'overflow-y-scroll mt-[3.2rem] h-[70vh] z-5'}>
                    <ShortsComments id={videoid} comments={comments} answers={answersByComment || []}/></div>
            </div>
        </div>
    );
};

export default ShortCommentsBlock;


'use client';

import React, {useEffect, useState} from 'react';
import {GoSortDesc} from 'react-icons/go';
import MyCommentPost from './mycommentpost';
import CommentsPost from './commentsposts';
import { ICommentPost } from '@/types/commentpost.interface';
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import { IAnswerCommentPost } from '@/types/answercommentpost.interface';
import { signalRService } from '@/services/signalr.service';

interface CommentsProps {
    postid: number;

}

const CommentsPostBlock: React.FC<CommentsProps> = ({postid}) => {

    const {user} = useUser();
    const [comments, setComments] = useState<ICommentPost[]>([]);
    const [allComments, setAllComments] = useState(0);
    const [iAmUser, setUser] = useState<IUser | null>(null);
    const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
    const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('date'); // Состояние для метода сортировки
    const [answersByComment, setAnswersByComment] = useState<{ [key: number]: IAnswerCommentPost[] }>({});
    const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket состояние

    // Получение текущего пользователя
    const getUser = async (user: any, setUser: (prev: IUser) => void) => {
        try {
            if (user) {
                const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfochannel/' + user?.id, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data: IUser = await response.json();
                    setUser(data);
                    console.log('user ch:', data);
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
            const response = await fetch('https://localhost:7154/api/AnswerPost/getbycommentid/' + commentId, {
                method: 'GET',
            });

            if (response.ok) {
                const data: IAnswerCommentPost[] = await response.json();
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
            const response = await fetch('https://localhost:7154/api/CommentPost/getbypostid/' + postid, {
                method: 'GET',
            });

            if (response.ok) {
                const data: ICommentPost[] = await response.json();

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
    const sortByDate = (comments: ICommentPost[]) => {
        return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Сортировка по количеству лайков
    const sortByLikes = (comments: ICommentPost[]) => {
        return [...comments].sort((a, b) => b.likeCount - a.likeCount);
    };

    // Выполняем сортировку на основе выбранного метода
    const handleSortMethodChange = (method: 'date' | 'likes') => {
        setSortMethod(method);
        const sortedData = comments.sort((a, b) => {
           
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
            return 0; 
        });
        setComments(sortedData);
    };

    useEffect(() => {

        const handleMessage = (messageType: string, payload: any) => {

            console.log('Сообщение от SignalR сервера:', messageType);

            if (messageType === 'new_commentpost') {

                getComments();

                comments.forEach((comment) => {
                    getAnswers(comment.id);
                    console.log('получаю ответы****!!!', answersByComment);// Загружаем ответы для каждого комментария автоматически
                })
            }
            if (messageType === 'update_commentpost') {
                const upComment = payload;
                setComments((prevComments) =>
                    prevComments.map((com) =>
                        com.id === upComment.id
                            ? {...com, isEdited: upComment.isEdited, comment: upComment.text} // Обновляем количество лайков
                            : com
                    )
                );
            }
            if (messageType === 'pin_commentpost') {
                const upComment = payload;
                setComments((prevComments) =>
                    prevComments.map((com) =>
                        com.id === upComment.id
                            ? {...com, isPinned: upComment.isPinned} // Обновляем количество лайков
                            : com
                    )
                );
            }
            if (messageType === 'like_commentpost') {
                const upComment = payload;
                setComments((prevComments) =>
                    prevComments.map((com) =>
                        com.id === upComment.id
                            ? {...com, likeCount: upComment.likeCount} // Обновляем количество лайков
                            : com
                    )
                );
            }
            if (messageType === 'dislike_commentpost') {
                const upComment = payload;
                setComments((prevComments) =>
                    prevComments.map((com) =>
                        com.id === upComment.id
                            ? {...com, dislikeCount: upComment.dislikeCount} // Обновляем количество лайков
                            : com
                    )
                );
            }
        };
    signalRService.onMessageReceived(handleMessage);

    return () => {
        signalRService.offMessageReceived(handleMessage);
    };
    }, [postid]);


    useEffect(() => {
        getUser(user, setUser);
        getComments();

    }, [postid, user, sortMethod]);

    useEffect(() => {
        comments.forEach((comment) => {
            getAnswers(comment.id);

        });

        console.log('ответы------:', answersByComment);

    }, [comments]);

    return (
        <div>

            <div onClick={() => {
                if (isSortMenuOpen) {
                    setSortMenuOpen(false);
                }
            }}>
                <div className="flex items-center space-x-8">
                    <div className="font-[500]">{allComments} Comments</div>
                    <div
                        className="flex space-x-1 relative"
                        onClick={() => setSortMenuOpen(!isSortMenuOpen)}
                    >
                        <GoSortDesc size={22}/>
                        <div className="text-[0.9rem] font-[500]">Sort</div>
                        {!isSortMenuOpen && (
                            <div
                                className="absolute left-[-30px] top-7 ml-2 p-1 rounded-md shadow-lg bg-gray-500 text-white hidden hover-tooltip w-[120px]"
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
                                className="absolute bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full mt-2 z-10 w-[180px]"
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
                <div style={{marginTop: '30'}}>
                    {iAmUser ? <MyCommentPost postId={postid} amuser={iAmUser}/> : <p></p>}
                    <br/>
                    <CommentsPost id={postid} comments={comments} answers={answersByComment || []}/>
                </div>
            </div>
        </div>
    );
};

export default CommentsPostBlock;
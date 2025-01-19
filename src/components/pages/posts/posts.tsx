'use client'
import { useEffect, useState, useRef } from 'react';
import { SlDislike, SlLike } from "react-icons/sl";
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import { formatTimeAgo } from "@/utils/format";
import { BiCommentDetail } from 'react-icons/bi';
import { ICommentPost } from '@/types/commentpost.interface';
import { IPost } from "@/types/post.interface";
import Link from "next/link";
import { BiTrash } from 'react-icons/bi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { signalRService } from '@/services/signalr.service';
import { IVideo } from '@/types/videoinfo.interface';
import { formatNumber } from "@/utils/format";
import { FaCircle } from 'react-icons/fa';
import api from '@/services/axiosApi';
import CreatePost from './createpost';
import '@/styles/modalsubtitles.css';

interface IPropsPost {
  channelId: number,

}

interface IOPtion {
  index: number,
  rate: number,
  allCounts: number,
}

interface ICheckPost {
  isVoted: boolean,
  allVotes: number,
  options: [IOPtion],
}
interface ICheckPostNew {
  postId: number,
  votePost: ICheckPost;
}

const PostList: React.FC<IPropsPost> = ({ channelId }) => {
  const [posts, setPosts] = useState<IPost[]>([]); // Храним список постов
  const [loading, setLoading] = useState<boolean>(true); // Для отображения состояния загрузки
  const [error, setError] = useState<string | null>(null); // Для обработки ошибок
  const { user } = useUser();
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [display, setDisplay] = useState('block');
  const [display1, setDisplay1] = useState('none');
  const [commentsByPost, setCommentsByPost] = useState<{ [key: number]: ICommentPost[] }>({});
  const [allComments, setAllComments] = useState<{ [key: number]: number }>({});
  const textAreasRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(posts.length).fill(false));
  const [isTextOverflowing, setIsTextOverflowing] = useState<boolean[]>([]);
  const [deleteMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [postId: number]: number | null }>({});
  const [checksPosts, setChecksPosts] = useState<{ [postId: number]: ICheckPost }>({});
  const [videosLink, setVideosLink] = useState<VideosMap>({});



  const getComments = async (postId: number) => {
    try {
      const response = await api.get('/CommentPost/getbypostid/' + postId);

      if (response.status === 200) {
        const data: ICommentPost[] = await response.data;

        // Записываем все комментарии для поста
        setCommentsByPost((prevComments) => ({
          ...prevComments,
          [postId]: data, // Записываем комментарии для конкретного postId
        }));
        console.log(`ВСЕГО Комментарии для поста ${postId} =`, allComments[postId]);
        console.log(`Комментарии для поста ${postId} успешно получены:`, data);
      } else if (response.status === 404) {
        // Если комментариев нет, сохраняем пустой массив для поста
        setCommentsByPost((prevComments) => ({
          ...prevComments,
          [postId]: [],
        }));
        console.log(`Комментариев для поста ${postId} не найдено (404).`);
      } else {
        console.error('Ошибка при получении списка комментариев:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };


  const getUser = async () => {
    try {

      const response = await api.get('/ChannelSettings/getinfobychannelid/' + channelId);

      if (response.status === 200) {
        const data: IUser = await response.data;
        setUser(data);
      } else {
        console.error('Ошибка при получении пользователя:', response.statusText);
      }

    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  const sortByDate = (posts: IPost[]) => {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const dislike = async (id: number, userid: string) => {
    if (user) {
      try {

        const response = await api.put('/Post/dislike/' + id + '/' + user.id + '/' + userid);

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
        const response = await api.put('/Post/like/' + id + '/' + user.id + '/' + userid);

        if (response.status === 200) {
          console.log('успешный лайк', response);
        } else {
          console.error('Ошибка при like:', response.statusText);
        }

      } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
      }
    }
  };

  const deletePost = async (id: number) => {
    if (user) {
      try {
        const response = await api.delete('/Post/' + id);

        if (response.status === 200) {
          closeReport();
          console.log('успешнo deleted', response);
        } else {
          console.error('Ошибка при delete:', response.statusText);
        }

      } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
      }
    }
  };

  const closeReport = () => {
    setReportMenuOpenIndex(null);
  };

  const toggleDeleteMenu = (index: number, event: React.MouseEvent) => {
    if (deleteMenuOpenIndex === index) {
      setReportMenuOpenIndex(null); // Закрываем, если уже открыто
    } else {
      setReportMenuOpenIndex(index); // Открываем для конкретного элемента
    }
  };



  useEffect(() => {
    // Обработчик сообщений
    const handleMessage = (messageType: string, payload: any) => {
      console.log('Сообщение от SignalR сервера:', messageType);

      if (messageType === 'new_post') {
        const newPost = payload;
        const i = newPost.channelSettingsId;
        if (i == channelId) {
          setPosts((prevPosts) => {
            const postExists = prevPosts.some((post) => post.id === newPost.id);
            if (!postExists) {
              return [newPost, ...prevPosts];
            }
            return prevPosts;
          });
        }
      }

      if (messageType === 'new_likepost') {
        const likedAnswer = payload;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === likedAnswer.id
              ? { ...post, likeCount: likedAnswer.likeCount }
              : post
          )
        );
      }

      if (messageType === 'new_dislikepost') {
        const dislikedAnswer = payload;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === dislikedAnswer.id
              ? { ...post, dislikeCount: dislikedAnswer.dislikeCount }
              : post
          )
        );
      }

      if (messageType === 'post_deleted') {
        const deletedPost = payload;
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== deletedPost.id)
        );
      }

      if (messageType === 'vote-post') {
        console.log("vote-post", payload);
        const pp = { isVoted: payload.isVoted, allVotes: payload.allVotes, options: payload.options };
        setChecksPosts(prevState => ({
          ...prevState,
          [payload.postId]: {
            ...prevState[payload.postId],
            ...pp
          }
        }));
        console.log('new chekpost', checksPosts[payload.postId]);
      }

    };
    signalRService.onMessageReceived(handleMessage);

    // Очистка подписки при размонтировании компонента
    return () => {
      signalRService.offMessageReceived(handleMessage);
    };
  }, [posts, channelId, checksPosts]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/Post/getbychannelid/` + channelId);
      if (response.status != 200) {
        throw new Error('Ошибка при получении данных');
      }
      const data: IPost[] = await response.data;
      setPosts(sortByDate(data));
    } catch (err) {
      alert('ERROR!!!')
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    fetchPosts();
    getUser();

  }, [channelId]);

  useEffect(() => {
    const postIds = Object.keys(posts).map(Number);

    postIds.forEach((postId) => {
      getComments(posts[postId].id);
    });
  }, [posts]);

  useEffect(() => {
    const postIds = Object.keys(commentsByPost).map(Number);

    postIds.forEach((postId) => {
      setAllComments((prevAllComments) => ({
        ...prevAllComments,
        [postId]: commentsByPost[postId].length,
      }));
    });
    console.log(allComments);

  }, [commentsByPost]);

  const toggleExpand = (index: number) => {

    setExpandedStates((prevState) =>
      prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
    );
  };


  const handleOptionChange = (postId: number, optionIndex: number) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [postId]: optionIndex,
    }));
  };


  async function fetchVotingData(postId: number): Promise<ICheckPost> {
    const response = await api.get(`/Vote/getbypostanduser/${postId}/${user?.id}`);
    if (response.status != 200) {
      if (response.status === 404) {
        console.log(`Vote с ID ${postId} не найден.`);
      } else {

        console.log(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }
      return {
        isVoted: false,
        allVotes: 0,
        options: [{
          index: 0,
          rate: 0,
          allCounts: 0
        }],
      }

    }
    const data = await response.data;
    console.log('vote found', data);
    // Преобразование данных с сервера в структуру ICheckPost
    return {
      isVoted: data.isVoted,
      allVotes: data.allVotes,
      options: data.options.map((option: any, index: number) => ({
        index,
        rate: option.rate,
        allCounts: option.allCounts,
      })),
    };
  }

  async function createCheckPosts(posts: { id: number }[]): Promise<void> {
    const checkP = await Promise.all(
      posts.map(post => fetchVotingData(post.id))
    );
    console.log('votes', checkP);
    // Преобразуем массив `checkP` в объект с ключами `postId`
    const checkPObject = posts.reduce((acc, post, index) => {
      acc[post.id] = checkP[index];
      return acc;
    }, {} as { [postId: number]: ICheckPost });
    setChecksPosts(checkPObject);
  }

  const handleVoteSubmit = async (index: number) => {
    const selectedOption = selectedOptions[posts[index].id];

    if (selectedOption !== null) {
      try {
        const response = await api.post(`/Vote/add`, { PostId: posts[index].id, OptionId: selectedOption, UserId: user?.id }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200) {
          console.log('Голос успешно отправлен');
        } else {
          console.error('Ошибка при отправке голоса');
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
      }
    }
  };


  // Инициализируем начальные значения для каждого postId
  const initialCheckPosts = posts.reduce((acc, post) => {
    acc[post.id] = {
      isVoted: false,
      allVotes: 0,
      options: [
        {
          index: 0,
          rate: 0,
          allCounts: 0,
        },
      ],
    };
    console.log('init checkvotes', acc)
    return acc;
  }, {} as { [postId: number]: ICheckPost });




  useEffect(() => {
    setChecksPosts(initialCheckPosts);
    // Проверяем, все ли текстовые области помещают текст
    const overflowStatuses = textAreasRefs.current.map((textarea) => {
      if (textarea) {
        return textarea.scrollHeight > textarea.clientHeight;
      }
      return false;
    });
    setIsTextOverflowing(overflowStatuses);
    setExpandedStates(Array(posts.length).fill(false));
    console.log('start cheking');
    createCheckPosts(posts);

  }, [posts]);

  const initialSelectedOptions = posts.reduce((acc, post) => {
    acc[post.id] = null; // Устанавливаем начальное значение `null` для каждого postId
    return acc;
  }, {} as { [postId: number]: number | null });

  useEffect(() => {

    setSelectedOptions(initialSelectedOptions);
  }, [posts]);


  type VideosMap = {
    [key: number]: IVideo; // Указываем, что ключи — числа, а значения — объекты VideoData
  };

  const getVideobyLink = async (link2: string) => {
    const url = encodeURIComponent(link2);
    try {
      const response = await api.get('/Video/getvideoinfobyvideourl/' + url);

      if (response.status === 200) {
        const data: IVideo = await response.data;
        return data;
      } else {
        console.error('Ошибка при получении video:', response.statusText);
        return null;
      }

    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
      return null;
    }

  }

  useEffect(() => {
    // Функция для получения данных видео из базы данных
    const fetchVideoData = async (post: IPost) => {
      if (post.type === 'videolink') {
        try {
          if (post.video != null) {
            const videoData: IVideo | null = await getVideobyLink(post.video);
            console.log('videolink', videoData);
            return videoData;
          }
          return null;
        } catch (error) {
          console.error('Ошибка загрузки видео:', error);
          return null;
        }
      }
      return null;
    };

    // Перебираем все postIds и загружаем видео, если post.type === 'videolink'
    const loadVideos = async () => {
      const videoDataMap: VideosMap = {}; // Временный объект для хранения загруженных данных видео
      for (const post of posts) {
        const videoData: IVideo | null = await fetchVideoData(post);
        if (videoData) {
          videoDataMap[post.id] = videoData; // Записываем данные видео с ключом post.Id
        }
      }
      setVideosLink(videoDataMap); // Обновляем состояние с загруженными видео
    };

    loadVideos();
  }, [posts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='w-full'>
      <div style={{ display }}>



        <div className=" w-3/4" >

          {posts.length === 0 ? (
            <p>No posts</p>
          ) : (

            <ul>
              {posts.map((post, index) => (
                <>

                  <li key={post.id} style={{
                    borderRadius: '10px', border: '1px solid lightgray', padding: '20px', marginTop: '20px',
                    paddingRight: '30px', paddingLeft: '30px', textAlign: 'center'
                  }}>
                    <div className='flex ' style={{ width: '100%', justifyContent: 'space-between' }}>
                      <div className='flex '>
                        <img
                          src={iAmUser?.channelProfilePhoto}
                          alt="User Avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                        />
                        <a style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }} href='#'>{iAmUser?.channelNikName}&nbsp;&nbsp;</a>
                      </div>

                      <small style={{ fontWeight: 'bold', color: 'gray' }}>{formatTimeAgo(new Date(post.date))}</small>

                    </div>
                    {(post.type === 'text' ) ? (<>
                      <div key={index} style={{ marginBottom: '20px', paddingLeft: '50px' }}>
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
                          value={post.text}
                          readOnly
                          rows={1}
                        />
                      </div>
                      <p style={{ display: expandedStates[index] ? 'block' : 'none' }}>
                        {post.text.split('\n').map((line, ind) => (
                          <span key={ind}>
                            {line}
                            <br />
                          </span>
                        ))}</p>
                      <div style={{ fontWeight: 'bold', paddingLeft: '15px', color: 'gray' }}>
                        {isTextOverflowing[index] &&
                          !expandedStates[index] && (
                            <button onClick={() => toggleExpand(index)} >
                              Read more
                            </button>
                          )}

                        {isTextOverflowing[index] && expandedStates[index] && (
                          <button onClick={() => toggleExpand(index)} >
                            Collapse
                          </button>
                        )}
                      </div>
                    </>) : <>
                    {post.type != 'videolink' &&(  <h2 className="text-xl font-semibold mb-4">{post.text}</h2>)}
                    </>}
                    <br />
                    {post.type === 'text' || post.type === 'videolink' ? (<>
                      <Link href={"/post/comments/" + post.id} className="block pl-0 pr-4 py-2 rounded-full">
                        {post.photo &&
                          <img src={post.photo} alt="Post image" width="100%" style={{ paddingLeft: '50px' }} />}
                        {post.video && (
                          <>
                            <div className='flex'>
                              {post.type === 'videolink'? (<>
                              
                                <video src={post.video} controls width="350px" style={{ paddingLeft: '50px' }}
                                  autoPlay loop muted>
                                  Ваш браузер не поддерживает видео.
                                </video>
                               
                                <div>
                                  <div style={{ paddingRight: '10px' }}>
                                    <a href={post.video} target="_blank" rel="noopener noreferrer"
                                      className="ml-4 text-blue-600 underline ">
                                      {post.video}
                                    </a>
                                  </div>
                                  <div><small>
                                    {/* {formatNumber(videosLink[post.id]?.viewCount)} views */}
                                    <FaCircle style={{ fontSize: '5px', color: 'gray', margin: '0 8px', display: 'inline' }} />
                                    {/* {formatTimeAgo(new Date(videosLink[post.id]?.uploadDate))} */}
                                    {formatTimeAgo(new Date(post.date))}
                                    </small></div>
                                  <div>{videosLink[post.id]?.description}</div>
                                  <br/>
                                  <h2 className="text-xl font-semibold mb-4">{post.text}</h2>
                                </div>
                              </>) : <>
                                <video src={post.video} controls width="100%" style={{ paddingLeft: '50px' }} autoPlay loop muted >
                                  Ваш браузер не поддерживает видео.
                                </video>
                              </>}
                            </div>

                          </>
                        )}
                      </Link>
                    </>) : <>
                      <div>
                        <div className="p-4 border rounded-md shadow-md w-full  bg-white">

                          {checksPosts[post.id] && (checksPosts[post.id].isVoted || !checksPosts[post.id].isVoted) ? (<>
                            <ul className="space-y-2">
                              {post.options.map((option, index) => {

                                const maxCount = Math.max(...checksPosts[post.id].options.map(opt => opt.rate));
                                // Условная стилизация: синий, если текущий `count` максимальный, серый — в остальных случаях
                                const backgroundColor = 'rgba(128, 128, 128, 0.3)';

                                return (
                                  <li key={index} className="flex items-center">

                                    <input
                                      type="radio"
                                      name={`poll-${post.id}`}
                                      id={`option-${post.id}-${index}`}
                                      value={index}
                                      checked={selectedOptions[post.id] === index}
                                      onChange={() => handleOptionChange(post.id, index)}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`option-${post.id}-${index}`}
                                      className="text-gray-700"
                                      style={{
                                        padding: '5px',
                                        width: '100%',
                                        border: '2px solid rgba(0, 128, 0, 0.5)',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: ((checksPosts[post.id]?.isVoted || user?.id === iAmUser?.clerk_Id) && checksPosts[post.id].options[index]?.rate === maxCount)
                                          ? `linear-gradient(to right, rgba(0, 180, 255, 0.2) ${checksPosts[post.id].options[index]?.rate}%,
             transparent ${checksPosts[post.id].options[index]?.rate}%)`
                                          : (checksPosts[post.id]?.isVoted || user?.id === iAmUser?.clerk_Id) ? `linear-gradient(to right, rgba(211, 211, 211, 0.5) ${checksPosts[post.id].options[index]?.rate}%,
             transparent ${checksPosts[post.id].options[index]?.rate}%)` : 'initial',
                                      }}
                                    >
                                      {option}
                                      {checksPosts[post.id] && checksPosts[post.id].isVoted || user?.id === iAmUser?.clerk_Id ? (
                                        <small style={{ fontWeight: 'bold' }}>{checksPosts[post.id].options[index]?.rate}%</small>
                                      ) : <></>}
                                    </label>

                                  </li>
                                );
                              })}
                            </ul>

                            {!checksPosts[post.id].isVoted ? (
                              <button
                                onClick={() => handleVoteSubmit(index)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                                disabled={selectedOptions[post.id] === null}
                                style={{ backgroundColor: '#00b4ff', fontWeight: 'bold' }}
                              >
                                Vote
                              </button>
                            ) : < ></>}
                            {checksPosts[post.id].isVoted || user?.id === iAmUser?.clerk_Id ? (
                              <><small >&nbsp;&nbsp;&nbsp;
                                Total votes </small><span >{checksPosts[post.id].allVotes}</span></>) : <></>}

                          </>) : <> </>}

                        </div>
                      </div>
                    </>}
                    <div className="flex items-center space-x-8 pt-5" style={{ paddingLeft: "55px", width: '100%', justifyContent: 'space-between' }}>
                      <div className="flex items-center space-x-2.5">
                        <div className="flex items-center space-x-2.5 pr-10">

                          <SlLike size={20} onClick={iAmUser ? () => like(post.id, iAmUser?.clerk_Id) : undefined} />
                          <div style={{ fontSize: "14px" }}>{post.likeCount !== 0 && post.likeCount}</div>
                        </div>
                        <div className="flex items-center space-x-2.5">
                          <SlDislike size={20} onClick={iAmUser ? () => dislike(post.id, iAmUser?.clerk_Id) : undefined} />
                          <div style={{ fontSize: "14px" }}>{post.dislikeCount !== 0 && post.dislikeCount}</div>
                        </div>
                      </div>

                      <TooltipProvider>
                        <Tooltip >
                          <TooltipTrigger className="max-sm:hidden">
                            <Link href={"/post/comments/" + post.id} className="block pl-0 pr-4 py-2 rounded-full">
                              <div className='flex ' >
                                {allComments[post.id] != 0 ? (
                                  <span style={{ paddingRight: '10px' }}>
                                    {allComments[post.id]}</span>) :
                                  (<span style={{ paddingRight: '10px' }}>No comments</span>)}
                                <BiCommentDetail size={24} color="gray" />
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>add comment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {iAmUser?.clerk_Id === user?.id ? (
                        <div>
                          <div onClick={(event) => toggleDeleteMenu(index, event)} >
                            <BiTrash size={24} color="brown" />
                          </div>
                          {deleteMenuOpenIndex === index ? (
                            <div
                              className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[180px]"
                              style={{
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                position: 'absolute',
                                // border: '1px solid grey'
                              }}
                            >
                              <div className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-red-300"

                                style={{ display: 'flex', justifyContent: 'center' }}
                                onClick={() => deletePost(post.id)}>
                                <span style={{ fontSize: '18px' }}>Delete</span></div>


                              {/* <div className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300" */}
                              <div className="modal-button"
                                style={{ display: 'flex', justifyContent: 'center' }}
                                onClick={closeReport}>
                                <span style={{ fontSize: '18px' }}>Cancel</span></div>
                            </div>
                          ) : (<></>)}

                        </div>) : (<></>)}

                    </div>
                  </li>

                </>))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
};

export default PostList;

'use client'
import { useEffect, useState } from 'react';
import { SlDislike, SlLike } from "react-icons/sl";
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import { formatTimeAgo } from "@/utils/format";
import { IPost } from "@/types/post.interface";
import { IChannel } from "@/types/channelinfo.interface";
import Link from "next/link";
import { BiArrowBack } from 'react-icons/bi';
import '@/styles/channelmodul.css';
import Image from 'next/image';
import api from '@/services/axiosApi';

interface IPropsPost {
  postid: number,

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

const Post: React.FC<IPropsPost> = ({ postid }) => {

  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [post, setPost] = useState<IPost | null>(null);
  const [channel, setChannel] = useState<IChannel | null>(null);
  const { user } = useUser();
  const [checksPosts, setChecksPosts] = useState<ICheckPost>();
  const [selectedOptions, setSelectedOptions] = useState< number | null >();

  const getChannel = async () => {
    try {

      const response = await api.get('/ChannelSettings/' + post?.channelSettingsId);

      if (response.status === 200) {
        const data: IChannel = await response.data;
        setChannel(data);
      } else {
        console.error('Ошибка при получении channel.json:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  const getUser = async () => {
    try {

      const response = await api.get('/ChannelSettings/getinfobychannelid/' + post?.channelSettingsId);

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
  const getPost = async () => {
    try {

      const response = await api.get('/Post/' + postid);

      if (response.status === 200) {
        const data: IPost = await response.data;
        setPost(data);
        console.log("post/", data);
      } else {
        console.error('Ошибка при получении пользователя:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
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

  useEffect(() => {
    getPost();
  }, [postid]);

  useEffect(() => {
    getUser();
    getChannel();
  }, [post]);

  async function createCheckPosts() {
    try {
        const data = await fetchVotingData(postid);  
        setChecksPosts(data); 
    } catch (error) {
        console.error("Ошибка при создании CheckPosts:", error);
    }
}


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

const handleVoteSubmit = async () => {

  if (selectedOptions !== null) {
    try {
      const response = await api.post(`/Vote/add`, { PostId: postid, OptionId: selectedOptions, UserId: user?.id }, {
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

useEffect(() => {
  createCheckPosts();

}, [post]);

return (
  <div  >

    {channel ? (<>
      <div style={{ width: '100%' }}  >
        <div style={{ marginBottom: '100px', width: '100%' }}  >

          <div className='content' style={{ width: '100%' }}>

            <div className='flex ' style={{ width: '100%', justifyContent: 'space-between', }}>
              <div className='flex '>
                <img
                  src={iAmUser?.channelProfilePhoto}
                  alt="User Avatar"
                  style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '15px' }}
                />
                <a style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }} href='#'>{iAmUser?.channelNikName}&nbsp;&nbsp;</a>
              </div>

              {post ? (<small style={{ fontWeight: 'bold', color: 'gray', paddingRight: '50px' }}>{formatTimeAgo(new Date(post.date))}</small>) : (<></>)}


            </div>
            <p style={{ textAlign: 'center', paddingTop: '20px' }}>{post?.text.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}</p>
            <br />

            {post?.photo &&
              <img src={post.photo} alt="Post image" width="100%" style={{ paddingLeft: '50px', paddingRight: '50px' }} />}
            {post?.video && (
              <>

                <video src={post.video} controls width="100%">
                  Ваш браузер не поддерживает видео.
                </video>
                <div style={{ paddingRight: '10px' }}>
                  <a href={post.video} target="_blank" rel="noopener noreferrer"
                    className="ml-4 text-blue-600 underline ">
                    {post.video}
                  </a>
                </div>

              </>
            )}

            {/* ******************************** */}
            {post?.type === "vote" && (

              <ul className="space-y-2">
                {post.options.map((option, index) => {
                   
                  const maxCount =checksPosts? Math.max(...checksPosts.options.map(opt => opt.rate)) : 0;
                  const backgroundColor = 'rgba(128, 128, 128, 0.3)';

                  return (
                    <li key={index} className="flex items-center">

                      <input
                        type="radio"
                        name={`poll-${post.id}`}
                        id={`option-${post.id}-${index}`}
                        checked={selectedOptions === index}
                        onChange={() => setSelectedOptions(index)}
                        value={index}
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
                          background: ((checksPosts?.isVoted || user?.id === iAmUser?.clerk_Id) && checksPosts?.options[index]?.rate === maxCount)
                            ? `linear-gradient(to right, rgba(0, 180, 255, 0.2) ${checksPosts?.options[index]?.rate}%,
             transparent ${checksPosts?.options[index]?.rate}%)`
                            : (checksPosts?.isVoted || user?.id === iAmUser?.clerk_Id) ? `linear-gradient(to right, rgba(211, 211, 211, 0.5) ${checksPosts?.options[index]?.rate}%,
             transparent ${checksPosts?.options[index]?.rate}%)` : 'initial',
                        }}
                      >
                        {option}
                        {checksPosts?.isVoted || user?.id === iAmUser?.clerk_Id ? (
                          <small style={{ fontWeight: 'bold' }}>{checksPosts?.options[index]?.rate}%</small>
                        ) : <></>}
                      </label>

                    </li>
                  );
 
              
                })}
              </ul>)}
              <div className='flex' style={{justifyContent:'center'}}> 
              { !checksPosts?.isVoted && (
                <button
                  onClick={ handleVoteSubmit}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                  disabled={selectedOptions === null}
                  style={{ backgroundColor: '#00b4ff', fontWeight: 'bold' }}
                >
                  Vote
                </button>
              ) }
              
             {checksPosts?.isVoted || user?.id === iAmUser?.clerk_Id ? (
                <div className='flex' style={{justifyContent:'center',flexDirection:'column'}}>
                  <div>
                  <small >&nbsp;&nbsp;&nbsp;
                  Total votes </small><span >{checksPosts?.allVotes}</span>
                  </div></div>) : <></>}
                  </div>

            {/* ************************************* */}

            <div className="flex space-x-2.5" style={{ width: '100%', justifyContent: 'end', marginTop: '20px', paddingRight: '50px' }}>

              <div className="flex items-center space-x-2.5 pr-10">
                <SlLike size={20} onClick={iAmUser ? post ? () => like(post?.id, iAmUser?.clerk_Id) : undefined : undefined} />
                <div style={{ fontSize: "14px" }}>{post?.likeCount !== 0 && post?.likeCount}</div>
              </div>
              <div className="flex items-center space-x-2.5">
                <SlDislike size={20} onClick={iAmUser ? post ? () => dislike(post?.id, iAmUser?.clerk_Id) : undefined : undefined} />
                <div style={{ fontSize: "14px" }}>{post?.dislikeCount !== 0 && post?.dislikeCount}</div>
              </div>

            </div>

          </div>








        </div> </div> </>) : <></>} </div>
);
};

export default Post;
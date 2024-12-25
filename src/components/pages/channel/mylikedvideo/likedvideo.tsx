'use client'

import React, { useState, useEffect } from 'react'
import VideoList from "@/components/pages/channel/mylikedvideo/videolist";
import { IVideo } from "@/types/videoinfo.interface";
import { useUser } from '@clerk/nextjs';
import FilterComponent from './filtersearch';
import api from '@/services/axiosApi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {PlayCircle, } from "lucide-react";
import { IUser } from '@/types/user.interface';

const LikedVideo: React.FC = () => {
  const { user } = useUser();
  const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
  const [filters, setFilters] = useState({
    uploadDate: '',
    contentType: '',
    sortBy: ''
  });
  const [nameFilt, setNameFillt] = useState('last liked video first');
  const [channelName, setChannelName] = useState("");
  const [totalVideos, setTotalVideos] = useState(0);
  
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
  const getVideos = async () => {
    try {
      if (user) {
        const response = await api.get('/Video/getlikedvideo/' + user.id);

        if (response.status === 200) {
          const mydata: IVideo[] = await response.data;
          console.log('успешный list of likedvideo', mydata);

          setMoreVideos(mydata);
          setMoreVideos(prevVideos => applyFiltersAndSorting(prevVideos));
        } else {
          console.error('Ошибка получения видео:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  const applyFiltersAndSorting = (results: any[]) => {

    if (filters.uploadDate === 'today') {
      results = results.filter((video: any) => {
        const uploadDate = new Date(video.uploadDate);
        return uploadDate.toDateString() === new Date().toDateString();
      });
    } else if (filters.uploadDate === 'month') {
      results = results.filter((video: any) => {
        const uploadDate = new Date(video.uploadDate);
        return uploadDate.getMonth() === new Date().getMonth();
      });
    }

    if (filters.contentType === 'shorts') {
      results = results.filter((video: any) => video.isShort === true);
    } else if (filters.contentType === 'video') {
      results = results.filter((video: any) => video.isShort === false);
    }

    if (filters.sortBy === 'date') {
      results = results.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    } else if (filters.sortBy === 'views') {
      results = results.sort((a: any, b: any) => b.viewCount - a.viewCount);
    } else if (filters.sortBy === 'rating') {
      results = results.sort((a: any, b: any) => b.likeCount - a.likeCount);
    }

    return results;
  };


  useEffect(() => {
    setNameFillt('');
    if (filters.contentType == '' && filters.sortBy == '' && filters.uploadDate == '')
      setNameFillt('last liked video first');
    else {
      if (filters.contentType != '')
        setNameFillt(filters.contentType);
      if (filters.uploadDate != '')
        setNameFillt(nameFilt + ', ' + filters.uploadDate);
      if (filters.sortBy != '')
        setNameFillt(nameFilt + ', ' + filters.sortBy);
    }
    getVideos();
  }, [filters]);

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);

  };
  const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const byteArrayToBase64 = (byteArray: Uint8Array) => {
    let binary = '';
    byteArray.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };
  const lastLikedVideo = moreVideos[0];
  const coverArray = lastLikedVideo ? base64ToUint8Array(lastLikedVideo.cover) : null;
  const coverBase64 = coverArray ? byteArrayToBase64(coverArray) : null;
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2">
        <div className="relative rounded-lg overflow-hidden h-[400px]">
          {lastLikedVideo ? (
            <img
              src={`data:image/jpeg;base64,${coverBase64}`}
              alt={lastLikedVideo.tittle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span>Loading...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-3">
              {lastLikedVideo ? lastLikedVideo.tittle : "Loading..."}
            </h1>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={lastLikedVideo?.channelProfilePhoto || "/placeholder.svg"}
                  alt={channelName}
                />
                <AvatarFallback>{channelName?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-lg">{channelName}</span>
            </div>
            <p className="text-lg opacity-80">{`Playlist • Private • ${totalVideos} videos`}</p>
            <p className="text-lg opacity-80 mt-2">
              {lastLikedVideo ? lastLikedVideo.description : "Loading..."}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button className="bg-white text-black hover:bg-gray-100 px-6 py-2 text-lg">
            <PlayCircle className="mr-2 h-5 w-5" /> Play all
          </Button>
        </div>
      </div>

      <div className="pr-[2%] max-sm:pr-0 flex-1" style={{ marginTop: '10px' }}>
        <FilterComponent applyFilters={applyFilters} name={nameFilt} />
        <VideoList data={moreVideos} />
      </div>
    </div>
  );

}

export default LikedVideo
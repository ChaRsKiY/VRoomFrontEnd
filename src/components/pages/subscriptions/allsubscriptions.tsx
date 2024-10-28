'use client'

import React, {useState,useEffect, ReactNode} from 'react'
import { useUser } from '@clerk/nextjs';
import Link from "next/link";
import Image from "next/image";
import {IChannel} from '@/types/channelinfo.interface';
import FolowComponent from '@/components/pages/watch/folowblock';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import FilterComponent from './filtersubscriptions';
import { SortAsc } from 'lucide-react';

interface SubscribersData {
  [key: number]: number; // Ключи - channelId, значения - количество подписчиков
}
const AllSubscriptionsComponent: React.FC = () => {

    const [ mainPageFollowed,setMainPageFollowed] = useState<IChannel[]>([]); 
    const [ allFollowed,setAllFollowed] = useState<IChannel[]>([]); 
    const { user } = useUser();
    const [subscribers, setSubscribers] = useState<SubscribersData>({});
    const [isFollowed, setIsFollowed] = useState<boolean[]>([]); 
   
    const getFollowed = async () => {
       
        try {
          // Выполняем запрос к API для получения данных подписок пользователя
          const response = await fetch(`https://localhost:7154/api/Subscription/findbyuserid/${user?.id}`);
          
          if (!response.ok) {
            throw new Error('Ошибка получения данных');
          }
      
          // Преобразуем данные в JSON
          const subscriptions = await response.json();
          console.log(subscriptions);
  
          setMainPageFollowed(  subscriptions.slice(0, 15) );

          setAllFollowed(  subscriptions);
         
        } catch (error) {
          console.error('Ошибка:', error);
          return [];
        }
    
      }; 
      
      const applyFilters = (newFilters: any) => {
        if(newFilters==='sortUp')
        {
          const sortedArray = [...allFollowed].sort((a, b) => a.channelNikName.localeCompare(b.channelNikName));
               setAllFollowed(sortedArray);
        }
        if(newFilters==='sortDown')
          {
            const sortedArray = [...allFollowed].sort((a, b) => b.channelNikName.localeCompare(a.channelNikName));
                 setAllFollowed(sortedArray);
          }
    };

      const getSubscribers = async (channelId: number): Promise<number> => {
        if (!user) return 0;
    
        try {
          const response = await fetch(`https://localhost:7154/api/Subscription/countbychannelid/${channelId}`, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error('Ошибка при получении подписчиков:', response.statusText);
            return 0;
          }
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
          return 0;
        }
      };

      const deleteSubscription = async ( channelSettingsId:number,index:number) => {
        if(user){ 
        try {     
          const response = await fetch('https://localhost:7154/api/Subscription/delete/'+channelSettingsId +'/'+ user.id , {
            method: 'DELETE',
          });
    
          if (response.ok) {
            setIsFollowed((prevIsFollowed) => {
              const newIsFollowed = [...prevIsFollowed]; // Копируем массив
              newIsFollowed[index] = false; // Меняем значение по индексу
              return newIsFollowed; // Возвращаем обновленный массив
            });
          } else {
            console.error('Ошибка при isfolowed:', response.statusText);
          }
        
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }}
      }; 

      const addSubscription=()=>{}

      useEffect(() => {
        if (user) {
            getFollowed();
        }
    }, [user]);
 
    useEffect(() => {
      // getSubscribers();
      if (allFollowed.length > 0) {
        const followedArray = Array(allFollowed.length).fill(true);
        setIsFollowed(followedArray);
      }
      
    }, [allFollowed, user]);

    useEffect(() => {
      const fetchAllSubscribers = async () => {
        // Указываем тип для результатов
        const results: { channelId: number; count: number }[] = await Promise.all(
          allFollowed.map(async (item) => {
            const count = await getSubscribers(item.id);
            return { channelId: item.id, count };
          })
        );
  
        // Используем reduce с типом SubscribersData
        const subscribersData: SubscribersData = results.reduce<SubscribersData>((acc, { channelId, count }) => {
          acc[channelId] = count;
          return acc;
        }, {});
  
        setSubscribers(subscribersData);
        console.log(subscribers);
      };
  
      fetchAllSubscribers();
    }, [allFollowed, user]);

    return (
        <div  style={{width:'100%',marginLeft:'100%'}}>
            <div style={{width:'100%'}}>
               <div style={{fontSize:'28px', fontWeight:'bold', marginLeft:'100px',marginBottom:'30px'}}>
                All your subscriptions
                </div>
              <div className='flex ' style={{width:'100%',display:'flex',justifyContent:'space-around'}}> 
                <div>
               <FilterComponent applyFilters={applyFilters} />
          {allFollowed.map((el, index) => (
                    <div className='flex'>
                    <Link href={"/gotochannel/" + el.id}  className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                        
                            <div className="text-2xl">
                                <Image className="rounded-full" src={el.channelProfilePhoto} alt={el.channelNikName} width={126} height={126}  style={{minHeight:'126px'}}/>
                            </div>
                       <div className='flex-col'>
                        <div className='flex' style={{fontWeight:'bold'}}>{el.channelNikName}
                             &nbsp;&nbsp;&nbsp;
                            <CheckCircleIcon className="h-5 w-5 text-gray-500" /> 
                          </div>
                        <div>{subscribers[el.id]} subscribers</div>
                        </div>
                    </Link>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
                    <FolowComponent isfolowed={isFollowed[index]} // Передаем состояние подписки
                       onDelete={() => deleteSubscription(el.id, index)} onAdd={addSubscription}/>
                    </div>
                    </div>
                ))}
              </div>
              </div>
             </div>
             {allFollowed.length==0?(<div className='flex ' style={{width:'100%',display:'flex',justifyContent:'space-around',
              fontSize:'18px'
             }}> 
              You don't have any subscriptions yet</div>):(<></>)}
         </div>
    )
}

export default AllSubscriptionsComponent
'use client'

import React, {useState,useEffect} from 'react'
import { useUser } from '@clerk/nextjs';

interface IChannel{

}
const AllSubscriptionsComponent: React.FC = () => {

    const [ mainPageFollowedCategories,setMainPageFollowedCategories] = useState<IChannel[]>([]); 
    const [ allFollowed,setAllFollowed] = useState<IChannel[]>([]); 
    const { user } = useUser();
   
    const getFollowedCategories = async () => {
       
        try {
          // Выполняем запрос к API для получения данных подписок пользователя
          const response = await fetch(`https://localhost:7154/api/Subscription/findbyuserid/${user?.id}`);
          
          if (!response.ok) {
            throw new Error('Ошибка получения данных');
          }
      
          // Преобразуем данные в JSON
          const subscriptions = await response.json();
          console.log(subscriptions);
          // Преобразуем данные в нужный формат для вашего массива и берем только первые 5 элементов
          setMainPageFollowedCategories(  subscriptions.slice(0, 5).map((subscription: any) => ({
            iconPath: subscription.channelPlofilePhoto || "defaultIconUrl.jpg",  // URL иконки, можно задать значение по умолчанию
            name: subscription.channelName,  // Имя категории или пользователя
            path: `/subscription/${subscription.id}`,  // Путь на страницу подписки
            iconClassNames: "rounded-full"  // Класс иконки
          })) );

          setAllFollowed(  subscriptions.map((subscription: any) => ({
            iconPath: subscription.channelPlofilePhoto || "defaultIconUrl.jpg",  // URL иконки, можно задать значение по умолчанию
            name: subscription.channelName,  // Имя категории или пользователя
            path: `/subscription/${subscription.id}`,  // Путь на страницу подписки
            iconClassNames: "rounded-full"  // Класс иконки
          })) );
      
        
      
        } catch (error) {
          console.error('Ошибка:', error);
          return [];
        }
    
      }; 

      useEffect(() => {
        if (user) {
            getFollowedCategories();
        }
    }, [user]);
 

    return (
        <div  style={{width:'100%',marginLeft:'100%'}}>
            <div>
               <div style={{fontSize:'28px', fontWeight:'bold', marginLeft:'100px'}}>
                All your subscriptions
                </div>


             </div>

         </div>
    )
}

export default AllSubscriptionsComponent
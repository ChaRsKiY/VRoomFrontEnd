'use client';
import React, {useState, useEffect} from 'react';
import { Switch } from "@/components/ui/switch";
import api from '@/services/axiosApi';
import { useUser } from '@clerk/nextjs';
import { IUserNotif } from '@/types/user-notifications.interface';

const MyPreferences: React.FC = () => {
    const { user } = useUser();
    const [iAmUser, setUser] = useState<IUserNotif | null>(null);

    const getUser = async () => {
        try {
    
          const response = await api.get('/User/getbyclerkid/' + user?.id);
    
    
          if (response.status = 200) {
            const data: IUserNotif= await response.data;
            setUser(data);
           
          } else {
            console.error('Ошибка при получении channel.json:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }
      };
    
      useEffect(() => {
        getUser();
    }, [user]);

    const onCheckedChangeRecomended = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonrecomendedvideo/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedChangeMySubscriptionChannelActivity = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonmysubscriptionchannelactivity/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedChangeActivityOnMyChannel = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonactivityonmychannel/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedOnActivityOnMyComments = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonactivityonmycomments/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedOnOthersMentionOnMyChannel = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonothersmentiononmychannel/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedOnShareMyContent = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonsharemycontent/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    const onCheckedOnPromotionalContent = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonpromotionalcontent/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    return (
        <div className="space-y-4">
            {iAmUser?(<>
            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnMySubscriptionChannelActivity} onCheckedChange={onCheckedChangeMySubscriptionChannelActivity} />
                <div>
                    <h3>Subscriptions</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity from the channels I'm
                        subscribed to</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnRecomendedVideo} onCheckedChange={onCheckedChangeRecomended} />
                <div>
                    <h3>Recommended videos</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me of videos I might like based on what I
                        watch</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnActivityOnMyChannel} onCheckedChange={onCheckedChangeActivityOnMyChannel} />
                <div>
                    <h3>Activity on my channel</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about comments and other activity on my
                        channel or videos</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnOnActivityOnMyComments} onCheckedChange={onCheckedOnActivityOnMyComments} />
                <div>
                    <h3>
                        Replies to my comments</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity on my comments and posts on
                        other channels
                    </h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnOthersMentionOnMyChannel} onCheckedChange={onCheckedOnOthersMentionOnMyChannel} />
                <div>
                    <h3>Mentions</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me when others mention my channel</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnShareMyContent} onCheckedChange={onCheckedOnShareMyContent} />
                <div>
                    <h3>
                        Shared content</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me when others share my content on their channels</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Switch defaultChecked={iAmUser.subscribedOnPromotionalContent} onCheckedChange={onCheckedOnPromotionalContent} />
                <div>
                    <h3>
                        Promotional content and offerings</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">Notify me of promotional content and offerings, like members-only perks</h4>
                </div>
            </div></> ):<></>}
        </div>
    )
}

export default MyPreferences
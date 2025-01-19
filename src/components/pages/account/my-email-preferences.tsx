'use client';
import React, {useState, useEffect} from 'react'
import { Switch } from "@/components/ui/switch";
import api from '@/services/axiosApi';
import { useUser } from '@clerk/nextjs';
import { IUserNotif } from '@/types/user-notifications.interface';

const MyEmailPreferences: React.FC = async () => {
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

    const onEmailCheckedChangeRecomended = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonrecomendedvideo/' + user.id + '/' + checked);
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
    const onEmailCheckedChangeMySubscriptionChannelActivity = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonmysubscriptionchannelactivity/' + user.id + '/' + checked);
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
    const onEmailCheckedChangeActivityOnMyChannel = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonactivityonmychannel/' + user.id + '/' + checked);
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
    const onEmailCheckedOnActivityOnMyComments = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonactivityonmycomments/' + user.id + '/' + checked);
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
    const onEmailCheckedOnOthersMentionOnMyChannel = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonothersmentiononmychannel/' + user.id + '/' + checked);
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
    const onEmailCheckedOnShareMyContent = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonsharemycontent/' + user.id + '/' + checked);
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
    const onEmailCheckedOnPromotionalContent = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/emailsubscribeonpromotionalcontent/' + user.id + '/' + checked);
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
        <div className="flex-1">
            {iAmUser?(
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnMySubscriptionChannelActivity} onCheckedChange={onEmailCheckedChangeMySubscriptionChannelActivity} />
                    <div>
                        <h3>Subscriptions</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity from the channels I'm
                            subscribed to</h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnRecomendedVideo} onCheckedChange={onEmailCheckedChangeRecomended} />
                    <div>
                        <h3>Recommended videos</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me of videos I might like based on what I
                            watch</h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnActivityOnMyChannel} onCheckedChange={onEmailCheckedChangeActivityOnMyChannel} />
                    <div>
                        <h3>Activity on my channel</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me about comments and other activity on my
                            channel or videos</h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnOnActivityOnMyComments} onCheckedChange={onEmailCheckedOnActivityOnMyComments} />
                    <div>
                        <h3>
                            Replies to my comments</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me about activity on my comments and posts
                            on
                            other channels
                        </h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnOthersMentionOnMyChannel} onCheckedChange={onEmailCheckedOnOthersMentionOnMyChannel} />
                    <div>
                        <h3>Mentions</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me when others mention my channel</h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnShareMyContent} onCheckedChange={onEmailCheckedOnShareMyContent} />
                    <div>
                        <h3>
                            Shared content</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me when others share my content on their
                            channels</h4>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch defaultChecked={iAmUser.emailSubscribedOnPromotionalContent} onCheckedChange={onEmailCheckedOnPromotionalContent} />
                    <div>
                        <h3>
                            Promotional content and offerings</h3>
                        <h4 className="text-[0.9rem] text-neutral-500">Notify me of promotional content and offerings,
                            like members-only perks</h4>
                    </div>
                </div>
            </div> ):<></>}
        </div>
    )
}

export default MyEmailPreferences
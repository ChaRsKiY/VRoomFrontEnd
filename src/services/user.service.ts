import {IUser} from "@/types/user.interface";

export const getUser = async (user: any, setUser: (prev: IUser) => void) => {
    try {
        if(user){
            const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfochannel/' + user?.id, {
                method: 'GET',
            });

            if (response.ok) {
                const data: IUser = await response.json();
                setUser(data);
            } else {
                console.error('Ошибка при получении пользователя:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
    }
};
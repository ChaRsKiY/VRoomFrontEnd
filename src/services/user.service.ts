import {IUser} from "@/types/user.interface";
import api from "@/services/axiosApi"

export const getUser = async (user: any, setUser: (prev: IUser) => void) => {
    try {
        if(user){
            const response = await api.get('/ChannelSettings/getinfochannel/' + user?.id);

            if (response.status===200) {
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
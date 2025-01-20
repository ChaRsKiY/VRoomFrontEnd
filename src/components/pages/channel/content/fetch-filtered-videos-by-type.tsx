import api from '@/services/axiosApi';

export async function fetchVideos(userId: string, isShort: boolean, appliedFilters = {}) {
    try {
        // Получаем информацию о канале
        const firstResponse = await api.get(`/ChannelSettings/getbyownerid/${userId}`);

        // Получаем видео по каналу с фильтрами
        const response = await api.get(`/Video/getvideosorshortsbychannelidwithfilters`, {
            params: {
                id: firstResponse.data.id,
                isShort: isShort,
                ...appliedFilters,
            },
        });

        return response.data; // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export async function fetchShortsOrVideosByChannelId(pageNumber: number, pageSize: number, channelId: number, isShort: boolean) {
    try {/*/1/4/${channelId}/${false}*/
        const response = await api.get(`/Video/getchannelshortsorvideospaginated`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                channelid: channelId,
                isShort: isShort,
            },
        });

        return response.data; // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}


export async function fetchPinnedVideoOrNullByChannelId(channelId: number) {
    try {
        const response = await api.get(`/PinnedVideo/getpinnedvideoornullbychannelid/${channelId}`);
        console.log('Полученные данные:', response.data);
        return response.data === "" ? null : response.data;
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return;
    }
}

export async function fetchPinnedVideoByChannelId(channelId: number) {
    try {
        const response = await api.get(`/PinnedVideo/getpinnedvideobychannelid/${channelId}`);
        console.log('Полученные данные:', response.data);
        return response.data === "" ? null : response.data;
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return;
    }
}

export async function fetchAllVideosByChannelId(channelId: number) {
    try {
        const response = await api.get(`/Video/getchannelvideos/${channelId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return;
    }
}
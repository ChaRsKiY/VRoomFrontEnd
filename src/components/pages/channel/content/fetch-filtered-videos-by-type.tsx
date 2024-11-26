import api from '@/services/axiosApi';

async function fetchVideos(userId: string, isShort: boolean, appliedFilters = {}) {
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

export default fetchVideos;//()

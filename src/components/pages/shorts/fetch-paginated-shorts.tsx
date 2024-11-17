import api from '@/services/axiosApi';

export async function fetchPaginatedShorts(pageNumber: number, pageSize: number, specificId?: number | null) {
    try {
        const response = await api.get(`/Video/getallvideoinfopaginatedwith1vbyid/${pageNumber}/${pageSize}/${specificId}`);
        console.log('sp=' + specificId);
        return response.data; // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

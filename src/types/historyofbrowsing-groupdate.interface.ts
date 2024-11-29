import {IPresentedChannel} from "@/types/channel.interface";
import {VideoHistoryItem} from "@/types/VideoHistoryItem";

export interface HistoryOfBrowsingGroupDate {
    date: string; // Дата просмотра
    historyOfBrowsingVideos: VideoHistoryItem[]; // Список видео за эту дату
}
export interface ChSection {
    id: number;
    title: string;
}

export interface ChannelSection {
    id: number;
    channel_SettingsId: number;
    title: string;
    sectionId: number;
    order: number;
    isVisible: boolean;
}

export interface ChannelSectionWithUrl extends ChannelSection {
    url: string;
    urlType: string; // Поле для проверки соответствия
}

export interface ChannelSectionWithContent extends ChannelSection {
    type: string; //"videoList" | "singleVideo" | "text" Тип контента
}
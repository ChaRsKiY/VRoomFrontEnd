import { ISubtitle } from "@/types/subtitle.interface";

export interface IContentVideo {
    id: number,
    objectID: string,
    channelSettingsId: number,
    tittle: string,
    description: string,
    uploadDate: Date,
    duration: number,
    videoUrl: string,
    vRoomVideoUrl: string,
    cover: string,
    viewCount: number,
    likeCount: number,
    dislikeCount: number,
    isShort: boolean,
    categoryIds?: [],
    visibility: boolean,
    isAgeRestriction: boolean,
    isCopyright: boolean,
    audience: string,
    tagIds?: [],
    historyOfBrowsingIds?: [],
    commentVideoIds?: [],
    playLists?: [],
    lastViewedPosition: string,
    subtitles?:ISubtitle[],
}
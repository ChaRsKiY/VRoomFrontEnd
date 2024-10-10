
export interface IContentVideo {
    id: number,
    objectID: string,
    channelSettingsId:number,
    tittle: string,
    description: string,
    uploadDate: Date,
    duration: number,
    videoUrl: string,
    cover:string,
    viewCount: number,
    likeCount:number,
    dislikeCount:number,
    isShort:boolean,
    categoryIds?:[],
    visibility:boolean,
    tagIds?:[],
    historyOfBrowsingIds?:[],
    commentVideoIds?:[],
    playLists?:[],
    lastViewedPosition:string,
}
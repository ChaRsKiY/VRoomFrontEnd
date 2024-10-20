export interface IVideo {
    id: number,
    objectId:string,
    tittle: string,
    uploadDate: Date,
    duration:number,
    channelSettingsId: number,
    channelName:string,
    channelBanner:string,
    videoUrl:string,
    description: string,
    viewCount :number,
    likeCount:number,
    dislikeCount:number,
    isShort:boolean,
    cover: string,
    visibility: boolean,
}


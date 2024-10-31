export interface IPost {
    id: number,
    text: string,
    channelSettingsId: number,
    date: Date,
    photo?: string,
    video?:string,
    likeCount:number,
    dislikeCount:number,
    type?:string,
    options:[]
}

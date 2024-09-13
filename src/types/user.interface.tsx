

export interface IUser {
    id: string,
    clerk_Id: string,
    channelName: string,
    channelSettings_Id:number,
    channelBanner:string,
    isPremium:boolean,
    subscriptionCount:number,
    subscriptions:[],
    playLists:[],
    historyOfBrowsing:[],
    commentPosts:[],
    commentVideos:[],
    answerPosts:[],
    answerVideos:[]
}

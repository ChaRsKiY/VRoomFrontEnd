export interface IChannel {
    id:number;
    channelName: string,
    channelNikName: string,
    description: string
    dateJoined: Date;
    channelBanner:string;
    channelProfilePhoto:string;
    channel_URL:string;
    owner_Id:number;
    language_Id: number;
    country_Id:number;
    notification:boolean;
    videos:[];
    posts:[];
    subscriptions:[];
}

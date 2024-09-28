export interface ICommentPost {
    id:number,
    userId: string,
    userName: string,
    channelBanner:string,
    postId:number,
    comment: string,
    date: Date,
    likeCount:number,
    dislikeCount:number,
    answerPostId?:number,
    isPinned:boolean,
    isEdited:boolean,
    users?:[]
}
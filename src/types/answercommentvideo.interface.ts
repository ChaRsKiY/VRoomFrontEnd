export interface IAnswerCommentVideo {
    id:number,
    userId: string,
    userName: string,
    channelBanner:string,
    commentVideo_Id:number,
    text: string,
    answerDate: Date,
    likeCount:number,
    dislikeCount:number,
    isEdited:boolean
}


export interface ICommentVideo {
    UserId: string,
    VideoId:number,
    Comment: string,
    Date: Date,
    LikeCount:number,
    DislikeCount:number,
    AnswerVideoId?:number,
    IsPinned:boolean,
    IsEdited:boolean
}

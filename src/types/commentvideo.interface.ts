
export interface ICommentVideo {
    userId: string,
    videoId:number,
    comment: string,
    date: Date,
    likeCount:number,
    dislikeCount:number,
    answerVideoId?:number,
    isPinned:boolean,
    isEdited:boolean
}

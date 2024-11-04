export interface IAnswerCommentPost {
    id: number,
    userId: string,
    userName: string,
    channelBanner: string,
    channelId?: number,
    commentPost_Id: number,
    text: string,
    answerDate: Date,
    likeCount: number,
    dislikeCount: number,
    isEdited: boolean
}
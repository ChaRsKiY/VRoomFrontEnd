
export interface ICommentVideo {
    id: number,
    userId: string,
    userName: string,
    channelBanner: string,
    channelId?: number,
    videoId: number,
    comment: string,
    date: Date,
    likeCount: number,
    dislikeCount: number,
    answerVideoId?: number,
    isPinned: boolean,
    isEdited: boolean,
    users?: []
}

export interface GetVideoSubscribedDTO {
    id: string;
    creatorId: string;
    thumbnail: string;
    title: string;
    description: string;
    url: string;
    duration: number;
    liked: boolean;
    creator: {
        id: string;
        username: string;
        avatar: string;
        subscribed: boolean;
    };
}
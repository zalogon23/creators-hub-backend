export interface GetVideoSubscribedDTO {
    id: string;
    creator: {
        id: string;
        avatar: string;
        username: string;
    }
    title: string;
    description: string;
    url: string;
    duration: number;
    thumbnail: string;
    subscribed: boolean;
}
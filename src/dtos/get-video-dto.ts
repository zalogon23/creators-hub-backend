export interface GetVideoDTO {
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
}
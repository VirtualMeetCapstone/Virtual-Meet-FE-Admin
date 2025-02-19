export interface User {
    id : string,
    name: string,
    picture: {
        url: string;
        type: number;
        thumbnailUrl?: string | null;
    };
    bio: string,
    followersCount: number

}

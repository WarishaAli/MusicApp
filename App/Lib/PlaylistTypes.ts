export enum PlaylistTypes{
    EXPLORE= "Explore",
    PLAYLIST = "Playlist"
}

export interface Playlist {
    name: string;
    image?: string;
    songs: Songs[];
}
export interface Songs{
    name: string;
    artist: string;
    url: string;
}
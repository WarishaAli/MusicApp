import { Songs } from "./PlaylistTypes";
import RNTrackPlayer from "react-native-track-player";

export const transformSongArray = (songArray: Array<Songs>) => {
    if(songArray){
    let newArray = songArray.map((item, index, array) => {
        return {
            id: item.songid,
            url: item.song_file,
            title: item.song_name,
            artist: item.artistName,
            artwork: item.songimage,
        };
    })
    return newArray;
    // console.log("array for track player", newArray);
}}

export const transformSongObject = (songObject: any) => {
    return {
        songid: songObject.id,
        song_name: songObject.title,
        song_category: "",
        songimage: songObject.artwork,
        song_file: songObject.url,
        song_type: "mp3",
        artistName: songObject.artist,
    }
}

export const  getPlayerState = async () => {
    const b = await RNTrackPlayer.getState();
    console.log("player state", b);
    return b === 3 ? true : false;
}
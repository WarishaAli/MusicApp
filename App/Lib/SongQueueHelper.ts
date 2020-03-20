import { Songs } from "./PlaylistTypes";

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

// artistName: "Ms Cash"
// songid: "88"
// song_name: "Burn Rubber"
// song_category: "Club"
// song_image: "b410b7b8ed67a3cf4e7bf4ed32768c4e.jpg"
// song_file: "http://app.hiphopstreets.com/songfile/e4b030132131cbf9a062eb30bcad3d99.mp3"
// userid: "93"
// status: "1"
// add_date: "2017-08-06 17:09:04"
// likecount: "2"
// song_type: "mp3"
// cat_id: "0"
// featured: "0"
// songimage: "http://app.hiphopstreets.com/songimage/b410b7b8ed67a3cf4e7bf4ed32768c4e.jpg"
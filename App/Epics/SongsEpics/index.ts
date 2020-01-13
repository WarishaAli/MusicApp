import { Epic, ofType } from "redux-observable";
import { getType } from "typesafe-actions";
import { SongsActions } from "../../Reducers/SongsReducer";
import {mergeMap} from "rxjs/operators";
import {findCurrentSongIndex} from "../../Lib/MusicPlayerHelpers";
import { of } from "rxjs";

export const setNextSongEpic: Epic = (action$, state$) => action$.pipe(
    ofType(getType(SongsActions.setNextSong)),
    mergeMap(() => {
        const currentPlaylist = state$.value.songs.playlist;
        const currentSong = state$.value.songs.song;
        console.log(currentSong, currentPlaylist);
        const currentIndex = findCurrentSongIndex(currentPlaylist.songs, currentSong);
        console.log(currentIndex);
        if(currentIndex + 1 <= currentPlaylist.songs.length-1){
            return of(SongsActions.setSong(currentPlaylist.songs[currentIndex+1]));
        } else{
            return of(SongsActions.void());
        }
    })
    ); 
export const setPrevSongEpic: Epic = (action$, state$) => action$.pipe(
    ofType(getType(SongsActions.setPreviousSong)),
    mergeMap(() => {
        const currentPlaylist = state$.value.songs.playlist;
        const currentSong = state$.value.songs.song;
        const currentIndex = findCurrentSongIndex(currentPlaylist.songs, currentSong);
        if(currentIndex > 0){
            return of(SongsActions.setSong(currentPlaylist.songs[currentIndex-1]));
        } else{
            return of(SongsActions.void());
        }
    })
)

export const selectSongEpic: Epic = (action$, state$) => action$.pipe(
    ofType(getType(SongsActions.setPlaylist)),
    mergeMap(() => {
        console.log(state$.value.songs.playlist.songs[0]);
        return of(SongsActions.setSong(state$.value.songs.playlist.songs[0]))
    })
);
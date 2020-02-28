import { Epic, ofType } from "redux-observable";
import { getType } from "typesafe-actions";
import { CategoryAction } from "../../Reducers/CategoryReducers"
import { mergeMap } from "rxjs/operators";
import { IDependencies } from "../../Reducers/CreateStore";
import { of } from "rxjs";
import { SongsActions } from "../../Reducers/SongsReducer";
import SoundPlayer from "react-native-sound-player";

export const getCategoriesEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getCategoryRequest)),
    mergeMap((action) => {
        return api.hiphop.getCategories().pipe(
            mergeMap((response) => {
                if (response.ok) {
                    return of(CategoryAction.getCategorySuccess(response.data.data))
                } else {
                    return of(CategoryAction.getCategoryFailure())
                }
            })
        )
    })
)

export const getSongByCategoryEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getSongByCatRequest)),
    mergeMap((action) => {
        return api.hiphop.getSongByCat(action.payload).pipe(
            mergeMap((response) => {
                console.log("song by category", response);
                if (response.ok) {
                    response.data.data.length > 0 &&
                    SoundPlayer.playUrl(response.data.data[0].song_file);
                    return response.data.data.length > 0 ? 
                    of(CategoryAction.getSongByCatSuccess(response.data.data),
                    SongsActions.setPlaylist(response.data.data), SongsActions.setSong(response.data.data[0]),
                    SongsActions.setIsPlaying(true), SongsActions.showPlaying(true)
                    ) : of(CategoryAction.getSongByCatSuccess(response.data.data))


                } else {
                    return of(CategoryAction.getSongByCatFailure())
                }
            })
        )
    })
)

export const getHomeDataEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getHomeDataReq)),
    mergeMap((action) => {
        return api.hiphop.homeData().pipe(
            mergeMap((response) => {
                if (response.ok) {
                    return of(CategoryAction.getHomeDataSuccess({
                        featuredSongs: response.data.featuredSongs, featuredVideos: response.data.featuredVideos,
                        featuredPodcasts: response.data.podcastShows,
                    }))
                } else {
                    return of(CategoryAction.getHomeDataFailure())
                }
            })
        )
    })
)
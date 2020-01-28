import { Epic, ofType } from "redux-observable";
import { getType } from "typesafe-actions";
import {CategoryAction} from "../../Reducers/CategoryReducers"
import { mergeMap } from "rxjs/operators";
import { IDependencies } from "../../Reducers/CreateStore";
import { of } from "rxjs";
import { SongsActions } from "../../Reducers/SongsReducer";

export const getCategoriesEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getCategoryRequest)),
    mergeMap((action) =>{
        return api.hiphop.getCategories().pipe(
            mergeMap((response) => {
                
                console.log("cate response", response)
                if(response.ok){
                    return of(CategoryAction.getCategorySuccess(response.data.data))
                } else{
                    return of(CategoryAction.getCategoryFailure())
                }
            })
        )
    })
) 

export const getSongByCategoryEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getSongByCatRequest)),
    mergeMap((action) =>{
        return api.hiphop.getSongByCat(action.payload).pipe(
            mergeMap((response) => {
                if(response.ok){
                    return of(CategoryAction.getSongByCatSuccess(response.data.data), SongsActions.setPlaylist(response.data.data))
                } else{
                    return of(CategoryAction.getSongByCatFailure())
                }
            })
        )
    })
)

export const getHomeDataEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
    ofType(getType(CategoryAction.getHomeDataReq)),
    mergeMap((action) =>{
        return api.hiphop.homeData().pipe(
            mergeMap((response) => {
                console.log("home data", response.data)
                if(response.ok){
                    return of(CategoryAction.getHomeDataSuccess({featuredSongs: response.data.featuredSongs, featuredVideos:response.data.featuredVideos,
                    featuredPodcasts: response.data.podcastShows,
                    }))
                } else{
                    return of(CategoryAction.getHomeDataFailure())
                }
            })
        )
    })
)
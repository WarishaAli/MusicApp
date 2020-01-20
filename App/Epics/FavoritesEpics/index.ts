import { Epic, ofType } from "redux-observable";
import { getType } from "typesafe-actions";
import { mergeMap } from "rxjs/operators";
import { IDependencies } from "../../Reducers/CreateStore";
import { of } from "rxjs";
import { FavoriteAction } from "../../Reducers/FavoritesReducer";
import { ApiResponse } from "apisauce";

export const getFavoritesEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
    ofType(getType(FavoriteAction.getFavoriteRequest)),
    mergeMap((action) =>{
        return api.hiphop.getFavoriteSongs(state$.value.login.userData.access_token).pipe(
            mergeMap((response: ApiResponse<any>) => {
                if(response.ok && response.data.status === 200){
                    console.log("response fav", response);
                    return of(FavoriteAction.getFavoriteSuccess(response.data.data))
                } else{
                    return of(FavoriteAction.getFavoriteFailure())
                }
            })
        )
    })
) 
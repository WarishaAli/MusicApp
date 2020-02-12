import { Epic, ofType } from "redux-observable"
import { of } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { getType } from "typesafe-actions"
import { IDependencies } from "../../Reducers/CreateStore"
import { ProfileAction } from "../../Reducers/ProfileReducers"
import { Alert } from "react-native"


export const getProfileEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
    ofType(getType(ProfileAction.getProfileRequest)),
    mergeMap((action) => {
        return api.hiphop.getProfile(state$.value.login.userData.access_token).pipe(
            mergeMap((response) => {
                // console.log("profile response", response)
                if (response.ok) {
                    return of(ProfileAction.getProfileSuccess(response.data.userobject))
                } else {
                    return of(ProfileAction.getProfileFailure())
                }
            })
        )
    })
)

export const updateProfileEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
    ofType(getType(ProfileAction.updateProfileRequest)),
    mergeMap((action) => {
        return api.hiphop.updateProfile(state$.value.login.userData.access_token, action.payload).pipe(
            mergeMap((response) => {
                console.log("profile update response", response)
                if (response.ok) {
                    return of(ProfileAction.updateProfileSuccess(response.data.useobject))
                } else {
                    Alert.alert("Error", "Unfortunately an error occured updating your profile, please check your internet connection or try again later");
                    return of(ProfileAction.updateProfileFailure())
                }
            })
        )
    })
)
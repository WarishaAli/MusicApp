import AsyncStorage from '@react-native-community/async-storage';
import { ApiResponse } from "apisauce";
import { Alert } from "react-native";
import { Epic, ofType } from "redux-observable";
import { of } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { getType } from "typesafe-actions";
import { LOGIN_KEY } from "../../Lib/Constants";
import { IUserData } from "../../Lib/Interfaces";
import { IDependencies } from "../../Reducers/CreateStore";
import { LoginActions } from "../../Reducers/LoginReducers";
import { SongsActions } from "../../Reducers/SongsReducer";
import { ProfileAction } from '../../Reducers/ProfileReducers';
import { async } from 'rxjs/internal/scheduler/async';

export let loginData: any = undefined;
// export let shouldLogin: boolean = false;
export let loginResponse: IUserData = undefined;

export const checkIfLoginEpic: Epic = (action$, state$) => action$.pipe(
  ofType(getType(LoginActions.checkIsLogin)),
  mergeMap(async () => {
    // var loginData: IUserData | undefined = undefined;
    try {
      const value = await AsyncStorage.getItem(LOGIN_KEY);
      console.log("from async storage", value);
      if (value !== null) {
        loginData = JSON.parse(value);
      }
    } catch (e) {
      console.log(e, "error getting value from async");
      return of(SongsActions.void())
    }
  }),
  mergeMap((response) => {
    return loginData ? of(LoginActions.loginSuccess(loginData), ProfileAction.getProfileRequest()) : of(LoginActions.loginFailure());
    // return of(LoginActions.loginSuccess({}))
  }),
)

export const loginRequestEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.loginRequest)),
  mergeMap((action) => {
    return api.hiphop.login(action.payload.email, action.payload.pwd, action.payload.socialType, action.payload.socialId).pipe(
      mergeMap(async (response: ApiResponse<any>) => {
        console.log(response)
        if (response.ok && response.data.error === false) {

          try {
            await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(response.data.object));
            loginResponse = response.data.object;
          }
          catch (error) {
            console.log(error);
            Alert.alert("Error", "Unfortunately an error occurred while saving your login information, please try again later or contact customer support");
            // return of(LoginActions.loginFailure());
          }
        }
        else {
          Alert.alert("Error", "Unfortunatley an error occurred during your login, please check your credentials or try again later");
          // return of(LoginActions.loginFailure())
        };
        return of(SongsActions.void())
      }),
      mergeMap(() => {
        return loginResponse ? of(LoginActions.loginSuccess(loginResponse)) : of(LoginActions.loginFailure());
        // return of(LoginActions.loginSuccess({}))

      })
    );
  })
);
export const signupRequestEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.signup)),
  mergeMap((action) => {
    return api.hiphop.signup(action.payload.username, action.payload.email, action.payload.pwd).pipe(
      mergeMap(async (response: ApiResponse<any>) => {
        if (response.ok && response.data.error === false) {
          try {
            await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(response.data.object));
            loginResponse = response.data.object;
          }
          catch (error) {
            console.log(error);
            Alert.alert("Error", "Unfortunately an error occurred while saving your account information, please try again later or contact customer support");
          }
        }
        else {
          Alert.alert("Error", "Unfortunatley an error occurred during your signup, please check your internet connection or try again later");
        };
        return of(SongsActions.void())
      }),
      mergeMap(() => {
        return loginResponse ? of(LoginActions.loginSuccess(loginResponse)) : of(LoginActions.loginFailure());


      })
    );
  })
);

export const logoutEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.logout)),
  mergeMap((action: any) => {
    return api.hiphop.logout(state$.value.login.userData.access_token).pipe(
      mergeMap(async() => {
        try{
            await AsyncStorage.removeItem(LOGIN_KEY)
        }catch{
          console.log("logout error")
        }
        return of(SongsActions.void())
    }),
      mergeMap(() => {
        return of(LoginActions.loginFailure());
      })
    )
  })
)
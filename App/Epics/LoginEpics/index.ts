import { Epic, ofType } from "redux-observable";
import { getType } from "typesafe-actions";
import { LoginActions } from "../../Reducers/LoginReducers";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import AsyncStorage from '@react-native-community/async-storage';
import { LOGIN_KEY } from "../../Lib/Constants";
import { IDependencies } from "../../Reducers/CreateStore";
import { ApiResponse } from "apisauce";
import { IUserData } from "../../Lib/Interfaces";
import { Alert } from "react-native";
import { from } from "seamless-immutable";

export const checkIfLoginEpic: Epic = (action$, state$) => action$.pipe(
    ofType(getType(LoginActions.checkIsLogin)),
    mergeMap(async () => {
        let isLogin = false;
              const value =  await AsyncStorage.getItem(LOGIN_KEY);
              if(value !== null) {
                //   value.userId ? isLogin= true : isLogin = false
                //   console.log(value.userId, "login check")
              console.log(value, JSON.stringify(value));
              return of(LoginActions.loginSuccess(value));
              } else{
                return of(LoginActions.loginFailure());
              }
    }),
    mergeMap((response) => {
      return from(response)}),
);

export const loginRequestEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.loginRequest)),
  mergeMap((action) => {
    return api.hiphop.login(action.payload)
    // return api.hiphop.getSongByCat()
    .pipe(
      mergeMap(async (response: ApiResponse<any>) => {
        console.log("response", response, response.data.error);
        if(response.ok && response.data.error === "false"){
          try{
            await AsyncStorage.setItem(LOGIN_KEY, response.data);
            return of(LoginActions.loginSuccess(response.data))
          }
          catch(error){
            Alert.alert("Error", "Unfortunately an error occurred while saving your login information, please try again later or contact customer support");
            return of(LoginActions.loginFailure());
          }
        }
        else{
          Alert.alert("Error", "Unfortunatley an error occurred during your login, please check your internet connection or try again later");
          return of(LoginActions.loginFailure())
        }
      })
    );
  })
);

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

export const checkIfLoginEpic: Epic = (action$, state$) => action$.pipe(
    ofType(getType(LoginActions.checkIsLogin)),
    mergeMap(() => {
        let isLogin = false;
              const value =  AsyncStorage.getItem(LOGIN_KEY);
              if(value !== null) {
                //   value.userId ? isLogin= true : isLogin = false
                //   console.log(value.userId, "login check")
              console.log(value);
              }
        return of(LoginActions.setIsLogin(isLogin));
    })
);

export const loginRequestEpic: Epic = (action$, state$, {api}: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.loginRequest)),
  mergeMap((action) => {
    return api.hiphop.login({socialType: "normal", deviceType: "android",
    deviecId: "sdSdSDs", emailId: "ali.warishaa@gmail.com", password: "123456"}).pipe(
      mergeMap((response: ApiResponse<any>) => {
        console.log("response", response);
        if(response.ok){
          return of(LoginActions.loginSuccess(response.data))
        }
        else{
          Alert.alert("Error", "Unfortunatley an error occurred during your login, please check your internet connection or try again later");
          return of(LoginActions.loginFailure())
        }
      })
    );
  })
);

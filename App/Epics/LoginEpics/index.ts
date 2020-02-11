import AsyncStorage from '@react-native-community/async-storage';
import { ApiResponse } from "apisauce";
import { Alert } from "react-native";
import { Epic, ofType } from "redux-observable";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { getType } from "typesafe-actions";
import { UserRole } from '../../Containers/SignupScreen/SignupScreen';
import { LOGIN_KEY } from "../../Lib/Constants";
import { IUserData } from "../../Lib/Interfaces";
import { IDependencies } from "../../Reducers/CreateStore";
import { LoginActions } from "../../Reducers/LoginReducers";
import { ProfileAction } from '../../Reducers/ProfileReducers';
import { SongsActions } from "../../Reducers/SongsReducer";

export let loginData: any = undefined;
// export let shouldLogin: boolean = false;
export let loginResponse: IUserData | undefined = undefined;
// export let userRole: UserRole = undefined;

export const checkIfLoginEpic: Epic = (action$, state$) => action$.pipe(
  ofType(getType(LoginActions.checkIsLogin)),
  mergeMap(async () => {
    // var loginData: IUserData | undefined = undefined;
    try {
      const value = await AsyncStorage.getItem(LOGIN_KEY);
      if (value !== null) {
        loginData = JSON.parse(value);
      }
    } catch (e) {
      return of(SongsActions.void())
    }
  }),
  mergeMap((response) => {
    return loginData ? of(LoginActions.loginSuccess(loginData), ProfileAction.getProfileRequest()) : of(LoginActions.loginFailure());
    // return of(LoginActions.loginSuccess({}))
  }),
)
export const storeLoginData = async (loginData: IUserData) => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(loginData));
    loginResponse = loginData;
  }
  catch (error) {
    Alert.alert("Error", "Unfortunately an error occurred while saving your login information, please try again later or contact customer support");
    // return of(LoginActions.loginFailure());
  }
}
export const loginRequestEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.loginRequest)),
  mergeMap((action) => {
    console.log("at login request payload", action.payload)
    return api.hiphop.login(action.payload.email, action.payload.pwd, action.payload.socialType, action.payload.socialId).pipe(
      mergeMap(async (response: ApiResponse<any>) => {
        console.log("login response", response);
        if (response.ok && response.data.error === false) {
          if (response.data.object.user_cat !== "undefined") {
            // loginResponse = response.data.object;
            await storeLoginData(response.data.object);

          } else {
            console.log("at no user cat");
            let userRole = "";
            const a = new Promise((resolve, reject) => {
              Alert.alert("Input", "Please provide your user role", [
                {
                  text: "Artist User",
                  onPress: async () => {
                    response.data.object.user_cat = UserRole.ARTIST;
                    await storeLoginData(response.data.object);
                    // loginResponse = response.data.object;
                  }
                },
                {
                  text: "Normal User",
                  onPress: async () => {
                    response.data.object.user_cat = UserRole.NORMAL;
                    await storeLoginData(response.data.object);
                    // loginResponse = response.data.object;
                  }
                }
              ]);
            });
            // a.then(() => {
            //   response.data.object.user_cat = userRole;
            //   storeLoginData(response.data.object);
            //   loginResponse = response.data.object;
            // });
            // a.catch(() => {
            //   loginResponse = undefined;
            // });

            // let userRoles = await action.payload.noUserRole();
            // console.log("user role form modal", userRoles);
            // if(userRole === UserRole.NORMAL || userRole === UserRole.ARTIST){

            // }
          }
          // try {
          //   await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(response.data.object));
          //   loginResponse = response.data.object;
          // }
          // catch (error) {
          //   Alert.alert("Error", "Unfortunately an error occurred while saving your login information, please try again later or contact customer support");
          //   // return of(LoginActions.loginFailure());
          // }
        }
        else {
          Alert.alert("Error", "Unfortunatley an error occurred during your login, please check your credentials or try again later");
          // return of(LoginActions.loginFailure())
          loginResponse = undefined;
        };
        return of(SongsActions.void())
      }),
      mergeMap(() => {
        if(loginResponse !== undefined){
          return action.payload.socialType === "facebook" ? of(LoginActions.loginSuccess(loginResponse)) :  of(LoginActions.loginSuccess(loginResponse), ProfileAction.getProfileRequest())
        }else{
          return of(LoginActions.loginFailure())
        }
      })
    );
  })
);
export const signupRequestEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.signup)),
  mergeMap((action) => {
    return api.hiphop.signup(action.payload.username, action.payload.email, action.payload.pwd, action.payload.userRole).pipe(
      mergeMap(async (response: ApiResponse<any>) => {
        console.log("signup response", response);
        if (response.ok && response.data.error === false) {
          try {
            await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(response.data.object));
            loginResponse = response.data.object;
          }
          catch (error) {
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

export const logoutEpic: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.logout)),
  mergeMap((action: any) => {
    return api.hiphop.logout(state$.value.login.userData.access_token).pipe(
      mergeMap(async () => {
        try {
          await AsyncStorage.removeItem(LOGIN_KEY)
        } catch{
          console.log("logout error")
        }
        return of(SongsActions.void())
      }),
      mergeMap(() => {
        return of(LoginActions.loginFailure());
      })
    )
  })
);

export const socialLogout: Epic = (action$, state$, { api }: IDependencies) => action$.pipe(
  ofType(getType(LoginActions.socialLogout)),
  mergeMap(async (action: any) => {
    try {
      const value = await AsyncStorage.getItem(LOGIN_KEY);
      // console.log("at social logout", value);
      if (value !== null) {
        try {
          await AsyncStorage.removeItem(LOGIN_KEY)
        } catch{
          console.log("logout error")
        }
      }
    } catch (e) {
      // console.log(e, "error getting value from async");
      return of(SongsActions.void())
    }
  })
);

// export const checkUserRoleEpic: Epic = (action$, state$) => action$.pipe(
//   ofType(getType(LoginActions.checkUserRole)),
//   mergeMap(async (action) => {
//     try {
//       const value = await AsyncStorage.getItem(LOGIN_KEY);
//       if (value !== null) {
//         userRole = JSON.parse(value).user_cat;
//       }
//     } catch (e) {
//       return of(SongsActions.void())
//     }
//   }),
//   mergeMap((response) => {
//     console.log(response);
//     if(userRole === UserRole.ARTIST || userRole === UserRole.NORMAL){
//       return of(LoginActions.setUserRole(userRole))
//     }
//     else{
//       // action.payload && action.payload();
//       return of(SongsActions.void())
//     }
//     // return (userRole === UserRole.ARTIST || userRole === UserRole.NORMAL) ? of(LoginActions.setUserRole(userRole)) : of(SongsActions.void());
//     // return of(LoginActions.loginSuccess({}))
//   }),
// )
import { createAction, PayloadAction } from "typesafe-actions";
import * as SI from "seamless-immutable";
import {Reducer } from "redux";
import { mapReducers, ReducerMap } from "../../Lib/ReduxHelpers";
import {IUserData, IUserRequest} from "../../Lib/Interfaces";

const actions = {
    signup: createAction("SIGNUP_REQUEST", (username: string, email: string, pwd: string) => ({
        type: "SIGNUP_REQUEST", payload: {username, email, pwd}
    })),
    loginRequest: createAction("LOGIN_REQUEST", (email: string, pwd: string, socialType: string) => ({
        type: "LOGIN_REQUEST", payload: {email, pwd, socialType}
    })),
    loginSuccess: createAction("LOGIN_SUCCESS", (params: IUserData) => ({
        type: "LOGIN_SUCCESS", payload: params
    })),
    loginFailure: createAction("LOGIN_FAILURE", () => ({
        type: "LOGIN_FAILURE"
    })),
    checkIsLogin: createAction("CHECK_LOGIN"),
    
    setIsLogin: createAction("SET_LOGIN", (params: boolean) => ({
        type: "SET_LOGIN", payload: params
    })),
    logout: createAction("USER_LOGOUT")
}

export const LoginActions = actions;

export interface LoginState {
    userData: IUserData | undefined,
    isLogin: boolean
  
}
export type LoginAction = PayloadAction<string, LoginState>;

export type ImmutableLoginState = SI.ImmutableObject<LoginState>;

export const INITIAL_STATE : ImmutableLoginState = SI.from({
    userData: undefined,
    isLogin: false
})

export const loginSuccess : Reducer<ImmutableLoginState> = (state, action) => 
    state.merge({userData: action.payload, isLogin: true});

export const loginFailure: Reducer<ImmutableLoginState> = (state) => state.merge({
    userData: undefined, isLogin: false
});

export const setIsLogin: Reducer<ImmutableLoginState>=(state, action) => state.merge({
    isLogin: action.payload,
})

const reducerMap: ReducerMap<typeof actions, ImmutableLoginState> = {
   loginSuccess,
   loginFailure,
   setIsLogin,
}

export const LoginReducer = mapReducers(INITIAL_STATE, reducerMap, actions);

export default LoginReducer;

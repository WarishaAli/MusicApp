import { createAction, PayloadAction } from "typesafe-actions";
import * as SI from "seamless-immutable";
import { Reducer } from "redux";
import { ReducerMap, mapReducers } from "../../Lib/ReduxHelpers";
import { IUserData } from "../../Lib/Interfaces";

const actions = {
    getProfileRequest: createAction("GET_PROFILE_REQUEST", (() => ({
        type: "GET_PROFILE_REQUEST"
    }))),
    getProfileSuccess: createAction("GET_PROFILE_SUCCESS", ((params: IUserData) => ({
        type: "GET_PROFILE_SUCCESS", payload: params,
    }))),
    getProfileFailure: createAction("GET_PROFILE_FAILURE", (() => ({
        type: "GET_PROFILE_FAILURE",
    }))),
    updateProfileRequest: createAction("UPDATE_PROFILE_REQUEST", ((params: IUserData) => ({
        type: "UPDATE_PROFILE_REQUEST", payload: params,
    }))),
    updateProfileSuccess: createAction("UPDATE_PROFILE_SUCCESS", ((params: IUserData) => ({
        type: "UPDATE_PROFILE_SUCCESS", payload: params,
    }))),
    updateProfileFailure: createAction("UPDATE_PROFILE_FAILURE", (() => ({
        type: "UPDATE_PROFILE_FAILURE",
    }))),
    
};

export const ProfileAction = actions;

export interface ProfileState {
    profileData: IUserData | undefined;
}

export type ProfileActions = PayloadAction<string, any>;

export type ImmutableProfileState = SI.ImmutableObject<ProfileState>;

export const INITIAL_STATE: ImmutableProfileState = SI.from({
    profileData: undefined,
});

export const getProfileSuccess: Reducer<ImmutableProfileState> = (state, action) => state.merge({
    profileData: action.payload,
})
export const updateProfileSuccess: Reducer<ImmutableProfileState> = (state, action) => state.merge({
    profileData: action.payload,
})

const reducerMap: ReducerMap<typeof actions, ImmutableProfileState> = {
    getProfileSuccess,
    updateProfileSuccess,
};

export const ProfileReducers = mapReducers(INITIAL_STATE, reducerMap, actions);

export default ProfileReducers;
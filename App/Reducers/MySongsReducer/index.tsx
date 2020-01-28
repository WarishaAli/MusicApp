import { createAction, PayloadAction } from "typesafe-actions";
import * as SI from "seamless-immutable";
import {Reducer} from "redux";
import { ReducerMap, mapReducers } from "../../Lib/ReduxHelpers";
import { Songs } from "../../Lib/PlaylistTypes";
import { ISongUpload } from "../../Lib/Interfaces";


const actions= {
    getMySongsRequest: createAction("GET_MY_SONGS_REQ", (() => ({
        type: "GET_MY_SONGS_REQ",
    }))),
    getMySongsSuccess: createAction("GET_MY_SONGS_SUCCESS", ((params: Songs) => ({
        type: "GET_MY_SONGS_SUCCESS", payload: params
    }))),
    getMySongsFailure: createAction("GET_MY_SONGS_FAILURE", (() => ({
        type: "GET_MY_SONGS_FAILURE",
    }))),
    uploadMySongReq: createAction("UPLOAD_MY_SONGS_REQ", ((params: ISongUpload) => ({
        type: "UPLOAD_MY_SONGS_REQ", payload: params,
    }))),
    uploadMySongSuccess: createAction("UPLOAD_MY_SONGS_SUCCESS", (() => ({
        type: "UPLOAD_MY_SONGS_SUCCESS"
    }))),
    uploadMySongFailure: createAction("UPLOAD_MY_SONGS_FAILURE", (() => ({
        type: "UPLOAD_MY_SONGS_FAILURE"
    }))),
};

export const MySongAction = actions;

export interface MySongState {
    mySongs: Array<Songs> | undefined;
}

export type mySongActions = PayloadAction<string, any>;

export type ImmutableMySongState = SI.ImmutableObject<MySongState>;

export const INITIAL_STATE: ImmutableMySongState = SI.from({
    mySongs: undefined
});

export const getMySongsSuccess: Reducer<ImmutableMySongState> = (state, action) => state.merge({
    mySongs: action.payload,
})


const reducerMap: ReducerMap<typeof actions, ImmutableMySongState> = {
    getMySongsSuccess,
};

export const MySongReducers = mapReducers(INITIAL_STATE, reducerMap, actions);

export default MySongReducers;
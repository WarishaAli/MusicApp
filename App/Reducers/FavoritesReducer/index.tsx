import { createAction, PayloadAction } from "typesafe-actions";
import * as SI from "seamless-immutable";
import {Reducer} from "redux";
import { ReducerMap, mapReducers } from "../../Lib/ReduxHelpers";

export interface IFavoriteResponse{
    songId: string,
    songName: string,
    songCategory: string,
    // "song_image": "825932c0c8999d4f94d36bf0288f20b1.jpg",
    songFile: string,
    userId: string,
    status: string,
    addDate: string,
    likeCount: string,
    songType: string,
    catId: string,
    songImage: string;
}
const actions= {
    getFavoriteRequest: createAction("GET_FAVORITE_REQUEST", (() => ({
        type: "GET_FAVORITE_REQUEST"   }))),
    getFavoriteSuccess: createAction("GET_FAVORITE_SUCCESS", ((params: IFavoriteResponse) => ({
        type: "GET_FAVORITE_SUCCESS", payload: params,
    }))),
    getFavoriteFailure: createAction("GET_FAVORITE_FAILURE", (() => ({
        type: "GET_FAVORITE_FAILURE",
    }))),
    makeFavoriteRequest: createAction("MAKE_FAVORITE_REQUEST", ((songId: string) => ({
        type: "MAKE_FAVORITE_REQUEST", payload: songId  }))),
    makeFavoriteSuccess: createAction("MAKE_FAVORITE_SUCCESS", ((params: IFavoriteResponse) => ({
        type: "MAKE_FAVORITE_SUCCESS", payload: params,
    }))),
    makeFavoriteFailure: createAction("MAKE_FAVORITE_FAILURE", (() => ({
        type: "MAKE_FAVORITE_FAILURE",
    }))),
};

export const FavoriteAction = actions;

export interface FavoriteState {
    favoritesData: Array<IFavoriteResponse> | undefined;
}

export type FavoriteActions = PayloadAction<string, any>;

export type ImmutableFavoriteState = SI.ImmutableObject<FavoriteState>;

export const INITIAL_STATE: ImmutableFavoriteState = SI.from({
    favoritesData: undefined,
});

export const getFavoriteSuccess: Reducer<ImmutableFavoriteState> = (state, action) => state.merge({
    favoritesData: action.payload,
})

const reducerMap: ReducerMap<typeof actions, ImmutableFavoriteState> = {
    getFavoriteSuccess,
};

export const FavoriteReducers = mapReducers(INITIAL_STATE, reducerMap, actions);

export default FavoriteReducers;
/// <reference types="@types/webpack-env" />
import { combineReducers } from "redux";
import configureStore from "./CreateStore";
import root from "../Epics/index";
import { GithubReducer, ImmutableGithubState } from "./GithubReducers";
import { NavigationReducer, NavigationState } from "./NavigationReducers";
import {BottomBarReducer, BottomBarState} from "./BottomBarReducer";
import SongsReducer, { SongsState } from "./SongsReducer";
import LoginReducer, { LoginState } from "./LoginReducers";
import Api from "../Services/Api";
import CategoryReducers, { CategoryState } from "./CategoryReducers";
import FavoriteReducers, { FavoriteState } from "./FavoritesReducer";

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  // nav: NavigationReducer,
  // github: GithubReducer,
  bottomBar: BottomBarReducer,
  songs: SongsReducer,
  login: LoginReducer,
  category: CategoryReducers,
  favorites: FavoriteReducers,
});

export interface RootState {
  // github: ImmutableGithubState;
  // nav: NavigationState;
  bottomBar: BottomBarState;
  songs: SongsState,
  login: LoginState,
  category: CategoryState,
  favorites: FavoriteState,
}
const api: any = Api.create;
const db: any = "";
export default () => {
  // tslint:disable-next-line:prefer-const
  let { store } = configureStore(reducers, root, {api, db});

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require("./").reducers;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

import { combineEpics } from "redux-observable";
import { setNextSongEpic, setPrevSongEpic, selectSongEpic } from "./SongsEpics";
import { checkIfLoginEpic, loginRequestEpic, signupRequestEpic } from "./LoginEpics";
import { getCategoriesEpic, getSongByCategoryEpic } from "./CategoryEpics";
import { getFavoritesEpic } from "./FavoritesEpics";

export default combineEpics(
    setNextSongEpic,
    setPrevSongEpic,
    // selectSongEpic,
    checkIfLoginEpic,
    loginRequestEpic,
    signupRequestEpic,
    getCategoriesEpic,
    getFavoritesEpic,
    getSongByCategoryEpic,
);
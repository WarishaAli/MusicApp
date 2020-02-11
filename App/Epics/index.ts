import { combineEpics } from "redux-observable";
import { setNextSongEpic, setPrevSongEpic, selectSongEpic } from "./SongsEpics";
import { checkIfLoginEpic, loginRequestEpic, signupRequestEpic, logoutEpic, checkUserRoleEpic } from "./LoginEpics";
import { getCategoriesEpic, getSongByCategoryEpic, getHomeDataEpic } from "./CategoryEpics";
import { getFavoritesEpic, makeFavoritesEpic } from "./FavoritesEpics";
import { getMySongsEpic, uploadMySongEpic } from "./MySongsEpics";
import { getProfileEpic, updateProfileEpic } from "./ProfileEpics";

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
    makeFavoritesEpic,
    getMySongsEpic,
    uploadMySongEpic,
    getProfileEpic,
    updateProfileEpic,
    logoutEpic,
    getHomeDataEpic,
    // checkUserRoleEpic,
);
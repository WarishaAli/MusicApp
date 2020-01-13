import { combineEpics } from "redux-observable";
import { setNextSongEpic, setPrevSongEpic, selectSongEpic } from "./SongsEpics";
import { checkIfLoginEpic, loginRequestEpic } from "./LoginEpics";

export default combineEpics(
    setNextSongEpic,
    setPrevSongEpic,
    // selectSongEpic,
    checkIfLoginEpic,
    loginRequestEpic,
);
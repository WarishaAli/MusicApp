import "./App/Config/ReactotronConfig"
import { AppRegistry } from 'react-native';
import App from "./App/Containers/App";
import RNTrackPlayer from "react-native-track-player";


RNTrackPlayer.registerPlaybackService(() => require("./service.js"));

AppRegistry.registerComponent("MusicApp", () => App);
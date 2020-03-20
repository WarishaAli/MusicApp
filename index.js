import "./App/Config/ReactotronConfig"
import { AppRegistry } from 'react-native';
import App from "./App/Containers/App";
import RNTrackPlayer from "react-native-track-player";

RNTrackPlayer.registerPlaybackService()

AppRegistry.registerComponent("MusicApp", () => App);

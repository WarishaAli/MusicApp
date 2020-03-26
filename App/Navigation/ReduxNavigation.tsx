import * as React from "react";
import { createAppContainer, NavigationScreenProps } from "react-navigation";
import { connect, Dispatch } from "react-redux";
import AppNavigation from "./AppNavigation";
import LoginNavigation from "./LoginNavigation";
import { RootState } from "../Reducers";
import { LoginActions } from "../Reducers/LoginReducers";
import { Alert, Platform, Linking } from "react-native";
import { ISongData, OpenSong } from "../Containers/MusicPlayScreen/MusicPlayScreen";
import { SongsActions } from "../Reducers/SongsReducer";
import { setKey, expand } from "react-native-google-shortener";

export interface StateProps {
  isLogin: boolean;
}
export interface DispatchProps {
  checkLogin: () => void;
  checkUserRole: (callback: () => void) => void;
  playSong: (song: ISongData) => void;
  shouldPlay: (play: boolean) => void;
  showPlay: (play: boolean) => void;
}
export type Props = StateProps & DispatchProps & NavigationScreenProps;

// here is our redux-aware smart component
class ReduxNavigation extends React.Component<Props> {
  // const { dispatch, nav } = props;
  // const navigation = ReactNavigation.addNavigationHelpers({
  //   dispatch,
  //   state: nav,
  // });
  public componentDidMount() {
    setKey("AIzaSyCDJLIQ-qeKlvUDfxokL2W4OCIfmD77pM0");
    this.props.checkLogin();
    this.props.checkUserRole(() => Alert.alert("Error", "no user role"));
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    }
  }
  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  public handleOpenURL = (event) => { // D
    this.navigate(event.url);
  }
  public navigate = (url) => { // E
    if (url) {
      expand('https://goo.gl/').then(response => {
        console.log(response.id);
        console.log(response.longUrl);
      });
      console.log(url, "at linking listener");
      let croppedShareUrl = "";
      let n = url.search("song");
      croppedShareUrl = url.substring(n + 5, url.length)
      let parsedUrl = JSON.parse('{"' + decodeURI(`${croppedShareUrl}`.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
      console.log(parsedUrl, "at redux nav");
      // SoundPlayer.playUrl(parsedUrl.song_file);

      this.props.playSong(parsedUrl);
      this.props.shouldPlay(true);
      this.props.showPlay(true);
      this.props.navigation.push("MusicPlayScreen", { songData: parsedUrl, isSong: parsedUrl.song_type === "mp3", comingFrom: OpenSong.SCREEN })

    }
  }
  public render() {
    // console.log("at redux comp", this.props.isLogin);
    const AppContainer = createAppContainer(AppNavigation);
    const LoginContainer = createAppContainer(LoginNavigation)
    return this.props.isLogin ? <AppContainer /> : <LoginContainer />
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  checkLogin: () => dispatch(LoginActions.checkIsLogin()),
  checkUserRole: (callback) => dispatch(LoginActions.checkUserRole(callback)),
  playSong: (song) => dispatch(SongsActions.setSong(song)),
  shouldPlay: (play) => dispatch(SongsActions.setIsPlaying(play)),
  showPlay: (showPlay) => dispatch(SongsActions.showPlaying(showPlay)),
})

const mapStateToProps = (state: RootState) => ({
  isLogin: state.login.isLogin,
});
export default connect(mapStateToProps, mapDispatchToProps)(ReduxNavigation);

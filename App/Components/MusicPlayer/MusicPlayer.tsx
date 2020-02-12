import React from "react";
import { View, Text, Image, ViewStyle, Alert, TouchableOpacity } from "react-native";
import styles from "./MusicPlayerStyles";
import { Icon } from "native-base";
import SoundPlayer from "react-native-sound-player";
import { RootState } from "../../Reducers";
import { connect } from "react-redux";
import { Dispatch } from "react-redux";
import { SongsActions } from "../../Reducers/SongsReducer";
import { Songs } from "../../Lib/PlaylistTypes";
import { NavigationScreenProps } from "react-navigation";
import { async } from "rxjs/internal/scheduler/async";


export interface OwnProps {
    style?: ViewStyle;
    hide: boolean;
    navigation: NavigationScreenProps;
    // playNextSong? : () => void;
};

export interface DispatchProps {
    playMusic: (shouldPlay: boolean) => void;
    playNext: (isAuto: boolean) => void;
    playPrev: () => void;
    showPlaying: (playing: boolean) => void;
}
export interface State {
    showPause: boolean;

}
export interface StateProps {
    isPlaying: boolean;
    currentSong: Songs;
    currentPlaylist: Songs;
    showPlay: boolean;
}

export type Props = StateProps & OwnProps & DispatchProps & NavigationScreenProps;

class MusicPlayer extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            showPause: false,
        }
    }
    public _onFinishedPlaying: any = null;

    public componentDidMount() {
        this._onFinishedPlaying = SoundPlayer.addEventListener("FinishedPlaying", (result: any) => {
            console.log("at song finished playing", result)
            this.playNextSong(true);
        })
    }
    public componentWillUnmount() {
        this._onFinishedPlaying.remove();
    }
    public componentDidUpdate(nextProps: Props) {
        if (this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong) {
            // this.props.isPlaying ? this.playSong() : this.pauseSong();
        }
    }
    public loadUrl = () => {
        try {
            SoundPlayer.loadUrl(this.props.currentSong.song_file);
        }
        catch (e) {
            console.log("error loading song url", e);
            Alert.alert("Unfortunately we could not load your song, please check you internet connection or try again later.")
        }
    }
    public playSong = () => {

        if (this.props.currentSong.song_file) {

            try {
                // this.loadUrl();
                SoundPlayer.playUrl(this.props.currentSong.song_file)
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            };
            this.props.showPlaying(true);
            this.props.playMusic(true);
        }
    };
    public pauseSong = () => {
        SoundPlayer.pause();
        this.props.showPlaying(false);
    }
    public playNextSong = (isAuto: boolean) => {
        this.props.playNext(isAuto);
    }
    public playPreviousSong = () => {
        this.props.playPrev();
    }
    public openSongScrenn = async () => {
        try {
            const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
            console.log('getInfo', info.duration / 60, info.currentTime / 60) // {duration: 12.416, currentTime: 7.691}
            this.props.navigation.push("MusicPlayScreen", { songData: info })
        } catch (e) {
            console.log('There is no song playing', e)
        }
    }
    public render() {
        return (
            <TouchableOpacity
            activeOpacity={0}
            onPress={this.props.hide ? () => null : this.openSongScrenn}
            style={[styles.mainView, this.props.style, { opacity: this.props.hide ? 0 : 1 }]}>
                {/* <View style={styles.imageView}> */}
                <Image
                    style={styles.imageView}
                    resizeMode={"cover"}
                    source={{ uri: this.props.currentSong.songimage }}></Image>
                {/* </View> */}
                {this.props.currentSong && <View style={styles.textView}>
                    <Text style={styles.heading}>{this.props.currentSong.song_name || " "}</Text>
                    <Text style={styles.subHeading}>{this.props.currentSong.song_category || ""}</Text>
                </View>}
                { <View style={{ flexDirection: "row", alignSelf: "center", flex: 0.5, marginLeft: 20 }}>
                    <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"} />
                    {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon]} name={"pause"} type={"AntDesign"} />}
                    {!this.props.showPlay && <Icon onPress={this.playSong} style={[styles.icon]} name={"caretright"} type={"AntDesign"} />}
                    <Icon onPress={() => this.playNextSong(false)} style={styles.icon} name={"stepforward"} type={"AntDesign"} />
                </View>}

            </TouchableOpacity>
        )
    }
};
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    playNext: (isAuto: boolean) => dispatch(SongsActions.setNextSong(isAuto)),
    playPrev: () => dispatch(SongsActions.setPreviousSong()),
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing))
});
export const mapStateToProps = (state: RootState): StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
});
export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
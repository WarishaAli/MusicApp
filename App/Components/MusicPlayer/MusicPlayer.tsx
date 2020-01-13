import React from "react";
import {View, Text, Image, ViewStyle, Alert} from "react-native";
import styles from "./MusicPlayerStyles";
import { Icon } from "native-base";
import SoundPlayer from "react-native-sound-player";
import { RootState } from "../../Reducers";
import {connect} from "react-redux";
import {Dispatch} from "react-redux";
import {SongsActions} from "../../Reducers/SongsReducer";
import { Songs } from "../../Lib/PlaylistTypes";


export interface OwnProps{
    style?: ViewStyle
    // playNextSong? : () => void;
};

export interface DispatchProps{
    playMusic: (shouldPlay: boolean) => void;
    playNext: () => void;
    playPrev: () => void;
    showPlaying: (playing: boolean) => void;
}
export interface State{
    showPause: boolean;
    
}
export interface StateProps{
    isPlaying: boolean;
    currentSong: Songs;
    currentPlaylist: Songs;
    showPlay: boolean;
}

export type Props = StateProps & OwnProps & DispatchProps;

class MusicPlayer extends React.Component<Props, State> {
    public constructor(props: Props){
        super(props);
        this.state={
            showPause: false,
        }
    }
    public _onFinishedPlaying: any= null;

    public componentDidMount(){
        // if(this.props.playNextSong !== undefined){
            this._onFinishedPlaying = SoundPlayer.addEventListener("FinishedPlaying", this.props.playNext)
        // }
    }
    public componentWillUnmount() {
        this._onFinishedPlaying.remove();
    }
    public componentDidUpdate (nextProps: Props){
        if(this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong){
            this.props.isPlaying ? this.playSong() : this.pauseSong();
        }
    }
    public loadUrl = () => {
        try{
            SoundPlayer.loadUrl(this.props.currentSong.url);
        }
        catch(e){
            console.log("error loading song url", e);
            Alert.alert("Unfortunately we could not load your song, please check you internet connection or try again later.")
        }
    }
    public playSong= () => {
        if (this.props.currentSong.url){  
            try {
            SoundPlayer.playUrl(this.props.currentSong.url)
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        };
        this.props.showPlaying(true);
    }};
    public pauseSong = () => {
        SoundPlayer.pause();
        this.props.showPlaying(false);
    }
    public playNextSong = () => {
        this.props.playNext();
    }
    public playPreviousSong = () => {
        this.props.playPrev();
    }
    public render(){
        return(
    <View style={[styles.mainView, this.props.style]}>
        {/* <View style={styles.imageView}> */}
            <Image
                style={styles.imageView}
                resizeMode={"cover"}
                source={{uri: "https://www.voguehk.com/media/2019/08/Sep_Rihanna_CoverStory04_online-1-960x1280.jpg"}}></Image>
        {/* </View> */}
        {this.props.currentSong && <View style={styles.textView}>
            <Text style={styles.heading}>{this.props.currentSong.name || " "}</Text>
            <Text style={styles.subHeading}>{this.props.currentSong.artist || ""}</Text>
        </View>}
        <View style={{flexDirection: "row", alignSelf: "center", flex: 0.5, marginLeft: 20}}>
        <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"}/>
        {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon,{fontSize: 30}]} name={"pause"} type={"AntDesign"}/>}
        {!this.props.showPlay && <Icon onPress={this.playSong}style={[styles.icon]} name={"caretright"} type={"AntDesign"}/>}
        <Icon onPress={this.playNextSong} style={styles.icon} name={"stepforward"} type={"AntDesign"}/>
        </View>
    </View>
        )
    }
};
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    playNext: () => dispatch(SongsActions.setNextSong()),
    playPrev: () => dispatch(SongsActions.setPreviousSong()),
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing))
});
export const mapStateToProps = (state: RootState):StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
});
export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
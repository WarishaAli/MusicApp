import React from "react";
import { Container, Icon, Col } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import styles from "./MusicPlayScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { TouchableOpacity, Image, Text, View } from "react-native";
import colors from "../../Themes/Colors";
import Slider from '@react-native-community/slider';
import SoundPlayer from "react-native-sound-player";
import { Songs } from "../../Lib/PlaylistTypes";
import { connect, Dispatch } from "react-redux";
import { SongsActions } from "../../Reducers/SongsReducer";
import { RootState } from "../../Reducers";

export interface ISongData {
    song_name: string;
    song_category: string;
    songimage: string;
    song_file: string;
    duration: number;
    currentTime: number;
}
export interface State {
    songData: ISongData | any;
    songDuration: {duration: number, currentTime: number}
}
export interface DispatchProps{
    playMusic: (shouldPlay: boolean) => void;
    playNext: (isAuto: boolean) => void;
    playPrev: () => void;
    showPlaying: (playing: boolean) => void;
}

export interface StateProps{
    isPlaying: boolean;
    currentSong: Songs;
    currentPlaylist: Songs;
    showPlay: boolean;
}
export type Props = NavigationScreenProps & DispatchProps & StateProps;
class MusicPlayScreen extends React.Component<Props, State>{
    public constructor(props) {
        super(props);
        this.state = {
            songData: this.props.currentSong,
            songDuration: this.props.navigation.getParam("songData"),
        }
    }
    public _onFinishedPlaying: any= null;

    public componentDidMount(){
            this._onFinishedPlaying = SoundPlayer.addEventListener("FinishedPlaying", (result: any) => {
                console.log("at song finished playing", result)
                this.playNextSong(true);
            })
    }
    public componentWillUnmount() {
        this._onFinishedPlaying.remove();
    }
    public componentDidUpdate (nextProps: Props){
        if(this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong){
            this.props.isPlaying ? this.playSong() : this.pauseSong();
        }
    }
    public playSong= () => {
        if (this.props.currentSong.song_file){
            try {
            SoundPlayer.playUrl(this.props.currentSong.song_file)
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        };
        this.props.showPlaying(true);
    }};
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
    

    // public pad = (n, width, z = 0) => {
    //     n = n + '';
    //     return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    //   }
      
    // public minutesAndSeconds = (position) => ([
    //     this.pad(Math.floor(position / 60), 2),
    //     this.pad(position % 60, 2),
    //   ]);
    public render() {
        return (
            <Container style={styles.container}>
                <CommonHeader title={"Play Music"} rightItem={
                    <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                        <Icon name={"ios-arrow-down"} type={"Ionicons"} style={{ color: colors.lightMaroon, fontSize: 18 }} />
                    </TouchableOpacity>
                } />
                
                <View style={styles.holderView}>
               
                    <Image style={styles.image} source={{ uri: this.props.currentSong.songimage }}></Image>
                   <View style={{flexDirection: "row", marginTop: 30}}>
                   <View style={{  alignSelf: "center", flex: 0.9}}>
                        <Text style={styles.songNameText}>{this.props.currentSong.song_name}</Text>
                        {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}
                        <Text style={{color: colors.charcoal}}>{this.props.currentSong.song_category}</Text>
                    </View>
                    <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity>
                   </View>
                   
                    {/* <View style={{ flexDirection: "row", marginTop: 35, justifyContent: "space-between" }}> */}
                    <View  style={{ flexDirection: "row", marginTop: 35, justifyContent: "space-between" }}>
            {/* <Text>{this.state.songDuration.currentTime}</Text> */}
            {/* <Text>{this.state.songDuration.duration}</Text> */}
                    </View>
                    {/* <Slider
                    style={{marginTop: 0, height: 20}}
                    minimumValue={this.state.songData.currentTime}
                    maximumValue={this.state.songData.duration}
                    minimumTrackTintColor={colors.lightMaroon}
                    maximumTrackTintColor={colors.black}
                    thumbTintColor={colors.black}
                    onValueChange={(n) => {
                        this.setState(prev => ({
                            songData: {...prev.songData, currentTime: n}
                        }))
                    }}
                    onSlidingComplete={(n: number) => {this.setState(prev => ({
                        songData: {...prev.songData, currentTime: n}
                    }));
                    SoundPlayer.seek(this.state.songData.currentTime)
                }}
                    value={this.state.songData.currentTime}
                    /> */}
                    {/* </View> */}
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 35 }}>
                        <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"} />
                        {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"pausecircle"} type={"AntDesign"} />}
                        {!this.props.showPlay && <Icon onPress={this.playSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"play"} type={"AntDesign"} />}
                        <Icon onPress={() => this.playNextSong(false)} style={styles.icon} name={"stepforward"} type={"AntDesign"} />
                    </View>
                </View>
            </Container>
        )
    }
}
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    playNext: (isAuto: boolean) => dispatch(SongsActions.setNextSong(isAuto)),
    playPrev: () => dispatch(SongsActions.setPreviousSong()),
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing))
});
export const mapStateToProps = (state: RootState):StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
});

export default connect(mapStateToProps, mapDispatchToProps) (MusicPlayScreen);
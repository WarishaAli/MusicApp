import React from "react";
import { Container, Icon, Col } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import styles from "./MusicPlayScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { TouchableOpacity, Image, Text, View, Alert } from "react-native";
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
    songDuration: { duration: number, currentTime: number };
    layout: { width: number, height: number, x: number, y: number, }
}
export interface DispatchProps {
    playMusic: (shouldPlay: boolean) => void;
    playNext: (isAuto: boolean) => void;
    playPrev: () => void;
    showPlaying: (playing: boolean) => void;
}

export interface StateProps {
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
            layout: { width: 0, height: 0, x: 0, y: 0 }
        }
    }
    public _onFinishedPlaying: any = null;
    public _onFinishedloading: any = null;
    public timer: any = null;

    public componentDidMount() {
        this._onFinishedPlaying = SoundPlayer.addEventListener("FinishedPlaying", (result: any) => {
            console.log("at song finished playing", result);
            this.playNextSong(true);
            this.setState({ songDuration: { duration: 0, currentTime: 0 } })
        });
        this._onFinishedloading = SoundPlayer.addEventListener("FinishedLoading", (result: any) => {
            console.log("at finish loading");
            // result && this.durationCounter();
        })
        // if (this.props.isPlaying) {
        //     this.getInfo();
        // }
    }
    // public durationCounter = () => {
    //     this.timer = setInterval(async () => {
    //       const info = await SoundPlayer.getInfo();
    //       this.setState({songDuration: { duration: this.gettimeInMins(info.duration), currentTime: this.gettimeInMins(info.currentTime)}})
    //     }, 1000);
    //   };
    public gettimeInMins = (time: number) => {
        let num = time / 60;
        let str = num.toString().substring(0, 5);
        return parseFloat(str);
    }
    public getInfo = async () => {
        const info = await SoundPlayer.getInfo();
        console.log("song info", info);
        console.log(this.gettimeInMins(info.duration));
        info && this.setState({ songDuration: { duration: this.gettimeInMins(info.duration), currentTime: this.gettimeInMins(info.currentTime) } })
    }
    public componentWillUnmount() {
        this._onFinishedPlaying.remove();
    }
    public componentDidUpdate(nextProps: Props) {
        if (this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong) {
            this.props.isPlaying ? this.playSong() : this.pauseSong();
        };

    }
    public playSong = async () => {
        if (this.props.currentSong.song_file) {
            try {
                SoundPlayer.playUrl(this.props.currentSong.song_file);
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            };
            this.props.showPlaying(true);
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


    // public pad = (n, width, z = 0) => {
    //     n = n + '';
    //     return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    //   }

    // public minutesAndSeconds = (position) => ([
    //     this.pad(Math.floor(position / 60), 2),
    //     this.pad(position % 60, 2),
    //   ]);
    public onLayoutSlider = (e: any) => {
        this.setState({
            layout: {
                x: e.nativeEvent.layout.x, y: e.nativeEvent.layout.y,
                width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height
            }
        })
    }
    public songProgress = () => {
        this.getInfo();
    }
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
                    <Text style={{ marginTop: 30, fontSize: 15, fontFamily: "serif", color: colors.black, alignSelf: "center" }}>Now Playing</Text>
                    <Text style={styles.songNameText}>{this.props.currentSong.song_name}</Text>
                    {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}
                    <Text style={{ color: colors.charcoal, fontFamily: "serif", alignSelf: "center", marginTop: 2 }}>{this.props.currentSong.song_category}</Text>

                    {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}

                    {/* <View style={{ flexDirection: "row", marginTop: 35, justifyContent: "space-between" }}> */}
                    {/* <View style={{height: 3, width: "100%", backgroundColor: colors.black }}></View> */}
                    {/* <Slider
                    // onLayout={this.onLayoutSlider}
                        style={{ marginTop: 40, height: 20,}}
                        minimumValue={this.state.songData.currentTime}
                        maximumValue={this.state.songData.duration}
                        minimumTrackTintColor={colors.lightMaroon}
                        maximumTrackTintColor={colors.black}
                        thumbTintColor={colors.black}
                        onValueChange={(n) => {
                            this.setState(prev => ({
                                songDuration: { ...prev.songDuration, currentTime: n }
                            }))
                        }}
                        onSlidingComplete={(n: number) => {
                            this.setState(prev => ({
                                songDuration: { ...prev.songDuration, currentTime: n }
                            }));
                            SoundPlayer.seek(this.state.songData.currentTime)
                        }}
                        value={this.state.songDuration.currentTime}
                        onProgress={this.songProgress}
                    /> */}
                    {/* <View style={{ flexDirection: "row", marginTop: 0, justifyContent: "space-between", }}>
                        <Text style={styles.timeText}>{this.state.songDuration.currentTime}</Text>
                        <Text style={styles.timeText}>{this.state.songDuration.duration}</Text>
                    </View> */}
                    {/* </View> */}
                    <View style={{
                        flexDirection: "row", alignSelf: "center", marginTop: 30,
                        // position: "absolute", width: "40%",
                        // bottom: this.state.layout.height, right: this.state.layout.width - 30
                    }}>
                        <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"} />
                        {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"ios-pause"} type={"Ionicons"} />}
                        {!this.props.showPlay && <Icon onPress={this.playSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"play"} type={"AntDesign"} />}
                        <Icon onPress={() => this.playNextSong(false)} style={styles.icon} name={"stepforward"} type={"AntDesign"} />
                    </View>
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 50 }}>
                        <TouchableOpacity style={{padding: 10}}>
                            <Icon name={"hearto"} type={"AntDesign"} style={{fontSize: 18, color: colors.charcoal, marginTop: 2}}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10}}>
                            <Icon name={"share-outline"} type={"MaterialCommunityIcons"} style={{fontSize: 20, color: colors.charcoal, }}></Icon>
                        </TouchableOpacity>
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
export const mapStateToProps = (state: RootState): StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayScreen);
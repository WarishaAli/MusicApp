import React from "react";
import { Container, Icon, Col, Toast } from "native-base";
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
import { ArtistProfileAction } from "../../Reducers/ArtistProfileReducer";
import { UserRole } from "../SignupScreen/SignupScreen";
import Share from "react-native-share";
import { FavoriteAction } from "../../Reducers/FavoritesReducer";

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
    duration: {min: number, sec: number, total: number}; 
    currentTime: { min: number, sec: number, total: number };
    layout: { width: number, height: number, x: number, y: number, }
}
export interface DispatchProps {
    playMusic: (shouldPlay: boolean) => void;
    playNext: (isAuto: boolean) => void;
    playPrev: () => void;
    showPlaying: (playing: boolean) => void;
    isPlaying: (play: boolean) => void;
    getArtist: (userId: string) => void;
    makeFavorite: (songId: string) => void;
}

export interface StateProps {
    isPlaying: boolean;
    currentSong: Songs;
    currentPlaylist: Songs;
    showPlay: boolean;
    userRole: UserRole;
}
export type Props = NavigationScreenProps & DispatchProps & StateProps;
class MusicPlayScreen extends React.Component<Props, State>{
    public constructor(props) {
        super(props);
        this.state = {
            songData: this.props.currentSong,
            duration: {min: 0, sec: 0, total: 0},
            currentTime: {min: 0, sec: 0, total: 0},
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
            // this.setState({ duration: {min: 0, sec: 0, total: 0}, currentTime: { min: 0, sec: 0, total: 0}})
            // this.timer && clearInterval(this.timer);
        });
        this._onFinishedloading = SoundPlayer.addEventListener("FinishedLoading", (result: any) => {
            console.log("at finish loading");
            // if (result) {
            //     this.durationCounter();
            // }
        })
        // if (this.props.isPlaying) {
        //     this.getInfo();
        // }
    }
    public getMinsSec = (time: number) => {
        return { minutes: (time / 60).toFixed(0), seconds: (time % 60).toFixed(0) }
    }
    // public getDuration = async () => {
    //     const songInfo = await SoundPlayer.getInfo();
    //     const totalTime =  this.getMinsSec(songInfo.duration);
       
    //     console.log("at total song time", totalTime);
    //     this.setState({ duration: {min: totalTime.minutes, sec: totalTime.seconds, total: songInfo.duration},
    //             // currentTime: {
    //             //     min: currentTime.minutes,
    //             //     sec: currentTime.seconds,
    //             //     total: songInfo.currentTime,
    //             // }
    //         });
    //     this.durationCounter();
    // }
    public durationCounter = async () => {
        // const songInfo = await SoundPlayer.getInfo();
        // const totalTime =  this.getMinsSec(songInfo.duration);
        // console.log("at total song time", totalTime);
        // this.setState({ duration: {min: totalTime.minutes, sec: totalTime.seconds, total: songInfo.duration}});
        this.timer = setInterval(async () => {
            const songInfo = await SoundPlayer.getInfo();
            const totalTime =  this.getMinsSec(songInfo.duration);
            const current =  this.getMinsSec(songInfo.currentTime);
          this.props.isPlaying && this.setState({
            duration: {min: totalTime.minutes, sec: totalTime.seconds, total: songInfo.duration},
        });
        this.props.showPlaying && current.seconds == "59" ? this.setState({currentTime: {min: this.state.currentTime.min + 1, total: songInfo.currentTime, sec: 0}})
        : this.setState({currentTime: {sec: this.state.currentTime.sec + 1, total: songInfo.currentTime, min: this.state.currentTime.min}})
            // console.log("making seconds mins", minutes, seconds);
            //   this.setState({songDuration: { duration: this.gettimeInMins(info.duration), currentTime: this.gettimeInMins(info.currentTime)}})
        }, 1000);
        
    };
    // public gettimeInMins = (time: number) => {
    //     let num = time / 60;
    //     let str = num.toString().substring(0, 5);
    //     return parseFloat(str);
    // }
    // public getInfo = async () => {
    //     const info = await SoundPlayer.getInfo();
    //     console.log("song info", info);
    //     console.log(this.gettimeInMins(info.duration));
    //     info && this.setState({ songDuration: { duration: this.gettimeInMins(info.duration), currentTime: this.gettimeInMins(info.currentTime) } })
    // }
    public componentWillUnmount() {
        this._onFinishedPlaying.remove();
    }
    public componentDidUpdate(nextProps: Props) {
        if (this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong) {
            // this.props.isPlaying ? this.playSong() : this.pauseSong();
        };

    }
    public playSong = () => {
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
    public openArtistProfile = (userId: string) => {
        this.props.getArtist(userId);
        this.props.navigation.push("ArtistProfileScreen")
    }
    // public songProgress = () => {
    //     this.getInfo();
    // }

    public shareSong = (item: any) => {
        Share.open({
            url: item.song_file, title: "HiphopStreets",
            message: "Hey, check out this song on Hiphop Streets!"
        }).then((res) => {
            console.log(res);
            Toast.show({ text: "Song shared successfully!" });
        }).catch((err) => console.log("at error", err))
    }
    public render() {
        console.log(this.state.currentTime.total, this.state.duration.total);
        return (
            <Container style={styles.container}>
                <CommonHeader title={"Play Music"} rightItem={
                    <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                        <Icon name={"ios-arrow-down"} type={"Ionicons"} style={{ color: colors.lightMaroon, fontSize: 18 }} />
                    </TouchableOpacity>
                } />

                <View style={styles.holderView}>

                    <Image style={styles.image} source={{ uri: this.props.currentSong.songimage }}></Image>
                    <Text style={{ marginTop: 20, fontSize: 15, fontFamily: "serif", color: colors.black, alignSelf: "center" }}>Now Playing</Text>
                    <Text style={styles.songNameText}>{this.props.currentSong.song_name}</Text>
                    {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}
                    <Text
                        onPress={() => this.openArtistProfile(this.props.currentSong.userid)}
                        style={{ color: colors.charcoal, fontFamily: "serif", alignSelf: "center", marginTop: 10, }}>
                        {this.props.currentSong.artistName}</Text>
                    <View style={{ backgroundColor: colors.maroon, height: 1, alignSelf: "center", width: 80, marginTop: 5 }}></View>
                    <Text
                        style={{ color: colors.charcoal, fontFamily: "serif", alignSelf: "center", marginTop: 10, }}>
                        {this.props.currentSong.song_category}</Text>

                    {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}

                    <View style={{ justifyContent: "space-between" }}>
                        {/* <View style={{height: 3, width: "100%", backgroundColor: colors.black }}></View> */}
                        {/* <Slider
                            //  onLayout={this.onLayoutSlider} 
                            style={{ marginTop: 20, height: 20, width: "100%" }}
                            // minimumValue={this.state.currentTime.total}
                            maximumValue={this.state.duration.total}
                            minimumTrackTintColor={colors.lightMaroon}
                            maximumTrackTintColor={colors.black}
                            thumbTintColor={colors.black}
                            onValueChange={(n) => {
                                console.log("value change",n, typeof(n),this.getMinsSec(n));
                                this.setState({currentTime: {min: parseInt( this.getMinsSec(n).minutes),
                                sec: parseInt(this.getMinsSec(n).seconds), total: n
                                }})
                            }}
                            onSlidingComplete={(n: number) => {
                                this.setState({currentTime: {min: this.getMinsSec(n).minutes,
                                    sec: this.getMinsSec(n).seconds, total: n
                                    }})
                                SoundPlayer.seek(this.state.currentTime.total)
                            }}
                            value={this.state.currentTime.total}
                        // onProgress={this.songProgress}
                        /> */}
                        {/* <View style={{ flexDirection: "row", marginTop: 0, justifyContent: "space-between", width: "100%" }}>
                            <Text style={styles.timeText}>{this.state.currentTime.min.toString() + 
                            ":" + this.state.currentTime.sec.toString()}</Text>
                            <Text style={styles.timeText}>
                                {this.state.duration.min.toString() + ":" + this.state.duration.sec.toString()}</Text>
                        </View> */}
                    </View>
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
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.makeFavorite(this.props.currentSong.songid)}>
                            <Icon name={"hearto"} type={"AntDesign"} style={{ fontSize: 18, color: colors.charcoal, marginTop: 2 }}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, marginLeft: 5 }} onPress={this.shareSong}>
                            <Icon name={"share-outline"} type={"MaterialCommunityIcons"} style={{ fontSize: 20, color: colors.charcoal, }}></Icon>
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
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing)),
    isPlaying: (play) => dispatch(SongsActions.setIsPlaying(true)),
    getArtist: (userId) => dispatch(ArtistProfileAction.getArtistProfileRequest(userId)),
    makeFavorite: (songId) => dispatch(FavoriteAction.makeFavoriteRequest(songId))
});
export const mapStateToProps = (state: RootState): StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
    userRole: state.login.userData.user_cat
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayScreen);
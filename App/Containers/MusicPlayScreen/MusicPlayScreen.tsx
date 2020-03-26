import React from "react";
import { Container, Icon, Col, Toast } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import styles from "./MusicPlayScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { TouchableOpacity, Image, Text, View, ScrollView, Dimensions } from "react-native";
import colors from "../../Themes/Colors";
import Slider from '@react-native-community/slider';
import SoundPlayer from "react-native-sound-player";
import { Songs, PlaylistTypes } from "../../Lib/PlaylistTypes";
import { connect, Dispatch } from "react-redux";
import { SongsActions } from "../../Reducers/SongsReducer";
import { RootState } from "../../Reducers";
import { ArtistProfileAction } from "../../Reducers/ArtistProfileReducer";
import { UserRole } from "../SignupScreen/SignupScreen";
import Share from "react-native-share";
import { FavoriteAction } from "../../Reducers/FavoritesReducer";
import { isFavorite, isPortrait } from "../../Lib/MusicPlayerHelpers";
import Video from 'react-native-video';
import RNTrackPlayer from "react-native-track-player";
import { getPlayerState } from "../../Lib/SongQueueHelper";
import TrackPlayer from "../../Components/TrackPlayer/TrackPlayer";

export enum OpenSong {
    SCREEN = "From Screen",
    COMPONENT = "From Component",
}

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
    duration: { min: number, sec: number, total: number };
    currentTime: { min: number, sec: number, total: number };
    layout: { width: number, height: number, x: number, y: number, };
    isSong: boolean;
    // videoUrl: Songs;
    pauseVideo: boolean;
    songPausedAt: number;
    comingFrom: OpenSong;
    
}
export interface DispatchProps {
    playMusic: (shouldPlay: boolean) => void;
    playNext: (isSong: boolean) => void;
    playPrev: (isSong: boolean) => void;
    showPlaying: (playing: boolean) => void;
    isSongPlaying: (play: boolean) => void;
    getArtist: (userId: string) => void;
    makeFavorite: (songId: string) => void;
    getFavorites: (shoulSetPlaylist: boolean) => void;
    setSong: () => void;
}

export interface StateProps {
    isPlaying: boolean;
    currentSong: Songs;
    currentPlaylist: Songs;
    showPlay: boolean;
    userRole: UserRole;
    favorites: any;

}
export type Props = NavigationScreenProps & DispatchProps & StateProps;
class MusicPlayScreen extends React.Component<Props, State>{
    public constructor(props) {
        super(props);
        this.state = {
            songData: this.props.currentSong,
            duration: { min: 0, sec: 0, total: 0 },
            currentTime: { min: 0, sec: 0, total: 0 },
            layout: { width: 0, height: 0, x: 0, y: 0 },
            isSong: this.props.navigation.getParam("isSong"),
            // videoUrl:  this.props.navigation.getParam("videoUrl"),
            pauseVideo: false,
            songPausedAt: 0,
            comingFrom: this.props.navigation.getParam("comingFrom"),
       
        }
    }
    public _onFinishedPlaying: any = null;
    public _onFinishedloading: any = null;
    public timer: any = null;
    public videoPlayer: any = null;

    public async componentDidMount() {
        this.props.getFavorites(false);
        console.log(this.state.isSong, "song or video");
        this.getSongTotalTime();
        // this._onFinishedPlaying = this.state.isSong ? SoundPlayer.addEventListener("FinishedPlaying", (result: any) => {
        //     console.log("at song finished playing", result);
        //     this.playNextSong(true);
        //     this.setState({ duration: { min: 0, sec: 0, total: 0 }, currentTime: { min: 0, sec: 0, total: 0 } })
        //     this.timer && clearInterval(this.timer);
        // }) : null;
        // this._onFinishedloading = this.state.comingFrom === OpenSong.SCREEN && this.state.isSong ? SoundPlayer.addEventListener("FinishedLoading", (result: any) => {
        //     console.log("at finish loading");
        //     if (result) {
        //         this.durationCounter();
        //     }
        // }) : null;
        // if (this.props.showPlay && this.state.comingFrom === OpenSong.COMPONENT) {
       this.props.currentSong && this.durationCounter();
        // }
    }
    public getSongTotalTime = async () => {
        if (this.props.currentSong) {
            const songTotalTime = await RNTrackPlayer.getDuration();
            const totalTime = this.getMinsSec(songTotalTime);
            this.setState({ duration: { min: totalTime.minutes, sec: totalTime.seconds, total: songTotalTime }, })
        }
    }
    public getMinsSec = (time: number) => {
        console.log(Math.floor(time / 60));
        return { minutes: Math.floor(time / 60), seconds: (time % 60).toFixed(0) }
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
        if (this.props.currentSong.song_file) {
            this.timer = setInterval(async () => {
                // const songTotal = await RNTrackPlayer.getDuration();
                const songCurrent = await RNTrackPlayer.getPosition();
                // const totalTime = this.getMinsSec(songTotal);
                const current = this.getMinsSec(songCurrent);
                // this.props.isPlaying && this.setState({
                //     duration: { min: totalTime.minutes, sec: totalTime.seconds, total: songTotal },
                // });
                // console.log("at parse int", parseInt(current.seconds));
                this.setState({ currentTime: { min: current.minutes, sec: current.seconds, total: songCurrent } })
                // this.props.showPlaying && parseInt(current.seconds) === 59 ? this.setState({ currentTime: { min: this.state.currentTime.min + 1, total: songInfo.currentTime, sec: 0 } })
                //     : this.setState({ currentTime: { sec: this.state.currentTime.sec + 1, total: songInfo.currentTime, min: this.state.currentTime.min } })
                // console.log("making seconds mins", minutes, seconds);
                //   this.setState({songDuration: { duration: this.gettimeInMins(info.duration), currentTime: this.gettimeInMins(info.currentTime)}})
            }, 1000);
        }


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
        // this._onFinishedPlaying && this._onFinishedPlaying.remove();
        // this._onFinishedloading && this._onFinishedloading.remove();
        this.timer && clearInterval(this.timer);
    }
    public componentDidUpdate(nextProps: Props) {
        if ((this.props.isPlaying !== nextProps.isPlaying || this.props.currentSong !== nextProps.currentSong)
            && this.state.isSong) {
            // this.props.isPlaying ? this.playSong() : this.pauseSong();
            this.durationCounter();
            this.getSongTotalTime();
        };

    }
    public playSong = () => {
        if (this.props.currentSong.song_file && this.state.isSong) {
            RNTrackPlayer.play();
            this.props.showPlaying(true);
            this.durationCounter();
        } else {
            this.setState({ pauseVideo: false });
            this.props.showPlaying(true);
        }
    };
    public pauseSong = () => {
        if (this.state.isSong) {
            // SoundPlayer.pause();
            // this.setState({ songPausedAt: this.state.currentTime.total })
            this.timer && clearInterval(this.timer);
            RNTrackPlayer.pause();
        } else {
            this.setState({ pauseVideo: true }); SoundPlayer.pause()
        }
        this.props.showPlaying(false);

    }
    public playNextSong = async (isAuto: boolean) => {
        // this.props.playNext(this.state.isSong);
        const skip = await RNTrackPlayer.skipToNext();
    }
    public playPreviousSong = async () => {
        // this.props.playPrev(this.state.isSong);
        const skip = await RNTrackPlayer.skipToPrevious()
    }

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

    // public shareSong = (item: any) => {
    //     Share.open({
    //         url: item.song_file, title: "HiphopStreets",
    //         message: "Hey, check out this song on Hiphop Streets!"
    //     }).then((res) => {
    //         console.log(res);
    //         Toast.show({ text: "Song shared successfully!" });
    //     }).catch((err) => console.log("at error", err))
    // }
    public shareSong = (item: any) => {
        let urlParam = [];
        let shareUrl = "";
        for (let i in item) {
            urlParam.push(encodeURI(i) + "=" + encodeURI(item[i]))
        }
        shareUrl = `http://app.hiphopstreets.com/song?${urlParam.join("&")}`;

        Share.open({
            url: shareUrl, title: "HiphopStreets",
            message: "Hey, check out this song on Hiphop Streets!"
        }).then((res) => {
            console.log(res);
            Toast.show({ text: "Song shared successfully!" });
        }).catch((err) => console.log("at error", err))
    }
    public onBuffer = () => {
        console.log("buffering video")
    }
    getSongDuration = async () => {
        if (this.state.isSong) {
            const duration = await RNTrackPlayer.getDuration();
            let time = this.getMinsSec(duration);
            this.setState({ duration: { min: time.minutes, sec: time.seconds, total: duration } })
            // return time.minutes.toString() + ":" + time.seconds.toString();
        }
    }
    getSongCurrentTime = async () => {
        if (this.state.isSong) {
            const duration = await RNTrackPlayer.getPosition();
            console.log("at curren time", duration);
            let time = this.getMinsSec(duration);
            this.setState({ currentTime: { min: time.minutes, sec: time.seconds, total: duration } })
            // return time.minutes.toString() + ":" + time.seconds.toString();
        }
    }
    public render() {
        return (
            <Container style={styles.container}>
                <CommonHeader title={"Play Music"} rightItem={
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.pop();
                        if (!this.state.isSong) {
                            this.props.showPlaying(false);
                            this.setState({ pauseVideo: true });
                            this.props.isSongPlaying(false);
                            this.props.setSong();
                            SoundPlayer.pause();
                        }
                        this.timer && clearInterval(this.timer);
                    }}>
                        <Icon name={"ios-arrow-down"} type={"Ionicons"} style={{ color: colors.lightMaroon, fontSize: 18 }} />
                    </TouchableOpacity>
                } />

                <ScrollView style={styles.holderView}>

                    {this.state.isSong && <Image style={styles.image} source={{ uri: this.props.currentSong.songimage }}></Image>}
                    {!this.state.isSong &&
                        // <View style={styles.video}>
                        <Video source={{ uri: this.props.currentSong.song_file }}   // Can be a URL or a local file.
                            ref={(ref: any) => {
                                this.videoPlayer = ref
                            }}                                      // Store reference
                            onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            // onError={this.videoError}               // Callback when video cannot be loaded
                            resizeMode={"cover"}
                            style={{
                                marginTop: 0, width: Dimensions.get("screen").width,
                                height: isPortrait() ? 300 : Dimensions.get("window").height / 1.2
                            }}
                            paused={this.state.pauseVideo}
                            onReadyForDisplay={() => this.props.showPlaying(true)}
                            onEnd={() => this.props.showPlaying(false)}
                            poster={this.props.currentSong.songimage}
                            onProgress={({ currentTime, playableDuration, seekableDuration }) => {
                                this.setState({
                                    currentTime: {
                                        min: this.getMinsSec(currentTime).minutes, sec: this.getMinsSec(currentTime).seconds,
                                        total: currentTime
                                    }, duration: {
                                        min: this.getMinsSec(seekableDuration).minutes, sec: this.getMinsSec(seekableDuration).seconds,
                                        total: seekableDuration
                                    }
                                })
                            }}
                        // selectedAudioTrack={{type: this.state.pauseVideo ? "disabled" : "system"}}
                        />

                        //  </View>
                    }
                    <Text style={{ marginTop: 20, fontSize: 15, fontFamily: "serif", color: colors.black, alignSelf: "center" }}>Now Playing</Text>
                    <Text numberOfLines={1} style={styles.songNameText}>{this.props.currentSong.song_name}</Text>
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
                        <Slider
                            //  onLayout={this.onLayoutSlider} 
                            style={{ marginTop: 20, height: 20, width: "100%" }}
                            // minimumValue={this.state.currentTime.total}
                            maximumValue={this.state.duration.total}
                            minimumTrackTintColor={colors.lightMaroon}
                            maximumTrackTintColor={colors.black}
                            thumbTintColor={colors.black}
                            onValueChange={(n) => {
                                if (this.state.isSong) {
                                    this.setState({
                                        currentTime: {
                                            min: parseInt(this.getMinsSec(n).minutes),
                                            sec: parseInt(this.getMinsSec(n).seconds), total: n
                                        }
                                    })
                                    RNTrackPlayer.seekTo(n);
                                    // SoundPlayer.seek(this.state.currentTime.total)
                                } else {
                                    this.videoPlayer.seek(n);
                                }
                            }}
                            onSlidingComplete={(n: number) => {
                                if (this.state.isSong) {
                                    this.setState({
                                        currentTime: {
                                            min: parseInt(this.getMinsSec(n).minutes),
                                            sec: parseInt(this.getMinsSec(n).seconds), total: n
                                        }
                                    })
                                    RNTrackPlayer.seekTo(n);
                                } else {
                                    this.videoPlayer.seek(n);
                                }
                            }}
                            value={this.state.currentTime.total}
                        // onProgress={this.songProgress}
                        />


                        {/* song time view */}
                        <View style={{ flexDirection: "row", marginTop: 0, justifyContent: "space-between", width: "100%" }}>
                            <Text style={styles.timeText}>
                                {this.state.currentTime.min.toString() + ":" + this.state.currentTime.sec.toString()}
                            </Text>
                            <Text style={styles.timeText}>
                                {this.state.duration.min.toString() + ":" + this.state.duration.sec.toString()}</Text>
                        </View>
                    </View>


                    {/* song play next previous view */}
                    <View style={{
                        flexDirection: "row", alignSelf: "center", marginTop: 25,
                        // position: "absolute", width: "40%",
                        // bottom: this.state.layout.height, right: this.state.layout.width - 30
                    }}>
                        <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"} />
                        {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"ios-pause"} type={"Ionicons"} />}
                        {!this.props.showPlay && <Icon onPress={this.playSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"play"} type={"AntDesign"} />}
                        <Icon onPress={() => this.playNextSong(false)} style={styles.icon} name={"stepforward"} type={"AntDesign"} />
                    </View>

                    {/* share add to favorite view */}
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 25 }}>
                        {/* {
                            this.props.userRole === UserRole.NORMAL && */}
                            <TouchableOpacity style={{
                                padding: 2, flex:0.5, flexDirection: "row", borderWidth: 0.5, borderRadius: 5,
                                justifyContent: "center", borderColor: colors.lightMaroon
                            }} onPress={() => this.props.makeFavorite(this.props.currentSong.songid)}>
                                <Text style={{fontSize: 12}}>{isFavorite(this.props.favorites, this.props.currentSong.songid) ?
                                    "Remove from favorites" : "Add to favorites"}</Text>
                                <Icon name={"hearto"}
                                    type={"AntDesign"} style={{
                                        fontSize: 10, color: colors.charcoal, marginLeft: 2, padding: 0, marginTop: 3
                                    }}></Icon>
                            </TouchableOpacity>
                            {/* } */}
                        <TouchableOpacity
                            style={{
                                padding: 2, flex: 0.5, flexDirection: "row", borderWidth: 0.5, borderRadius: 5,
                                justifyContent: "center", marginLeft: 5, borderColor: colors.lightMaroon, marginTop: 1,
                            }}
                            onPress={() => this.shareSong(this.props.currentSong)}>
                            <Text style={{fontSize: 12}}>{this.state.isSong ? "Share song" : "Share video"}</Text>
                            <Icon name={"share-outline"} type={"MaterialCommunityIcons"} style={{ fontSize: 13, color: colors.charcoal, marginTop: 4 }}></Icon>
                        </TouchableOpacity>
                    </View>

                    {/* go to favorites playlist */}
                    <View
                    style={{ flexDirection: "row", alignSelf: "center", marginTop: 15, marginBottom: 30 }}
                    >
                         <TouchableOpacity style={{
                                padding: 2, flex:0.5,  flexDirection: "row", borderWidth: 0.5, borderRadius: 5,
                                justifyContent: "center", borderColor: colors.lightMaroon,
                            }} onPress={() => this.props.navigation.push("PlaylistScreen", { comingFrom: PlaylistTypes.PLAYLIST })}>
                                <Text style={{fontSize: 12}}>My playlist</Text>
                                <Icon name={"playlist"} type={"SimpleLineIcons"} style={{
                                        fontSize: 10, color: colors.charcoal, marginLeft: 2, padding: 0, marginTop: 2
                                    }}></Icon>
                            </TouchableOpacity>
                    </View>

                </ScrollView>
                {/* <TrackPlayer/> */}

            </Container>
        )
    }
}
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    playNext: (isSong: boolean) => dispatch(SongsActions.setNextSong(isSong)),
    playPrev: (isSong) => dispatch(SongsActions.setPreviousSong(isSong)),
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing)),
    isSongPlaying: (play) => dispatch(SongsActions.setIsPlaying(true)),
    getArtist: (userId) => dispatch(ArtistProfileAction.getArtistProfileRequest(userId)),
    makeFavorite: (songId) => dispatch(FavoriteAction.makeFavoriteRequest(songId)),
    getFavorites: (shoulSetPlaylist) => dispatch(FavoriteAction.getFavoriteRequest(shoulSetPlaylist)),
    setSong: () => dispatch(SongsActions.setSong({ song_name: "Select a song", songimage: "", song_file: "" })),
});
export const mapStateToProps = (state: RootState): StateProps => ({
    isPlaying: state.songs.isPlaying,
    currentSong: state.songs.song,
    currentPlaylist: state.songs.playlist,
    showPlay: state.songs.showPlay,
    userRole: state.login.userData.user_cat,
    favorites: state.favorites.favoritesData,
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayScreen);
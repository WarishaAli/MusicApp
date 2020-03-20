import { Card, Container, Icon, ListItem, Item, Button } from "native-base";
import React from "react";
import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, Alert, View, TextInput, ActivityIndicator } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import BottomBar from "../../Components/BottomBar";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import genreData from "../../Lib/GenresData";
import { Playlist, PlaylistTypes } from "../../Lib/PlaylistTypes";
import { RootState } from "../../Reducers";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { CategoryAction, ICategoryResponse } from "../../Reducers/CategoryReducers";
import { SongsActions } from "../../Reducers/SongsReducer";
import { Images } from "../../Themes";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import styles from "./HomeScreenStyles";
import SoundPlayer from "react-native-sound-player";
import { ISongData, OpenSong } from "../MusicPlayScreen/MusicPlayScreen";
import { SearchAction } from "../../Reducers/SearchReducer";
import TrackPlayer from "react-native-track-player";
export interface State {
    croppedFeaturedSongs: any;
    showSearchBar: boolean;
    searchText: string;
}
export interface OwnProps {

}
export enum DataTypes {
    SONGS = "Top Songs",
    ALBUMS = "Categories",
    VIDEOS = "Videos",
    PODCASTS = "Podcasts",
}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    setPlaylist: (list: Playlist) => void;
    getCategories: () => void;
    getHomeData: () => void;
    playSong: (song: ISongData) => void;
    shouldPlay: (play: boolean) => void;
    showPlay: (play: boolean) => void;
    searchSong: (keyword: string) => void;
    // songCat: () => void;
}

export interface StateProps {
    category: ICategoryResponse | undefined;
    loginToken: any;
    featuredSongs: any;
    featuredVideos: any;
    featuredPodcasts: any;
    isSongPlaying: boolean;
    searchData: any;
    isSongSearching: boolean;
    videoCategories: any;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;
class HomeScreen extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            croppedFeaturedSongs: [],
            showSearchBar: false,
            searchText: "",
        }
    }
    public componentDidMount() {
        this.props.setBottomTab(BottomBarBtns.EXPLORE);
        this.props.getCategories();
        this.props.getHomeData();
        // this.props.songCat();
    }
    public selectSingleCategory = (data: any) => {
        // this.props.setPlaylist(data);
        this.props.navigation.navigate("Playlist", { comingFrom: PlaylistTypes.EXPLORE, category: data, isVideo: data.song_category.includes("videos") })
    };
    public renderTextIcon = (title: string, data: any) => (
        <TouchableOpacity
            onPress={() => this.props.navigation.push("SelectAllCategory", { params: { title: title, data: data } })}
            style={{ flexDirection: "row" }}>
            <Text style={[styles.subHeading]}>{title}</Text>
            <Icon name={"ios-arrow-forward"} type={"Ionicons"} style={{ fontSize: 18, padding: 0, marginLeft: 7, alignSelf: "center", marginTop: 2, color: colors.charcoal }} />
        </TouchableOpacity>
    );
    public renderGenreList = (data: any, noDataText: string) => {
        return data ? (
            <FlatList data={data.length > 15 ? data.slice(0, 10) : data}
                renderItem={(item) =>
                    (noDataText === DataTypes.VIDEOS || noDataText === DataTypes.ALBUMS) ? this.renderGenreView(item) : this.renderFeauteredSongs(item, noDataText)}
                style={styles.listStyle}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            // keyExtractor={(item) => noDataText === "categories" ? item.cat_id : item.songid}
            />
        ) : (<Text style={styles.noDataText}>
            Currently there are no {noDataText} to display!
        </Text>)
    }

    // public getSongInfo = async (item) => {
    //     try {
    //         const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
    //         console.log('getInfo', info.duration / 60, info.currentTime / 60) // {duration: 12.416, currentTime: 7.691}
    //         this.props.navigation.push("MusicPlayScreen", { songData: info })
    //     } catch (e) {
    //         console.log('There is no song playing', e)
    //     }
    // }
    public playSong = (item) => {
        SoundPlayer.playUrl(item.song_file);
        this.props.playSong(item);
        this.props.shouldPlay(true);
        this.props.showPlay(true);
        this.props.setPlaylist(this.props.featuredSongs);
    }
    public openSongScreen = async (item) => {
        this.playSong(item);
        this.props.navigation.push("MusicPlayScreen", { songData: item, isSong: true, comingFrom: OpenSong.SCREEN })
    }

    public openVideoScreen = (videoItem: any) => {
        SoundPlayer.pause();
        this.props.playSong(videoItem)
        this.props.setPlaylist(this.props.featuredVideos);
        this.props.navigation.push("MusicPlayScreen", { songData: videoItem, isSong: false, videoUrl: videoItem })
    }
    public openPodcastScreen = (item) => {
        SoundPlayer.playUrl(item.song_file);
        this.props.playSong(item);
        this.props.shouldPlay(true);
        this.props.showPlay(true);
        this.props.setPlaylist(this.props.featuredPodcasts);
        this.props.navigation.push("MusicPlayScreen", { songData: item, isSong: true, comingFrom: OpenSong.SCREEN })
    }

    public renderFeauteredSongs = (item: any, text: string) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (text === DataTypes.VIDEOS) {
                        this.openVideoScreen(item.item)
                    } else if (text === DataTypes.PODCASTS) {
                        this.openPodcastScreen(item.item)
                    } else if (text === DataTypes.SONGS) {
                        this.openSongScreen(item.item)
                    }
                }}>
                <Card style={styles.songsCard}>
                    <ImageBackground style={styles.cardImage} source={{ uri: item.item.songimage }}
                    // imageStyle={{ borderRadius: 5 }}
                    ></ImageBackground>
                    <View style={styles.cardOverlayView}>
                        <Text numberOfLines={1} style={styles.songName}>{item.item.song_name}</Text>
                        <Text style={{ fontSize: 12, color: colors.charcoal, alignSelf: "center" }}>{item.item.artistName}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }
    public renderGenreView = (item) => {
        return (
            <TouchableOpacity
                onPress={() => { this.selectSingleCategory(item.item) }}>
                <Card style={styles.songsCard}>
                    <ImageBackground style={styles.cardImage} source={{ uri: item.item.thumbnail }} resizeMode={"cover"}
                    // imageStyle={{ borderRadius: 10}}
                    >
                    </ImageBackground>
                </Card>
            </TouchableOpacity>

        )
    }
    // public setData = (dataSet: any) => {
    //     this.setState({ data: dataSet });
    // }
    public showSearchBar = () => {
        this.setState({ showSearchBar: true })
    }
    public onClickSearchItem = (item: any) => {
        this.setState({ showSearchBar: false });
        item.song_category === "Podcast videos" ? this.openVideoScreen(item) : this.openSongScreen(item);
    }
    public renderSearchItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 5, marginLeft: 5 }} onPress={() => this.onClickSearchItem(item)}>
                <Text style={{ fontSize: 18, fontFamily: "serif", paddingLeft: 10 }}>{item.song_name}</Text>
                <Text style={{ paddingLeft: 10, marginTop: 2, fontSize: 12 }}>{item.song_category}</Text>
                <View style={{ backgroundColor: colors.maroon, height: 0.5, width: "80%", margin: 15 }}></View>
            </TouchableOpacity>
        )
    }
    public render() {
        console.log(!this.props.isSongPlaying, "at home")
        return (
            <Container style={{ backgroundColor: colors.snow }} >
                <CommonHeader title={"Search"}
                    rightItem={
                        <TouchableOpacity>
                            <Icon name={"search"} type={"Feather"} style={styles.searchIcon} onPress={this.showSearchBar}></Icon>
                        </TouchableOpacity>
                    }
                />
                {!this.state.showSearchBar &&
                    <Button
                        transparent={true}
                        onPress={this.showSearchBar}
                        style={{ width: 100, position: "absolute", top: 10, left: 20, height: 20 }} />}
                {
                    (this.state.showSearchBar && this.props.isSongSearching) &&
                    <ActivityIndicator
                        style={{ position: "absolute", top: 15, right: 60, zIndex: 10 }}
                        color={colors.lightMaroon}
                    />
                }
                {(this.state.showSearchBar && !this.props.isSongSearching) &&
                    <TouchableOpacity onPress={() => this.setState({ showSearchBar: false })} style={{ position: "absolute", top: 15, right: 60, zIndex: 10 }}>
                        <Icon name={"closecircleo"} type={"AntDesign"}
                            style={{
                                fontSize: 12, color: colors.lightMaroon
                                ,
                            }}></Icon>
                    </TouchableOpacity>
                }
                {this.state.showSearchBar && <TextInput
                    style={{
                        position: "absolute", top: 0, backgroundColor: colors.snow, flex: 1, width: "80%", right: 50, padding: 5,
                        borderWidth: 0.5, borderColor: colors.silver, borderRadius: 5, borderBottomColor: colors.steel
                    }} placeholder={"Search a song"} placeholderTextColor={colors.lightMaroon}
                    onChangeText={(text) => this.props.searchSong(text)}></TextInput>}
                {this.state.showSearchBar && <View style={{
                    width: "90%", height: 300, position: "absolute", top: 45,
                    backgroundColor: colors.snow, zIndex: 10, alignSelf: "center", borderWidth: 0.5, borderColor: colors.silver, borderBottomColor: colors.silver
                }}>

                    {this.props.searchData && this.props.searchData.length === 0 ?
                        <Text style={{ alignSelf: "flex-start", padding: 30, color: colors.maroon }}>
                            We could not find any song for your query</Text> :
                        <FlatList data={this.props.searchData} renderItem={this.renderSearchItem}
                        />}
                </View>}



                <ScrollView style={{ marginLeft: 15, flex: 0.9, marginBottom: 100 }}>
                    {/* <Button onPress={() => {
                            TrackPlayer.add([{
                                id: 'trackId',
                                url: "http://app.hiphopstreets.com/songfile/439008f6956afd56b0a0b770769a63e7.mp3",
                                title: 'Dope',
                                artist: 'Warisha',
                                artwork: Images.appLogo,
                            },{
                                id: 'track2',
                                url: "http://app.hiphopstreets.com/songfile/439008f6956afd56b0a0b770769a63e7.mp3",
                                title: 'Hello',
                                artist: 'Ali',
                                artwork: Images.croppedBackgroundImage,  
                            }
                        ]);
                           
                        
                            // Starts playing it
                            TrackPlayer.play();
                        
                        }
                    }></Button> */}
                {this.renderTextIcon(DataTypes.SONGS, this.props.featuredSongs)}
                {this.renderGenreList(this.props.featuredSongs, DataTypes.SONGS)}
                {this.renderTextIcon(DataTypes.ALBUMS, this.props.category)}
                {this.renderGenreList(this.props.category, DataTypes.ALBUMS)}
                {/* {this.renderTextIcon(DataTypes.VIDEOS, this.props.featuredVideos)} */}
                {/* {this.renderGenreList(this.props.featuredVideos, DataTypes.VIDEOS)} */}
                {this.renderTextIcon(DataTypes.VIDEOS, this.props.videoCategories)}
                {this.renderGenreList(this.props.videoCategories, DataTypes.VIDEOS)}
                {this.renderTextIcon(DataTypes.PODCASTS, this.props.featuredPodcasts)}
                {this.renderGenreList(this.props.featuredPodcasts, DataTypes.PODCASTS)}
                </ScrollView>


                {
            this.props.isSongPlaying && <MusicPlayer style={styles.musicPlayer} hide={false}
                navigation={this.props.navigation}
            />
        }
        <BottomBar navigation={this.props.navigation} />
            </Container >
        )
    }
}
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
    setPlaylist: (list) => dispatch(SongsActions.setPlaylist(list)),
    getCategories: () => dispatch(CategoryAction.getCategoryRequest()),
    getHomeData: () => dispatch(CategoryAction.getHomeDataReq()),
    playSong: (song) => dispatch(SongsActions.setSong(song)),
    shouldPlay: (play) => dispatch(SongsActions.setIsPlaying(play)),
    showPlay: (showPlay) => dispatch(SongsActions.showPlaying(showPlay)),
    searchSong: (keyword) => dispatch(SearchAction.searchRequest(keyword)),
    // songCat: () => dispatch(CategoryAction.getSongByCatRequest("Hiphop videos"))

})

export const mapStateToProps = (state: RootState): StateProps => ({
    category: state.category.categoriesData,
    loginToken: state.login.userData,
    featuredSongs: state.category.homeData ? state.category.homeData.featuredSongs : undefined,
    featuredVideos: state.category.homeData ? state.category.homeData.featuredVideos : undefined,
    featuredPodcasts: state.category.homeData ? state.category.homeData.featuredPodcasts : undefined,
    isSongPlaying: state.songs.isPlaying || state.songs.showPlay,
    searchData: state.search.searchData,
    isSongSearching: state.search.fetching,
    videoCategories: state.category.homeData ? state.category.homeData.videoCategories : undefined,
})
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
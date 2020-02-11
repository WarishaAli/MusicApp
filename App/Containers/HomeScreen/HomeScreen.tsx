import { Card, Container, Icon } from "native-base";
import React from "react";
import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, Alert, View } from "react-native";
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
import { ISongData } from "../MusicPlayScreen/MusicPlayScreen";

export interface State {
    croppedFeaturedSongs: any;
}
export interface OwnProps {

}
export enum DataTypes{
    SONGS = "Top Songs",
    ALBUMS="Albums",
    VIDEOS="Videos",
    PODCASTS="Podcasts",
}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    setPlaylist: (list: Playlist) => void;
    getCategories: () => void;
    getHomeData: () => void;
    playSong: (song: ISongData) => void;
    shouldPlay: (play: boolean) => void;
    showPlay: (play: boolean) => void;

}

export interface StateProps {
    category: ICategoryResponse | undefined;
    loginToken: any;
    featuredSongs: any;
    featuredVideos: any;
    featuredPodcasts: any;
    isSongPlaying: boolean;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;
class HomeScreen extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            croppedFeaturedSongs: [],
        }
    }
    public componentDidMount() {
        this.props.setBottomTab(BottomBarBtns.EXPLORE);
        this.props.getCategories();
        this.props.getHomeData();
    }
    public selectSingleCategory = (data: any) => {
        // this.props.setPlaylist(data);
        this.props.navigation.navigate("Playlist", { comingFrom: PlaylistTypes.EXPLORE, category: data })
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
            renderItem={(item) => noDataText === DataTypes.ALBUMS ? this.renderGenreView(item) : this.renderFeauteredSongs(item, noDataText)} style={styles.listStyle} horizontal={true}
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
        this.props.playSong(item);
        this.props.shouldPlay(true);
        this.props.setPlaylist(this.props.featuredSongs);
    }
    public openSongScreen = async (item) => {
        this.playSong(item);
        // this.getSongInfo(item);
        this.props.navigation.push("MusicPlayScreen", { songData: item })
    }

    public openVideoScreen = (videoItem: any) => {

    }

    public renderFeauteredSongs = (item: any, text: string) => {
        return (
            <TouchableOpacity onPress={() => text === DataTypes.VIDEOS ? this.openVideoScreen(item.item) : this.openSongScreen(item.item)}>
                <Card style={styles.songsCard}>
                    <ImageBackground style={styles.cardImage} source={{ uri: item.item.songimage }}
                    // imageStyle={{ borderRadius: 5 }}
                    ></ImageBackground>
                    <View style={styles.cardOverlayView}>
                    <Text style={styles.songName}>{item.item.song_name}</Text>
                    <Text style={{ fontSize: 12, color: colors.charcoal, alignSelf: "center" }}>{item.item.song_category}</Text>
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
    public render() {
        return (
            <Container style={{ backgroundColor: colors.snow }} >
                <CommonHeader title={"Search"}
                    rightItem={<Icon name={"search"} type={"Feather"} style={styles.searchIcon}></Icon>}
                />
                <ScrollView style={{ marginLeft: 15, flex: 0.9, marginBottom: 70 }}>
                    {this.renderTextIcon(DataTypes.SONGS, this.props.featuredSongs)}
                    {this.renderGenreList(this.props.featuredSongs, DataTypes.SONGS)}
                    {this.renderTextIcon(DataTypes.ALBUMS, this.props.category)}
                    {this.renderGenreList(this.props.category, DataTypes.ALBUMS)}
                    {this.renderTextIcon(DataTypes.VIDEOS, this.props.featuredVideos)}
                    {this.renderGenreList(this.props.featuredVideos, DataTypes.VIDEOS)}
                    {this.renderTextIcon(DataTypes.PODCASTS, this.props.featuredPodcasts)}
                    {this.renderGenreList(this.props.featuredPodcasts, DataTypes.PODCASTS)}
                </ScrollView>


                {<MusicPlayer style={styles.musicPlayer} hide={!this.props.isSongPlaying}
                    navigation={this.props.navigation}
                />}
                <BottomBar navigation={this.props.navigation} />
            </Container>
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

})

export const mapStateToProps = (state: RootState): StateProps => ({
    category: state.category.categoriesData,
    loginToken: state.login.userData,
    featuredSongs: state.category.homeData ? state.category.homeData.featuredSongs : undefined,
    featuredVideos: state.category.homeData ? state.category.homeData.featuredVideos : undefined,
    featuredPodcasts: state.category.homeData ? state.category.homeData.podcastShows : undefined,
    isSongPlaying: state.songs.isPlaying
})
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
import { NavigationScreenProps, FlatList } from "react-navigation";
import React from "react";
import { Container, Card, Content, Icon } from "native-base";
import { Text, TouchableOpacity, ImageBackground } from "react-native";
import styles from "./AllCategoriesScreenStyles";
import { PlaylistTypes, Playlist } from "../../Lib/PlaylistTypes";
import colors from "../../Themes/Colors";
import { SongsActions } from "../../Reducers/SongsReducer";
import { connect } from "react-redux";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { Images } from "../../Themes";
import { RootState } from "../../Reducers";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import { ISongData } from "../MusicPlayScreen/MusicPlayScreen";
import SoundPlayer from "react-native-sound-player";
import { DataTypes } from "../HomeScreen/HomeScreen";

export enum ScreenTitle {
    GENRE = "Albums",
    SONGS = "Featured songs",
    VIDEOS = "Featured videos",
    PODCASTS = "Featured podcasts",
}
export interface OwnProps {

}
export interface DispatchProps {
    setPlaylist: (list: Playlist) => void;
    playSong: (song: ISongData) => void;
    shouldPlay: (play: boolean) => void;
    showPlay: (play: boolean) => void;
}
export interface StateProps {
    isPlaying: boolean;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;

class AllCategoriesScreen extends React.Component<Props>{
    public categoryData: any;
    constructor(props: Props) {
        super(props);
        this.categoryData = this.props.navigation.getParam("params");
    }
    public selectSingleCategory = (data: any) => {
        console.log("all category", data);
        // this.props.setPlaylist(data);
        this.props.navigation.navigate("PlaylistScreen", { comingFrom: PlaylistTypes.EXPLORE, category: data })
    };
    public renderCatTiles = ({ item }) => {
        return (
            <TouchableOpacity style={styles.cardItemStyle} onPress={() => { this.selectSingleCategory(item) }}>
                <Card style={{ flex: 1 }}>
                    <ImageBackground style={styles.cardImage} source={{ uri: item.thumbnail }} resizeMode={"cover"} imageStyle={{ borderRadius: 5 }}>
                        {/* <TouchableOpacity onPress={() => {this.selectSingleCategory(item)}}> */}
                        {/* <Text style={[styles.subHeading, { color: colors.snow, alignSelf: "center", marginBottom: 10, fontSize: 17}]}>{item.song_category}</Text> */}
                        {/* </TouchableOpacity> */}
                    </ImageBackground>
                </Card>
            </TouchableOpacity>
        )
    };
    public playSong = (songData: any) => {
        SoundPlayer.playUrl(songData.song_file);
        this.props.showPlay(true);
        this.props.playSong(songData);
        this.props.shouldPlay(true);
        this.props.setPlaylist(this.categoryData.data);
    }
    public renderSongTiles = ({ item }) => (
        <TouchableOpacity style={styles.cardItemStyle} onPress={() => this.playSong(item)}>
            <Card style={{ flex: 1 }}>
                <ImageBackground style={styles.cardImage} source={{ uri: item.songimage }} resizeMode={"cover"} imageStyle={{ borderRadius: 5 }}>
                </ImageBackground>
            </Card>
            <Text style={styles.subHeading}>{item.song_name}</Text>
            <Text style={{ fontSize: 12 }}>{item.song_category}</Text>
        </TouchableOpacity>
    )
    public render() {
        return (
            <Container>
                <CommonHeader title={"Explore " + this.categoryData.title}
                    leftItem={
                        <TouchableOpacity onPress={() => this.props.navigation.pop()} style={{ marginTop: 10, paddingRight: 5 }}>
                            <Icon name={"ios-arrow-back"} style={{ color: colors.lightMaroon, fontSize: 15, }} />
                        </TouchableOpacity>
                    }
                />
                <Content style={{ paddingHorizontal: 20, }}>
                    {/* <Text style={styles.headerTitle}>{this.categoryData.title}</Text> */}
                    <FlatList renderItem={this.categoryData.title === DataTypes.ALBUMS ? this.renderCatTiles : this.renderSongTiles}
                        data={this.categoryData.data} style={{ marginBottom: 100 }}
                        numColumns={2}
                    />
                </Content>
                <MusicPlayer style={styles.musicPlayer} hide={!this.props.isPlaying} />
            </Container>
        );
    }
}
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setPlaylist: (list) => dispatch(SongsActions.setPlaylist(list)),
    playSong: (song) => dispatch(SongsActions.setSong(song)),
    shouldPlay: (play) => dispatch(SongsActions.setIsPlaying(play)),
    showPlay: (showPlay) => dispatch(SongsActions.showPlaying(showPlay)),
});

export const mapStateToProps = (state: RootState): StateProps => ({
    isPlaying: state.songs.isPlaying,
})

export default connect(mapStateToProps, mapDispatchToProps)(AllCategoriesScreen);
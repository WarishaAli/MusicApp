import React from "react";
import { NavigationScreenProps, FlatList } from "react-navigation";
import { Container, Content, Button, Icon, Col } from "native-base";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { playlists } from "../../Lib/PlaylistData";
import styles from "./PlaylistScreenStyles";
import BottomBar from "../../Components/BottomBar";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import { connect, Dispatch } from "react-redux";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { SongsActions } from "../../Reducers/SongsReducer";
import { RootState } from "../../Reducers/index"
import { PlaylistTypes, Playlist, Songs } from "../../Lib/PlaylistTypes";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { FavoriteAction, IFavoriteResponse } from "../../Reducers/FavoritesReducer";
import { CategoryAction } from "../../Reducers/CategoryReducers";

export interface OwnProps {
    comingFrom: PlaylistTypes;

}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    playMusic: (shouldPlay: boolean) => void;
    // selectPlaylist: (playlist: Playlist) => void;
    selectSong: (song: Songs) => void;
    getFavorites: () => void;
    getSongByCat: (catName: string) => void;
}
export interface StateProps {
    shouldPlay: boolean;
    selectedPlaylist: Playlist | undefined;
    selectedSong: Songs | undefined;
    favorites: undefined | Array<IFavoriteResponse>;
    categorySongs: undefined | Array<any>;
}
export interface State {
    playlistType: PlaylistTypes;
    categoryName: string;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;

class PlaylistScreen extends React.Component<Props, State>{
    public constructor(props: Props) {
        super(props);
        this.state = {
            playlistType: this.props.navigation.getParam("comingFrom"),
            categoryName: this.props.navigation.getParam("category")
        }
    }
    public async componentDidMount() {
        this.state.playlistType === PlaylistTypes.PLAYLIST ? this.props.getFavorites() : this.props.getSongByCat(this.state.categoryName);
        this.state.playlistType === PlaylistTypes.PLAYLIST && this.props.setBottomTab(BottomBarBtns.PLAYLIST);
        // await this.props.selectPlaylist(playlists[0]);
        // this.props.selectSong(this.props.selectedPlaylist.songs[0]);
        this.props.playMusic(false);
    }
    public playSong = (item: any) => {
        this.props.playMusic(true);
        this.props.selectSong(item);
    }
    // public selectPlaylist = (list: Playlist) => { 
    //     this.props.selectPlaylist(list);
    // }
    // public renderHorizontalItems = ({item}) => (
    //         <Button transparent={true} onPress={() => this.selectPlaylist(item)} style={[styles.cardItemStyle,{backgroundColor: item.name === this.props.selectedPlaylist.name ? colors.maroon : colors.lightMaroon}]}>
    //         <Text style={styles.playlistName}>{item.name}</Text>
    //         </Button>
    // );
    public renderSongs = ({ item }) => (
        // image songName catName likeCount
        <TouchableOpacity onPress={() => this.playSong(item)} style={{ flexDirection: "row", marginTop: 25, }}>
            <Image source={{ uri: item.songimage }} style={styles.songImg}></Image>
            <View style={{paddingLeft: 10}}>
                <Text style={[styles.heading,
                    // { fontWeight: this.props.selectedSong.name === item.name ? "bold" : "normal", color: this.props.selectedSong.name === item.name ? colors.maroon : colors.black }
                ]}>{item.song_name}</Text>
                <Text style={[styles.subHeading, {marginTop: 1}]}>{item.song_category}</Text>
            </View>
            <View style={{flex: 0.3, flexDirection: "row", paddingLeft: 50}}>
            <Text style={[styles.subHeading, {marginLeft: 0}]}>{item.likecount}</Text>
            <Icon name={"hearto"} type={"AntDesign"}></Icon>
            </View>
            {/* <View style={styles.caretView} /> */}
        </TouchableOpacity>
    )
    public render() {
        return (
            <Container>
                <CommonHeader title={"Stream songs"}
                    leftItem={
                        this.state.playlistType === PlaylistTypes.EXPLORE && <Icon name={"ios-arrow-back"} style={{ fontSize: 20, color: colors.snow }} onPress={() => this.props.navigation.pop()}></Icon>
                    }
                />
                <View style={styles.headerView}>
                    <Text style={styles.header}>{this.state.playlistType === PlaylistTypes.EXPLORE ?
                        this.state.categoryName : "Favorites"}</Text>
                    <Button style={styles.listenBtn} onPress={() => this.playSong(this.props.selectedPlaylist.songs[0])}>
                        <Icon name={"playcircleo"} type={"AntDesign"} style={{ fontSize: 15, padding: 0, margin: 0 }} />
                        <Text style={styles.listenTxt}>Play</Text>
                    </Button>
                </View>
                <Content style={{ paddingHorizontal: 10, paddingTop: 30 }}>
                    {/* <View>
                        <Text></Text>
                    </View> */}
                    {this.props.selectedPlaylist &&
                        <FlatList scrollEnabled={true} style={{ paddingHorizontal: 30 }}
                            data={this.props.selectedPlaylist} renderItem={this.renderSongs} />}
                </Content>
                <MusicPlayer
                    style={this.state.playlistType === PlaylistTypes.EXPLORE ? styles.singleCatStyle : styles.playlistStyle}
                // playNextSong={this.playNext}
                />
                {this.state.playlistType === PlaylistTypes.PLAYLIST &&
                    <BottomBar navigation={this.props.navigation} />}
            </Container>
        );
    }
};
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    // selectPlaylist: (playlist) => dispatch(SongsActions.setPlaylist(playlist)),
    selectSong: (song) => dispatch(SongsActions.setSong(song)),
    getFavorites: () => dispatch(FavoriteAction.getFavoriteRequest()),
    getSongByCat: (catName) => dispatch(CategoryAction.getSongByCatRequest(catName))
    // playNext: () => dispatch(SongsActions.setNextSong()),
});
export const mapStateToProps = (state: RootState): StateProps => ({
    shouldPlay: state.songs.isPlaying,
    selectedPlaylist: state.songs.playlist,
    selectedSong: state.songs.song,
    favorites: state.favorites.favoritesData,
    categorySongs: state.category.songByCategory,
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistScreen);
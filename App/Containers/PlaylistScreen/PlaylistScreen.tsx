import { Button, Container, Icon, Row, Toast } from "native-base";
import React from "react";
import { Image, Picker, Text, TouchableOpacity, View, Alert } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import ImagePicker from 'react-native-image-picker';
import { FlatList, NavigationScreenProps } from "react-navigation";
import { connect, Dispatch } from "react-redux";
import BottomBar from "../../Components/BottomBar";
import ModalView from "../../Components/ModalView/ModalView";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import { ISongUpload } from "../../Lib/Interfaces";
import { Playlist, PlaylistTypes, Songs } from "../../Lib/PlaylistTypes";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { CategoryAction, ICategoryResponse } from "../../Reducers/CategoryReducers";
import { FavoriteAction, IFavoriteResponse } from "../../Reducers/FavoritesReducer";
import { RootState } from "../../Reducers/index";
import { MySongAction } from "../../Reducers/MySongsReducer";
import { SongsActions } from "../../Reducers/SongsReducer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import styles from "./PlaylistScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Share from "react-native-share";
import { UserRole } from "../SignupScreen/SignupScreen";
// import SoundPlayer from "react-native-sound-player";
import { isFavorite } from "../../Lib/MusicPlayerHelpers";
import RNTrackPlayer from "react-native-track-player";
import { transformSongArray } from "../../Lib/SongQueueHelper";

export interface OwnProps {
    comingFrom: PlaylistTypes;

}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    playMusic: (shouldPlay: boolean) => void;
    selectSong: (song: Songs) => void;
    getFavorites: (setPlaylist: boolean) => void;
    getSongByCat: (catName: string) => void;
    makeFavorite: (songId: string) => void;
    getMySong: () => void;
    uploadSong: (params: ISongUpload) => void;
    showPlaying: (showPlayer: boolean) => void;
    getHeart: (setPlaylist: boolean) => void;
}
export interface StateProps {
    shouldPlay: boolean;
    selectedPlaylist: Playlist | undefined;
    selectedSong: Songs | undefined;
    favorites: undefined | Array<IFavoriteResponse>;
    categorySongs: undefined | Array<any>;
    mySongs: undefined | Array<Songs>;
    isPlaying: boolean;
    userRole: UserRole;
    category: ICategoryResponse;
}
export interface State {
    playlistType: PlaylistTypes;
    categoryData: any;
    showModal: boolean;
    songName: string;
    songImage: { uri: string, type: string, name: string };
    songFile: any;
    songCat: string;
    imgPosition: { x: number, y: number };
    songStatus: 0 | 1;
    showPicker: boolean;
    songType: "mp3" | "mp4";
    categories: any;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;

class PlaylistScreen extends React.Component<Props, State>{
    public constructor(props: Props) {
        super(props);
        this.state = {
            playlistType: this.props.navigation.getParam("comingFrom"),
            categoryData: this.props.navigation.getParam("category"),
            showModal: false,
            songCat: "",
            songFile: undefined,
            songImage: { uri: "", type: "image/jpeg", name: "" },
            songName: "",
            imgPosition: { x: 0, y: 0 },
            songStatus: 1,
            showPicker: false,
            songType: "mp3",
            categories: [],
        }
    }
    public async componentDidMount() {
        console.log("checkingggggggggg", this.props.navigation.getParam("isVideo"));
        switch (this.state.playlistType) {
            case PlaylistTypes.EXPLORE: {
                this.props.getSongByCat(this.state.categoryData.song_category);
            }
                break;
            case PlaylistTypes.PLAYLIST: {
                this.props.getFavorites(true);
                this.props.setBottomTab(BottomBarBtns.PLAYLIST);
            }
                break;
            case PlaylistTypes.MYSONGS: {
                this.props.getMySong();
                this.props.setBottomTab(BottomBarBtns.MYSONGS);
            }
        }
        this.props.getHeart(false);
        // console.log("favories data", this.props.favorites);
        this.setState({
            categories: [{
                cat_id: "-1",
                song_category: "Select a category",
                thumbnail: "",
            }, ...this.props.category]
        });
        // if (this.props.categorySongs) {
        //     RNTrackPlayer.reset();
        //     RNTrackPlayer.add(transformSongArray(this.props.categorySongs));
        //     RNTrackPlayer.play();
        // }
    }
    public playSong = (item: any) => {
        // SoundPlayer.playUrl(item.song_file);
        console.log("at play single song", transformSongArray([item]));
        RNTrackPlayer.reset();
        RNTrackPlayer.add(transformSongArray([item, ...this.props.categorySongs]));
        RNTrackPlayer.play();
        this.props.showPlaying(true);
        this.props.playMusic(true);
        this.props.selectSong(item);
        // SoundPlayer.loadUrl(item.song_file);

    }
    public openVideoScreen = (videoItem: any) => {
        // SoundPlayer.pause();
        RNTrackPlayer.pause();
        this.props.selectSong(videoItem)
        // this.props.setPlaylist(this.props.featuredVideos);
        this.props.navigation.push("MusicPlayScreen", { songData: videoItem, isSong: false, videoUrl: videoItem })
    }
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
    public renderSongs = ({ item }) => {
        let isFav = false;
        isFav = this.props.favorites ? isFavorite(this.props.favorites, item.songid) : false;
        // image songName catName likeCount

        return this.props.selectedPlaylist.length > 0 ? (
            <View style={{ flexDirection: "row", marginTop: 25, }}>
                <Image source={{ uri: item.songimage, cache: "reload" }} style={styles.songImg}></Image>
                <TouchableOpacity onPress={() => this.playSong(item)} style={{ paddingLeft: 10, width: "50%" }}>
                    <Text numberOfLines={2} lineBreakMode={"middle"} style={[styles.heading, { alignSelf: "flex-start" }
                        // { fontWeight: this.props.selectedSong.name === item.name ? "bold" : "normal", color: this.props.selectedSong.name === item.name ? colors.maroon : colors.black }
                    ]}>{item.song_name}</Text>
                    <Text style={[styles.subHeading, { marginTop: 1, color: colors.maroon, fontSize: 12 }]}>{item.artistName || item.song_category}</Text>
                </TouchableOpacity>
                <Row></Row>
                <View style={{ flexDirection: "row" }}>
                    {this.props.userRole === UserRole.NORMAL && <Text style={styles.likeTxt}>{item.likecount}</Text>}
                    {(this.props.userRole === UserRole.NORMAL) &&
                        <TouchableOpacity style={styles.iconView} onPress={() => { this.props.makeFavorite(item.songid) }}>
                            {!isFav ?
                                <Icon name={"hearto"} type={"AntDesign"} style={[styles.heartIcon, { fontSize: 17 }]}></Icon> :
                                <Icon name={"heart"} type={"AntDesign"} style={[styles.heartIcon, { fontSize: 17 }]}></Icon>
                            }
                        </TouchableOpacity>

                    }

                    <TouchableOpacity style={styles.shareView} onPress={() => this.shareSong(item)}>
                        <Icon name={"share-outline"} type={"MaterialCommunityIcons"} style={styles.heartIcon}></Icon>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.caretView} /> */}
            </View>) : <Text>
                <Text style={{ alignSelf: "center", marginTop: 100 }}>{this.state.playlistType === PlaylistTypes.PLAYLIST ? "Add some songs to your favorite list!" :
                    "No songs to display, please try again later!"}</Text>
            </Text>
    }
    public getHeading = () => {
        if (this.state.playlistType === PlaylistTypes.EXPLORE) {
            return this.state.categoryData.song_category
        } else if (this.state.playlistType === PlaylistTypes.PLAYLIST) {
            return "Favorites"
        } else {
            return "My Songs"
        }
    }
    public onLayoutImg = (e) => {
        this.setState({
            imgPosition: { x: e.nativeEvent.layout.width, y: e.nativeEvent.layout.height }
        })
    }
    public selectImage = () => {
        const options = {
            title: "Pick your profile picture"
        }
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({ songImage: { uri: response.uri, type: response.type, name: response.fileName } });
            }
        });
    }
    public selectSongFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
            this.setState({ songFile: { uri: res.uri, name: res.name, type: res.type } })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    public uploadSong = () => {
        if (this.state.songName.length > 0 && this.state.songCat.length > 0 && this.state.songFile !== undefined &&
            this.state.songImage.uri.length > 0 && this.state.songStatus !== undefined) {
            this.setState({ showModal: false });
            this.props.uploadSong({
                songName: this.state.songName, songFile: this.state.songFile, songCategory: this.state.songCat,
                songImage: this.state.songImage, status: this.state.songStatus, songType: this.state.songType,
            })
        } else {
            Alert.alert("Error", "Please provide a value for all fields!")
        }
    }
    public modalContent = () => (
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {this.state.songImage ? <Image source={{ uri: this.state.songImage.uri }} style={styles.songImageView} onLayout={this.onLayoutImg} />
                : <View style={[styles.songImageView, { backgroundColor: colors.maroon }]} onLayout={this.onLayoutImg}>
                    <Text style={styles.imagePlaceholder}>Add a picture for your song</Text>
                    {/* <Icon name={"camera"} type={"FontAwesome"} style={styles.emptyImageIcon}></Icon> */}
                </View>
            }
            <TouchableOpacity style={[styles.cameraView, { top: this.state.imgPosition.y - 100, left: this.state.imgPosition.x - 30, }]}
                onPress={this.selectImage}
            >
                <Icon name={"edit"} type={"AntDesign"} style={styles.camIcon}></Icon>
            </TouchableOpacity>
            <TextInput style={styles.textFieldStyle} value={this.state.songName} onChangeText={(text) => this.setState({ songName: text })} underlineColorAndroid={colors.maroon}
                placeholder={"Enter song name"}
            />

            <TouchableOpacity onPress={this.selectSongFile}>
                <TextInput value={this.state.songFile ? this.state.songFile.name : undefined}
                    underlineColorAndroid={colors.maroon} placeholder={"Select a song file"} pointerEvents="none" editable={false} />
            </TouchableOpacity>

            {/* <TextInput value={this.state.songCat} onChangeText={(text) => this.setState({ songCat: text })}
                underlineColorAndroid={colors.maroon} placeholder={"Enter song category"} /> */}
            {<Picker
                enabled={true}
                mode={"dialog"}
                selectedValue={this.state.songCat}
                onValueChange={(itemValue) => {
                    if (itemValue.cat_id !== "-1") {

                        this.setState({ songCat: itemValue })
                    }
                }}
                style={{ color: "#A0A0A0", fontSize: 6, fontWeight: "normal" }}
            >
                {this.state.categories ? this.state.categories.map((item: any) => (
                    <Picker.Item value={item.song_category} label={item.song_category} />)) : (null)}

            </Picker>}
            <View style={{ backgroundColor: colors.maroon, height: 1, marginBottom: 2 }} />


            {/* <TouchableOpacity onPress={() => this.setState({showPicker: true})}>
                        <TextInput value={this.state.songStatus===1 ? "active" : "inactive"}
                        underlineColorAndroid={colors.maroon} placeholder={"Select song's status"}
                        pointerEvents="none" editable={false} />
                        </TouchableOpacity> */}
            {<Picker
                enabled={true}
                mode={"dialog"}
                selectedValue={this.state.songStatus}
                onValueChange={(itemValue, itemIndex) => { this.setState({ songStatus: itemValue }) }}
                style={{ color: "#A0A0A0", fontSize: 8, fontWeight: "normal" }}
            >
                <Picker.Item label="active" value={1} />
                <Picker.Item label="inactive" value={0} />

            </Picker>}
            <View style={{ backgroundColor: colors.maroon, height: 1, marginBottom: 2 }} />
            {<Picker
                enabled={true}
                mode={"dialog"}
                selectedValue={this.state.songType}
                onValueChange={(itemValue, itemIndex) => { this.setState({ songType: itemValue }) }}
                style={{ color: "#A0A0A0", fontSize: 8, fontWeight: "normal" }}
            >
                <Picker.Item label="mp3" value={"mp3"} />
                <Picker.Item label="mp4" value={"mp4"} />

            </Picker>}
            <View style={{ backgroundColor: colors.maroon, height: 1, marginBottom: 2 }} />
            {/* <TextInput value={this.state.songFile} onChangeText={(text) => this.setState({ gender: text })} underlineColorAndroid={colors.maroon} /> */}
        </ScrollView>
    )

    public render() {
        return (
            <Container>
                <CommonHeader title={"Stream songs"}
                    leftItem={
                        this.state.playlistType === PlaylistTypes.EXPLORE && <TouchableOpacity style={{ marginTop: 10, paddingRight: 5 }} onPress={() => this.props.navigation.pop()}>
                            <Icon name={"ios-arrow-back"} style={{ fontSize: 16, color: colors.lightMaroon, padding: 10 }}></Icon>
                        </TouchableOpacity>
                    }
                />
                {/* <View style={{flexDirection: "row"}}> */}
                {/* <Image source={{uri: this.state.categoryData.thumbnail}} style={{width: 100, height: 100}}></Image> */}
                <View style={styles.headerView}>
                    <Text style={styles.header}>{this.getHeading()}</Text>
                    {/* <Button style={styles.listenBtn} onPress={() => this.playSong(this.props.selectedPlaylist[0])}>
                        <Icon name={"playcircleo"} type={"AntDesign"} style={{ fontSize: 15, padding: 0, margin: 0 }} />
                        <Text style={styles.listenTxt}>Play All</Text>
                    </Button> */}
                </View>
                {/* </View> */}

                <ScrollView style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                    {this.props.selectedPlaylist ?
                        <FlatList scrollEnabled={true} style={{ paddingHorizontal: 15, paddingBottom: 40 }}
                            data={this.props.selectedPlaylist} renderItem={this.renderSongs}
                            keyExtractor={(item) => item.songid}
                        /> : <Text style={{ alignSelf: "center", marginTop: 100 }}>{this.state.playlistType === PlaylistTypes.PLAYLIST ? "Add some songs to your favorite list!" :
                            "No songs to display, please try again later!"}</Text>
                    }
                </ScrollView>
                {this.state.playlistType === PlaylistTypes.MYSONGS && <TouchableOpacity style={styles.addSong}
                    onPress={() => this.setState({ showModal: true })}
                >
                    <Icon name={"add"} style={styles.addIcon} ></Icon>
                </TouchableOpacity>}
                <MusicPlayer
                    style={this.state.playlistType === PlaylistTypes.EXPLORE ? styles.singleCatStyle : styles.playlistStyle}
                    hide={false}
                    navigation={this.props.navigation}
                />
                <ModalView content={
                    this.modalContent()
                }
                    visible={this.state.showModal}
                    title={"Upload your song"}
                    cancel={() => { this.setState({ showModal: false }) }}
                    done={this.uploadSong}
                />
                {(this.state.playlistType === PlaylistTypes.PLAYLIST || this.state.playlistType === PlaylistTypes.MYSONGS) &&
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
    getFavorites: () => dispatch(FavoriteAction.getFavoriteRequest(true)),
    getSongByCat: (catName) => dispatch(CategoryAction.getSongByCatRequest(catName)),
    makeFavorite: (songId) => dispatch(FavoriteAction.makeFavoriteRequest(songId)),
    getMySong: () => dispatch(MySongAction.getMySongsRequest()),
    uploadSong: (params: ISongUpload) => dispatch(MySongAction.uploadMySongReq(params)),
    showPlaying: (playing) => dispatch(SongsActions.showPlaying(playing)),
    getHeart: () => dispatch(FavoriteAction.getFavoriteRequest(false)),
    // playNext: () => dispatch(SongsActions.setNextSong()),
});
export const mapStateToProps = (state: RootState): StateProps => ({
    shouldPlay: state.songs.isPlaying,
    selectedPlaylist: state.songs.playlist,
    selectedSong: state.songs.song,
    favorites: state.favorites.favoritesData,
    categorySongs: state.category.songByCategory,
    mySongs: state.mySongs.mySongs,
    isPlaying: state.songs.isPlaying,
    userRole: state.login.userData.user_cat,
    category: state.category.categoriesData,
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistScreen);
import { Button, Container, Icon, Row } from "native-base";
import React from "react";
import { Image, Picker, Text, TouchableOpacity, View } from "react-native";
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
import { CategoryAction } from "../../Reducers/CategoryReducers";
import { FavoriteAction, IFavoriteResponse } from "../../Reducers/FavoritesReducer";
import { RootState } from "../../Reducers/index";
import { MySongAction } from "../../Reducers/MySongsReducer";
import { SongsActions } from "../../Reducers/SongsReducer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import styles from "./PlaylistScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";

export interface OwnProps {
    comingFrom: PlaylistTypes;

}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    playMusic: (shouldPlay: boolean) => void;
    selectSong: (song: Songs) => void;
    getFavorites: () => void;
    getSongByCat: (catName: string) => void;
    makeFavorite: (songId: string) => void;
    getMySong: () => void;
    uploadSong: (params: ISongUpload) => void;
}
export interface StateProps {
    shouldPlay: boolean;
    selectedPlaylist: Playlist | undefined;
    selectedSong: Songs | undefined;
    favorites: undefined | Array<IFavoriteResponse>;
    categorySongs: undefined | Array<any>;
    mySongs: undefined | Array<Songs>;
}
export interface State {
    playlistType: PlaylistTypes;
    categoryData: any;
    showModal: boolean;
    songName: string;
    songImage: {uri: string, type: string, name: string};
    songFile: any;
    songCat: string;
    imgPosition: { x: number, y: number };
    songStatus: 0 | 1;
    showPicker: boolean;
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
            songImage: {uri: "", type: "image/jpeg", name: ""},
            songName: "",
            imgPosition: { x: 0, y: 0 },
            songStatus: 1,
            showPicker: false
        }
    }
    public async componentDidMount() {
        switch(this.state.playlistType){
            case PlaylistTypes.EXPLORE : {
                this.props.getSongByCat(this.state.categoryData.song_category)
            }
            break;
            case PlaylistTypes.PLAYLIST : {
                this.props.getFavorites();
                this.props.setBottomTab(BottomBarBtns.PLAYLIST);
            }
            break;
            case PlaylistTypes.MYSONGS: {
                this.props.getMySong();
                this.props.setBottomTab(BottomBarBtns.BLOGS);
            }
        }
        // this.state.playlistType === PlaylistTypes.PLAYLIST ? this.props.getFavorites() : this.props.getSongByCat(this.state.categoryName);
        // this.state.playlistType === PlaylistTypes.PLAYLIST && this.props.setBottomTab(BottomBarBtns.PLAYLIST);
        // await this.props.selectPlaylist(playlists[0]);
        // this.props.selectSong(this.props.selectedPlaylist.songs[0]);
        // this.props.playMusic(false);
    }
    public playSong = (item: any) => {
        this.props.playMusic(true);
        this.props.selectSong(item);
    }
    public renderSongs = ({ item }) => (
        // image songName catName likeCount
        <View style={{ flexDirection: "row", marginTop: 25, }}>
            <Image source={{ uri: item.songimage }} style={styles.songImg}></Image>
            <TouchableOpacity  onPress={() => this.playSong(item)} style={{paddingLeft: 10, width: "50%"}}>
                <Text numberOfLines={2} lineBreakMode={"middle"}style={[styles.heading, {alignSelf: "flex-start"}
                    // { fontWeight: this.props.selectedSong.name === item.name ? "bold" : "normal", color: this.props.selectedSong.name === item.name ? colors.maroon : colors.black }
                ]}>{item.song_name}</Text>
                {this.state.playlistType === PlaylistTypes.PLAYLIST && <Text style={[styles.subHeading, {marginTop: 1}]}>{item.song_category}</Text>}
            </TouchableOpacity>
            <Row></Row>
            <View style={{flexDirection: "row"}}>
            <Text style={[styles.subHeading, {marginLeft: 0}]}>{item.likecount}</Text>
            <TouchableOpacity onPress={() => {this.props.makeFavorite(item.songid)}}>
            <Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon>
            </TouchableOpacity>
            {false && <Icon name={"heart"} type={"AntDesign"} style={styles.heartIcon}></Icon>}
            </View>
            {/* <View style={styles.caretView} /> */}
        </View>
    )
    public getHeading = () => {
        if(this.state.playlistType === PlaylistTypes.EXPLORE){
            return this.state.categoryData.song_category
        } else if(this.state.playlistType === PlaylistTypes.PLAYLIST){
            return "Favorites"
        } else{
            return "My Songs"
        }
    }
    public onLayoutImg = (e) => {
        this.setState({
            imgPosition: { x: e.nativeEvent.layout.width, y: e.nativeEvent.layout.height }
        })
    }
    public selectImage = () => {
        const options={
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
          
              this.setState({songImage: {uri: response.uri, type: response.type, name: response.fileName}});
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
            this.setState({songFile: {uri: res.uri, name: res.name, type: res.type}})
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    }
    public uploadSong = () => {
        this.setState({showModal: false});
        this.props.uploadSong({songName: this.state.songName, songFile: this.state.songFile, songCategory: this.state.songCat,
        songImage: this.state.songImage, status: this.state.songStatus === 0 ? "inactive" : "active",
        })
    }
    public modalContent = () => (
        <View style={styles.modalContent}>
                        {this.state.songImage ? <Image source={{ uri: this.state.songImage.uri}} style={styles.songImageView} onLayout={this.onLayoutImg} />
                        : <View style={[styles.songImageView,{backgroundColor: colors.maroon}]} onLayout={this.onLayoutImg}>
                            <Text style={styles.imagePlaceholder}>Add a picture for your song</Text>
                            {/* <Icon name={"camera"} type={"FontAwesome"} style={styles.emptyImageIcon}></Icon> */}
                        </View>    
                    }
                        <TouchableOpacity style={[styles.cameraView, { top: this.state.imgPosition.y - 100, left: this.state.imgPosition.x - 30, }]}
                        onPress={this.selectImage}
                        >
                            <Icon name={"edit"} type={"AntDesign"} style={styles.camIcon}></Icon>
                        </TouchableOpacity>
                        <TextInput style={styles.textFieldStyle}value={this.state.songName} onChangeText={(text) => this.setState({ songName: text })} underlineColorAndroid={colors.maroon}
                        placeholder={"Enter song name"}
                        />
                        <TextInput value={this.state.songCat} onChangeText={(text) => this.setState({ songCat: text })}
                        underlineColorAndroid={colors.maroon} placeholder={"Enter song category"} />
                        
                        <TouchableOpacity onPress={this.selectSongFile}>
                        <TextInput value={this.state.songFile ? this.state.songFile.name : undefined}
                        underlineColorAndroid={colors.maroon} placeholder={"Select a song file"} pointerEvents="none" editable={false} />
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => this.setState({showPicker: true})}>
                        <TextInput value={this.state.songStatus===1 ? "active" : "inactive"}
                        underlineColorAndroid={colors.maroon} placeholder={"Select song's status"}
                        pointerEvents="none" editable={false} />
                        </TouchableOpacity> */}
                        { <Picker
                            enabled={true}
                            mode={"dialog"}
                            selectedValue={this.state.songStatus}
                            onValueChange={(itemValue, itemIndex) => {this.setState({songStatus: itemValue})}}
                            style={{color: "#A0A0A0", fontSize: 8, fontWeight: "normal"}}
                        >
                            <Picker.Item label="active" value={1}/>
                            <Picker.Item label="inactive" value={0}/>

                        </Picker>}
                        <View style={[styles.caretView, {flex: 0.08, backgroundColor: colors.maroon, height: 0.1}]}></View>
                        {/* <TextInput value={this.state.songFile} onChangeText={(text) => this.setState({ gender: text })} underlineColorAndroid={colors.maroon} /> */}
                    </View>
    )
   
    public render() {
        return (
            <Container>
                <CommonHeader title={"Stream songs"}
                    leftItem={
                  this.state.playlistType === PlaylistTypes.EXPLORE &&  <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                   <Icon name={"ios-arrow-back"} style={{ fontSize: 16, color: colors.snow }}></Icon>
                </TouchableOpacity>
                    }
                />
                {/* <View style={{flexDirection: "row"}}> */}
                {/* <Image source={{uri: this.state.categoryData.thumbnail}} style={{width: 100, height: 100}}></Image> */}
                <View style={styles.headerView}>
                    <Text style={styles.header}>{this.getHeading()}</Text>
                    <Button style={styles.listenBtn} onPress={() => this.playSong(this.props.selectedPlaylist.songs[0])}>
                        <Icon name={"playcircleo"} type={"AntDesign"} style={{ fontSize: 15, padding: 0, margin: 0 }} />
                        <Text style={styles.listenTxt}>Play All</Text>
                    </Button>
                </View>
                {/* </View> */}
               
                <ScrollView style={{ paddingHorizontal: 10, paddingTop: 10, maxHeight: "65%"}}>
                    {this.props.selectedPlaylist &&
                        <FlatList scrollEnabled={true} style={{ paddingHorizontal: 15, paddingBottom: 40}}
                            data={this.props.selectedPlaylist} renderItem={this.renderSongs}
                            keyExtractor={(item) => item.songid}
                            />}
                </ScrollView>
                {this.state.playlistType === PlaylistTypes.MYSONGS && <TouchableOpacity style={styles.addSong}
                    onPress={() => this.setState({showModal: true})}
                >
                    <Icon name={"add"}style={styles.addIcon} ></Icon>
                    </TouchableOpacity>}
                <MusicPlayer
                    style={this.state.playlistType === PlaylistTypes.EXPLORE ? styles.singleCatStyle : styles.playlistStyle}
                    hide={false}
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
    getFavorites: () => dispatch(FavoriteAction.getFavoriteRequest()),
    getSongByCat: (catName) => dispatch(CategoryAction.getSongByCatRequest(catName)),
    makeFavorite: (songId) => dispatch(FavoriteAction.makeFavoriteRequest(songId)),
    getMySong: () => dispatch(MySongAction.getMySongsRequest()),
    uploadSong: (params: ISongUpload) => dispatch(MySongAction.uploadMySongReq(params)),
    // playNext: () => dispatch(SongsActions.setNextSong()),
});
export const mapStateToProps = (state: RootState): StateProps => ({
    shouldPlay: state.songs.isPlaying,
    selectedPlaylist: state.songs.playlist,
    selectedSong: state.songs.song,
    favorites: state.favorites.favoritesData,
    categorySongs: state.category.songByCategory,
    mySongs: state.mySongs.mySongs,
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistScreen);
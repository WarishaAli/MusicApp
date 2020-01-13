import React from "react";
import { NavigationScreenProps, FlatList } from "react-navigation";
import {Container, Content, Button, Icon} from "native-base";
import {Text, View, TouchableOpacity, Image} from "react-native";
import {playlists} from "../../Lib/PlaylistData";
import styles from "./PlaylistScreenStyles";
import BottomBar from "../../Components/BottomBar";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import { connect, Dispatch } from "react-redux";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { SongsActions } from "../../Reducers/SongsReducer";
import {RootState} from "../../Reducers/index"
import { PlaylistTypes, Playlist, Songs } from "../../Lib/PlaylistTypes";

export interface OwnProps{
   comingFrom: PlaylistTypes;

}
export interface DispatchProps{
    setBottomTab: (btnName: BottomBarBtns) => void;
    playMusic: (shouldPlay: boolean) => void;
    selectPlaylist: (playlist: Playlist) => void;
    selectSong: (song: Songs) => void;
}
export interface StateProps{
    shouldPlay: boolean;
    selectedPlaylist: Playlist | undefined;
    selectedSong: Songs | undefined;
}
export interface State{
    playlistType: PlaylistTypes;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps & StateProps;

class PlaylistScreen extends React.Component<Props, State>{
    public constructor(props: Props){
        super(props);
        this.state={
            playlistType: this.props.navigation.getParam("comingFrom"),
        }
    }
    public async componentDidMount () {
        this.state.playlistType === PlaylistTypes.PLAYLIST && this.props.setBottomTab(BottomBarBtns.PLAYLIST);
        await this.state.playlistType === PlaylistTypes.PLAYLIST && this.props.selectPlaylist(playlists[0]);
        this.props.selectSong(this.props.selectedPlaylist.songs[0]);
        this.props.playMusic(false);
    }
    public playSong = (item: any) => {
        this.props.playMusic(true);
        this.props.selectSong(item);
    }
    public selectPlaylist = (list: Playlist) => { 
        this.props.selectPlaylist(list);
    }
    public renderHorizontalItems = ({item}) => (
            <Button transparent={true} onPress={() => this.selectPlaylist(item)} style={[styles.cardItemStyle,{backgroundColor: item.name === this.props.selectedPlaylist.name ? colors.maroon : colors.lightMaroon}]}>
            <Text style={styles.playlistName}>{item.name}</Text>
            </Button>
    );
    public renderSongs= ({item}) => (
        <TouchableOpacity onPress={() => this.playSong(item)} style={{flexDirection: "column", marginTop: 25,}}>
            <View style={styles.textIconView}>
                {this.props.selectedSong && <View>
                    <Text style={[styles.heading, {fontWeight: this.props.selectedSong.name === item.name ? "bold" : "normal" ,color: this.props.selectedSong.name === item.name ? colors.maroon : colors.black}]}>{item.name}</Text>
                    <Text style={[styles.subHeading,{fontWeight: this.props.selectedSong.name === item.name ? "bold" : "normal", color: this.props.selectedSong.name === item.name ? colors.maroon : colors.black}]}>{item.artist}</Text>
                </View>}
                </View>
            <View style={styles.caretView}/>
        </TouchableOpacity>
    )
    public render(){
        return(
            <Container>
                <Content style={{paddingHorizontal: 10, paddingTop: 30}}>
                    {(this.props.selectedPlaylist && this.state.playlistType=== PlaylistTypes.EXPLORE) && 
                     <View style={styles.textImageStyle}>
                        <Image source={{uri: this.props.selectedPlaylist.image}} style={styles.imageStyle}
                        resizeMode={"cover"}
                        >
                        </Image>
                        <View style={styles.headerView}>
                         <Text style={styles.header}>{this.props.selectedPlaylist.name}</Text>
                         <Button style={styles.listenBtn} onPress={() => this.playSong(this.props.selectedPlaylist.songs[0])}>
                             <Icon name={"playcircleo"} type={"AntDesign"} style={{fontSize: 15, padding: 0, margin: 0}}/>
                             <Text style={styles.listenTxt}>Play</Text>
                         </Button>
                         </View>
                      </View>
                    }
                    {(this.state.playlistType === PlaylistTypes.PLAYLIST && this.props.selectedPlaylist)
                    && <FlatList style={{marginTop: 30}} showsHorizontalScrollIndicator={false} horizontal={true} data={playlists} renderItem={this.renderHorizontalItems}/>}
                    { this.props.selectedPlaylist && 
                    <FlatList  scrollEnabled={true} style={{paddingHorizontal: 30}} data={this.props.selectedPlaylist.songs} renderItem={this.renderSongs}/>}
                    </Content>
                <MusicPlayer
                style={this.state.playlistType === PlaylistTypes.EXPLORE ? styles.singleCatStyle : styles.playlistStyle}
                // playNextSong={this.playNext}
                 />
                {this.state.playlistType === PlaylistTypes.PLAYLIST &&
                <BottomBar navigation={this.props.navigation}/>}     
            </Container>
        );
    }
};
export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
    playMusic: (shouldPlay) => dispatch(SongsActions.setIsPlaying(shouldPlay)),
    selectPlaylist: (playlist) => dispatch(SongsActions.setPlaylist(playlist)),
    selectSong: (song) => dispatch(SongsActions.setSong(song)),
    // playNext: () => dispatch(SongsActions.setNextSong()),
});
export const mapStateToProps = (state: RootState): StateProps => ({
    shouldPlay: state.songs.isPlaying,
    selectedPlaylist: state.songs.playlist,
    selectedSong: state.songs.song,
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistScreen);
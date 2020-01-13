import { Container, Header, Icon, Card, CardItem, Content, Button, Item } from "native-base";
import React from "react";
import {Text, TouchableOpacity, FlatList, ImageBackground, View, ScrollView, BackHandler} from "react-native";
import genreData from "../../Lib/GenresData";
import styles from "./HomeScreenStyles";
import colors from "../../Themes/Colors";
import btnsData from "../../Lib/HomeScreenBtns";
import artistsData from "../../Lib/ArtistsData";
import albumsData from "../../Lib/AlbumsData";
import BottomBar from "../../Components/BottomBar";
import {NavigationScreenProps} from "react-navigation";
import { BottomBarBtns } from "../../Types/BottomBar";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import {connect} from "react-redux";
import { TouchableHighlight } from "react-native-gesture-handler";
import { PlaylistTypes, Playlist } from "../../Lib/PlaylistTypes";
import { SongsActions } from "../../Reducers/SongsReducer";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";

export interface State{
    data: any;
}
export interface OwnProps{

}
export interface DispatchProps{
    setBottomTab: (btnName: BottomBarBtns) => void;
    setPlaylist: (list: Playlist) => void;
}
export type Props= OwnProps & NavigationScreenProps & DispatchProps;
class HomeScreen extends React.Component<Props, State> {
    public constructor(props: Props){
        super(props);
        this.state={
            data: genreData,
        }
    }
    public componentDidMount(){
        this.props.setBottomTab(BottomBarBtns.EXPLORE);
    }
    public selectSingleCategory = (data: any) =>{
        this.props.setPlaylist(data);
        this.props.navigation.navigate("Playlist", {comingFrom: PlaylistTypes.EXPLORE})
    };
    public renderTextIcon = (title: string, data: any) => (
        <TouchableOpacity onPress={() => this.props.navigation.push("SelectAllCategory", {params: {title: title, data: data}})}
            style={{flexDirection: "row", marginTop: 10}}>
            <Text style={[styles.subHeading,{marginTop:0}]}>{title}</Text>
            <Icon name={"ios-arrow-forward"} type={"Ionicons"} style={{fontSize: 15, padding: 0, marginLeft: 5, alignSelf: "center", marginTop:2,}}/>
        </TouchableOpacity>
    );
    public renderList = (data: any) => {
        return(
            <FlatList data={data} numColumns={2} renderItem={this.renderRowView} pagingEnabled={true} />
        )
    }
    public renderRowView = ({item}) => {
        return(
           <Card style={styles.cardItemStyle}>
                <ImageBackground style={styles.cardImage} source={{uri: item.image}} resizeMode={"cover"}>
                    <TouchableOpacity onPress={() => {this.selectSingleCategory(item)}}>
                        <Text style={[styles.subHeading, { color: colors.snow, alignSelf: "center", marginBottom: 10, fontSize: 17}]}>{item.name}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </Card>
        )
    }
    public setData = (dataSet: any) => {
        this.setState({data: dataSet});
    }
    public render () {
        return(
            <Container style={{backgroundColor: colors.snow}} >
                <Content style={{paddingHorizontal: 25, paddingTop: 5, maxHeight: "80%"}}>
                        {this.renderTextIcon("Genres", genreData)}
                        {this.renderList(genreData)}
                        {this.renderTextIcon("Artists", artistsData)}
                        {this.renderList(artistsData)}
                        {this.renderTextIcon("Albums", albumsData)}
                        {this.renderList(albumsData)}
                </Content>
                <MusicPlayer style={styles.musicPlayer}/>
                <BottomBar navigation={this.props.navigation}/>
            </Container>
        )
    }
}
export const mapDispatchToProps = (dispatch: Dispatch):DispatchProps => ({
    setBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
    setPlaylist: (list) => dispatch(SongsActions.setPlaylist(list)),
})
export default connect(null, mapDispatchToProps)(HomeScreen);
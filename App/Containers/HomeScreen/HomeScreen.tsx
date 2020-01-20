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
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { CategoryAction, ICategoryResponse } from "../../Reducers/CategoryReducers";
import { RootState } from "../../Reducers";

export interface State{
    data: any;
}
export interface OwnProps{

}
export interface DispatchProps{
    setBottomTab: (btnName: BottomBarBtns) => void;
    setPlaylist: (list: Playlist) => void;
    getCategories: () => void;
}

export interface StateProps{
    category: ICategoryResponse | undefined;
    loginToken: any;
}
export type Props= OwnProps & NavigationScreenProps & DispatchProps & StateProps;
class HomeScreen extends React.Component<Props, State> {
    public constructor(props: Props){
        super(props);
        this.state={
            data: genreData,
        }
    }
    public componentDidMount(){
        this.props.setBottomTab(BottomBarBtns.EXPLORE);
        this.props.getCategories();
    }
    public selectSingleCategory = (data: any) =>{
        // this.props.setPlaylist(data);
        this.props.navigation.navigate("Playlist", {comingFrom: PlaylistTypes.EXPLORE, category: data.song_category})
    };
    public renderTextIcon = (title: string) => (
        // <TouchableOpacity 
            // onPress={() => this.props.navigation.push("SelectAllCategory", {params: {title: title, data: data}})}
            // style={{flexDirection: "row", marginTop: 10}}>
            <Text style={[styles.subHeading,{marginLeft: 20}]}>{title}</Text>
            // {/* <Icon name={"ios-arrow-forward"} type={"Ionicons"} style={{fontSize: 15, padding: 0, marginLeft: 5, alignSelf: "center", marginTop:2,}}/> */}
        // </TouchableOpacity>
    );
    public renderList = (data: any) => {
        return data ? (
            <FlatList data={data} numColumns={2} renderItem={this.renderRowView} style={styles.listStyle} />
        ): (<Text style={styles.noDataText}>
            Currently there are no categories to display!
        </Text>)
    }
    public renderRowView = ({item}) => {
        return(
           <Card style={styles.cardItemStyle}>
                {/* <ImageBackground style={styles.cardImage} source={{uri: "https://pbs.twimg.com/profile_images/721563055054659584/4fR7eFfy.jpg"}} resizeMode={"cover"}> */}
                    <TouchableOpacity onPress={() => {this.selectSingleCategory(item)}}>
                        <Text style={[styles.subHeading, { color: colors.black, alignSelf: "center", fontSize: 17}]}>{item.song_category}</Text>
                    </TouchableOpacity>
                {/* </ImageBackground> */}
            </Card>
        )
    }
    public setData = (dataSet: any) => {
        this.setState({data: dataSet});
    }
    public render () {
        return(
            <Container style={{backgroundColor: colors.snow}} >
                <CommonHeader title={"Hiphop Streets"} />
                {this.renderTextIcon("Explore Categories")}
                <ScrollView style={{ paddingHorizontal: 10, maxHeight: "60%"}}>
                        {this.renderList(this.props.category)}
                        {/* {this.renderTextIcon("Artists", artistsData)}
                        {this.renderList(artistsData)}
                        {this.renderTextIcon("Albums", albumsData)}
                        {this.renderList(albumsData)} */}
                </ScrollView>
                <MusicPlayer style={styles.musicPlayer}/>
                <BottomBar navigation={this.props.navigation}/>
            </Container>
        )
    }
}
export const mapDispatchToProps = (dispatch: Dispatch):DispatchProps => ({
    setBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
    setPlaylist: (list) => dispatch(SongsActions.setPlaylist(list)),
    getCategories: () => dispatch(CategoryAction.getCategoryRequest())
})

export const mapStateToProps = (state: RootState):StateProps => ({
    category: state.category.categoriesData,
    loginToken: state.login.userData,
})
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
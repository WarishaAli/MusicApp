import { Card, Container, Icon } from "native-base";
import React from "react";
import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity } from "react-native";
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

export interface State {
    croppedFeaturedSongs: any;
}
export interface OwnProps {

}
export interface DispatchProps {
    setBottomTab: (btnName: BottomBarBtns) => void;
    setPlaylist: (list: Playlist) => void;
    getCategories: () => void;
    getHomeData: () => void;
}

export interface StateProps {
    category: ICategoryResponse | undefined;
    loginToken: any;
    featuredSongs: any;
    featuredVideos: any;
    featuredPodcasts: any;
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
            style={{ flexDirection: "row"}}>
            <Text style={[styles.subHeading]}>{title}</Text>
            <Icon name={"ios-arrow-forward"} type={"Ionicons"} style={{ fontSize: 18, padding: 0, marginLeft: 7, alignSelf: "center", marginTop: 2, color: colors.charcoal}} />
        </TouchableOpacity>
    );
    public renderGenreList = (data: any, noDataText: string) => {
        return data ? (
            <FlatList data={data.length > 15 ? data.slice(0,10) : data} renderItem={noDataText === "categories" ? this.renderGenreView: this.renderFeauteredSongs} style={styles.listStyle} horizontal={true}
            showsHorizontalScrollIndicator={false} 
            // keyExtractor={(item) => noDataText === "categories" ? item.cat_id : item.songid}
            />
        ) : (<Text style={styles.noDataText}>
            Currently there are no {noDataText} to display!
        </Text>)
    } 

    public renderFeauteredSongs = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push("MusicPlayScreen", {songData: item})}>
                <Card style={styles.songsCard}>
                    <ImageBackground style={styles.cardImage} source={{uri: item.songimage}} imageStyle={{borderRadius: 5}}></ImageBackground>
                </Card>
                <Text style={styles.songName}>{item.song_name}</Text>
                <Text style={{fontSize: 12}}>{item.song_category}</Text>
            </TouchableOpacity>
        )
    }
    public renderGenreView = ({ item }) => {
        return (
            <TouchableOpacity 
            onPress={() => { this.selectSingleCategory(item) }}>
                <Card style={styles.songsCard}>
                <ImageBackground style={styles.cardImage} source={{uri: item.thumbnail}} resizeMode={"cover"} imageStyle={{borderRadius: 5}}>
                    {/* <TouchableOpacity onPress={() => { this.selectSingleCategory(item) }}> */}
                        {/* <Text style={[styles.subHeading, { color: colors.snow, alignSelf: "center", fontSize: 16, zIndex: 4, marginTop: 20 }]}>{item.song_category}</Text> */}
                    {/* </TouchableOpacity> */}
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
                <ScrollView style={{ maxHeight: "70%", marginLeft: 15 }}>
                    {this.renderTextIcon("Music by genre", this.props.category)}
                    {this.renderGenreList(this.props.category, "categories")}
                    {this.renderTextIcon("Featured songs", this.props.featuredSongs)}
                    {this.renderGenreList(this.props.featuredSongs, "featured songs")}
                    {this.renderTextIcon("Featured videos", this.props.featuredVideos)}
                    {this.renderGenreList(this.props.featuredVideos, "featured videos")}
                    {this.renderTextIcon("Featured podcasts", this.props.featuredPodcasts)}
                    {this.renderGenreList(this.props.featuredPodcasts, "featured podcasts")}
                </ScrollView>


                <MusicPlayer style={styles.musicPlayer} />
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
})

export const mapStateToProps = (state: RootState): StateProps => ({
    category: state.category.categoriesData,
    loginToken: state.login.userData,
    featuredSongs: state.category.homeData ? state.category.homeData.featuredSongs : undefined,
    featuredVideos: state.category.homeData ? state.category.homeData.featuredVideos : undefined,
    featuredPodcasts: state.category.homeData ? state.category.homeData.podcastShows : undefined,
})
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
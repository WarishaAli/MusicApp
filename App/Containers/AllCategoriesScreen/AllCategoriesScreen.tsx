import { NavigationScreenProps, FlatList } from "react-navigation";
import React from "react";
import {Container, Card, Content, Icon} from "native-base";
import {Text, TouchableOpacity, ImageBackground} from "react-native";
import styles from "./AllCategoriesScreenStyles";
import { PlaylistTypes, Playlist } from "../../Lib/PlaylistTypes";
import colors from "../../Themes/Colors";
import { SongsActions } from "../../Reducers/SongsReducer";
import { connect } from "react-redux";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { Images } from "../../Themes";

export interface OwnProps{

}
export interface DispatchProps{
    setPlaylist: (list: Playlist) => void;
}
export type Props = OwnProps & NavigationScreenProps & DispatchProps;

class AllCategoriesScreen extends React.Component<Props>{
    public categoryData: any;
    constructor(props: Props){
        super(props);
        this.categoryData = this.props.navigation.getParam("params");
    }
    public selectSingleCategory = (data: any) =>{
        this.props.setPlaylist(data);
        this.props.navigation.navigate("PlaylistScreen", {comingFrom: PlaylistTypes.EXPLORE})
    };
    public renderTiles = ({item}) => {
        return(
            <Card style={styles.cardItemStyle}>
                 <ImageBackground style={styles.cardImage} source={Images.categoryBackground} resizeMode={"cover"}>
                     <TouchableOpacity onPress={() => {this.selectSingleCategory(item)}}>
                         <Text style={[styles.subHeading, { color: colors.snow, alignSelf: "center", marginBottom: 10, fontSize: 17}]}>{item.song_category}</Text>
                     </TouchableOpacity>
                 </ImageBackground>
             </Card>
         )
    };
    public render(){
        return(
            <Container>
                 <CommonHeader title={"Explore " + this.categoryData.title}
                 leftItem={
                 <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                     <Icon name={"ios-arrow-back"} style={{color: colors.snow, fontSize: 15}}  />
                 </TouchableOpacity>
                 }
                 />
                <Content style={{paddingHorizontal: 20,}}>
                    {/* <Text style={styles.headerTitle}>{this.categoryData.title}</Text> */}
                    <FlatList renderItem={this.renderTiles} data={this.categoryData.data} style={{marginBottom: 100}}/>
                </Content>
            </Container>
        );
    }
}
export const mapDispatchToProps = (dispatch: Dispatch):DispatchProps => ({
    setPlaylist: (list) => dispatch(SongsActions.setPlaylist(list)),
})

export default connect(null, mapDispatchToProps)(AllCategoriesScreen);
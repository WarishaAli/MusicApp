import React from "react";
import {Text, FlatList, TouchableOpacity, ImageBackground, View} from "react-native";
import { Container } from "native-base";
import { Blogs } from "../../Lib/BlogData";
import {Card} from "native-base";
import styles from "../AllCategoriesScreen/AllCategoriesScreenStyles";
import colors from "../../Themes/Colors";
import BottomBar from "../../Components/BottomBar";
import { NavigationScreenProps } from "react-navigation";
import { BottomBarBtns } from "../../Types/BottomBar";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { connect } from "react-redux";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";

export interface DispatchProps{
    selectBottomTab: (tab: BottomBarBtns) => void;
}

export type Props = NavigationScreenProps & DispatchProps;

class BlogScreen extends React.Component<Props>{
    public componentDidMount(){
        this.props.selectBottomTab(BottomBarBtns.BLOGS);
    }
    public renderItems = ({item}) => {
     return(
         <View>
        <Text style={{fontSize: 18, fontWeight: "normal", paddingLeft: 5}}>{item.name}</Text>
             <Card style={styles.cardItemStyle}>
        <ImageBackground style={styles.cardImage} source={{uri: item.image}} resizeMode={"cover"}>
            <TouchableOpacity onPress={() => null}>
                <Text style={[styles.subHeading, { color: colors.snow, alignSelf: "center", marginBottom: 10, fontSize: 17}]}>{item.name}</Text>
            </TouchableOpacity>
        </ImageBackground>
    </Card>
         </View>
     )       
    }
    public render(){
        return(
            <Container>
                <CommonHeader title={"Read Blogs"}/>
                <FlatList style={{padding: 20}}data={Blogs} renderItem={this.renderItems}/>
                <BottomBar navigation={this.props.navigation}/>
            </Container>
        )
    }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    selectBottomTab: (tab) => dispatch(BottomBarActions.setSelectedTab(tab))
})

export default connect(null, mapDispatchToProps) (BlogScreen);
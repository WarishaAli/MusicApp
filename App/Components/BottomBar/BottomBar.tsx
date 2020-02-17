import React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {View, Text, FlatList} from "react-native";
import {Icon, Button} from "native-base";
import styles from "./BottomBarStyles";
import colors from "../../Themes/Colors";
import { NavigationScreenProps } from "react-navigation";
import {BottomBarBtns} from "../../Types/BottomBar";
import { RotationGestureHandlerEventExtra } from "react-native-gesture-handler";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import {RootState} from "../../Reducers/index";
import { PlaylistTypes } from "../../Lib/PlaylistTypes";
import { UserRole } from "../../Containers/SignupScreen/SignupScreen";

export interface OwnProps{

}
export interface DispatchProps{
    selectTab: (selectedTab: BottomBarBtns) => void;
}
export interface StateProps{
    selectedTab: BottomBarBtns;
    userRole: UserRole;
}
// export interface State{
//     selected: BottomBarBtns,
// }
export type Props = NavigationScreenProps & OwnProps& DispatchProps & StateProps;

class BottomBar extends React.Component<Props, State>{
    public constructor(props: Props){
      super(props); 
    }

    // public setSelected = (selectedTab: BottomBarBtns) => {
    //     this.setState({selected: selectedTab})
    // }

    public selectBottomTab = (selectedTab: BottomBarBtns) => {
        // this.props.selectTab(selectedTab);
        switch(selectedTab) {
            case BottomBarBtns.EXPLORE:
                // this.props.navigation.pop();
                this.props.navigation.push("HomeScreen");
                break;
            case BottomBarBtns.PLAYLIST:
                this.props.navigation.push("PlaylistScreen", {comingFrom: PlaylistTypes.PLAYLIST});
                break;
            case BottomBarBtns.BLOGS: 
                this.props.navigation.push("PlaylistScreen", {comingFrom: PlaylistTypes.MYSONGS});
                break;
            case BottomBarBtns.SETTINGS:
                this.props.navigation.push("SettingScreen");
                break;
        }
    }
    public render(){
    console.log(this.props.navigation);
    return(
        <View style={styles.mainView}>
            
            {/* Playlist */} 
            {this.props.userRole === UserRole.NORMAL && <Button onPress={() => this.selectBottomTab(BottomBarBtns.PLAYLIST)} transparent={true}
            style={[styles.iconHolder, {backgroundColor: this.props.selectedTab === BottomBarBtns.PLAYLIST ? colors.lightMaroon : colors.maroon}]}>
            <Icon style={styles.iconStyle} name={"favorite-border"} type={"MaterialIcons"}/>
            <Text style={styles.textStyle}>favorites</Text>
        </Button>}
            {/* Blogs */}
            {this.props.userRole === UserRole.ARTIST && <Button onPress={() => this.selectBottomTab(BottomBarBtns.BLOGS)} transparent={true}
            style={[styles.iconHolder, {backgroundColor: this.props.selectedTab === BottomBarBtns.BLOGS ? colors.lightMaroon : colors.maroon}]}>
            <Icon style={styles.iconStyle} name={"playlist"} type={"SimpleLineIcons"}/>
            <Text style={styles.textStyle}>my songs</Text>
        </Button>}
            {/* Settings */}

            {/* Explore */}
            <Button onPress={() => this.selectBottomTab(BottomBarBtns.EXPLORE)} transparent={true}
            style={[styles.iconHolder, {backgroundColor: this.props.selectedTab === BottomBarBtns.EXPLORE ? colors.lightMaroon : colors.maroon}]}>
             <Icon style={[styles.iconStyle, {fontSize: 24}]} name={"compass"} type={"Feather"}/>
            <Text style={styles.textStyle}>explore</Text>
            </Button>

            <Button 
            // onPress={() => this.selectBottomTab(BottomBarBtns.SETTINGS)}
            transparent={true}
            style={[styles.iconHolder, {backgroundColor: this.props.selectedTab === BottomBarBtns.SETTINGS ? colors.lightMaroon : colors.maroon}]}>
            <Icon style={styles.iconStyle} name={"readme"} type={"FontAwesome5"}/>
             <Text style={styles.textStyle}>blogs</Text>
        </Button>
            
            <Button onPress={() => this.selectBottomTab(BottomBarBtns.SETTINGS)} transparent={true}
            style={[styles.iconHolder, {backgroundColor: this.props.selectedTab === BottomBarBtns.SETTINGS ? colors.lightMaroon : colors.maroon}]}>
            <Icon style={styles.iconStyle} name={"settings"} type={"SimpleLineIcons"}/>
             <Text style={styles.textStyle}>settings</Text>
        </Button>
        </View>
    );
    }
}
const mapDispatchToProps= (dispatch: Dispatch): DispatchProps => ({
    selectTab: (selectedTab) => dispatch(BottomBarActions.setSelectedTab(selectedTab))
});

const mapStateToProps = (state: RootState) : StateProps => ({
    selectedTab: state.bottomBar.selectedTab,
    userRole: state.login.userData?.user_cat,
})
export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
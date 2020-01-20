import React from "react";
import { Container, Icon, Col, CardItem, ListItem} from "native-base";
import { connect } from "react-redux";
import {View, TouchableOpacity, Text, BackHandler} from "react-native";
import styles from "./SettingsScreenStyles";
import BottomBar from "../../Components/BottomBar";
import { NavigationScreenProps } from "react-navigation";
import { BottomBarBtns } from "../../Types/BottomBar";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import colors from "../../Themes/Colors";

export interface DispatchProps{
    selectBottomTab: (selectedTab: BottomBarBtns) => void;
}

export type Props = NavigationScreenProps & DispatchProps;

class SettingScreen extends React.Component<Props>{
    // public onBackPress: any = null;
    public handleBack = () => {
        this.props.navigation.navigate("HomeScreen");
    }
    public componentDidMount(){
        this.props.selectBottomTab(BottomBarBtns.SETTINGS);
        // this.onBackPress = BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    }
    public componentWillUnmount(){
        // this.onBackPress && BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    }
    public renderItem = (initials?:boolean, title: string, onPress: () => void, icon?: string) => {
        return(
            <>
            <ListItem>
            <TouchableOpacity onPress={onPress} style={styles.listView}>
                {/* <View style={{width: 30}}> */}
                {initials && <View style={styles.roundView}><Text style={styles.initials}>WA</Text></View>}
                {icon && <Icon name={icon} type={"AntDesign"} style={{fontSize: 20, color: colors.maroon}}/>}
                {/* </View> */}
                <View><Text style={styles.text}>{title}</Text></View>
            </TouchableOpacity>
            </ListItem>
          
             </>
        )
    }
    public render() {
        return(
            <Container>
                <View style={{paddingTop: 5, paddingHorizontal: 18}}>
                        {this.renderItem(true, "View Profile", this.openProfile)}
                        {this.renderItem(false, "About Us", this.openAboutUs, "infocirlceo")}
                        {this.renderItem(false, "Privacy Policy", this.openPrivacy, "lock")}
                        {this.renderItem(false, "Logout", this.logout, "logout")}
                </View>
                <BottomBar navigation={this.props.navigation}/>
            </Container>
        )
    }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    selectBottomTab: (tab) => dispatch(BottomBarActions.setSelectedTab(tab))
})

export default connect(null, mapDispatchToProps)(SettingScreen);
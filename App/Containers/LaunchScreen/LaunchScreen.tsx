import React, { Component } from "react";
import { Image, ScrollView, Text, View, ImageBackground } from "react-native";
import {Container, Icon} from "native-base";

import { Images } from "../../Themes";

// Styles
import styles from "./LaunchScreenStyles";
import colors from "../../Themes/Colors";
import LargeButton from "../../Components/LargeButton";
import LargeTransparentButton from "../../Components/LargeTransparentButton";
import AppLogo from "../../Components/AppLogo/AppLogo";
import { NavigationScreenProps } from "react-navigation";

export default class LaunchScreen extends Component<NavigationScreenProps> {
  public openSignup = () => {
    this.props.navigation.navigate("SignUpScreen");
  }
  public openLogin = () => {
    this.props.navigation.navigate("EmailLogin");
  }
  public render() {
    return (
     <Container style={styles.mainContainer}>
       <ImageBackground style={{flex: 1}}source={Images.backgroundImg}>
       {/* <AppLogo style={{marginTop: 200}} appNameStyle={{color: colors.snow}} appSloganStyle={{color: colors.lightPink}} iconStyle={{color: colors.snow}}/> */}
       <View style={{width: "100%", position: "absolute", bottom: 20}}>
       <Text style={styles.accountText}>Don't have an account? <Text onPress={this.openSignup} style={{color: colors.maroon}}>Sign up</Text></Text>
       <LargeButton style={{marginTop: 10,  marginHorizontal: 20}} text={"LOGIN WITH FACEBOOK"} iconName={"sc-facebook"} iconType={"EvilIcons"}></LargeButton>
       <LargeTransparentButton onPress={this.openLogin} style={{marginTop: 10}}text={"LOGIN WITH EMAIL"} iconName={"email"} iconType={"MaterialCommunityIcons"}/>
       </View>
       </ImageBackground>
     </Container>
    );
  }
}

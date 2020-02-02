import React, { Component } from "react";
import { Image, ScrollView, Text, View, ImageBackground } from "react-native";
import {Container, Content} from "native-base";
import { LoginButton, AccessToken, GraphRequest,GraphRequestManager } from 'react-native-fbsdk';

import { Images } from "../../Themes";

// Styles
import styles from "./LaunchScreenStyles";
import colors from "../../Themes/Colors";
import LargeButton from "../../Components/LargeButton";
import LargeTransparentButton from "../../Components/LargeTransparentButton";
import AppLogo from "../../Components/AppLogo/AppLogo";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { LoginActions } from "../../Reducers/LoginReducers";
import { IUserData } from "../../Lib/Interfaces";
import { ProfileAction } from "../../Reducers/ProfileReducers";

export interface DispatchProps{
  fbLogin: (email: undefined, pwd: undefined, socialType: "facebook", socialId: string) => void;
  setProfileData: (params: IUserData) => void;
  logout: () => void;
}

export type Props = DispatchProps & NavigationScreenProps;

 class LaunchScreen extends Component<Props> {
  public openSignup = () => {
    this.props.navigation.navigate("SignUpScreen");
  }
  public openLogin = () => {
    this.props.navigation.navigate("EmailLogin");
  }
  public fbLogin = (error: any, result: any) => {
    if (error) {
      console.log("login has error: " + error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      console.log("at else")
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          let req = new GraphRequest('/me', {
            httpMethod: 'GET',
            version: 'v2.5',
            parameters: {
                'fields': {
                    'string' : 'email,name,friends, picture,'
                }
            }
        }, (err, res) => {
            console.log("graph request result", err, res);
            if(!err){
              this.props.fbLogin(undefined, undefined, "facebook", data.accessToken.toString());
              this.props.setProfileData({name: res.name, image: res.picture.data.url})
            }
        });
        new GraphRequestManager().addRequest(req).start();
        }
      )
    }
  }
  public render() {
    return (
     <Container style={styles.mainContainer}>
       {/* <Content> */}
       <ImageBackground style={{flex: 1}}source={Images.backgroundImg}>
       {/* <AppLogo style={{marginTop: 200}} appNameStyle={{color: colors.snow}} appSloganStyle={{color: colors.lightPink}} iconStyle={{color: colors.snow}}/> */}
       <ScrollView style={{width: "100%", position: "absolute", bottom: 20}}>
       <Text style={styles.accountText}>Don't have an account? <Text onPress={this.openSignup} style={{color: colors.maroon}}>Sign up</Text></Text>
       {/* <View style={{flexDirection: "row",  paddingHorizontal: 5, paddingVertical: 10, justifyContent: "space-between"}}> */}
       <View style={{alignSelf: "center", flex: 1, paddingVertical: 10}}>
       <LoginButton
          onLoginFinished={
            (error, result) => {
             this.fbLogin(error, result)
            }
          }
          onLogoutFinished={this.props.logout}/>
       </View>
       {/* <View style={{flex: 0.4, alignSelf: "flex-end"}}>
       <LargeButton text={"login with google"} style={{ height: 30}}></LargeButton></View> */}
       {/* </View> */}
    
      
       {/* <LargeButton style={{marginTop: 10,  marginHorizontal: 20}} text={"LOGIN WITH FACEBOOK"} iconName={"sc-facebook"} iconType={"EvilIcons"}></LargeButton> */}
       <LargeTransparentButton onPress={this.openLogin} style={{marginTop: 10}}text={"LOGIN WITH EMAIL"} iconName={"email"} iconType={"MaterialCommunityIcons"}/>
       </ScrollView>
       </ImageBackground>
       {/* </Content> */}
     </Container>
    );
  }
}
const mapDispatchToProps = (dispatch):DispatchProps => ({
  fbLogin: (email, pwd, socialType, socialId) => dispatch(LoginActions.loginRequest(email, pwd, socialType, socialId)),
  setProfileData: (params: IUserData) => dispatch(ProfileAction.getProfileSuccess(params)),
  logout: () => dispatch(LoginActions.socialLogout()),
})
export default connect(null, mapDispatchToProps) (LaunchScreen);

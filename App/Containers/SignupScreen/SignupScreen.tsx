import React from "react";
import { Container } from "native-base";
import styles from "./SignupScreenStyles";
import InputText from "../../Components/InputText/InputText";
import AppLogo from "../../Components/AppLogo/AppLogo";
import colors from "../../Themes/Colors";
import LargeButton from "../../Components/LargeButton";
import {Text} from "react-native";
import { NavigationScreenProps } from "react-navigation";

class SignupScreen extends React.Component<NavigationScreenProps> {
    public openLogin = () => {
        this.props.navigation.navigate("EmailLogin");
      }
    public render () {
        return(
            <Container style={styles.mainContainer}>
                <AppLogo iconStyle={{color: colors.lightPink}} appNameStyle={{color: colors.coal}} appSloganStyle={{color: colors.lightPink}}/>
                <InputText placeHolder={"Full Name"}/>
                <InputText style={{marginTop: 20}} placeHolder={"Email"}/>
                <InputText style={{marginTop: 20}} placeHolder={"Password"}/>
                <InputText style={{marginTop: 20}} placeHolder={"Confirm Password"}/>
                <LargeButton style={{marginTop: 20}} text={"SIGNUP"}/>
                <Text style={styles.accountText}>Already have an account? <Text onPress={this.openLogin} style={{color: colors.maroon}}>Login</Text></Text>
       
            </Container>
        )
    }
}

export default SignupScreen;
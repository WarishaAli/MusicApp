import React from "react";
import { Container } from "native-base";
import styles from "./EmailLoginStyles";
import InputText from "../../Components/InputText/InputText";
import AppLogo from "../../Components/AppLogo/AppLogo";
import colors from "../../Themes/Colors";
import LargeButton from "../../Components/LargeButton";
import {Text} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { IUserRequest } from "../../Lib/Interfaces";
import { LoginActions } from "../../Reducers/LoginReducers";
import { connect } from "react-redux";
import {Content} from "native-base";

export interface DispatchProps{
    login: (email: string, pwd: string, socialType: string) => void;
}
export interface State{
    email: string;
    password: string;
}

export type Props = DispatchProps & NavigationScreenProps;

class EmailLogin extends React.Component<Props, State> {
    public constructor(props: Props){
        super(props);
        this.state={
            email: "",
            password: "",
        }
    }
    public openSignup = () => {
        this.props.navigation.navigate("SignUpScreen");
      }
      public login = () => {

        //   console.log(this.state.email, this.state.password);
          this.props.login(this.state.email, this.state.password, "normal");
        //   this.props.navigation.navigate("HomeScreen");
      }
      public setEmail = (text: string) => {
            this.setState({email: text});
      }
      public setPassword = (text: string) => {
        this.setState({password: text});
      }
    public render () {
        return(
            <Container style={styles.mainContainer}>
                <Content>
                <AppLogo iconStyle={{color: colors.maroon}} appNameStyle={{color: colors.coal}} appSloganStyle={{color: colors.maroon}}/>
                <InputText placeHolder={"Email"} onChangeText={this.setEmail} value={this.state.email}/>
                <InputText style={{marginTop: 20}} placeHolder={"Password"} onChangeText = {this.setPassword} value={this.state.password} secureTextEntry={true}/>
                <LargeButton  onPress={this.login} style={{marginTop: 20}} text={"LOGIN"}
                disabled={this.state.email.length === 0 || this.state.password.length === 0}
                />
                {/* <Text style={styles.forgotPwdText}>Forgot Password?</Text> */}
                <Text style={styles.forgotPwdText}>OR</Text>
                <LargeButton style={{marginTop: 10}} text={"LOGIN WITH FACEBOOK"} iconName={"sc-facebook"} iconType={"EvilIcons"}
                ></LargeButton>
                <Text style={styles.accountText}>Don't have an account? <Text onPress={this.openSignup} style={{color: colors.maroon}}>Sign up</Text></Text>
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch):DispatchProps => ({
    login: (email, pwd, socialType) => dispatch(LoginActions.loginRequest(email, pwd, socialType))
})

export default connect(null, mapDispatchToProps) (EmailLogin);
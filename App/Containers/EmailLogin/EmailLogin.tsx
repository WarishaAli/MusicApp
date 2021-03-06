import { Container } from "native-base";
import React from "react";
import { Text, Alert, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import AppLogo from "../../Components/AppLogo/AppLogo";
import InputText from "../../Components/InputText/InputText";
import LargeButton from "../../Components/LargeButton";
import { LoginActions } from "../../Reducers/LoginReducers";
import colors from "../../Themes/Colors";
import styles from "./EmailLoginStyles";
import {validateEmail, validatePassword} from "../../Lib/ValidationHelper";
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { IUserData } from "../../Lib/Interfaces";

export interface DispatchProps {
    login: (email: string, pwd: string, socialType: string) => void;
    fbLogin: (email: undefined, pwd: undefined, socialType: "facebook", socialId: string, userData: IUserData) => void;
    logout: () => void;
 
}
export interface State {
    email: string;
    password: string;
    showModal: boolean;
    emailError: boolean;
    passwordError: boolean;
    emailErrorText: string;
    pwdErrorText: string;
    // userRole: UserRole;
}

export type Props = DispatchProps & NavigationScreenProps;

class EmailLogin extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showModal: false,
            emailError: false,
            passwordError: false,
            emailErrorText: "",
            pwdErrorText: "",
            // userRole: UserRole.NORMAL,
        }
    }
    public openSignup = () => {
        this.props.navigation.navigate("SignUpScreen");
    }
    // public noUserRole = () => {
    //     Alert.alert("Input", "Please provide your user role", [
    //         {
    //             text: "Artist User",
    //             onPress: () => this.setState({userRole: UserRole.ARTIST})
    //         },
    //         {
    //             text: "Normal User",
    //             onPress: () => this.setState({userRole: UserRole.NORMAL})
    //         }
    //     ]);
    //     return this.state.userRole;
    // }
    public login = () => {

        //   console.log(this.state.email, this.state.password);
        this.props.login(this.state.email, this.state.password, "normal");
        //   this.props.navigation.navigate("HomeScreen");
    }
    public setEmail = (text: string) => {
        this.setState({ email: text });
        validateEmail(text) ? this.setState({emailError: false}) : 
        this.setState({emailError: true, emailErrorText: "Please enter a valid email address"})
    }
    public setPassword = (text: string) => {
        this.setState({ password: text });
    }
   
    public disableBtn = () => {
        return !validateEmail(this.state.email) || this.state.password.length === 0
    }
    public forgotPwd = () => {
        this.props.navigation.push("ForgotPasswordScreen");
    }
    public render() {
        return (
            <Container style={styles.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>  
                    <AppLogo iconStyle={{ color: colors.maroon }}  appSloganStyle={{ color: colors.maroon }} />
                    <InputText error={this.state.emailError} placeHolder={"Email"} onChangeText={this.setEmail} value={this.state.email}
                    errorText={this.state.emailErrorText}
                    />
                    <InputText style={{ marginTop: 20 }} 
                    placeHolder={"Password"} onChangeText={this.setPassword}
                    value={this.state.password} 
                    isPwd={this.state.password.length > 0}
                    error={this.state.passwordError} errorText={this.state.pwdErrorText}
                    />
                    <LargeButton onPress={this.login} style={{ marginTop: 20 }} text={"LOGIN"}
                        disabled={this.disableBtn()}
                    />
                    <Text style={styles.forgotPwdText} onPress={this.forgotPwd}>Forgot Password?</Text>
                    <Text style={styles.forgotPwdText}>OR</Text>
                    <View style={{alignSelf: "center", flex: 1, paddingVertical: 10, marginTop: 10}}>
       <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + error);
                Alert.alert("Error", "Unfortunately an error occurred during your login, please try again later")
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                console.log("at else")
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    let userDataFb = {userName: "", biography: "", gender: "", image: "", emailId: ""};
                    let req = new GraphRequest('/me', {
                      accessToken: data.accessToken.toString(),
                      parameters: {
                        fields: {
                          string: 'email,name,first_name,last_name,picture'
                        }
                      }
                    }, (err, res) => {
                      console.log("graph request result", err, res);
                      if(err === undefined || err === null){
                        // this.props.fbLogin(undefined, undefined, "facebook", data.accessToken.toString());
                        userDataFb = {
                          userName: res.name,
                          image: {uri: res.picture.data.url, type: "image/png", name: "fbimage.png"}, 
                          gender: "", biography: "-", emailId: "-" };
                        this.props.fbLogin(undefined, undefined, "facebook", data.accessToken.toString(), userDataFb );
                      }
                  });
                  new GraphRequestManager().addRequest(req).start();
                  
                  }
                )
              }
            }
          }
          onLogoutFinished={this.props.logout}/>
       </View>
      
                    <Text style={styles.accountText}>Don't have an account? <Text onPress={this.openSignup} style={{ color: colors.maroon }}>Sign up</Text></Text>
                </ScrollView>
                {/* <ModalView
                    visible={this.state.showModal}
                    title={"Select a user role"}
                    content={this.modalContent()}
                    cancel={() => null}
                    done={() => this.setState({ showModal: false })}
                /> */}
            </Container>
        ) 
    }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
    login: (email, pwd, socialType) => dispatch(LoginActions.loginRequest(email, pwd, socialType)),
    fbLogin: (email, pwd, socialType, socialId, userData) => dispatch(LoginActions.loginRequest(email, pwd, socialType, socialId, userData)),
    logout: () => dispatch(LoginActions.socialLogout()),
})

export default connect(null, mapDispatchToProps)(EmailLogin);
import { Container } from "native-base";
import React from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import AppLogo from "../../Components/AppLogo/AppLogo";
import InputText from "../../Components/InputText/InputText";
import LargeButton from "../../Components/LargeButton";
import { LoginActions } from "../../Reducers/LoginReducers";
import colors from "../../Themes/Colors";
import styles from "./EmailLoginStyles";

export interface DispatchProps {
    login: (email: string, pwd: string, socialType: string) => void;
}
export interface State {
    email: string;
    password: string;
    showModal: boolean;
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
    }
    public setPassword = (text: string) => {
        this.setState({ password: text });
    }
    // public modalContent = () => (
    //     <View>
    //         <View style={{ flexDirection: "row" }}>
    //             <View style={{ flexDirection: "row", padding: 10 }}>
    //                 <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.NORMAL}
    //                     onPress={() => this.setState({ userRole: UserRole.NORMAL })} />
    //                 <Text style={{ marginLeft: 20 }}>{UserRole.NORMAL}</Text>
    //             </View>
    //             <View style={{ flexDirection: "row", padding: 10 }}>
    //                 <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.ARTIST}
    //                     onPress={() => this.setState({ userRole: UserRole.ARTIST })} />
    //                 <Text style={{ marginLeft: 20 }}>{UserRole.ARTIST}</Text>
    //             </View>
    //         </View>
    //     </View>
    // );
    public forgotPwd = () => {
        this.props.navigation.push("ForgotPasswordScreen");
    }
    public render() {
        return (
            <Container style={styles.mainContainer}>
                <ScrollView>
                    <AppLogo iconStyle={{ color: colors.maroon }}  appSloganStyle={{ color: colors.maroon }} />
                    <InputText placeHolder={"Email"} onChangeText={this.setEmail} value={this.state.email} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Password"} onChangeText={this.setPassword} value={this.state.password} secureTextEntry={true} />
                    <LargeButton onPress={this.login} style={{ marginTop: 20 }} text={"LOGIN"}
                        disabled={this.state.email.length === 0 || this.state.password.length === 0}
                    />
                    <Text style={styles.forgotPwdText} onPress={this.forgotPwd}>Forgot Password?</Text>
                    <Text style={styles.forgotPwdText}>OR</Text>
                    {/* <LargeButton style={{ marginTop: 10 }} text={"LOGIN WITH FACEBOOK"} iconName={"sc-facebook"} iconType={"EvilIcons"}
                    ></LargeButton> */}
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
    login: (email, pwd, socialType) => dispatch(LoginActions.loginRequest(email, pwd, socialType))
})

export default connect(null, mapDispatchToProps)(EmailLogin);
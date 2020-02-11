import React from "react";
import { Container, Content, CheckBox } from "native-base";
import styles from "./SignupScreenStyles";
import InputText from "../../Components/InputText/InputText";
import AppLogo from "../../Components/AppLogo/AppLogo";
import colors from "../../Themes/Colors";
import LargeButton from "../../Components/LargeButton";
import { Text, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { LoginActions } from "../../Reducers/LoginReducers";
import { connect } from "react-redux";

export enum UserRole{
    NORMAL = "normal",
    ARTIST = "artist",
}

export interface State {
    email: string;
    password: string;
    confirmPwd: string;
    username: string;
    userRole: UserRole;
}

export interface DispatchProps {
    signup: (username: string, email: string, pwd: string, userRole: UserRole) => void;
}
export type Props = DispatchProps & NavigationScreenProps;

class SignupScreen extends React.Component<Props, State> {
    public constructor(props) {
        super(props);
        this.state = {
            confirmPwd: "",
            email: "",
            password: "",
            username: "",
            userRole: UserRole.NORMAL,
        }
    }
    public openLogin = () => {
        this.props.navigation.navigate("EmailLogin");
    }
    public setUsername = (text: string) => {
        this.setState({ username: text })
    }

    public setEmail = (text: string) => {
        this.setState({ email: text })
    }

    public setPwd = (text: string) => {
        this.setState({ password: text })
    }
    public confirmPwd = (text: string) => {
        this.setState({ confirmPwd: text })
    }
    public signup = () => {
        this.props.signup(this.state.username, this.state.email, this.state.password, this.state.userRole);
    }
    public render() {
        return (
            <Container style={styles.mainContainer}>
                <Content showsVerticalScrollIndicator={false}>
                    <AppLogo iconStyle={{ color: colors.lightPink }}  appSloganStyle={{ color: colors.lightPink }} />
                    <InputText placeHolder={"Full Name"} onChangeText={this.setUsername} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Email"} onChangeText={this.setEmail} />
                    <View style={{backgroundColor: colors.silver, marginTop: 20, padding: 5}}>
                        <Text style={{padding: 10, color: colors.charcoal}}>User Role</Text>
                        <View style={{flexDirection: "row"}}>
                        <View style={{flexDirection: "row", padding:10}}>
                        <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.NORMAL} onPress={() => this.setState({userRole: UserRole.NORMAL})}/>
        <Text style={{marginLeft: 20}}>{UserRole.NORMAL}</Text>
                        </View>
                        <View style={{flexDirection: "row", padding:10}}>
                        <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.ARTIST}
                        onPress={() => this.setState({userRole: UserRole.ARTIST})}/>
        <Text style={{marginLeft: 20}}>{UserRole.ARTIST}</Text>
                        </View>
                        </View>

                    </View>
                    <InputText style={{ marginTop: 20 }} placeHolder={"Password"} onChangeText={this.setPwd} secureTextEntry={true} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Confirm Password"} onChangeText={this.confirmPwd}  secureTextEntry={true}/>
                    <LargeButton style={{ marginTop: 20 }} text={"SIGNUP"} onPress={this.signup}
                    disabled={(this.state.email.length === 0 || this.state.username.length === 0 || this.state.password.length === 0 ||
                    this.state.password !== this.state.confirmPwd
                    )}/>
                    <Text style={styles.accountText}>Already have an account? <Text onPress={this.openLogin} style={{ color: colors.maroon }}>Login</Text></Text>
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
    signup: (username, email, pwd, userRole) => dispatch(LoginActions.signup(username, email, pwd, userRole))
})

export default connect(null, mapDispatchToProps) (SignupScreen);
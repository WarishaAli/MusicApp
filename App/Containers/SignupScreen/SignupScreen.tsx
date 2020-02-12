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

export enum UserRole {
    NORMAL = "user",
    ARTIST = "artist",
}

export interface State {
    email: string;
    password: string;
    confirmPwd: string;
    username: string;
    userRole: UserRole;
    dob: string;
    pob: string;
    country: string;
    topAlbums: string;
    interests: string;
    firstPage: boolean;
}

export interface DispatchProps {
    signup: (username: string, email: string, pwd: string, userRole: UserRole, pob: string, dob: string, country: string,
        interests? :string, topAlbums? :string) => void;
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
            dob: "",
            pob: "",
            interests: "",
            topAlbums: "",
            country: "",
            firstPage: true
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
    public setDob = (text: string) => {
        this.setState({ dob: text })
    }

    public setPob = (text: string) => {
        this.setState({ pob: text })
    }

    public setCountry = (text: string) => {
        this.setState({ country: text })
    }
    public setPwd = (text: string) => {
        this.setState({ password: text })
    }
    public confirmPwd = (text: string) => {
        this.setState({ confirmPwd: text })
    }
    public signup = () => {
        this.state.firstPage ? this.setState({ firstPage: false }) :
            this.props.signup(this.state.username, this.state.email, this.state.password, this.state.userRole, this.state.pob, this.state.dob,
                this.state.country, this.state.interests, this.state.topAlbums);
    }
    public setInterests = (text: string) => {
        this.setState({ interests: text })
    }
    public setTopAlbums = (text: string) => {
        this.setState({ topAlbums: text })
    }

    public disableBtn = () => {
        if (this.state.firstPage) {
            return (this.state.email.length === 0 || this.state.username.length === 0 || this.state.dob.length === 0 ||
                this.state.pob.length === 0 || this.state.country.length === 0
            )
        } else {
            return this.state.userRole === UserRole.ARTIST ? (this.state.interests.length === 0 ||
                this.state.topAlbums.length === 0 || this.state.password.length === 0 ||
                this.state.password !== this.state.confirmPwd
            ) : (this.state.password.length === 0 ||
                this.state.password !== this.state.confirmPwd)
        }
    }
    public renderTextFields = () => {
        return this.state.firstPage ? (
            <View>
                <InputText placeHolder={"Full Name"} onChangeText={this.setUsername} value={this.state.username} />
                <InputText style={{ marginTop: 20 }} placeHolder={"Email"} onChangeText={this.setEmail} value={this.state.email}/>
                <InputText style={{ marginTop: 20 }} placeHolder={"Birthday"} onChangeText={this.setDob} value={this.state.dob}/>
                <InputText style={{ marginTop: 20 }} placeHolder={"Place of birth"} onChangeText={this.setPob} value={this.state.pob}/>
                <InputText style={{ marginTop: 20 }} placeHolder={"Country"} onChangeText={this.setCountry} value={this.state.country}/>
            </View>
        ) : (
                <View>
                    <View style={{ backgroundColor: colors.silver, marginTop: 20, padding: 5 }}>
                        <Text style={{ padding: 10, color: colors.charcoal }}>User Role</Text>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flexDirection: "row", padding: 10 }}>
                                <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.NORMAL} onPress={() => this.setState({ userRole: UserRole.NORMAL })} />
                                <Text style={{ marginLeft: 20 }}>{UserRole.NORMAL}</Text>
                            </View>
                            <View style={{ flexDirection: "row", padding: 10 }}>
                                <CheckBox color={colors.steel} checked={this.state.userRole === UserRole.ARTIST}
                                    onPress={() => this.setState({ userRole: UserRole.ARTIST })} />
                                <Text style={{ marginLeft: 20 }}>{UserRole.ARTIST}</Text>
                            </View>
                        </View>

                    </View>
                    {this.state.userRole === UserRole.ARTIST && <View>
                        <InputText style={{ marginTop: 20 }} placeHolder={"Interests"} onChangeText={this.setInterests} value={this.state.interests} />
                        <InputText style={{ marginTop: 20 }} placeHolder={"Top Albums"} onChangeText={this.setTopAlbums} value={this.state.topAlbums} />
                    </View>}
                    <InputText style={{ marginTop: 20 }} placeHolder={"Password"} onChangeText={this.setPwd} secureTextEntry={true} value={this.state.password}/>
                    <InputText style={{ marginTop: 20 }} placeHolder={"Confirm Password"} onChangeText={this.confirmPwd} secureTextEntry={true} value={this.state.confirmPwd}/>
                </View>
            )
    }
    public render() {
        return (
            <Container style={styles.mainContainer}>
                <Content showsVerticalScrollIndicator={false}>
                    <AppLogo iconStyle={{ color: colors.lightPink }} appSloganStyle={{ color: colors.lightPink }} />
                    {this.renderTextFields()}
                    <LargeButton style={{ marginTop: 20 }} text={this.state.firstPage ? "NEXT" : "SIGNUP"} onPress={this.signup}
                        disabled={this.disableBtn()} />
                        {!this.state.firstPage && 
                        <Text style={[styles.accountText, {color: colors.maroon}]}
                        onPress={() => this.setState({firstPage: true})}
                        >Edit previously entered fields?</Text>
                        }
                    <Text style={styles.accountText}>Already have an account? <Text onPress={this.openLogin} style={{ color: colors.maroon }}>Login</Text></Text>
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
    signup: (username, email, pwd, userRole, pob, dob, country, interests, 
        topAlbums) => dispatch(LoginActions.signup(username, email, pwd, userRole, pob, dob, country, interests, topAlbums))
})

export default connect(null, mapDispatchToProps)(SignupScreen);
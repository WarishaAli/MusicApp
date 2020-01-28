import React from "react";
import { Container, Content } from "native-base";
import InputText from "../../Components/InputText/InputText";
import LargeButton from "../../Components/LargeButton";
import {Text} from "react-native";
import colors from "../../Themes/Colors";
import styles from "./AddSongScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";

export interface OwnProps {

}
export type Props = OwnProps;

class AddSongScreen extends React.Component<Props>{
    public render() {
        return (
            <Container>
                <CommonHeader title={"Add your song"}></CommonHeader>
                <Content style={{padding: 30, marginTop: 20}}>
                    {/* <AppLogo iconStyle={{ color: colors.lightPink }} appNameStyle={{ color: colors.coal }} appSloganStyle={{ color: colors.lightPink }} /> */}
                    <InputText placeHolder={"Song Name"} onChangeText={this.setUsername} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Song Category"} onChangeText={this.setEmail} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Password"} onChangeText={this.setPwd} secureTextEntry={true} />
                    <InputText style={{ marginTop: 20 }} placeHolder={"Confirm Password"} onChangeText={this.confirmPwd} secureTextEntry={true} />
                    <LargeButton style={{ marginTop: 20 }} text={"SIGNUP"} onPress={this.signup}
                         />
                    <Text style={styles.accountText}>Already have an account? <Text onPress={this.openLogin} style={{ color: colors.maroon }}>Login</Text></Text>
                </Content>
            </Container>
        )
    }
}

export default AddSongScreen;
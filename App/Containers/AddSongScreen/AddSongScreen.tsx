import React from "react";
import { Container, Content, Icon } from "native-base";
import InputText from "../../Components/InputText/InputText";
import LargeButton from "../../Components/LargeButton";
import {Text, TouchableOpacity, Linking} from "react-native";
import colors from "../../Themes/Colors";
import styles from "./AddSongScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { NavigationScreenProps } from "react-navigation";

export interface OwnProps {

}
export type Props = OwnProps & NavigationScreenProps;

class AddSongScreen extends React.Component<Props>{
    public render() {
        return (
            <Container>
                <CommonHeader title={"Add your song"}
                     leftItem={
                        <TouchableOpacity style={{ marginTop: 10, paddingRight: 5 }} onPress={() => this.props.navigation.pop()}>
                            <Icon name={"ios-arrow-back"} style={{ fontSize: 16, color: colors.lightMaroon, padding: 10 }}></Icon>
                        </TouchableOpacity>}
                ></CommonHeader>
                 <Text style={styles.descriptionText}>We are working to add this feature in our app, for now please visit our website to upload song <Text
                        style={{ color: colors.maroon }} onPress={() => Linking.openURL("https://www.hiphopstreets.com")}>https://www.hiphopstreets.com</Text>
                        </Text>
       
                
            </Container>
        )
    }
}

export default AddSongScreen;
import React from "react";
import {Button, Icon} from "native-base";
import {ViewStyle, Text} from "react-native";
import styles from "./LargeButtonStyles";

export interface props {
    onPress?: () => void;
    style?: ViewStyle;
    text: string;
    iconName?: string;
    iconType?: string;
}
const LargeButton = ({onPress, style, text, iconName, iconType}: props) => (
<Button style={[styles.btnView, style]} onPress={onPress}>
    {iconName && <Icon style={{padding: 0, fontSize: 25}} name={iconName} type={iconType}/>}
    <Text style={styles.btnText}>{text}</Text>
</Button>
) ;

export default LargeButton;
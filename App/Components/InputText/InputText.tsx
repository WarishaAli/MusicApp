import React from "react";
import { TextInput } from "react-native";
import styles from "./InputTextStyles";
import colors from "../../Themes/Colors";

export interface Props{
    placeHolder: string;
    style?: any;
    onChangeText: (text: string) => void;
}

const InputText: React.SFC<Props> = ({placeHolder, style, onChangeText, ...remaining}: Props) => (
    <TextInput
    {...remaining}
    style={[styles.textField, style]} placeholder={placeHolder} placeholderTextColor={colors.charcoal}
    onChangeText={onChangeText}
    ></TextInput>
)

export default InputText;
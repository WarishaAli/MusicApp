import React from "react";
import { TextInput, View, Text } from "react-native";
import styles from "./InputTextStyles";
import colors from "../../Themes/Colors";

export interface Props{
    placeHolder: string;
    style?: any;
    onChangeText: (text: string) => void;
    error? : boolean;
    errorText?: string;
}

const InputText: React.SFC<Props> = ({placeHolder, style, onChangeText, error, errorText,  ...remaining}: Props) => (
    <View>
    <TextInput
    {...remaining}
    style={[styles.textField, style, {borderColor: error ? colors.lightMaroon : colors.silver, borderWidth: error ? 1 : 0}]}
    placeholder={placeHolder} placeholderTextColor={colors.charcoal}
    onChangeText={onChangeText}
    ></TextInput>
    {error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
)

export default InputText;
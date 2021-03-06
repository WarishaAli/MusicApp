import React from "react";
import { Header } from "native-base";
import styles from "./CommonHeaderStyles";
import { Text } from "react-native";
import {View} from "react-native";
export interface OwnProps{
    leftItem?: any;
    rightItem?:any;
    title: string
}
export type Props = OwnProps;

export default class CommonHeader extends React.Component<Props> {
    public render(){
        return(
            <Header noShadow={true} style={styles.header}>
                <View style={styles.leftStyle}>
                {this.props.leftItem}
                <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View style={styles.rightStyle}>
                {this.props.rightItem}
                </View>
            </Header>
        )
    }
}
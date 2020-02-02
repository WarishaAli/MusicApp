import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";
import { Fonts } from "../../Themes";

export default StyleSheet.create({
    header:{
        backgroundColor: colors.transparent,
        flexDirection: "row",
        height: 35,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        borderBottomWidth: 0,
    },
    text:{
        // ...Fonts.style.h3,
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "capitalize",
        color: colors.lightMaroon,
        fontFamily: "serif",
        alignSelf: "center",
        marginLeft: 10,
        marginTop: 5
    },
    leftStyle:{
        marginLeft: 10,
    },
    rightStyle:{
        marginRight: 20,
        marginTop: 5
    }
})
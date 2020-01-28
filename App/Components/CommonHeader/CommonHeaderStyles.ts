import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";
import { Fonts } from "../../Themes";

export default StyleSheet.create({
    header:{
        backgroundColor: colors.lightMaroon,
        flexDirection: "row",
        height: 35,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
    },
    text:{
        // ...Fonts.style.h3,
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "capitalize",
        color: colors.snow,
        fontFamily: "serif",
        alignSelf: "center",
    },
    leftStyle:{
        marginLeft: 10,
    },
    rightStyle:{
        marginRight: 20
    }
})
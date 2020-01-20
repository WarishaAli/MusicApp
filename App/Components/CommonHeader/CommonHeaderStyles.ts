import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    header:{
        backgroundColor: colors.lightMaroon,
        flexDirection: "row",
        height: 50,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
    },
    text:{
        fontSize: 20,
        // textAlign: "center",
        fontWeight: "bold",
        textTransform: "capitalize",
        color: colors.snow,
        // fontFamily: "Futura",
        alignSelf: "center",
    },
    leftStyle:{
        marginLeft: 10,
    },
    rightStyle:{
        marginRight: 20
    }
})
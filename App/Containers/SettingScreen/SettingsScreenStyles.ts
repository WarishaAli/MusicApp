import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    roundView:{
        backgroundColor: colors.maroon,
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: "center"
    },
    initials: {
        fontSize: 15,
        fontWeight: "bold",
        color: colors.snow,
        alignSelf: "center",
    },
    listItem: {
        marginTop: 20,
    },
    listView:{
        flexDirection: "row",
        marginTop: 50,
        // padding: 20,
    },
    text:{
        alignSelf: "flex-start",
        paddingLeft: 20,
        color: colors.maroon,
        fontSize: 16,
    },
    caretLine: {
        backgroundColor: colors.steel,
        height: 1,
        paddingHorizontal: 30,
    }
})
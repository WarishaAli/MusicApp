import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    mainView:{
        opacity: 0.9,
        backgroundColor: colors.steel,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 10,
    },
    imageView: {
        borderRadius: 200,
        width: 50,
        height: 50,
        alignSelf: "center",
        // backgroundColor: colors.snow,
        marginHorizontal: 10,
    },
    textView: {
        flexDirection: "column",
        alignSelf: "center",
        // justifyContent: "flex-start",
        paddingLeft: 0,
        flex: 0.5,
        // marginRight: 30,
    },
    heading: {
        color: colors.charcoal,
        fontSize: 18,
        textAlign: "left",
    },
    subHeading: {
        color: colors.charcoal,
        fontSize: 12,
    },
    icon:{
        color: colors.charcoal,
        flex: 0.2,
        // marginLeft: 5,
    }
})
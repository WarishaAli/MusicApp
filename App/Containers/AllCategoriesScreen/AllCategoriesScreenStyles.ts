import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    cardItemStyle: {
        height: 80,
        flex: 0.5,
        marginTop: 20,
        
    },
    cardImage: {
        flex: 1, justifyContent: "flex-end", borderRadius: 0, zIndex: 2,
    },
    subHeading: {
        fontSize: 20,
        // fontWeight: "bold",
        color: colors.coal,
        fontFamily: "serif"
    },
    headerTitle:{
        fontSize: 25,
        fontWeight: "bold",
    }
})
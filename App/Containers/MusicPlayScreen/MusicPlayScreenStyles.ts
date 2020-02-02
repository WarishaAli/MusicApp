import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    icon:{
        color: colors.charcoal,
        fontSize: 30,
        marginTop: 4,
    },
    container:{
        flex: 1,
        backgroundColor: colors.lightPink,
    },
    image:{
        height: 250,
        width: 250,
        borderRadius: 10,
        alignSelf: "center",
    },
    holderView:{
        marginTop: 80,
        paddingHorizontal: 50,
    },
    heartIcon:{
        fontSize: 18,
        color: colors.charcoal,
        marginLeft: 50,
        paddingTop: 8,
    },
    songNameText:{
        fontSize: 20,
        // fontWeight: "bold",
        color: colors.charcoal,
        fontFamily: "serif",
        // alignSelf: "center",
    }
})
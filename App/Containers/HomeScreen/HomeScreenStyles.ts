import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.maroon,
        alignSelf: "flex-start",
        // paddingTop: 10,
        // paddingLeft: 10,
    },
    header:{
        flex: 1,
        justifyContent: "space-between",
        alignContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 30,
        backgroundColor: colors.maroon,
        height: 80,
        borderRadius: 0,
        opacity: 0.4,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.coal,
        marginTop: 40
    },
    icon: {
        color: colors.snow, alignSelf: "flex-end"
    },
    headerView: {
        padding: 10, flex: 1, flexDirection: "row", alignContent: "space-between", justifyContent: "space-between"
    },
    btnList: {
        marginTop: 30, paddingHorizontal: 20,
    },
    btnTop: {
        borderWidth: 0, borderColor: colors.maroon, backgroundColor: colors.maroon, borderRadius: 3, marginHorizontal: 2, width: 100, justifyContent: "center", height: 40,
    },
    btnText: {
        color: colors.snow, fontSize: 15, fontWeight: "normal", textAlign: "center",
    },
    cardItemStyle: {
        height: 80,
        flex: 0.5,
        
    },
    cardImage: {
        flex: 1, justifyContent: "flex-end", borderRadius: 0, zIndex: 2,
    },
    musicPlayer:{
        marginBottom: 10,
        position: "absolute",
        bottom: 80,
        width: "100%",
    },
});
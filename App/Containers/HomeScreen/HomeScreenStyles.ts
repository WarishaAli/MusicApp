import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    songName:{
        color: colors.black,

    },
    songsCard:{
        width: 140,
        height: 120,
    },
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
        fontSize: 18,
        // fontWeight: "bold",
        color: colors.coal,
        marginTop: 20,
        marginBottom: 20,
        // marginTop: 40,
        fontFamily: "serif"
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
        height: 60,
        width: 130,    
    },
    cardImage: {
        flex: 1,
    },
    musicPlayer:{
        marginBottom: 10,
        position: "absolute",
        bottom: 60,
        width: "100%",
    },
    listStyle:{
        // marginTop: 10,
        // marginBottom: 20,
        // paddingLeft: 2,
        paddingRight: 20,
        marginBottom: 10
    },
    noDataText:{
        alignSelf: "flex-start",
        // paddingTop: 40,
        fontSize: 14,
        paddingHorizontal: 10,
        marginBottom: 5,
    }
});
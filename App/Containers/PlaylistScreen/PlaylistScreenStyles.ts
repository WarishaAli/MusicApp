import {StyleSheet} from "react-native";
import colors from "../../Themes/Colors";

export default StyleSheet.create({
    playlistName:{
        color: colors.snow,
        textAlign: "center",
        fontSize: 18,
        padding: 2,
    },
    cardItemStyle:{
        borderRadius: 60,
        height: 100, 
        width: 100, 
        marginLeft: 10, 
        marginTop:10,
        backgroundColor: colors.lightMaroon, 
        justifyContent: "center",
        opacity: 0.8,
    },
    songsView:{
        flexDirection: "row",
    },
    heading: {
        color: colors.black,
        fontSize: 18,
        // textAlign: "left",
    },
    subHeading: {
        color:colors.charcoal,
        fontSize:15,
        textAlign: "left",
        marginTop: 5,
    },
    caretView: {
        height: 0.5,
        backgroundColor: colors.steel,
        flex: 1,
        marginTop:2,
    },
    textIconView: {
        flexDirection: "row",
    },
    playlistStyle: {
        marginBottom: 10,
        position: "absolute",
        bottom: 80,
        width: "100%",
    },
    singleCatStyle: {
        marginBottom: 10,
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    pauseIcon:{
        color: colors.lightMaroon, marginLeft: 100
    },
    header: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "left",
        // flex: 0.5,
        // paddingLeft: 10,
    },
    imageStyle:{
        width: 150,
        height: 150,
        // flex: 1,
        alignSelf: "flex-start",
        borderRadius: 5,
    },
    textImageStyle:{
        flexDirection: "row",
        paddingLeft: 20
    },
    headerView:{ 
        paddingLeft: 20,
    },
    listenBtn:{
        backgroundColor: colors.lightMaroon,
        paddingRight: 20,
        height: 30,
        marginTop: 5,
        justifyContent: "center",
        borderRadius: 5,
    },
    listenTxt: {
        color: colors.snow,
        textAlign: "center",
        fontSize: 15,
    }
})
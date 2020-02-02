import React from "react";
import { Container, Icon } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import styles from "./MusicPlayScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { TouchableOpacity, Image, Text, View } from "react-native";
import colors from "../../Themes/Colors";

export interface ISongData {
    song_name: string;
    song_category: string;
    songimage: string;
    song_file: string;
}
export interface State {
    songData: ISongData | any;
}
export type Props = NavigationScreenProps;
class MusicPlayScreen extends React.Component<Props, State>{
    public constructor(props) {
        super(props);
        this.state = {
            songData: this.props.navigation.getParam("songData"),
        }
    }
    public render() {
        return (
            <Container style={styles.container}>
                <CommonHeader title={"Play Music"} rightItem={
                    <TouchableOpacity>
                        <Icon name={"ios-arrow-down"} type={"Ionicons"} style={{ color: colors.lightMaroon, fontSize: 18 }} />
                    </TouchableOpacity>
                } />
                <View style={styles.holderView}>
                    <Image style={styles.image} source={{ uri: this.state.songData.songimage }}></Image>
                   <View style={{flexDirection: "row", marginTop: 30}}>
                   <View style={{  alignSelf: "center", flex: 0.9}}>
                        <Text style={styles.songNameText}>{this.state.songData.song_name}</Text>
                        {/* <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity> */}
                        <Text style={{color: colors.charcoal}}>{this.state.songData.song_category}</Text>
                    </View>
                    <TouchableOpacity><Icon name={"hearto"} type={"AntDesign"} style={styles.heartIcon}></Icon></TouchableOpacity>
                   </View>
                   
                    <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
                        <View style={{backgroundColor: colors.lightMaroon, height: 8, flex: 1, borderRadius: 20, alignSelf: "center" }}></View>
                    </View>
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}>
                        <Icon onPress={this.playPreviousSong} style={styles.icon} name={"stepbackward"} type={"AntDesign"} />
                        {this.props.showPlay && <Icon onPress={this.pauseSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"pause"} type={"AntDesign"} />}
                        {!this.props.showPlay && <Icon onPress={this.playSong} style={[styles.icon, { fontSize: 40, paddingHorizontal: 30, marginTop: 0 }]} name={"play"} type={"AntDesign"} />}
                        <Icon onPress={() => this.playNextSong(false)} style={styles.icon} name={"stepforward"} type={"AntDesign"} />
                    </View>
                </View>
            </Container>
        )
    }
}

export default MusicPlayScreen;
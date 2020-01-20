import { Card, Col, Container, Content, Icon } from "native-base";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList, NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import BottomBar from "../../Components/BottomBar";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import ModalView from "../../Components/ModalView/ModalView";
import { SettingsData } from "../../Lib/SettingsData";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import styles from "./SettingsScreenStyles";
import ImagePicker from 'react-native-image-picker';

export interface DispatchProps {
    selectBottomTab: (selectedTab: BottomBarBtns) => void;
}

export interface State {
    visible: boolean;
    profileImage: string;
    userName: string;
    bio: string;
    gender: string;
    imgPosition: { x: number, y: number };
}

export type Props = NavigationScreenProps & DispatchProps;

class SettingScreen extends React.Component<Props, State>{

    public constructor(props) {
        super(props);
        this.state = {
            visible: false,
            profileImage: "https://www.voguehk.com/media/2019/08/Sep_Rihanna_CoverStory04_online-1-960x1280.jpg",
            bio: "Muisc Lover | 30 | Pakistan",
            gender: "Female",
            userName: "Warisha Ali",
            imgPosition: { x: 0, y: 0 }
        }
    }
    // public onBackPress: any = null;
    public handleBack = () => {
        this.props.navigation.navigate("HomeScreen");
    }
    public componentDidMount() {
        this.props.selectBottomTab(BottomBarBtns.SETTINGS);
        // this.onBackPress = BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    }
    public componentWillUnmount() {
        // this.onBackPress && BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    }
    public renderItem = (initials?: boolean, title: string, onPress: () => void, icon?: string) => {
        return (
            <TouchableOpacity style={styles.listView}>
                <Card style={{ padding: 20 }}>
                    <View style={{ flexDirection: "row" }}><Text style={styles.text}>{title}</Text>
                        <Col></Col>
                        <Icon name={"plus-circle"} type={"Feather"} style={styles.plusIcon}></Icon>
                    </View>
                </Card>
            </TouchableOpacity>


        )
    }
    public showModal = () => this.setState({ visible: true });
    public renderTopProfileView = () => (
        <View style={styles.profileView}>
            {/* <View style={styles.roundView}> */}
            <Image style={styles.roundView} source={{ uri: this.state.profileImage }}></Image>
            {/* </View> */}
            <View style={styles.profileInfo}>
                <Text style={styles.userNameHeading}>{this.state.userName}</Text>
                <Text style={styles.bioHeading} numberOfLines={4}>{this.state.bio}}</Text>
                <Text style={styles.bioHeading} numberOfLines={1}>{this.state.gender}</Text>
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={this.showModal}>
                    <Text style={[styles.userNameHeading, { fontWeight: "normal", fontSize: 15, color: colors.lightMaroon }]}>Edit Profile</Text>
                    <Icon name={"edit-3"} type={"Feather"} style={styles.editIcon}></Icon>
                </TouchableOpacity>
                {/* <LargeTransparentButton text={"Edit Profile"} textStyle= {styles.editBtnText} style={styles.editBtn}/> */}
            </View>
        </View>
    );

    public renderListView = () => (
        <View>
            <FlatList data={SettingsData} renderItem={this.renderSettingsItems} />
        </View>
    )
    public renderSettingsItems = ({ item }) => (

        <View style={styles.itemRow}>
            <Icon name={item.iconName} type={item.iconType} style={[styles.editIcon, { padding: 0, alignSelf: "flex-start", fontSize: 20 }]} />
            <View style={styles.settingsItemView}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
                <View style={styles.caretLine}></View>
            </View>
        </View>
    )
    public onLayoutImg = (e) => {
        this.setState({
            imgPosition: { x: e.nativeEvent.layout.width, y: e.nativeEvent.layout.height }
        })
    }
    public selectImage = () => {
        const options={
            title: "Pick your profile picture"
        }
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
          
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          
              this.setState({profileImage: response.uri});
            }
          });
    }
    public render() {
        return (
            <Container>
                <CommonHeader title={"Profile settings"} />
                <Content style={{ maxHeight: "80%" }}>
                    {this.renderTopProfileView()}
                    {this.renderListView()}
                </Content>
                <ModalView content={
                    <View style={styles.modalContent}>
                        <Image source={{ uri: this.state.profileImage}} style={styles.roundView} onLayout={this.onLayoutImg} />
                        <TouchableOpacity style={[styles.cameraView, { top: this.state.imgPosition.y - 140, left: this.state.imgPosition.x - 30, }]}
                        onPress={this.selectImage}
                        >
                            <Icon name={"camera"} type={"FontAwesome"} style={styles.camIcon}></Icon>
                        </TouchableOpacity>
                        <TextInput value={this.state.userName} onChangeText={(text) => this.setState({ userName: text })} underlineColorAndroid={colors.maroon} />
                        <TextInput value={this.state.bio} onChangeText={(text) => this.setState({ bio: text })} underlineColorAndroid={colors.maroon} />
                        <TextInput value={this.state.gender} onChangeText={(text) => this.setState({ gender: text })} underlineColorAndroid={colors.maroon} />
                    </View>
                }
                    visible={this.state.visible}
                    title={"Edit your profile"}
                    cancel={() => { this.setState({ visible: false }) }}
                    done={() => { this.setState({ visible: false }) }}
                />
                <BottomBar navigation={this.props.navigation} />
            </Container>
        )
    }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    selectBottomTab: (tab) => dispatch(BottomBarActions.setSelectedTab(tab))
})

export default connect(null, mapDispatchToProps)(SettingScreen);
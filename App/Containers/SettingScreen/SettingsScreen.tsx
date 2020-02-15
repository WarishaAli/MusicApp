import { Card, Col, Container, Content, Icon } from "native-base";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import ImagePicker from 'react-native-image-picker';
import { FlatList, NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import BottomBar from "../../Components/BottomBar";
import ModalView from "../../Components/ModalView/ModalView";
import { IUserData } from "../../Lib/Interfaces";
import { SettingsData } from "../../Lib/SettingsData";
import { RootState } from "../../Reducers";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";
import { LoginActions } from "../../Reducers/LoginReducers";
import { ProfileAction } from "../../Reducers/ProfileReducers";
import { SongsActions } from "../../Reducers/SongsReducer";
import colors from "../../Themes/Colors";
import { BottomBarBtns } from "../../Types/BottomBar";
import styles from "./SettingsScreenStyles";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Share from "react-native-share";

export interface DispatchProps {
    selectBottomTab: (selectedTab: BottomBarBtns) => void;
    updateProfile: (params: IUserData) => void;
    logout: () => void;
    selectSong: (song_file: string) => void;
    playMusic: (shouldPlay: boolean) => void;
}

export interface State {
    visible: boolean;
    profileImage: {uri: string, type: string, name: string};
    userName: string;
    bio: string;
    gender: string;
    emailId: string;
    imgPosition: { x: number, y: number };
}
export interface StateProps{
    profileData: IUserData;
}

export type Props = NavigationScreenProps & DispatchProps & StateProps;

class SettingScreen extends React.Component<Props, State>{

    public constructor(props) {
        super(props);
        this.state = {
            visible: false,
            profileImage: {uri: "", type: "image/jpeg", name: ""},
            bio: this.props.profileData ? this.props.profileData.biography : "Say something about yourself",
            gender: this.props.profileData ? this.props.profileData.sex : "Specify your gender",
            userName: this.props.profileData ? this.props.profileData.name : "your username",
            emailId: this.props.profileData ? this.props.profileData.email_id : "your email id",
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
            <Image style={styles.roundView} source={{ uri: this.props.profileData.image }}></Image>
            <View style={styles.profileInfo}>
                <Text style={styles.userNameHeading}>{this.props.profileData.name || "-"}</Text>
                <Text style={styles.bioHeading} numberOfLines={4}>{ this.props.profileData.email_id || "Your email id"}</Text>
                <Text style={styles.bioHeading} numberOfLines={4}>{this.props.profileData.biography || "Say something about yourself"}</Text>
                <Text style={styles.bioHeading} numberOfLines={1}>{this.props.profileData.sex || "Specify your gender"}</Text>
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={this.showModal}>
                    <Text style={[styles.userNameHeading, { fontWeight: "normal", fontSize: 15, color: colors.lightMaroon }]}>Edit Profile</Text>
                    <Icon name={"edit-3"} type={"Feather"} style={styles.editIcon}></Icon>
                </TouchableOpacity>
                {/* <LargeTransparentButton text={"Edit Profile"} textStyle= {styles.editBtnText} style={styles.editBtn}/> */}
            </View>
        </View>
    );

    public logout = () => {
        this.props.playMusic(false);
        this.props.logout();
    }

    public renderListView = () => (
        <View>
            <FlatList data={SettingsData} renderItem={this.renderSettingsItems} />
        </View>
    )
    public logout = (title: string) => {
       if( title==="Logout"){
            Alert.alert("Confirmation", "Are you sure you want to log out?", [
                {
                    text: "Yes",
                    onPress: this.props.logout,
                },
                {
                    text: "Cancel",
                }
            ])
       }else{
        return null;
       }
    }

    public renderSettingsItems = ({ item }) => (

        <View style={styles.itemRow}>
            <Icon name={item.iconName} type={item.iconType} style={[styles.editIcon, { padding: 0, alignSelf: "flex-start", fontSize: 20 }]} />
            <TouchableOpacity style={styles.settingsItemView} onPress={() => this.logout(item.title)}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
                <View style={styles.caretLine}></View>
            </TouchableOpacity>
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
          
              this.setState({profileImage: {uri: response.uri, type: response.type, name: response.fileName }});
            }
          });
    }
    updateProfile = () => {
        this.setState({visible: false});
        this.props.updateProfile({userName: this.state.userName, emailId: this.state.emailId, gender: this.state.gender,
        image: this.state.profileImage, biography: this.state.bio})
    }
    public render() {
        return (
            <Container>
                <CommonHeader title={"Profile & Settings"} />
                {/* {this.props.profileData ?  */}
                <Content style={{ maxHeight: "80%" }}>
                    {this.props.profileData && this.renderTopProfileView()}
                    {this.renderListView()}
                </Content> 
                {/* : */}
                 {/* <Text style={{padding: 30, alignSelf: "center", marginTop: 50}}>Unfortunately, your profile data is not available at the moment! Please try again later</Text> */}
                 {/* } */}
                <ModalView content={
                    <View style={styles.modalContent}>
                        <Image source={{ uri: this.state.profileImage.uri}} style={styles.roundView} onLayout={this.onLayoutImg} />
                        <TouchableOpacity style={[styles.cameraView, { top: this.state.imgPosition.y - 140, left: this.state.imgPosition.x - 30, }]}
                        onPress={this.selectImage}
                        >
                            <Icon name={"camera"} type={"FontAwesome"} style={styles.camIcon}></Icon>
                        </TouchableOpacity>
                        <TextInput value={this.state.userName} onChangeText={(text) => this.setState({ userName: text })} underlineColorAndroid={colors.maroon} placeholder={"Enter your username"} />
                        <TextInput value={this.state.emailId} onChangeText={(text) => this.setState({ emailId: text })} underlineColorAndroid={colors.maroon} placeholder={"Enter your email id"}/>
                        <TextInput value={this.state.bio} onChangeText={(text) => this.setState({ bio: text })} underlineColorAndroid={colors.maroon} placeholder={"Enter your biography"} />
                        <TextInput value={this.state.gender} onChangeText={(text) => this.setState({ gender: text })} underlineColorAndroid={colors.maroon} placeholder={"Enter your gender"}/>
                    </View>
                }
                    visible={this.state.visible}
                    title={"Edit your profile"}
                    cancel={() => { this.setState({ visible: false }) }}
                    done={this.updateProfile}
                />
                <BottomBar navigation={this.props.navigation} />
            </Container>
        )
    }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    selectBottomTab: (tab) => dispatch(BottomBarActions.setSelectedTab(tab)),
    updateProfile: (params: IUserData) => dispatch(ProfileAction.updateProfileRequest(params)),
    logout: () => dispatch(LoginActions.logout()),
    selectSong: (song) => dispatch(SongsActions.setSong(song)),
    playMusic: () => dispatch(SongsActions.setIsPlaying(false)),
})
const mapStateToProps = (state: RootState): StateProps => ({
    profileData: state.profile.profileData,
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";
import HomeScreen from "../Containers/HomeScreen/HomeScreen";
import PlaylistScreen from "../Containers/PlaylistScreen/PlaylistScreen";
import SelectAllCategory from "../Containers/AllCategoriesScreen/AllCategoriesScreen";
import BlogScreen from "../Containers/BlogScreen/BlogScreen";
import SettingsScreen from "../Containers/SettingScreen/SettingsScreen";

const home = createStackNavigator({
  Home: {screen: HomeScreen},
  Playlist: {screen: PlaylistScreen},
  SelectAllCategory: {screen: SelectAllCategory},
},{
  headerMode: "none",
  initialRouteName: "Home",
  navigationOptions: {
    headerStyle: styles.header,
  },
});

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  HomeScreen: {screen: home},
  PlaylistScreen: {screen: PlaylistScreen},
  BlogsScreen: {screen: BlogScreen},
  SettingScreen: {screen: SettingsScreen},
  // SelectAllCategory: {screen: SelectAllCategory},
}, {
  initialRouteName: "HomeScreen",
  headerMode: "none",
});

export default PrimaryNav;

import { createStackNavigator } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import SignupScreen from "../Containers/SignupScreen";
import EmailLogin from "../Containers/EmailLogin/EmailLogin";
import styles from "./Styles/NavigationStyles";


const LoginNav= createStackNavigator({
    LaunchScreen: { screen: LaunchScreen },
    EmailLogin: {screen: EmailLogin},
    SignUpScreen: {screen: SignupScreen },
},{
    headerMode: "none",
    initialRouteName: "LaunchScreen",
    navigationOptions: {
        headerStyle: styles.header,
      },
})

export default LoginNav;
import * as React from "react";
import {createAppContainer, NavigationScreenProps} from "react-navigation";
import { connect, Dispatch } from "react-redux";
import AppNavigation from "./AppNavigation";
import LoginNavigation from "./LoginNavigation";
import { RootState } from "../Reducers";
import { LoginActions } from "../Reducers/LoginReducers";
import { Alert } from "react-native";

export interface StateProps{
  isLogin: boolean;
}
export interface DispatchProps{
  checkLogin: () => void;
  checkUserRole: (callback: () => void) => void;
}
export type Props = StateProps & DispatchProps;

// here is our redux-aware smart component
class ReduxNavigation extends React.Component<Props> {
  // const { dispatch, nav } = props;
  // const navigation = ReactNavigation.addNavigationHelpers({
  //   dispatch,
  //   state: nav,
  // });
  public componentDidMount(){
    this.props.checkLogin();
    this.props.checkUserRole(() => Alert.alert("Error", "no user role"))
  }
  public render (){
    // console.log("at redux comp", this.props.isLogin);
  const AppContainer = createAppContainer(AppNavigation);
  const LoginContainer = createAppContainer(LoginNavigation)
    return this.props.isLogin ? <AppContainer/> : <LoginContainer/>
  }
}

const mapDispatchToProps = (dispatch: Dispatch):DispatchProps => ({
  checkLogin: () => dispatch(LoginActions.checkIsLogin()),
  checkUserRole: (callback) => dispatch(LoginActions.checkUserRole(callback)),
})

const mapStateToProps = (state: RootState) => ({
   isLogin: state.login.isLogin,
  });
export default connect(mapStateToProps, mapDispatchToProps)(ReduxNavigation);

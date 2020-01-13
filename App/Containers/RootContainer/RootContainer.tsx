import * as React from "react";
import { StatusBar, View } from "react-native";
import { connect } from "react-redux";
import ReduxPersist from "../../Config/ReduxPersist";
import ReduxNavigation from "../../Navigation/ReduxNavigation";
import { StartupActions } from "../../Reducers/StartupReducers";

// Styles
import styles from "./RootContainerStyles";
import { NavigationScreenProps } from "react-navigation";

interface OwnProps {
  startup: () => void;
}

interface State {

}
export type Props = OwnProps & NavigationScreenProps;

export class RootContainer extends React.Component<Props, State> {
  public componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }
  }

  public render() {
    console.log("root", this.props.navigation);
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ReduxNavigation />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any): Props => ({
  startup: () => dispatch(StartupActions.startup()),
});

export default connect(null, mapDispatchToProps)(RootContainer);

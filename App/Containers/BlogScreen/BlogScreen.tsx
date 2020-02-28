import { Container } from "native-base";
import React from "react";
import { FlatList } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import BottomBar from "../../Components/BottomBar";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { Blogs } from "../../Lib/BlogData";
import { BottomBarBtns } from "../../Types/BottomBar";
import { WebView } from "react-native-webview";
import { connect, Dispatch } from "react-redux";
import { BottomBarActions } from "../../Reducers/BottomBarReducer";

export interface DispatchProps {
    selectBottomTab: (tab: BottomBarBtns) => void;
}

export type Props = NavigationScreenProps & DispatchProps;

class BlogScreen extends React.Component<Props>{
    public componentDidMount() {
        this.props.selectBottomTab(BottomBarBtns.BLOGS);
    }
    public render() {
        return (
            <Container>
                {/* <CommonHeader title={"Blogs"}/> */}
                 <WebView
                source={{ uri: 'https://www.hiphopstreets.com/Blog' }}
            // style={{marginTop: 20}}
            />
            <BottomBar navigation={this.props.navigation}/>
            </Container>
        )
    }
}

export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    selectBottomTab: (btnName) => dispatch(BottomBarActions.setSelectedTab(btnName)),
})

export default connect(null, mapDispatchToProps)(BlogScreen);
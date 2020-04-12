import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
// var PushNotification = require("react-native-push-notification");

export default class PushNotifContainer extends Component{
    componentDidMount(){
        
      PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
              console.log("token firebase", token)
            },
          
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
              console.log("notification", notification);
          
              // process the notification here
          
              // required on iOS only 
            //   notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // Android only
            senderID: "591629993468",
            // iOS only
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          });
    }

    render(){
        return null;
    }
}
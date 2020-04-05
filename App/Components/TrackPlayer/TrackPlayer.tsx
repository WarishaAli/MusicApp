// libs
import RNTrackPlayer, { Track } from 'react-native-track-player';
import React from "react";
import { connect } from 'react-redux';
import { SongsActions } from '../../Reducers/SongsReducer';
import { Songs } from '../../Lib/PlaylistTypes';
import { transformSongObject } from '../../Lib/SongQueueHelper';
import AsyncStorage from '@react-native-community/async-storage';

export interface DispatchProps {
    setSong: (song: Songs) => void;
    showPlay: (playing: boolean) => void;
    isPlaying: (playing: boolean) => void;
}

export type Props = DispatchProps;

export const HAS_INSTANCE = "hasInstance";

class TrackPlayer extends React.Component<Props> {
    /** A wrapper API around RNTrackPlayer
     *
     * This API simplifies using RNTrackPlayer by exposing methods to do common things.
     */
    private static instance: TrackPlayer

 
    public async componentDidMount() {
        RNTrackPlayer.addEventListener("remote-pause", (event) => {
            console.log("#DEBUG remote pause #", event);
            RNTrackPlayer.pause();
        });

        // RNTrackPlayer.addEventListener("remote-stop", () => {
        //     console.log("#DEBUG remote stop #");
        //     RNTrackPlayer.destroy();
        // });

        RNTrackPlayer.addEventListener("remote-play", (event) => {
            console.log("#DEBUG remote play #", event);
            RNTrackPlayer.play();
        });
        RNTrackPlayer.addEventListener("playback-track-changed", async (event) => {
            console.log("#DEBUG track changed #", event);
            let  trackId = await RNTrackPlayer.getCurrentTrack();
            let song = await RNTrackPlayer.getTrack(trackId);
            this.props.setSong(transformSongObject( song));
            console.log("object transform", transformSongObject(song));
            console.log("at track changedddd", trackId, await RNTrackPlayer.getTrack(trackId));
        });
        RNTrackPlayer.addEventListener("playback-state", (event) => {
            console.log("#DEBUG state changed", event, event.state);
            if(event.state === 3 || event.state === 6){
                this.props.showPlay(true);
                this.props.isPlaying(true);
            } else if(event.state === 2){
                this.props.showPlay(false);
                this.props.isPlaying(false);
            } 
            // else if(event.state === 1 || event.state === 8){
            //     this.init();
            // }
            else{

            }
        });
        RNTrackPlayer.addEventListener("remote-next", (event) => {
            RNTrackPlayer.skipToNext();
        });
        RNTrackPlayer.addEventListener("remote-previous", () => {
            RNTrackPlayer.skipToPrevious();
        })
        const b = await RNTrackPlayer.getState().then((item) => {
            // console.log("player state", item, item !== 3, typeof(item));
            if (!TrackPlayer.instance) {
                item !== 3 && this.init();
            }
        })
       
    }


    public async init() {
        // set up the player so we can use it
        RNTrackPlayer.setupPlayer({
            iosCategoryMode: 'spokenAudio',
            maxCacheSize: 5000
        })

        // add support for capabilities
        const capabilities = [
            RNTrackPlayer.CAPABILITY_PLAY,
            RNTrackPlayer.CAPABILITY_PAUSE,
            RNTrackPlayer.CAPABILITY_SEEK_TO,
            // RNTrackPlayer.CAPABILITY_STOP,
            RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ]

        // list of options for the player
        const options = {
            stopWithApp: true,
            // An array of media controls capabilities
            capabilities,
            // An array of capabilities that will show up when the notification is in the compact form
            compactCapabilities: capabilities,
            //capabilities for notification bar
            notificationCapabilities: capabilities
        }

        // update the options
        RNTrackPlayer.updateOptions(options);
        // const a = await AsyncStorage.setItem(HAS_INSTANCE, "true");
    }
    public render() {
        
        return null
    }
}

export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setSong: (song) => dispatch(SongsActions.setSong(song)),
    showPlay: (playing) => dispatch(SongsActions.showPlaying(playing)),
    isPlaying: (playing) => dispatch(SongsActions.setIsPlaying(playing)),
})

export default connect (null, mapDispatchToProps) (TrackPlayer)
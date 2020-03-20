// libs
import RNTrackPlayer, { Track } from 'react-native-track-player';
import React from "react";
import { connect } from 'react-redux';
import { SongsActions } from '../../Reducers/SongsReducer';
import { Songs } from '../../Lib/PlaylistTypes';
import { transformSongObject } from '../../Lib/SongQueueHelper';

export interface DispatchProps {
    setSong: (song: Songs) => void;
}

export type Props = DispatchProps;

class TrackPlayer extends React.Component<Props> {
    /** A wrapper API around RNTrackPlayer
     *
     * This API simplifies using RNTrackPlayer by exposing methods to do common things.
     */
    private static instance: TrackPlayer

    // this allows us to get a current instance, or make an instance of the player
    // and stops us reinitialising the player
    // static getInstance() {
    //     if (!TrackPlayer.instance) {
    //         TrackPlayer.instance = new TrackPlayer("")
    //         TrackPlayer.instance.init()
    //         return TrackPlayer.instance
    //     }

    //     return TrackPlayer.instance
    // }

    public componentDidMount() {
        RNTrackPlayer.addEventListener("remote-pause", (event) => {
            console.log("#DEBUG remote pause #", event);
            RNTrackPlayer.pause();
        });

        RNTrackPlayer.addEventListener("remote-stop", () => {
            console.log("#DEBUG remote stop #");
            RNTrackPlayer.destroy();
        });

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
        if (!TrackPlayer.instance) {
            this.init();
        }
    }


    public init() {
        // set up the player so we can use it
        RNTrackPlayer.setupPlayer({
            iosCategoryMode: 'spokenAudio'
        })

        // add support for capabilities
        const capabilities = [
            RNTrackPlayer.CAPABILITY_PLAY,
            RNTrackPlayer.CAPABILITY_PAUSE,
            RNTrackPlayer.CAPABILITY_SEEK_TO,
            RNTrackPlayer.CAPABILITY_STOP,
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
        RNTrackPlayer.updateOptions(options)
    }
    public render() {
        return null
    }
}

export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setSong: (song) => dispatch(SongsActions.setSong(song))
})

export default connect (null, mapDispatchToProps) (TrackPlayer)
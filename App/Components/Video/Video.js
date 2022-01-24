import React, { Component } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes/';
import BottomControls from './BottomControls';
import VideoPlayer from 'react-native-true-sight';
import Common, { authTokenUri } from '../../Utils/Common';

import Log from '../../Utils/Log';
const log = new Log('CustomMessages/ChatVideo');

const renderLoader = () => (
  <ActivityIndicator color={Colors.video.activityIndicator} size="large" />
);

export default class Video extends Component {
  /*
   * Supported source prop formats:
   *  1. full web-url, e.g.: 'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
   *  2. local file path relative from web folder, e.g. 'assets/video/video.mp4'
   *  window.postMessage('complete');
   */
  static propTypes = {
    source: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    onToggleFullscreen: PropTypes.func,
    fullscreenMode: PropTypes.bool,
    initialPosition: PropTypes.number,
    autoStart: PropTypes.bool,
    useIOSNativeFullscreen: PropTypes.bool,
  };
  static defaultProps = {
    initialPosition: 0,
    autoStart: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      source: null,
    };
    this.player = React.createRef();
  }

  // TODO: Needs to be refactored
  UNSAFE_componentWillMount() {
    const { source } = this.props;
    // Check if it's a local or remote/web file
    // if it's a web url...
    let urlPattern = /^https?:\/\//i;
    if (urlPattern.test(source)) {
      // attach auth tokens
      const authTokenUrl = authTokenUri(source);
      this.setState({ source: authTokenUrl });
    } else {
      // if it's a local file, check if the filepath exists...
      RNFS.exists(source).then((exists) => {
        if (exists) {
          // ...set the source instantly
          this.setState({ source });
        } else {
          // If the file doesn't exist, find the absolute file-path first
          if (Platform.OS === 'ios') {
            this.baseDir = RNFetchBlob.fs.dirs.MainBundleDir + source;
            // on android, the video needs to be decompressed first
            // TODO: Maybe it's possible to use the Android Expansion File for this? -> see: https://github.com/react-native-community/react-native-video#android-expansion-file-usage
          } else if (Platform.OS === 'android') {
            // destination path for uncompressed video, this will be overridden each time
            const dest = `${RNFS.DocumentDirectoryPath}/tempVideo.mp4`;
            // decompress and copy to destination...
            RNFS.copyFileAssets(source, dest)
              .then(() => {
                this.setState({ source: dest });
              })
              .catch((err) => {
                log.warn(
                  'Could not uncompress video from local android assets: ' +
                    err.toString(),
                );
              });
          }
        }
      });
    }
  }

  render() {
    let width = this.props.width;
    let height = this.props.height;
    if (!height) {
      height = 0.5625 * width;
    }
    let style = { width, height };
    if (this.props.fullscreenMode) {
      style = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    }
    return (
      <View style={[style, { backgroundColor: 'black' }]}>
        {this.renderVideo()}
      </View>
    );
  }

  // Callback to be handled when fullscreen is closed
  closeFullscreenCallback(currentTime, paused) {
    this.player.current.setPosition(currentTime);
    if (!paused) {
      this.setPlayerPlaying();
    }
  }

  getPlayerCurrentTime() {
    return this.player.current.state.currentTime;
  }

  getPlayerPaused() {
    return this.player.current.state.isPaused;
  }

  setPlayerPaused() {
    this.player.current.setPaused();
  }

  setPlayerPlaying() {
    this.player.current.setPlaying();
  }

  renderVideo() {
    if (this.state.source) {
      const bottomControls = (props) => <BottomControls onToggleFullscreen={onToggleFullscreen} {...props} />;
      // TODO: Maybe we can pull things out of render for performance
      let onToggleFullscreen = () => {
        let paused = this.getPlayerPaused();
        let currentTime = this.getPlayerCurrentTime();
        // Pause current player
        this.setPlayerPaused();
        // then call fullscreen callback with current time
        this.props.onToggleFullscreen(
          this.props.source,
          currentTime,
          paused,
          (currentTime, paused) =>
            this.closeFullscreenCallback(currentTime, paused),
        );
      };
      let controlProps = {
        onToggleFullscreen,
        inFullscreen: this.props.fullscreenMode,
      };
      return (
        <VideoPlayer
          ref={this.player}
          bottomControlsBar={bottomControls}
          autoStart={this.props.autoStart}
          source={{uri: this.state.source}}
          initialPosition={this.props.initialPosition}
          middleControlsBarProps={controlProps}
          loader={renderLoader}
        />
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {renderLoader()}
        </View>
      );
    }
  }
}

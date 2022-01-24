import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import I18n from '../../I18n/I18n';
import Video from './Video.js';
import { Metrics } from '../../Themes';

// TODO: define proptypes
export default class FullscreenVideo extends Component {
  state = {
    horizontalMode: false,
  };

  constructor(props) {
    super(props);
    this.player = React.createRef();
  }

  componentDidMount() {
    // unlock to all Orientations
    // Orientation.unlockAllOrientations()
  }

  componentWillUnmount() {
    // Lock Ortientation to protrait again when leaving fullscreen-player!
    // Orientation.lockToPortrait()
  }

  render() {
    const { source, initialPosition, paused, closeFullscreenCallback } =
      this.props;
    const { horizontalMode } = this.state;
    const orientationStyle = {
      width: horizontalMode ? Metrics.screenHeight : Metrics.screenWidth,
      height: horizontalMode ? Metrics.screenWidth : Metrics.screenHeight,
      transform: horizontalMode ? [{ rotate: '90deg' }] : [],
    };
    return (
      <View style={[styles.mask]}>
        <View style={orientationStyle}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Video
              ref={this.player}
              orientation={'LANDSCAPE'}
              initialPosition={initialPosition}
              fullscreenMode
              autoStart={!paused}
              onToggleFullscreen={() => {
                closeFullscreenCallback(
                  this.player.current.getPlayerCurrentTime() + 1,
                  this.player.current.getPlayerPaused(),
                );
                this.props.onClose();
              }}
              source={source}
            />
          </View>
          <View style={styles.controls}>
            <Button
              buttonStyle={[
                styles.button,
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  padding: 0,
                  paddingHorizontal: 0,
                },
              ]}
              titleStyle={styles.buttonTitle}
              iconRight
              icon={
                <Icon
                  name="rotate-3d"
                  type="material-community"
                  color="#fff"
                  size={30}
                />
              }
              onPress={() =>
                this.setState({
                  horizontalMode: !this.state.horizontalMode,
                })
              }
            />
            <Button
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              iconRight
              icon={
                <Icon name="md-close" type="ionicon" color="#fff" size={30} />
              }
              title={I18n.t('Common.close')}
              onPress={() => {
                closeFullscreenCallback(
                  this.player.current.getPlayerCurrentTime() + 1,
                  this.player.current.getPlayerPaused(),
                );
                this.props.onClose();
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonTitle: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 5,
  },
});

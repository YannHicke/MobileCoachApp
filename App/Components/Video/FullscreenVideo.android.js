
import React, { Component } from 'react'

import {
  StyleSheet,
  View
} from 'react-native'
import CloseButton from '../CloseButton'
import I18n from '../../I18n/I18n'
import Video from './Video.js'
import Orientation from 'react-native-orientation'

// TODO: define proptypes
export default class FullscreenVideo extends Component {
  state = {
    orientation: 'PORTRAIT'
  }

  componentDidMount () {
    // unlock to all Orientations
    Orientation.unlockAllOrientations()
  }

  componentWillUnmount () {
    // Lock Ortientation to protrait again when leaving fullscreen-player!
    Orientation.lockToPortrait()
  }

  render () {
    const { source, initialPosition, paused, closeFullscreenCallback } = this.props
    // var {height, width} = Dimensions.get('window')
    return (
      <View style={styles.mask}>
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Video ref='player' orientation={this.state.orientation} initialPosition={initialPosition} fullscreenMode autoStart={!paused} onToggleFullscreen={() => {
            closeFullscreenCallback(this.refs.player.getCurrentTime() + 1, this.refs.player.getPaused())
            this.props.onClose()
          }} source={source} />
        </View>
        <CloseButton
          onPress={() => {
            closeFullscreenCallback(this.refs.player.getCurrentTime() + 1, this.refs.player.getPaused())
            this.props.onClose()
          }}
          title={I18n.t('Common.close')}
        />
      </View>
    )
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
    justifyContent: 'center'
  }
})

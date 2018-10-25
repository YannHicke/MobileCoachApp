
import React, { Component } from 'react'

import { View } from 'react-native'
import Video from 'react-native-video'

// TODO: define proptypes
export default class FullscreenVideo extends Component {
  componentDidMount () {
    this.player.presentFullscreenPlayer()
  }

  render () {
    const { source, closeFullscreenCallback, onClose } = this.props
    return (
      <View style={{overflow: 'hidden'}}>
        <Video source={{uri: source}}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}
          onError={this.videoError}
          onFullscreenPlayerDidDismiss={
            () => {
              closeFullscreenCallback()
              onClose()
            }
          }
        />
      </View>
    )
  }
}

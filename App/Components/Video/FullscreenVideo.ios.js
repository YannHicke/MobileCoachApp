import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import Video from 'react-native-video'

import BlurView from '../BlurView'

import Log from '../../Utils/Log'
const log = new Log('Components/Video/FullscreenVideo')

// TODO: define proptypes
export default class FullscreenVideo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showIndicator: true
    }
  }

  render () {
    const { showIndicator } = this.state
    const { source, closeFullscreenCallback, onClose } = this.props
    return (
      <BlurView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {showIndicator ? (
            <ActivityIndicator size='large' color='#fff' />
          ) : null}
        </View>
        <View pointerEvents='none' style={{ overflow: 'hidden' }}>
          <Video
            source={{ uri: source }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref
            }}
            fullscreen
            onError={(e) => {
              log.warn(
                'Error while trying to open fullscreen-video',
                JSON.stringify(e)
              )
              onClose()
            }}
            onLoad={() => {
              this.player.presentFullscreenPlayer()
              this.setState({ showIndicator: false })
            }}
            onFullscreenPlayerDidDismiss={() => {
              closeFullscreenCallback()
              onClose()
            }}
          />
        </View>
      </BlurView>
    )
  }
}

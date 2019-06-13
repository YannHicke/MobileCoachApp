import React, { Component } from 'react'
import {
  Image,
  TouchableWithoutFeedback,
  Alert,
  View
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import ResponsiveImage from '../Components/ResponsiveImage'
import {connect} from 'react-redux'

class ImageFakeContainer extends Component {
  render () {
    const {source} = this.props
    return (
      <TouchableWithoutFeedback onPress={() => this.onPress()}>
        <View style={{flex: 1}}>
          {isIphoneX() && this.props.showSpacer ? <Image resizeMode='stretch' style={{width: '100%', height: 50}} source={require('../Images/FakeScreens/gradient.jpg')} /> : null}
          <ResponsiveImage source={source} />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  onPress () {
    Alert.alert(
      '🚧 In Bearbeitung',
      '',
      [
        {text: 'OK', onPress: () => null}
      ]
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentScreen: state.guistate.currentScreen
  }
}

export default connect(mapStateToProps)(ImageFakeContainer)

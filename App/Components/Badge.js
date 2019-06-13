import React, { Component } from 'react'
import { ViewPropTypes, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import * as Animatable from 'react-native-animatable'
import { Badge } from 'react-native-elements'

import { Colors } from '../Themes/'

export const strongPulse = {
  0: {
    scale: 1
  },
  0.5: {
    scale: 1.3
  },
  1: {
    scale: 1
  }
}

Animatable.initializeRegistryWithDefinitions({
  strongPulse
})

class NewMessagesBadge extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style
  }

  render () {
    const allUnreadMessages =
      this.props.unreadMessages + this.props.unreadDashboardMessages
    if (allUnreadMessages > 0) {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <Animatable.View
            style={this.props.containerStyle}
            iterationDelay={1000}
            iterationCount='infinite'
            useNativeDriver
          >
            <Animatable.View
              animation='bounceIn'
              duration={600}
              useNativeDriver
            >
              <Badge
                value={allUnreadMessages <= 99 ? allUnreadMessages : '99+'}
                badgeStyle={badgeStyles.badgeStyle}
                textStyle={badgeStyles.textStyle}
              />
            </Animatable.View>
          </Animatable.View>
        </TouchableWithoutFeedback>
      )
    } else return null
  }
}

export const badgeStyles = {
  badgeStyle: {
    backgroundColor: Colors.badge.background,
    borderWidth: 0
  },
  textStyle: {
    color: Colors.main.appBackground
  }
}

const mapStateToProps = (state) => {
  return {
    unreadMessages: state.guistate.unreadMessages,
    unreadDashboardMessages: state.storyProgress.unreadDashboardMessages
  }
}

export default connect(mapStateToProps)(NewMessagesBadge)

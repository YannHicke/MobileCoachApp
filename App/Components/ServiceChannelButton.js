import React, { Component } from 'react'

import NavBarButton from './NavBarButton'

export default class ServiceChannelButton extends Component {
  handlePress = () => {
    const { onPress } = this.props
    onPress()
  }

  render () {
    const { badgeCounter } = this.props
    return (
      <NavBarButton
        badgeCounter={badgeCounter}
        onPress={this.handlePress}
        position='right'
        icon='email'
        iconType='material-community'
      />
    )
  }
}

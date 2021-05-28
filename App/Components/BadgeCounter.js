import React, { Component } from 'react';
import { ViewPropTypes } from 'react-native';

// import PropTypes from 'prop-types'
import * as Animatable from 'react-native-animatable';
import { Badge } from 'react-native-elements';

import { Colors } from '../Themes/';

export const strongPulse = {
  0: {
    scale: 1,
  },
  0.5: {
    scale: 1.3,
  },
  1: {
    scale: 1,
  },
};

Animatable.initializeRegistryWithDefinitions({
  strongPulse,
});

export default class BadgeCounter extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
  };

  render() {
    const allUnreadMessages = this.props.value;

    return (
      <Animatable.View
        style={[badgeStyles.badgeWrapperStyle, this.props.containerStyle]}
        animation="strongPulse"
        iterationDelay={1000}
        iterationCount="infinite"
        useNativeDriver>
        <Animatable.View animation="bounceIn" duration={600} useNativeDriver>
          <Badge
            value={allUnreadMessages <= 99 ? allUnreadMessages : '99+'}
            badgeStyle={badgeStyles.badgeStyle}
            textStyle={badgeStyles.textStyle}
          />
        </Animatable.View>
      </Animatable.View>
    );
  }
}

export const badgeStyles = {
  badgeWrapperStyle: {
    position: 'absolute',
    top: 5,
    left: 0,
  },
  badgeStyle: {
    backgroundColor: Colors.badge.background,
    borderWidth: 0,
  },
  textStyle: {
    color: Colors.main.appBackground,
  },
};

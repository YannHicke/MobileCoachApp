import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import BadgeCounter from './BadgeCounter';

export default class NavButton extends Component {
  render() {
    const { icon, onPress, position, iconStyle, iconType, badgeCounter } =
      this.props;
    const type = iconType || 'ionicon';
    const containerStyle =
      this.props.containerStyle === undefined ? {} : this.props.containerStyle;
    const style =
      position === 'left'
        ? {
            position: 'relative',
            paddingLeft: 15,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }
        : {
            position: 'relative',
            paddingLeft: 10,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
          };

    return (
      <TouchableOpacity
        style={[style, { ...containerStyle }]}
        onPress={onPress}>
        <Icon size={35} name={icon} type={type} {...iconStyle} />
        {badgeCounter ? <BadgeCounter value={badgeCounter} /> : null}
      </TouchableOpacity>
    );
  }
}

NavButton.defaultProps = {
  iconStyle: {
    size: 25,
    color: '#FFFFFF',
  },
};

NavButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconStyle: PropTypes.object,
};

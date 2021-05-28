import React, { PureComponent } from 'react';
import { Text, StyleSheet, ViewPropTypes } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// import {CategoryDefinitions} from './TaskMetrics'
import { ApplicationStyles, Colors } from '../Themes';

class PMButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    secondary: PropTypes.bool,
    title: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    titleStyle: Text.propTypes.style,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    secondary: false,
  };

  render() {
    const {
      onPress,
      secondary,
      iconRight,
      title,
      containerStyle,
      titleStyle,
      icon,
      disabled,
    } = this.props;
    let iconComponent = icon;
    if (typeof icon === 'string' || icon instanceof String) {
      iconComponent = (
        <FontAwesome5
          name={icon}
          size={14}
          style={iconRight ? { marginLeft: 6 } : { marginRight: 6 }}
          color={
            secondary
              ? Colors.buttons.common.background
              : Colors.buttons.common.text
          }
        />
      );
    }
    const viewStyle = [
      styles.container,
      secondary ? null : ApplicationStyles.shadowMedium,
      {
        backgroundColor: secondary
          ? 'transparent'
          : Colors.buttons.common.background,
      },
      containerStyle,
    ];
    const textStyle = [
      styles.title,
      {
        color: secondary
          ? Colors.buttons.common.background
          : Colors.buttons.common.text,
      },
      titleStyle,
    ];
    return (
      <Button
        onPress={onPress}
        disabled={disabled}
        buttonStyle={viewStyle}
        icon={iconComponent}
        iconRight={iconRight}
        color={Colors.buttons.common.background}
        titleStyle={textStyle}
        title={title.toUpperCase()}
        type={secondary ? 'clear' : 'solid'}
        disabledStyle={{
          backgroundColor: Colors.buttons.common.disabled,
        }}
        disabledTitleStyle={{
          color: Colors.buttons.common.disabledText,
        }}
      />
    );
  }
}

// <TouchableOpacity onPress={disabled ? null : onPress} disabled={disabled}>
// <View
//   style={
//     styles.container}
// >
//   {icon && !iconRight ? <FontAwesome5
//     name={icon}
//     size={14}
//     style={{marginRight: 5}}
//     color={secondary ? Colors.buttons.common.background : Colors.buttons.common.text}
//   /> : null}
//   <Text style={textStyle} numberOfLines={1}>{title.toUpperCase()}</Text>
//   {icon && iconRight ? <FontAwesome5
//     name={icon}
//     size={14}
//     style={{marginLeft: 5}}
//     color={secondary ? Colors.buttons.common.background : Colors.buttons.common.text}
//   /> : null}
// </View>
// </TouchableOpacity>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  title: {
    fontSize: 14,
  },
  disabled: {
    backgroundColor: Colors.buttons.common.disabled,
  },
});

export default PMButton;

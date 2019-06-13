import React, { PureComponent } from 'react'
import { Text, StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import Common from '../../Utils/Common'
import { Icon } from 'react-native-elements'
import hexToRgba from 'hex-to-rgba'
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { Colors } from '../../Themes'

class ModalInputButton extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    textStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    focused: PropTypes.bool,
    invalid: PropTypes.bool,
    iconLeft: PropTypes.node,
    iconRight: PropTypes.node
  }

  static defaultProps = {
    iconRight: (
      <Icon
        type='font-awesome'
        size={22}
        name='caret-down'
        color={hexToRgba(Colors.main.paragraph, 0.5)}
        containerStyle={{ marginLeft: 5 }}
      />
    )
  }

  render () {
    const {
      value,
      onPress,
      focused,
      invalid,
      iconLeft,
      iconRight,
      containerStyle
    } = this.props
    const style = [styles.inputContainer, containerStyle]
    if (invalid) style.push(styles.invalid)
    if (focused) style.push(styles.focus)
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        {iconLeft}
        {Common.isBlank(value) ? this.renderPlaceholder() : this.renderValue()}
        {iconRight}
      </TouchableOpacity>
    )
  }

  renderValue () {
    const { value, textStyle } = this.props
    return (
      <Text numberOfLines={1} style={[styles.inputText, textStyle]}>
        {value}
      </Text>
    )
  }

  renderPlaceholder () {
    const { placeholder, placeholderStyle } = this.props
    return (
      <Text
        numberOfLines={1}
        style={[styles.placeholderText, placeholderStyle]}
      >
        {placeholder}
      </Text>
    )
  }
}

export default ModalInputButton

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.main.grey3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 0,
    paddingHorizontal: 10,
    height: 56
  },
  placeholderText: {
    fontSize: 14,
    color: 'rgba(35, 38, 43, 0.5)',
    flex: 1
  },
  inputText: {
    color: Colors.main.paragraph,
    fontSize: 16,
    flex: 1
  },
  focus: {
    borderColor: Colors.buttons.common.background
  },
  invalid: {
    borderColor: Colors.buttons.common.invalid
  }
})

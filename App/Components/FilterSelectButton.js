import React, { PureComponent } from 'react'
import { StyleSheet, ViewPropTypes, Platform, View } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import PropTypes from 'prop-types'

import { Colors } from '../Themes'
import { normalize } from '../Utils/Common'

class FilterSelectButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    color: PropTypes.string
  }

  static defaultProps = {
    defaultIndex: 0,
    items: [],
    onChange: () => null,
    color: Colors.main.primary
  }

  constructor (props) {
    super(props)
    this.onPress = this.onPress.bind(this)
    this.state = {
      selectedIndex: props.defaultIndex
    }
  }

  onPress (index) {
    this.props.onChange(index)
    this.setState({ selectedIndex: index })
  }

  render () {
    const { items, color, containerStyle } = this.props
    const { selectedIndex } = this.state
    return (
      <View>
        <ButtonGroup
          type='clear'
          onPress={(index) => this.onPress(index)}
          buttons={items}
          selectedIndex={selectedIndex}
          containerStyle={[
            styles.container,
            { borderColor: color },
            containerStyle
          ]}
          innerBorderStyle={{ width: 1, color: color }}
          selectedButtonStyle={{ backgroundColor: color }}
          textStyle={[styles.title, { color: color }]}
        />
        {Platform.OS === 'android' ? (
          <View
            pointerEvents='none'
            style={[styles.androidLayoutFix, { borderColor: color }]}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  androidLayoutFix: {
    borderWidth: 1,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        borderWidth: 1
      }
    })
  },
  title: {
    fontSize: normalize(11)
  },
  titleActive: {
    color: '#fff'
  }
})

export default FilterSelectButton

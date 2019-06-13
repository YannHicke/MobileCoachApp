import React, { PureComponent, Fragment } from 'react'
import {
  View,
  StyleSheet,
  Picker,
  Text,
  Platform,
  ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types'

import ModalInputContainer from '../../Components/Forms/ModalInputContainer'
import ModalInputButton from '../../Components/Forms/ModalInputButton'
import { Colors } from '../../Themes'
// import I18n from '../../I18n/I18n'
// import Common from '../../Utils/Common'

class PickerInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    items: PropTypes.array.isRequired,
    initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    containerStyle: ViewPropTypes.style,
    label: PropTypes.string,
    labelStyle: Text.propTypes.style,
    textStyle: Text.propTypes.style,
    placeholder: PropTypes.string,
    // Android only: 'dialog', 'dropdown'
    mode: PropTypes.string,
    iconRight: PropTypes.node,
    iconLeft: PropTypes.node
  }

  static defaultProps = {
    onChange: () => null,
    mode: 'dropdown',
    placeholder: 'Select a value',
    items: []
  }

  constructor (props) {
    super(props)
    let initialIndex = 0
    if (props.initialValue) {
      initialIndex = props.items.findIndex(
        (item) => item.value === props.initialValue
      )
    }
    this.state = {
      currentIndex: initialIndex,
      // we need to store currently selected value as well..
      selectedIndex: initialIndex,
      modalVisible: false,
      invalid: false
    }
    this.renderButton = this.renderButton.bind(this)
  }

  renderButton (onPress) {
    const {
      items,
      placeholder,
      label,
      labelStyle,
      textStyle,
      containerStyle,
      iconRight,
      iconLeft
    } = this.props
    const { selectedIndex, modalVisible } = this.state
    return (
      <Fragment>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
        <ModalInputButton
          textStyle={textStyle}
          containerStyle={[styles.inputContainer, containerStyle]}
          onPress={onPress}
          value={items[selectedIndex] && items[selectedIndex].label}
          placeholder={placeholder}
          focused={modalVisible}
          iconRight={iconRight}
          iconLeft={iconLeft}
          // invalid={invalid}
        />
      </Fragment>
    )
  }

  handleChange (value) {
    this.setState({
      currentWheelValue: value
    })
  }

  render () {
    const { selectedIndex, modalVisible } = this.state
    const { items } = this.props
    if (Platform.OS === 'ios') {
      return (
        <ModalInputContainer
          renderButton={this.renderButton}
          onSubmit={() => {
            const { currentIndex } = this.state
            this.setState({
              selectedIndex: currentIndex
            })
            this.props.onChange(items[currentIndex].value)
          }}
          onShow={() =>
            this.setState({
              modalVisible: true,
              currentIndex: selectedIndex
            })
          }
          onHide={() => this.setState({ modalVisible: false })}
        >
          <View style={{ height: 200, justifyContent: 'center' }}>
            {modalVisible ? this.renderPicker() : null}
          </View>
        </ModalInputContainer>
      )
    } else {
      return <View>{this.renderAndroidPicker()}</View>
    }
  }

  renderPicker () {
    const { items, mode, textStyle, onChange } = this.props
    const { currentIndex } = this.state
    if (items.length > 0) {
      return (
        <Picker
          selectedValue={items[currentIndex].value}
          style={[
            styles.pickerStyle,
            Platform.OS === 'android' ? textStyle : null
          ]}
          onValueChange={(itemValue, itemIndex) => {
            if (Platform.OS === 'ios') {
              this.setState({ currentIndex: itemIndex })
            } else {
              this.setState({
                currentIndex: itemIndex,
                selectedIndex: itemIndex
              })
              onChange(items[itemIndex].value)
            }
          }}
          mode={mode}
        >
          {items.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.label} value={item.value} />
            )
          })}
        </Picker>
      )
    }
  }

  renderAndroidPicker () {
    const { label, labelStyle, containerStyle } = this.props
    return (
      <Fragment>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
        <View style={[styles.inputContainer, containerStyle]}>
          {this.renderPicker()}
        </View>
      </Fragment>
    )
  }
}

export default PickerInput

const styles = StyleSheet.create({
  pickerStyle: {
    justifyContent: 'center',
    ...Platform.select({
      android: {
        color: Colors.main.paragraph
      }
    })
  },
  inputContainer: {
    justifyContent: 'center',
    backgroundColor: Colors.main.grey3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 0,
    paddingHorizontal: 10,
    height: 56
  },
  placeholderText: {
    color: 'rgba(35, 38, 43, 0.5)',
    textAlign: 'left'
  },
  inputText: {
    color: Colors.main.paragraph,
    fontSize: 16,
    textAlign: 'left'
  },
  label: {
    fontSize: 14,
    color: 'rgba(35, 38, 43, 0.8)',
    marginBottom: 5
  }
})

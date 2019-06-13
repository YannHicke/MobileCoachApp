import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import DatePicker from 'react-native-datepicker'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import hexToRgba from 'hex-to-rgba'
import { Icon, ButtonGroup } from 'react-native-elements'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu'

import { Colors } from '../../Themes'
import I18n from '../../I18n/I18n'
import Common from '../../Utils/Common'
import moment from 'moment'
import { withFormikControl } from 'react-native-formik'

const placeholderTextColor = 'rgba(35, 38, 43, 0.5)'
const DatePickerFormikWrapper = withFormikControl(DatePicker)

export class FormItemText extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    icon: PropTypes.string,
    defaultValue: PropTypes.string,
    numericOnly: PropTypes.bool,
    invalid: PropTypes.bool,
    invalidMessage: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    onChange: () => null
  }

  constructor (props) {
    super(props)
    this.state = {
      focused: false,
      text: props.defaultValue ? props.defaultValue : ''
    }
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText (text) {
    const { numericOnly, onChange, setFieldValue } = this.props
    if (numericOnly) {
      let newText = ''
      let numbers = '0123456789,.'
      let containsSeperator = false
      for (let i = 0; i < text.length; i++) {
        if (numbers.indexOf(text[i]) > -1) {
          // Check for multiple komma / dots
          if (['.', ','].includes(text[i])) {
            // only add if its the first seperator
            if (!containsSeperator) {
              newText = newText + text[i]
              containsSeperator = true
            }
            // If its a number, just add is
          } else newText = newText + text[i]
        }
      }
      // use dot as delimeter
      text = newText.replace(',', '.')
    }
    this.setState({ text })
    if (onChange) onChange(text)
    if (setFieldValue) setFieldValue(text)
  }

  render () {
    const {
      label,
      placeholder,
      keyboardType,
      unit,
      icon,
      containerStyle,
      inputStyle,
      numberOfLines,
      multiline,
      invalid,
      name,
      value,
      defaultValue,
      invalidMessage,
      labelStyle,
      iconRight,
      disabled
    } = this.props

    const { focused } = this.state
    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {unit ? (
              <Text style={styles.placeholderText}>{` (${unit})`}</Text>
            ) : null}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            editable={disabled !== true}
            name={name}
            value={value || defaultValue}
            placeholderTextColor={placeholderTextColor}
            underlineColorAndroid='transparent'
            keyboardType={keyboardType}
            returnKeyType='done'
            style={[
              styles.inputContainer,
              { flex: 1 },
              styles.inputText,
              inputStyle,
              disabled ? styles.disabled : null,
              invalid ? styles.invalid : null,
              focused ? styles.focus : null,
              icon && !iconRight ? styles.containerWithIcon : null
            ]}
            placeholder={placeholder}
            // onChangeText={text => this.onChangeText(text)}
            onChangeText={this.onChangeText}
            // value={this.state.text}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
          {icon ? (
            <FontAwesome5
              name={icon}
              size={18}
              style={[
                styles.icon,
                iconRight ? { left: 'auto', right: 10 } : null
              ]}
              color={placeholderTextColor}
            />
          ) : null}
        </View>
        {invalid ? (
          <Text
            style={[
              styles.label,
              {
                marginTop: 5,
                marginBottom: 0,
                color: Colors.main.error
              }
            ]}
          >
            {invalidMessage}
          </Text>
        ) : null}
      </View>
    )
  }

  focus = () => {
    this.input.focus()
  }

  onFocus () {
    if (this.props.onFocus) this.props.onFocus()
    this.setState({
      focused: true
    })
  }

  onBlur () {
    const { setFieldTouched } = this.props
    if (this.props.onBlur) this.props.onBlur()
    this.setState({
      focused: false
    })
    if (setFieldTouched) this.props.setFieldTouched('email')
  }
}

export class FormItemDateTime extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    mode: 'date',
    format: 'DD.MM.YYYY',
    // defaultValue: moment().format('DD.MM.YYYY'),
    onChange: () => null
  }

  constructor (props) {
    super(props)
    this.state = {
      focused: false,
      date: props.value ? props.value : props.defaultValue
    }
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  componentWillReceiveProps (props) {
    // only act on change!
    if (props.value !== this.props.value) {
      if (this.state.date !== props.value) {
        this.setState({
          date: props.value || null
        })
      }
    }
  }

  render () {
    const {
      label,
      labelStyle,
      placeholder,
      placeholderShouldCoverInitialValue,
      onChange,
      format,
      minDate,
      maxDate,
      mode,
      icon,
      containerStyle,
      textStyle,
      placeholderStyle,
      dateInputStyle,
      innerWrapperStyle,
      invalid,
      name,
      invalidMessage
    } = this.props

    const { focused, date } = this.state
    return (
      <View style={[styles.container, innerWrapperStyle]}>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
        <View style={{ justifyContent: 'center' }}>
          <DatePickerFormikWrapper
            name={name}
            onOpenModal={this.onFocus}
            onCloseModal={this.onBlur}
            disabled={this.props.disabled}
            date={date}
            mode={mode}
            is24Hour
            locale={moment.locale()}
            format={format}
            placeholder={placeholder}
            confirmBtnText={I18n.t('Common.confirm')}
            cancelBtnText={I18n.t('Common.abort')}
            minDate={minDate}
            maxDate={maxDate}
            iconComponent={<View />}
            customStyles={{
              dateInput: [
                styles.dateInput,
                dateInputStyle,
                { height: 50 },
                icon ? { paddingLeft: 21 } : null
              ],
              dateText: [styles.dateText, styles.inputText, textStyle],
              placeholderText: [
                styles.inputText,
                styles.placeholderText,
                placeholderStyle
              ],
              disabled: {
                backgroundColor: Colors.buttons.common.disabled
              },
              dateTouchBody: [
                styles.inputContainer,
                containerStyle,
                focused ? styles.focus : null
              ]
            }}
            style={[
              { width: '100%', borderRadius: 8 },
              invalid && !focused ? styles.invalid : null
            ]}
            onDateChange={(string, date) => {
              this.setState({ date })
              onChange(string, date)
              this.onBlur()
            }}
            {...this.props}
          />
          {icon ? (
            <Icon
              name={icon}
              containerStyle={{
                position: 'absolute',
                left: 7,
                marginTop: 2
              }}
              type='material-community'
              size={22}
              color={placeholderTextColor}
            />
          ) : null}
          {placeholderShouldCoverInitialValue &&
          Common.isBlank(this.props.value) ? (
            <View
              pointerEvents='none'
              style={{
                justifyContent: 'center',
                position: 'absolute',
                left: 36,
                right: 3,
                backgroundColor: Colors.main.grey3,
                ...Platform.select({
                  ios: {
                    paddingBottom: 2
                  }
                })
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  styles.placeholderText,
                  placeholderStyle
                ]}
              >
                {placeholder}
              </Text>
            </View>
          ) : null}
        </View>
        {invalid ? (
          <Text
            style={[
              styles.label,
              {
                marginTop: 5,
                marginBottom: 0,
                color: Colors.main.error
              }
            ]}
          >
            {invalidMessage}
          </Text>
        ) : null}
      </View>
    )
  }

  onFocus () {
    this.setState({
      focused: true
    })
  }

  onBlur () {
    this.setState({
      focused: false
    })
  }
}

export class FormItemButtonGroup extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.number,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => null,
    items: ['A', 'B']
  }

  constructor (props) {
    super(props)
    const { defaultValue } = props
    this.state = {
      value: defaultValue
    }
    this.onPress = this.onPress.bind(this)
  }

  onPress (selectedIndex) {
    this.setState({ value: selectedIndex })
    this.props.onChange(selectedIndex)
  }

  render () {
    const { label, labelStyle, containerStyle, items } = this.props
    const { value } = this.state
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12
          },
          containerStyle
        ]}
      >
        <View style={[{ flex: 1 }]}>
          <Text style={[styles.label, { marginBottom: 0 }, labelStyle]}>
            {label}
          </Text>
        </View>
        <ButtonGroup
          onPress={this.onPress}
          selectedIndex={value}
          buttons={items}
          buttonStyle={{ backgroundColor: '#fff' }}
          textStyle={{ fontSize: 14 }}
          selectedButtonStyle={{
            backgroundColor: Colors.main.primary
          }}
          selectedTextStyle={{ color: '#fff' }}
          containerStyle={{
            width: 110,
            borderRadius: 8,
            marginRight: 6
          }}
        />
      </View>
    )
  }
}

export class FormItemCheckbox extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => null
  }

  constructor (props) {
    super(props)
    const { defaultValue } = props
    this.state = {
      value: defaultValue || false
    }
    this.onPress = this.onPress.bind(this)
  }

  onPress () {
    this.setState({ value: !this.state.value })
    this.props.onChange(!this.state.value)
  }

  render () {
    const { label, labelStyle, containerStyle } = this.props
    const { value } = this.state
    return (
      <TouchableOpacity
        style={[styles.checkboxContainer, containerStyle]}
        onPress={this.onPress}
      >
        {label ? (
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.inputText, labelStyle]}>{label}</Text>
          </View>
        ) : null}
        <FontAwesome5
          name={value ? 'check-square' : 'square'}
          size={22}
          solid={value}
          style={styles.checkboxIcon}
          color={
            value ? Colors.buttons.common.background : hexToRgba('#23262B', 0.8)
          }
        />
      </TouchableOpacity>
    )
  }
}

export const FormItemCheckboxGroup = ({ children, containerStyle }) => (
  <View
    style={[
      styles.container,
      styles.inputContainer,
      {
        paddingVertical: 0,
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'stretch'
      },
      containerStyle
    ]}
  >
    {children.length > 1
      ? children.map((child, index) => {
        const lastChild = index === children.length - 1
        return (
          <View
            key={index}
            style={
              lastChild
                ? null
                : {
                  borderBottomWidth: 1,
                  borderBottomColor: hexToRgba('#23262B', 0.2)
                }
            }
          >
            {child}
          </View>
        )
      })
      : children}
  </View>
)

export class FormItemRadioButton extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string
  }

  static defaultProps = {
    onChange: () => null,
    formHorizontal: true
  }

  constructor (props) {
    super(props)
    const { defaultValue, items } = props
    this.state = {
      value: defaultValue || items[0].value
    }
    this.onPress = this.onPress.bind(this)
  }

  onPress (value) {
    this.setState({ value })
    this.props.onChange(value)
  }

  render () {
    const {
      containerStyle,
      items,
      label,
      labelStyle,
      itemLabelStyle,
      formHorizontal,
      disabled
    } = this.props
    const { value } = this.state
    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
        <RadioForm formHorizontal={formHorizontal} animation>
          {items.map((item, i) => (
            <RadioButton
              disabled={disabled}
              labelHorizontal
              key={i}
              style={styles.radioButtonStyle}
              wrapStyle={{
                flex: 1,
                justifyContent: 'flex-start',
                marginBottom: 0
              }}
            >
              <RadioButtonInput
                obj={item}
                index={i}
                isSelected={value === item.value}
                onPress={() => {
                  this.onPress(item.value)
                }}
                buttonInnerColor={Colors.buttons.common.background}
                buttonOuterColor={
                  value === item.value
                    ? Colors.buttons.common.background
                    : hexToRgba(Colors.main.paragraph, 0.5)
                }
                buttonWrapStyle={{ alignItems: 'flex-start' }}
                buttonSize={10}
                buttonOuterSize={18}
                buttonStyle={{ borderWidth: 2 }}
              />
              <RadioButtonLabel
                obj={item}
                index={i}
                labelHorizontal
                onPress={() => {
                  this.onPress(item.value)
                }}
                labelStyle={[
                  styles.inputText,
                  { fontSize: 14 },
                  itemLabelStyle
                ]}
              />
            </RadioButton>
          ))}
        </RadioForm>
      </View>
    )
  }
}

export class FormItemPopupPicker extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => null
  }

  constructor (props) {
    super(props)
    const { defaultValue } = props
    this.state = {
      selectedIndex: defaultValue || undefined
    }
    this.onPress = this.onPress.bind(this)
  }

  onPress (value, index) {
    this.setState({ selectedIndex: index })
    this.props.onChange(value)
  }

  renderCurrentItem (item) {
    return (
      <Text>
        {item.label + ' '}
        <FontAwesome5
          name={item.icon}
          size={18}
          style={{ marginLeft: 5 }}
          color={item.color}
        />
      </Text>
    )
  }

  render () {
    const { containerStyle, inputStyle, items, placeholder } = this.props
    const { selectedIndex } = this.state
    return (
      <View style={[styles.container, containerStyle]}>
        <Menu
          renderer={renderers.Popover}
          rendererProps={{ preferredPlacement: 'top' }}
        >
          <MenuTrigger>
            <View
              style={[
                styles.inputContainer,
                inputStyle,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row'
                }
              ]}
            >
              <Text style={[styles.inputText, { textAlign: 'right' }]}>
                {Common.isBlank(selectedIndex)
                  ? placeholder
                  : this.renderCurrentItem(items[selectedIndex])}
              </Text>
              <FontAwesome5
                name='chevron-down'
                size={16}
                style={{ marginLeft: 4 }}
                color={Colors.main.paragraph}
              />
            </View>
          </MenuTrigger>
          <MenuOptions
            style={{
              flexDirection: 'row',
              padding: 8,
              borderRadius: 8
            }}
            customStyles={{ optionsContainer: { width: 270 } }}
          >
            {items.map((item, i) => (
              <MenuOption key={i} onSelect={() => this.onPress(item.value, i)}>
                <Text>
                  <FontAwesome5
                    name={item.icon}
                    size={33}
                    style={styles.checkboxIcon}
                    color={item.color}
                  />
                </Text>
              </MenuOption>
            ))}
            <MenuOption onSelect={() => this.onPress(undefined, undefined)}>
              <Text>
                <FontAwesome5
                  name='trash-alt'
                  size={30}
                  color={hexToRgba(Colors.main.paragraph, 0.8)}
                />
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  dateText: {
    color: Colors.main.paragraph,
    textAlign: 'left'
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start'
  },
  placeholderText: {
    color: placeholderTextColor
  },
  inputText: {
    color: Colors.main.paragraph,
    fontSize: 16
  },
  container: {
    marginBottom: 25
  },
  radioButtonStyle: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-start',
    marginBottom: 0,
    paddingVertical: 5
  },
  label: {
    fontSize: 14,
    color: 'rgba(35, 38, 43, 0.8)',
    marginBottom: 5
  },
  icon: {
    position: 'absolute',
    left: 10
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    height: 56,
    alignItems: 'center',
    backgroundColor: Colors.main.grey3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  containerWithIcon: {
    paddingLeft: 35
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20
  },
  checkboxIcon: {
    marginLeft: 10
  },
  focus: {
    borderColor: Colors.buttons.common.background
  },
  invalid: {
    borderColor: Colors.main.error,
    borderWidth: 1
  },
  disabled: {
    color: Colors.main.grey2
  }
})

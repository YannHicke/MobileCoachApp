import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  Platform,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '../Themes';
import { withFormikControl } from 'react-native-formik';
// import console = require('console');

class TextInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    invalid: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string,
    setFieldValue: PropTypes.func,
    error: PropTypes.string,
    setFieldTouched: PropTypes.func,
  };

  state = {
    text: '',
  };

  focus = () => {
    console.log('focus');
  };

  render() {
    const {
      placeholder,
      labelStyle,
      textInputStyle,
      containerStyle,
      invalid,
      name,
      error,
      value,
      setFieldValue,
      label,
    } = this.props;

    return (
      <View style={[styles.textInputContainer, containerStyle]}>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
        <RNTextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          // value={this.state.text}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.5)"
          underlineColorAndroid="transparent"
          name={name}
          style={[
            styles.textInput,
            textInputStyle,
            invalid ? { borderColor: 'red', borderWidth: 1 } : null,
            error ? { borderColor: 'red', borderWidth: 1 } : null,
          ]}
          // onChangeText={text =>
          //   this.setState({ text }, () => {
          //     onChangeText(text)
          //   })
          // }
          onChangeText={setFieldValue}
        />
      </View>
    );
  }
}

export default withFormikControl(TextInput);

const styles = StyleSheet.create({
  textInputContainer: {
    width: '100%',
  },
  textInput: {
    color: Colors.main.paragraph,
    backgroundColor: Colors.main.grey3,
    width: '100%',
    borderRadius: 8,
    fontSize: 16,
    ...Platform.select({
      ios: {
        minHeight: 50,
        paddingTop: 15,
        paddingBottom: 15,
      },
    }),
    paddingHorizontal: 10,
  },
  label: {
    color: 'rgba(35, 38, 43, 0.8)',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
});

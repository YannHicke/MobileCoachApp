import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Platform, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';

import { Colors } from '../Themes/';

export default class InputToolbar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  state = {
    text: '',
  };

  render() {
    const { onSubmit, placeholder } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.primary}>
          <View style={styles.textInputContainer}>
            <TextInput
              multiline
              blurOnSubmit
              ref={(ref) => {
                this.textInput = ref;
              }}
              value={this.state.text}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.5)"
              underlineColorAndroid="transparent"
              style={styles.textInput}
              onChangeText={(text) => this.setState({ text })}
            />
          </View>
          <Button
            icon={{
              type: 'font-awesome',
              name: 'send',
              color: Colors.buttons.common.text,
              size: 23,
            }}
            color={Colors.buttons.common.text}
            disabled={this.state.text === ''}
            disabledStyle={{
              backgroundColor: Colors.buttons.common.disabled,
            }}
            backgroundColor={Colors.buttons.common.background}
            buttonStyle={{
              borderRadius: 25,
              width: 50,
              height: 50,
            }}
            containerViewStyle={styles.buttonContainer}
            onPress={() => {
              this.textInput.blur();
              onSubmit(this.state.text);
              this.setState({ text: '' });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  primary: {
    padding: 5,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 10,
    minHeight: 50,
    padding: 12,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 15,
    backgroundColor: Colors.buttons.freeText.background,
  },
  textInput: {
    color: Colors.buttons.freeText.text,
    fontSize: 16,
    ...Platform.select({
      ios: {
        minHeight: 50,
        paddingTop: 15,
        paddingBottom: 15,
      },
    }),
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    marginRight: 0,
  },
});

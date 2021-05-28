import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Platform } from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import CommonUtils, { tapBlockingHandlers } from './../../Utils/Common';
import { Colors, Fonts, Metrics } from '../../Themes/';
import { inputMessageStyles } from './Styles/CommonStyles';

// MAX-Width for TextInput-Element: Screenwidth - MessageContainer Margin (58) - Bubble-Padding (30) -
const MAX_INPUT_WIDTH = Metrics.screenWidth - 180;
const MIN_INPUT_WIDTH = 40;

export default class TextOrNumberInputBubble extends Component {
  static propTypes = {
    currentMessage: PropTypes.object,
    onSubmit: PropTypes.func,
    setAnimationShown: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.submitted = false;
    this.shouldAnimate = this.props.currentMessage.custom.shouldAnimate;
    this.onlyNumbers = this.props.currentMessage.custom.onlyNumbers;
  }

  state = {
    text: '',
    // TextInput seems to randomly resize itself when text-content begins to overflow
    // a TextInput without a fixed width. To handle this issue: use onContentSizeChange to
    // check wether a fixed with should be applied.
    useFixedWidth: false,
    belowMinWidth: false,
  };

  onSubmitHandler() {
    // Only handle submit the first time (to prevent unwanted "double-taps")
    if (!this.submitted) {
      const { currentMessage, onSubmit } = this.props;
      const { onlyNumbers, textBefore, textAfter } = currentMessage.custom;

      let relatedMessageId = currentMessage._id.substring(
        0,
        currentMessage._id.lastIndexOf('-'),
      );

      let bubbleText = this.state.text;

      // Empty text
      if (bubbleText === '') {
        if (onlyNumbers) {
          bubbleText = '0';
        } else {
          bubbleText = ' ';
        }
      }

      // Placeholders
      if (textBefore != null) {
        bubbleText = textBefore + bubbleText;
      }
      if (textAfter != null) {
        bubbleText = bubbleText + textAfter;
      }

      // intention, text, value, relatedMessageId
      onSubmit(
        currentMessage.custom.intention,
        bubbleText,
        this.state.text,
        relatedMessageId,
      );
    }
    this.submitted = true;
  }

  onChange(text) {
    // Clean if only numbers are allowed
    if (this.onlyNumbers) {
      let newText = '';
      let numbers = '0123456789,.';
      let containsSeperator = false;
      for (let i = 0; i < text.length; i++) {
        if (numbers.indexOf(text[i]) > -1) {
          // Check for multiple komma / dots
          if (['.', ','].includes(text[i])) {
            // only add if its the first seperator
            if (!containsSeperator) {
              newText = newText + text[i];
              containsSeperator = true;
            }
            // If its a number, just add is
          } else {
            newText = newText + text[i];
          }
        }
      }
      this.setState({ text: newText });
    } else {
      this.setState({ text });
    }
  }

  onCancel() {
    const { currentMessage, onSubmit } = this.props;
    let relatedMessageId = currentMessage._id.substring(
      0,
      currentMessage._id.lastIndexOf('-'),
    );
    // Convention: when canceled, just send an empty string
    // intention, text, value, relatedMessageId
    onSubmit(currentMessage.custom.intention, '', '', relatedMessageId);
  }

  renderWrapperText(text) {
    if (text != null && text !== '') {
      return <Text style={styles.textInput}>{text}</Text>;
    } else {
      return null;
    }
  }

  handleContentSizeChange(width, height) {
    const { useFixedWidth, belowMinWidth } = this.state;
    if (width >= MAX_INPUT_WIDTH && !useFixedWidth) {
      this.setState({ useFixedWidth: true });
    }
    if (width < MAX_INPUT_WIDTH && useFixedWidth) {
      this.setState({ useFixedWidth: false });
    }

    if (width < MIN_INPUT_WIDTH && !belowMinWidth) {
      this.setState({ belowMinWidth: true });
    }
    if (width >= MIN_INPUT_WIDTH && belowMinWidth) {
      this.setState({ belowMinWidth: false });
    }
  }

  render() {
    const { currentMessage } = this.props;
    const { useFixedWidth, belowMinWidth } = this.state;
    let multiline = false;
    if (currentMessage.custom.multiline) {
      multiline = true;
    }
    let placeholder = ' ';
    if (currentMessage.custom.placeholder != null) {
      // Add a space to placeholder to center placeholder in TextInput
      // (placeholder is formatted with 'textAlign: left' so the cursor isn't shown in the center, this causes an uneven 'padding' on the left)
      placeholder = currentMessage.custom.placeholder;
    }
    let textAlign = 'center';
    if (Platform.OS === 'android' && multiline) {
      textAlign = 'left';
    }
    if (Platform.OS === 'ios' && !belowMinWidth) {
      textAlign = 'left';
    }
    // If the placeholder is shown, set text-align to right so the curser isn't positioned over placeholder
    if (placeholder !== ' ' && this.state.text === '') {
      textAlign = 'left';
    }
    const editable = CommonUtils.userCanEdit(currentMessage);
    return (
      <Animatable.View
        useNativeDriver
        animation={this.shouldAnimate ? this.props.fadeInAnimation : null}
        duration={this.props.duration}
        style={[inputMessageStyles.container]}
        onAnimationEnd={() => {
          this.shouldAnimate = false;
        }}>
        <View
          {...(editable ? null : tapBlockingHandlers)}
          style={[
            styles.inputBubble,
            {
              backgroundColor: editable
                ? Colors.buttons.freeText.background
                : Colors.buttons.freeText.disabled,
            },
          ]}>
          <View
            style={{
              flexShrink: 1,
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              overflow: 'hidden',
              marginRight: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
              {this.renderWrapperText(currentMessage.custom.textBefore)}
              <TextInput
                editable={editable}
                // autoFocus
                onChangeText={(text) => this.onChange(text)}
                value={this.state.text}
                multiline={multiline}
                placeholder={placeholder}
                placeholderTextColor={Colors.buttons.freeText.text}
                keyboardType={this.onlyNumbers ? 'numeric' : 'default'}
                underlineColorAndroid="rgba(0,0,0,0)"
                style={[
                  styles.textInput,
                  {
                    textAlign,
                    flex: 0,
                    flexShrink: 1,
                    borderBottomWidth: 0.8,
                    borderColor: Colors.buttons.freeText.text,
                  },
                  useFixedWidth && Platform.OS === 'ios'
                    ? { width: MAX_INPUT_WIDTH }
                    : null,
                ]}
                autoCapitalize={'sentences'}
                returnKeyType={'done'}
                autoCorrect={false}
                selectionColor={Colors.leftBubbleBackground}
                onSubmitEditing={() => this.onSubmitHandler()}
                onContentSizeChange={(e) =>
                  this.handleContentSizeChange(
                    e.nativeEvent.contentSize.width,
                    e.nativeEvent.contentSize.height,
                  )
                }
              />
              {this.renderWrapperText(currentMessage.custom.textAfter)}
            </View>
          </View>
          {/* The mask view is just a little fix to keep the left padding of the input bubble visible,
            even when the TextInput overflows the container. */}
          <View
            style={[
              styles.mask,
              {
                backgroundColor: editable
                  ? Colors.buttons.freeText.background
                  : Colors.buttons.freeText.disabled,
              },
            ]}
          />
          {currentMessage.custom.canBeCancelled ? (
            <Button
              containerStyle={styles.button}
              onPress={() => {
                return editable ? this.onCancel() : false;
              }}>
              <Icon
                name="ios-close-circle"
                type="ionicon"
                color={Colors.buttons.freeText.skipAnswer}
                size={30}
              />
            </Button>
          ) : null}
          <Button
            containerStyle={styles.button}
            onPress={() => {
              return editable ? this.onSubmitHandler() : false;
            }}>
            <Icon
              name="ios-checkmark-circle"
              type="ionicon"
              color={Colors.buttons.freeText.text}
              size={30}
            />
          </Button>
        </View>
      </Animatable.View>
    );
  }

  componentDidMount() {
    // notify redux that animationw as shown after first render
    const { currentMessage } = this.props;
    if (currentMessage.custom.shouldAnimate) {
      this.props.setAnimationShown(currentMessage._id);
    }
  }
}
const styles = StyleSheet.create({
  mask: {
    width: 15,
    height: 35,
    position: 'absolute',
    left: 0,
  },
  button: {
    padding: 5,
    alignItems: 'center',
  },
  inputBubble: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 16,
    borderTopRightRadius: 3,
    backgroundColor: Colors.buttons.freeText.background,
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
    color: Colors.buttons.freeText.text,
    fontFamily: Fonts.type.family,
    overflow: 'hidden',
    fontWeight: 'normal',
    paddingBottom: 0,
    paddingTop: 0,
    textDecorationLine: 'none',
    minWidth: MIN_INPUT_WIDTH,
    maxWidth: MAX_INPUT_WIDTH,
  },
});

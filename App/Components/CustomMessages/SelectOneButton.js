import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import CommonUtils, { tapBlockingHandlers } from './../../Utils/Common';
import { Colors } from '../../Themes/';
import { inputMessageStyles } from './Styles/CommonStyles';

class Option extends Component {
  static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.string,
    optionKey: PropTypes.number.isRequired,
    setMessageProperties: PropTypes.func,
    fadeInAnimation: PropTypes.string,
    delay: PropTypes.number,
    duration: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.shouldAnimate = true;
  }

  render() {
    const { title, value, currentMessage, containerStyle } = this.props;
    const disabled = !CommonUtils.userCanEdit(currentMessage);
    return (
      <Animatable.View
        {...(disabled ? tapBlockingHandlers : null)}
        ref="view"
        useNativeDriver
        animation={this.shouldAnimate ? this.props.fadeInAnimation : null}
        delay={this.props.delay}
        duration={this.props.duration}
        onAnimationEnd={() => {
          this.shouldAnimate = false;
        }}>
        <TouchableOpacity
          value={value}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 250,
            padding: 5,
            paddingHorizontal: 10,
            minHeight: 46,
            overflow: 'hidden',
            borderRadius: 16,
            backgroundColor: Colors.buttons.selectOne.background,
            marginBottom: 2,
          }}
          title={title}
          onPress={() => this.props.onPress(this.props.optionKey)}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'normal',
              color: Colors.buttons.selectOne.text,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  animatable = () => {
    return this.refs.view;
  };
}

export default class SelectOneButton extends Component {
  constructor(props) {
    super(props);
    this.tapped = false;
    this.animatableRefs = {};
    this.shouldAnimate = this.props.currentMessage.custom.shouldAnimate;
  }
  static propTypes = {
    currentMessage: PropTypes.object,
    onPress: PropTypes.func,
    fadeInAnimation: PropTypes.string,
    fadeOutAnimation: PropTypes.string,
    fadeOutSelectedAnimation: PropTypes.string,
    delayOffset: PropTypes.number,
    duration: PropTypes.number,
  };

  onPressHandler(message, text, value, selectedOptionKey) {
    // Only handle click the first time (to prevent unwanted "double-taps")
    if (!this.tapped) {
      let relatedMessageId = message._id.substring(
        0,
        message._id.lastIndexOf('-'),
      );
      this.props.onPress(
        message.custom.intention,
        text,
        value,
        relatedMessageId,
      );
      this.tapped = true;
    }
  }

  componentDidMount() {
    // notify redux that animationw as shown after first render
    const { currentMessage } = this.props;
    if (currentMessage.custom.shouldAnimate) {
      this.props.setAnimationShown(currentMessage._id);
    }
  }

  render() {
    const { options } = this.props.currentMessage.custom;

    return (
      <View style={inputMessageStyles.container}>
        {options.map((item, index) => {
          return (
            <View>
              <Option
                key={index}
                optionKey={index}
                title={item.button}
                value={item.value}
                currentMessage={this.props.currentMessage}
                onPress={(optionKey) =>
                  this.onPressHandler(
                    this.props.currentMessage,
                    item.button,
                    item.value,
                    optionKey,
                  )
                }
                ref={(ref) => {
                  // Apparently, this callback is often called with "null"-values..
                  if (ref !== null) {
                    this.animatableRefs[index] = ref;
                  }
                }}
                containerStyle={
                  options.length > 4 ? styles.buttonContainerSmall : undefined
                }
                fadeInAnimation={
                  this.shouldAnimate ? this.props.fadeInAnimation : null
                }
                fadeOutSelectedAnimation={this.props.fadeOutSelectedAnimation}
                delay={index * this.props.delayOffset}
                duration={this.props.duration}
              />
            </View>
          );
        })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainerSmall: {
    minHeight: 40,
  },
  buttonContainerDisabled: {
    backgroundColor: Colors.buttons.selectOne.disabled,
  },
});

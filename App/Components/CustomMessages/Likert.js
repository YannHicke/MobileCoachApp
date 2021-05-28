import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import CommonUtils, { tapBlockingHandlers } from './../../Utils/Common';
import { Colors, Metrics } from '../../Themes/';
import { inputMessageStyles } from './Styles/CommonStyles';

export default class Likert extends Component {
  static propTypes = {
    currentMessage: PropTypes.object,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.tapped = false;
    this.shouldAnimate = this.props.currentMessage.custom.shouldAnimate;

    const { answers } = this.props.currentMessage.custom.options;
    // stores which property of the answer should be displayed in chat bubble (value or label)
    this.options = [];
    answers.map((answer) => {
      // If no label was given in options, use value as label
      let option = {
        label: CommonUtils.isBlank(answer.label) ? answer.value : answer.label,
        value: answer.value,
      };
      this.options.push(option);
    });
  }

  renderItem(option, itemSize, onPress, index, length) {
    const { currentMessage } = this.props;
    let alternativeLayout = false;
    // Special layout for large likerts
    const minWidth = 35;
    let circleSize = itemSize - 5;
    if (itemSize < minWidth) {
      alternativeLayout = true;
      circleSize = 28;
      itemSize = 32;
    }
    const itemStyle = {
      // width: add 1px to circle-width to fix strange ios-display bug (buggy hairline)
      width: circleSize + 1,
      height: circleSize,
      backgroundColor: CommonUtils.userCanEdit(currentMessage)
        ? Colors.buttons.common.background
        : Colors.buttons.common.disabled,
      borderRadius: circleSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    };
    const editable = CommonUtils.userCanEdit(currentMessage);
    return (
      <Animatable.View
        {...(editable ? null : tapBlockingHandlers)}
        useNativeDriver
        key={index}
        animation={this.shouldAnimate ? this.props.fadeInAnimation : null}
        delay={index * this.props.delayOffset}
        duration={this.props.duration}
        onAnimationEnd={() => {
          this.shouldAnimate = false;
        }}>
        <TouchableOpacity
          disabled={!editable}
          onPress={() => {
            return editable
              ? this.onPressHandler(currentMessage, option.label, option.value)
              : false;
          }}
          style={{
            width: itemSize,
            alignItems: 'center',
          }}>
          <View style={itemStyle}>{this.renderValue(option, itemStyle)}</View>
          {this.renderLabel(option, itemSize, index, length, alternativeLayout)}
        </TouchableOpacity>
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

  onPressHandler(message, text, value) {
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
    }
    this.tapped = true;
  }

  shouldRenderLabel(index, length, alternativeLayout) {
    if (!alternativeLayout) {
      return true;
    } else {
      // even length
      if (length % 2 === 0) {
        // First / Last
        if (index === 0 || index === length - 1) {
          return true;
        }
        // both middle-elements
        if (index === length / 2 + 1 || index === length / 2 - 1) {
          return false;
        }
        // left side
        if (index < length / 2) {
          return index % 2 === 0;
        }
        // right side
        if (index > length / 2) {
          return index % 2 === 1;
        }
        // odd length
      } else {
        if (index % 2 === 0) {
          return true;
        }
      }
      return false;
    }
  }

  renderValue(option) {
    if (!this.props.currentMessage.custom.options.silent) {
      return (
        <Text style={{ color: Colors.buttons.common.text }}>
          {option.value}
        </Text>
      );
    }
  }

  renderLabel(option, itemSize, index, length, alternativeLayout) {
    if (this.shouldRenderLabel(index, length, alternativeLayout)) {
      const { currentMessage } = this.props;
      return (
        <View
          style={{
            alignItems: 'center',
            width: alternativeLayout ? itemSize * 2 : itemSize,
            marginTop: 10,
          }}>
          <Text
            style={{
              color: CommonUtils.userCanEdit(currentMessage)
                ? Colors.buttons.common.background
                : Colors.buttons.common.disabled,
              fontSize: 10,
              textAlign: 'center',
            }}>
            {option.label}
          </Text>
        </View>
      );
    }
  }

  render() {
    const { onPress } = this.props;
    const answers = this.options;
    const maxWidth = 50;
    let itemSize = (Metrics.screenWidth - 40) / answers.length;
    if (itemSize > maxWidth) {
      itemSize = maxWidth;
    }
    // const isLast = currentMessage.isLast

    return (
      <View
        style={[
          inputMessageStyles.container,
          {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          },
        ]}>
        {answers.map((option, index, array) => {
          return this.renderItem(
            option,
            itemSize,
            onPress,
            index,
            array.length,
          );
        })}
      </View>
    );
  }
}

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
// import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable';
import I18n from '../../I18n/I18n';

import CommonUtils, { tapBlockingHandlers } from './../../Utils/Common';
import { Colors, Fonts } from '../../Themes/';
import { inputMessageStyles } from './Styles/CommonStyles';

export default class LikertSlider extends Component {
  static propTypes = {
    currentMessage: PropTypes.object,
    onSubmit: PropTypes.func,
    setAnimationShown: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.submitted = false;
    this.shouldAnimate = this.props.currentMessage.custom.shouldAnimate;
    const { answers } = this.props.currentMessage.custom.options;
    // stores which property of the answer should be displayed in chat bubble (value or label)
    let answerBubbleProperty = 'label';
    const answerWithoutLabel = answers.find((answer) => answer.label === '');
    // If there is an answer option without label, use values as label
    if (answerWithoutLabel) {
      answerBubbleProperty = 'value';
    }
    this.answerBubbleProperty = answerBubbleProperty;

    this.min = 0;
    this.max = answers.length - 1;
    // Initial value = middle
    this.initialIndex = Math.floor(answers.length / 2);
    this.state = {
      value: this.initialIndex,
    };
  }

  onSubmitHandler() {
    // Only handle submit the first time (to prevent unwanted "double-taps")
    if (!this.submitted) {
      const { currentMessage, onSubmit } = this.props;
      const { answers } = currentMessage.custom.options;
      let relatedMessageId = currentMessage._id.substring(
        0,
        currentMessage._id.lastIndexOf('-'),
      );
      // intention, text, value, relatedMessageId
      onSubmit(
        currentMessage.custom.intention,
        answers[this.state.value][this.answerBubbleProperty],
        answers[this.state.value].value,
        relatedMessageId,
      );
    }
    this.submitted = true;
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
  renderValues() {
    const { answers, silent } = this.props.currentMessage.custom.options;
    // Only render values if not silent (likert-silent-slider)
    if (!silent) {
      return (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            paddingTop: 5,
            justifyContent: 'space-between',
          }}>
          {answers.map((answer, index) => {
            return (
              <View key={index} style={{ width: 20, alignItems: 'center' }}>
                <Text style={[styles.label]}>{answers[index].value}</Text>
              </View>
            );
          })}
        </View>
      );
    }
  }
  render() {
    const { currentMessage } = this.props;
    const editable = CommonUtils.userCanEdit(currentMessage);
    const { answers } = currentMessage.custom.options;
    return (
      <Animatable.View
        {...(editable ? null : tapBlockingHandlers)}
        useNativeDriver
        animation={this.shouldAnimate ? this.props.fadeInAnimation : null}
        duration={this.props.duration}
        style={[inputMessageStyles.container, { alignItems: 'stretch' }]}
        onAnimationEnd={() => {
          this.shouldAnimate = false;
        }}>
        <View
          style={[
            styles.inputBubble,
            editable ? null : styles.buttonContainerDisabled,
          ]}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {this.renderValues()}
            <Slider
              step={1}
              disabled={!editable}
              style={styles.slider}
              value={this.initialIndex}
              animateTransitions
              maximumValue={this.max}
              minimumValue={this.min}
              minimumTrackTintColor={
                editable
                  ? Colors.buttons.likertSlider.minTint
                  : Colors.buttons.common.cancel
              }
              maximumTrackTintColor={
                editable
                  ? Colors.buttons.likertSlider.maxTint
                  : Colors.buttons.common.cancel
              }
              thumbTintColor={
                editable
                  ? Colors.buttons.likertSlider.thumb
                  : Colors.buttons.common.cancel
              }
              onSlidingComplete={(value) => this.setState({ value })}
            />
            <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                }}>
                <Text style={styles.label}>{answers[this.min].label}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  alignSelf: 'flex-start',
                }}>
                <Text style={[styles.label, { textAlign: 'right' }]}>
                  {answers[this.max].label}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Button // {value}
          containerStyle={styles.buttonContainer}
          disabledContainerStyle={[styles.buttonContainerDisabled]}
          style={styles.button}
          disabled={!editable}
          onPress={() => this.onSubmitHandler()}>
          {/* <Icon name='ios-checkmark-circle' type='ionicon' color={Colors.buttons.common.text} size={30} /> */}
          {I18n.t('Common.confirm')}
        </Button>
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
  label: {
    color: Colors.buttons.likertSlider.text,
  },
  buttonContainer: {
    marginTop: 10,
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    minHeight: 35,
    borderRadius: 16,
    backgroundColor: Colors.buttons.likertSlider.button.background,
    marginBottom: 4,
  },
  buttonContainerDisabled: {
    backgroundColor: Colors.buttons.likertSlider.button.disabled,
  },
  button: {
    fontSize: Fonts.size.regular,
    color: Colors.buttons.likertSlider.button.text,
  },
  inputBubble: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    minHeight: 35,
    borderRadius: 16,
    borderTopRightRadius: 3,
    backgroundColor: Colors.buttons.likertSlider.background,
    marginBottom: 4,
  },
  slider: {
    flex: 1,
  },
});

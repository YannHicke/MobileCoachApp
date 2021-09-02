import React, { Component } from 'react';
import { StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../../Themes/';
import CustomMultiPicker from './CustomMultiPicker';
import I18n from '../../I18n/I18n';
import * as Animatable from 'react-native-animatable';

import CommonUtils, { tapBlockingHandlers } from './../../Utils/Common';
import { inputMessageStyles } from './Styles/CommonStyles';

import Log from '../../Utils/Log';
const log = new Log('Components/CustomMessages');

export default class SelectManyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      selectedKeys: [],
      // disabled: props.disabled || false
    };
    this.tapped = false;
    this.shouldAnimate = this.props.currentMessage.custom.shouldAnimate;
  }

  onPressHandler() {
    // Only handle click the first time (to prevent unwanted "double-taps")
    if (!this.tapped) {
      const { options, min, max } = this.props.currentMessage.custom;
      const { currentMessage } = this.props;
      if (this.checkCorrectSelectionCount(min, max)) {
        this.setState({ disabled: true });
        // transform to correct exchange format
        const result = [];
        let resultMessage = '';
        this.state.res.forEach((item, index) => {
          if (item !== '') {
            const label = options[index].label;
            resultMessage =
              resultMessage +
              '- ' +
              (label.startsWith('! ') ? label.substring(2) : label) +
              '\n---\n';
            result.push(options[index].value);
          } else {
            result.push('');
          }
        });
        log.debug('returning multiples value', this.state.res);
        let relatedMessageId = currentMessage._id.substring(
          0,
          currentMessage._id.lastIndexOf('-'),
        );
        this.tapped = true;
        this.props.onPress(
          currentMessage.custom.intention,
          resultMessage,
          result.toString(),
          relatedMessageId,
        );
        return;
      }

      return Alert.alert(I18n.t('Common.chooseAtLeastOne'), '', [
        { text: 'OK', onPress: () => true },
      ]);
    }
  }

  checkCorrectSelectionCount(min, max) {
    let selectionCount = 0;
    this.state.res.forEach((item) => {
      if (item !== '') {
        selectionCount++;
      }
    });
    if (selectionCount < min || (max > -1 && selectionCount > max)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const multipleSelect = true;
    const { currentMessage } = this.props;
    const { options } = currentMessage.custom;
    const selectedItems = []; // ['C', 'E']
    // const message = currentMessage.text // 'Bitte auswählen. Könnte auch ein längerer Text sein!'
    const confirmText = I18n.t('Common.confirm');
    const editable = CommonUtils.userCanEdit(currentMessage);
    return (
      <Animatable.View
        {...(editable ? null : tapBlockingHandlers)}
        useNativeDriver
        animation={this.shouldAnimate ? this.props.fadeInAnimation : null}
        duration={this.props.duration}
        style={[
          inputMessageStyles.container,
          { alignItems: 'stretch' },
          this.props.containerStyle,
        ]}
        onAnimationEnd={() => {
          this.shouldAnimate = false;
        }}>
        {/* <Text style={{marginBottom: 10}}>{message}</Text> */}
        <CustomMultiPicker
          slim={
            options.length > 4 &&
            !(currentMessage.custom.component === 'select-many-modal')
          }
          options={options}
          disabled={!editable}
          multiple={multipleSelect}
          returnValue={'value'} // label or value or index
          callback={(res, selectedKeys) => {
            this.setState({ res, selectedKeys });
          }} // callback, array of selected items
          rowBackgroundColor={'white'}
          // rowHeight={40}
          rowRadius={5}
          iconColor={Colors.buttons.selectMany.items.text}
          iconSize={30}
          labelColor={Colors.buttons.selectMany.items.text}
          selectedIconName={'ios-checkmark-circle-outline'}
          unselectedIconName={'ios-radio-button-off'}
          borderColor={Colors.buttons.selectMany.items.border}
          // scrollViewHeight={130}
          selected={selectedItems} // list of options which are selected by default
          // scrollViewStyle={} // Style object for scrollView that holds all items
          // itemStyle={} // Style object for the touchableOpacity of each item
          // selectedIconStyle={} // style object for the icon when selected
          // unselectedIconStyle={} // style object for the icon when unselected
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonContainer]}
          disabled={!CommonUtils.userCanEdit(currentMessage)}
          onPress={() => {
            this.onPressHandler();
          }}>
            <Text style={{
              fontSize: Fonts.size.regular,
              color: Colors.buttons.selectMany.submitButton.text
            }}>
          {confirmText}
          </Text>
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
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 10,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: Colors.buttons.selectMany.submitButton.background,
    marginBottom: 4,
  },
  disabled: {
    backgroundColor: Colors.buttons.selectMany.submitButton.disabled,
  },
});

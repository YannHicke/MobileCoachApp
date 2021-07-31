import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';

import I18n from '../I18n/I18n';
import HeaderBar from './HeaderBar';
import ServerMessageActions from '../Redux/MessageRedux';
import SelectManyComponent from './CustomMessages/SelectManyComponent';
import { Colors } from '../Themes';

// import Log from '../Utils/Log'
// const log = new Log('Components/SelectManyModal')

/*
 * Supported commands:
 *  window.postMessage('{"variable":"$result", "value": 20}');
 *  window.postMessage('close');
 *  window.postMessage('complete');
 */

class SelectManyModal extends Component {
  render() {
    const { currentMessage, answerAction } = this.props;
    return (
      <View style={styles.container}>
        <HeaderBar
          title={I18n.t('Common.selectManyTitle')}
          onClose={() => this.props.onClose(false)}
        />
        <ScrollView style={styles.contentContainer}>
          <View style={{ padding: 15, paddingTop: 10 }}>
            <Text style={styles.headline}>
              {I18n.t('Common.selectManySubtitle')}
            </Text>
            <SelectManyComponent
              onPress={(intention, text, value, relatedMessageId) => {
                answerAction(intention, text, value, relatedMessageId);
                this.props.onClose(true);
              }}
              currentMessage={currentMessage}
              containerStyle={{
                marginLeft: 0,
                marginRight: 0,
                paddingBottom: 10,
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headline: {
    fontSize: 16,
    color: Colors.main.headline,
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  sendVariableValue: (variable, value) =>
    dispatch(ServerMessageActions.sendVariableValue(variable, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectManyModal);

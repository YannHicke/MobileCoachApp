import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Message } from 'react-native-gifted-chat';
import PropTypes from 'prop-types';
import Spinner from 'react-native-spinkit';
import { connect } from 'react-redux';

import { Colors, Images } from '../../Themes';

class TypingIndicator extends Component {
  constructor(props) {
    super(props);

    const avatar = Images.coaches[props.coach];
    this.typingMessage = {
      _id: 'typingIndicator',
      type: 'text',
      user: {
        _id: 2,
        avatar,
      },
    };
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    onPress: PropTypes.func,
  };

  render() {
    return (
      <Message
        {...this.props}
        currentMessage={this.typingMessage}
        renderCustomView={this.renderCustomView}
      />
    );
  }

  renderCustomView() {
    const spinnerProps = {
      type: 'ThreeBounce',
      color: Colors.messageBubbles.left.text,
      isVisible: true,
      size: 28,
    };
    return <Spinner {...spinnerProps} style={styles.spinner} />;
  }
}

const mapStateToProps = (state) => {
  return {
    coach: state.settings.coach,
  };
};

export default connect(mapStateToProps)(TypingIndicator);

const styles = StyleSheet.create({
  spinner: {
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

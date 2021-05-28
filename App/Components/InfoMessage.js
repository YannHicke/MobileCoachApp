import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import propTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import { Colors } from '../Themes';

export default class InfoMessage extends Component {
  static propTypes = {
    onPress: propTypes.func,
    onClose: propTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  render() {
    const { message } = this.props;
    if (this.state.visible) {
      return (
        <Animatable.View
          ref="container"
          style={[styles.container, this.props.containerStyle]}
          useNativeDriver>
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={this.props.onPress}>
            <Icon
              name="info-with-circle"
              type="entypo"
              color="#fff"
              containerStyle={{ marginHorizontal: 10 }}
              size={18}
            />
            <Text style={styles.messageText}>{message}</Text>
          </TouchableOpacity>
        </Animatable.View>
      );
    } else {
      return null;
    }
  }
}

const styles = {
  container: {
    backgroundColor: Colors.connectionIndicator.intermediateState,
    height: 36,
    borderRadius: 18,
    maxWidth: 380,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
    },
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    flex: 1,
  },
  messageText: {
    color: '#fff',
    justifyContent: 'center',
  },
};

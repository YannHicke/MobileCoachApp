import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewPropTypes,
  Platform,
} from 'react-native';
import I18n from '../I18n/I18n';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { Colors, Metrics } from '../Themes/';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const iconProps = {
  size: 30,
  color: Colors.navigationBar.text,
};

export default class HeaderBar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onBack: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onClose: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    confirmClose: PropTypes.string,
    containerStyle: ViewPropTypes.style,
  };

  renderBackIcon() {
    if (this.props.onBack) {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.onBack()}>
          <Icon name="arrow-back" type="material" {...iconProps} />
        </TouchableOpacity>
      );
    }
  }

  renderCloseIcon() {
    if (this.props.onClose) {
      return (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.onCloseHandler()}>
          <Icon name="md-close" type="ionicon" {...iconProps} />
        </TouchableOpacity>
      );
    }
  }

  onCloseHandler() {
    if (this.props.confirmClose) {
      Alert.alert(
        this.props.confirmClose,
        '',
        [
          {
            text: I18n.t('Settings.no'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: I18n.t('Settings.yes'),
            onPress: this.props.onClose,
          },
        ],
        { cancelable: false },
      );
    } else {
      this.props.onClose();
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.renderBackIcon()}
            {this.renderCloseIcon()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.navigationBar.background,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    // Android shadow
    elevation: 2,
    zIndex: 100,
  },
  container: {
    zIndex: 10,
    ...Platform.select({
      ios: {
        marginTop: 20,
        ...ifIphoneX({
          marginTop: 41,
        }),
      },
    }),
  },
  header: {
    height: Metrics.navbarHeight,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  title: {
    fontWeight: '500',
    fontSize: 17,
    color: Colors.navigationBar.text,
    textAlign: 'center',
  },
  backButton: {
    // fontSize: 30,
    position: 'absolute',
    left: 5,
    padding: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 8,
  },
});

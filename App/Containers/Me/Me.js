import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'

import I18n from '../../I18n/I18n'
import { Colors, ApplicationStyles } from '../../Themes'
import ConnectionStateButton from '../../Components/ConnectionStateButton'
import { ConnectionStates } from '../../Redux/ServerSyncRedux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Log from '../../Utils/Log'
const log = new Log('Containers/Me/Me')

const margin = 18

class Me extends PureComponent {
  static defaultProps = {}

  constructor (props) {
    super(props)
    this.buttons = [
      {
        title: 'myData',
        icon: 'notes-medical',
        onPress: () => this.props.navigation.navigate('PersonalData')
      },
      {
        title: 'sources',
        icon: 'clipboard-list',
        onPress: () => this.props.navigation.navigate('ScreenSources')
      },
      {
        title: 'support',
        icon: 'envelope-open-text',
        onPress: () => this.props.navigation.navigate('ScreenSupport')
      },
      {
        title: 'imprint',
        icon: 'info-circle',
        onPress: () => this.props.navigation.navigate('ScreenImpressum')
      }
    ]
  }

  renderConnectionStateButton (connectionState) {
    return (
      <ConnectionStateButton
        onPress={() => {
          this.showConnectionStateMessage(connectionState)
        }}
        connectionState={connectionState}
      />
    )
  }

  renderTitleBar () {
    const { registrationTime } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          width: '100%',
          alignItems: 'center',
          paddingVertical: 25,
          paddingHorizontal: 18
        }}
      >
        <Icon
          name={'user'}
          size={60}
          style={{ color: 'rgba(255,255,255,0.7)', marginRight: 15 }}
        />
        <View>
          <Text style={{ color: '#fff', fontSize: 20, marginBottom: 5 }}>
            {this.props.name && this.props.name !== ''
              ? this.props.name
              : I18n.t('Me.homeScreen.me')}
          </Text>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {I18n.t('Me.homeScreen.participantSince') +
              ': ' +
              moment(registrationTime).format('MMMM YYYY')}
          </Text>
        </View>
      </View>
    )
  }

  renderButton (button) {
    return (
      <View style={[styles.card, ApplicationStyles.shadowMedium]}>
        <TouchableOpacity
          style={{ flex: 1, width: '100%' }}
          onPress={() => button.onPress()}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Icon name={button.icon} size={40} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              {I18n.t(`Me.homeScreen.${button.title}`).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const { connectionState } = this.props
    return (
      <View style={styles.container}>
        <View
          style={[
            ApplicationStyles.screenTitleContainer,
            styles.titleContainer
          ]}
        >
          <Text style={ApplicationStyles.screenTitle}>
            {I18n.t(`Me.personalData.title`).toUpperCase()}
          </Text>
          <View style={styles.connectionIconContainer}>
            {this.renderConnectionStateButton(connectionState)}
          </View>
        </View>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'center',
            flexGrow: 1,
            paddingBottom: 20
          }}
          style={{ flex: 1, paddingBottom: 90 }}
        >
          {this.renderTitleBar()}
          <View style={styles.tileContainer}>
            <View style={[styles.row, { marginBottom: margin }]}>
              <View style={[styles.col, { marginRight: margin }]}>
                {this.renderButton(this.buttons[0])}
              </View>
              <View style={styles.col}>
                {this.renderButton(this.buttons[1])}
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.col, { marginRight: margin }]}>
                {this.renderButton(this.buttons[2])}
              </View>
              <View style={styles.col}>
                {this.renderButton(this.buttons[3])}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  showConnectionStateMessage = (connectionState) => {
    log.action('GUI', 'ConnectionCheck', connectionState)

    let alertMessage = null
    switch (connectionState) {
      case ConnectionStates.INITIALIZING:
      case ConnectionStates.INITIALIZED:
        alertMessage = I18n.t('ConnectionStates.initialized')
        break
      case ConnectionStates.CONNECTING:
      case ConnectionStates.RECONNECTING:
        alertMessage = I18n.t('ConnectionStates.connecting')
        break
      case ConnectionStates.CONNECTED:
      case ConnectionStates.SYNCHRONIZATION:
        alertMessage = I18n.t('ConnectionStates.connected')
        break
      case ConnectionStates.SYNCHRONIZED:
        alertMessage = I18n.t('ConnectionStates.synchronized')
        break
    }

    Alert.alert(
      I18n.t('ConnectionStates.connectionToCoach'),
      alertMessage,
      [{ text: I18n.t('Common.ok'), onPress: () => true }],
      { cancelable: false }
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.buttons.common.background,
    paddingBottom: 0,
    ...ifIphoneX({
      paddingTop: 20
    })
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18
  },
  tileContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 18
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  col: {
    flexDirection: 'row',
    flex: 1,
    aspectRatio: 1
  },
  connectionIconContainer: {
    opacity: 0.7
  },
  buttonText: {
    fontSize: 18,
    color: Colors.main.paragraph,
    textAlign: 'center'
  },
  buttonIcon: {
    color: Colors.main.paragraph,
    marginBottom: 15
  },
  cardContainerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    registrationTime: state.storyProgress.registrationTimestamp,
    name: state.settings.syncedSettings.name,
    connectionState: state.serverSyncStatus.connectionState
  }
}

const mapStateToDispatch = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Me)

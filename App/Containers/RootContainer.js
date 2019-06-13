import React, { Component } from 'react'
import { View, StatusBar, Platform, Modal, Text, Linking } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ServerSyncActions from '../Redux/ServerSyncRedux'
import I18n from '../I18n/I18n'
import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { MenuProvider } from 'react-native-popup-menu'

import { Colors, Metrics } from '../Themes/'
import PMButton from '../Components/PMButton'

class RootContainer extends Component {
  onRef = (ref) => {
    this.popupMenu = ref
  }

  componentWillReceiveProps (newProps) {
    const oldScreen = this.props ? this.props.currentScreen : null
    const newScreen = newProps.guistate ? newProps.guistate.currentScreen : null

    if (oldScreen !== newScreen) {
      if (this.popupMenu && this.popupMenu.isMenuOpen()) {
        this.popupMenu.closeMenu()
      }
    }
  }

  render () {
    const { hydrationCompleted } = this.props

    return (
      <View style={{ flex: 1 }}>
        {hydrationCompleted ? (
          <MenuProvider name='popup-menu-provider' ref={this.onRef}>
            <StatusBar
              translucent={Metrics.androidStatusBarTranslucent}
              backgroundColor={Colors.statusBar.background}
              barStyle='light-content'
            />
            {this.props.versionInfo &&
            this.props.versionInfo.level === 'red' ? (
              <Modal animationType='fade' transparent={false} visble>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: Colors.main.appBackground,
                    padding: 20
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                      color: Colors.main.primary,
                      width: '100%',
                      paddingBottom: 20
                    }}
                  >
                    {this.props.versionInfo.title[I18n.locale]
                      ? this.props.versionInfo.title[I18n.locale]
                      : this.props.versionInfo.title.default}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      color: Colors.main.primary,
                      width: '100%',
                      paddingBottom: 30
                    }}
                  >
                    {this.props.versionInfo.message[I18n.locale]
                      ? this.props.versionInfo.message[I18n.locale]
                      : this.props.versionInfo.message.default}
                  </Text>
                  <PMButton
                    containerStyle={{
                      height: 40,
                      borderRadius: 8,
                      marginBottom: 10
                    }}
                    icon='external-link-alt'
                    iconRight
                    onPress={() => {
                      this.handleOpenLink(
                        this.props.versionInfo.link[Platform.OS]
                      )
                    }}
                    title={
                      this.props.versionInfo.button[I18n.locale]
                        ? this.props.versionInfo.button[I18n.locale]
                        : this.props.versionInfo.button.default
                    }
                  />
                </View>
              </Modal>
            ) : null}
            <ReduxNavigation />
            {Platform.OS === 'ios' ? (
              <View style={styles.statusBarSpacer} />
            ) : null}
          </MenuProvider>
        ) : null}
      </View>
    )
  }

  handleOpenLink = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => ({
  hydrationCompleted: state.hydrationCompleted.hydrationCompleted,
  currentScreen: state.guistate.currentScreen,
  versionInfo: state.serverSyncSettings.versionInfo
})

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  serverSyncInitialize: () => dispatch(ServerSyncActions.initialize())
})

const styles = {
  statusBarSpacer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: Colors.statusBar.background,
    height: 21,
    ...ifIphoneX({
      height: 41
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootContainer)

RootContainer.propTypes = {
  startup: PropTypes.func.isRequired
}

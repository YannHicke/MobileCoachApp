import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import { ImageCacheProvider } from 'react-native-cached-image'
import AsyncStorage from '@react-native-community/async-storage'

// Import Root Components
// Caution: The order of imports decides which i18n-file will be used (because I18n.translation will be set when importing the files)
// -> Second import (= translation files from new App-Version) will override first one.
// TODO: manually set translation files to be certain?
// import AppLegacy from './AppLegacy/Containers/App'
// import LegacyConfig from './AppLegacy/Config/AppConfig'
// import PushNotificationsLegacy from './AppLegacy/Utils/PushNotifications'

import App from './App/Containers/App'
import AppConfig from './App/Config/AppConfig'
import PushNotifications from './App/Utils/PushNotifications'

import { Colors } from './App/Themes/'
import Common from './App/Utils/Common'

import Log from './App/Utils/Log'
const log = new Log('VersionSwitch')

const VERSIONS = {
  '1': {
    component: <App />,
    appConfig: AppConfig,
    pushManager: PushNotifications
  }
  // LEGACY: {
  //   component: <AppLegacy />,
  //   appConfig: LegacyConfig,
  //   pushManager: PushNotificationsLegacy
  // }
}

const LATEST_VERSION = 1

export default class VersionSwitch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialized: false,
      legacyVersion: false
    }
  }

  componentWillMount () {
    // Check the serverSyncSettings to device wheter or not legacy version of the app should be used
    AsyncStorage.getItem('CLIENT_VERSION')
      .then((result) => {
        // If set: contains target-version
        // const targetVersion = results[0][1]
        // contains current version
        const currentVersion = result

        log.info(`Checking client version.`)
        this.bootVersion(currentVersion)
      })
      .catch((error) => {
        log.warn(
          'Error while trying to access store. Using latest App-Version.'
        )
        log.warn('Error', error.message)
        this.bootVersion(LATEST_VERSION)
      })
  }

  bootVersion (currentVersion) {
    // hardcoded "version" to load from "VERSIONS"-Object at top of this file
    // -> this has nothing to do with the real "client-version"
    const appToBoot = 1

    // load config for selected version
    const { appConfig, pushManager } = VERSIONS[appToBoot]

    const { clientVersion } = appConfig.config.serverSync

    // Reset image cache at startup (if necessary)
    if (appConfig.config.dev.purgeStoreAtStartup) {
      new ImageCacheProvider().getImageCacheManager().clearCache()
    }

    // Initialize push notifications
    pushManager
      .getInstance()
      .init(
        appConfig.config.dev.purgeStoreAtStartup,
        appConfig.config.serverSync.androidSenderId,
        appConfig.config.startup.automaticallyRequestPushPermissions
      )

    if (
      Common.isBlank(currentVersion) ||
      currentVersion.toString() !== clientVersion.toString()
    ) {
      // insert logic and transformations for new data model here

      AsyncStorage.setItem('CLIENT_VERSION', clientVersion.toString())
        .then(() => {
          log.info(`Wrote CLIENT_VERSION (${clientVersion}) to local-storage.`)
        })
        .catch((error) => {
          log.warn('Could not write CLIENT_VERSION to AsyncStorage.')
          log.warn(error.toString())
        })
        .finally(() => {
          this.setState({
            initialized: true,
            version: appToBoot
          })
        })
    } else {
      this.setState({
        initialized: true,
        version: appToBoot
      })
    }
  }

  async performUpdate (currentVersion, targetVersion) {
    log.info('PerformUpdate-flag was set, clearing storage.')
    // Data-Migrations should be done at this point.
    // It's also possible to handle data-migrations before restart (using redux/reducers), and keep certain redux-stores.
    // (use 'multiremove' instead of clear then to whipe unwanted data -> see: https://facebook.github.io/react-native/docs/asyncstorage#multiremove).
    AsyncStorage.clear()
      .then(() => {
        log.info('Successfully cleared store. Booting new App-Version.')
        this.bootVersion(targetVersion)
      })
      .catch((error) => {
        log.warn(
          'Error while trying to clear store. Fall back to legacy version of App.'
        )
        log.warn(error.toString())
        Alert.alert(
          '',
          'Could not perform update. Please delete and reinstall the app from to get the latest version.',
          [{ text: 'OK', onPress: this.props.onClose }]
        )
        this.bootVersion(currentVersion)
      })
  }

  render () {
    const { initialized } = this.state
    if (initialized) {
      return VERSIONS[this.state.version].component
    } else {
      return <View style={{ flex: 1, backgroundColor: Colors.main.primary }} />
    }
  }
}

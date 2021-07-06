/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import { name as appName } from './app.json'
import AppConfig from './App/Config/AppConfig'
import PushNotifications from './App/Utils/PushNotifications'

PushNotifications
      .getInstance()
      .init(
        AppConfig.config.dev.purgeStoreAtStartup,
        AppConfig.config.serverSync.androidSenderId,
        AppConfig.config.startup.automaticallyRequestPushPermissions
      )

AppRegistry.registerComponent(appName, () => App)

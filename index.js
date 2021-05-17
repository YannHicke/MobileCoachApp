/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)

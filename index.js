/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native'
import VersionSwitch from './VersionSwitch'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => VersionSwitch)

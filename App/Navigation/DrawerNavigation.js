import { DrawerNavigator } from 'react-navigation'

import { Animated, Easing } from 'react-native'

// import all screens here
import Chat from '../Containers/Chat/Chat'
import DashboardChat from '../Containers/Chat/DashboardChat'
import InfoCardsLibrary from '../Containers/InfoCardsLibrary/InfoCardsLibrary'
import MediaLibrary from '../Containers/MediaLibrary/MediaLibrary'
import Settings from '../Containers/Settings/Settings'
import Faq from '../Containers/FAQ/Faq'

// https://github.com/react-community/react-navigation/issues/1254
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
})

// Manifest of possible screens
const DrawerNavigation = DrawerNavigator(
  {
    Chat: {
      path: '/chat',
      screen: Chat,
      test: 'test'
    },
    DashboardChat: {
      path: '/dashboardChat',
      screen: DashboardChat,
      test: 'test'
    },
    InfoCardsLibrary: {
      path: '/infoCardsLibrary',
      screen: InfoCardsLibrary
    },
    MediaLibrary: {
      path: '/medialibrary',
      screen: MediaLibrary
    },
    Faq: {
      path: '/faq',
      screen: Faq
    },
    Settings: {
      path: '/settings',
      screen: Settings
    }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    transitionConfig: noTransitionConfig,
    initialRouteName: 'Chat',
    // LoadingContainer
    // mode: 'modal'
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode: 'locked-closed' // turn of the drawer: we use our own side-menu component
      // headerStyle: styles.header
    }
  }
)

export default DrawerNavigation

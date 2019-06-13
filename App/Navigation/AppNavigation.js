import { Animated, Easing } from 'react-native'

import DrawerNavigation from './DrawerNavigation'
import { StackNavigator } from 'react-navigation'
import OnboardingNav from '../Containers/Onboarding/OnboardingNav'
import LoadingContainer from '../Containers/LoadingContainer'

const Navigation = DrawerNavigation

// https://github.com/react-community/react-navigation/issues/1254
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
})

const PrimaryNav = StackNavigator(
  {
    LoadingContainer: {
      path: '/loading',
      screen: LoadingContainer
    },
    OnboardingNav: {
      path: '/intro',
      screen: OnboardingNav
    },
    MainNavigation: {
      path: '/app',
      screen: Navigation
    }
  },
  {
    headerMode: 'none',
    transitionConfig: noTransitionConfig,
    initialRouteName: 'LoadingContainer',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default PrimaryNav

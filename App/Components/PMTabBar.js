import React, { PureComponent, Fragment } from 'react'
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  View
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

import TabBarIcon from './TabBarIcon'
import { Colors } from '../Themes'
import CoachButton from './CoachButton'
import { TaskActionContent } from '../Containers/TaskModule/TaskActionButton'

const majorVersion = parseInt(Platform.Version, 10)
const isIos = Platform.OS === 'ios'
const useHorizontalTabs = majorVersion >= 11 && isIos

class TabBarBottom extends PureComponent {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true
  }

  constructor (props) {
    super(props)
    this.coachIndex = 0
    const { routes } = this.props.navigation.state
    routes.map((route, index) => {
      if (route.key === 'Chat') this.coachIndex = index
    })
  }

  _renderLabel = (scene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      isLandscape,
      allowFontScaling
    } = this.props
    if (showLabel === false) {
      return null
    }
    const { index } = scene
    const { routes } = navigation.state
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)]
    const outputRange = inputRange.map((inputIndex) =>
      inputIndex === index ? activeTintColor : inactiveTintColor
    )
    const color = position.interpolate({
      inputRange,
      outputRange
    })

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor
    const label = this.props.getLabel({ ...scene, tintColor })
    let marginLeft = 0
    if (isLandscape && showIcon && useHorizontalTabs) {
      marginLeft = LABEL_LEFT_MARGIN
    }
    let marginTop = 0
    if (!isLandscape && showIcon && useHorizontalTabs) {
      marginTop = LABEL_TOP_MARGIN
    }

    if (typeof label === 'string') {
      return (
        <Animated.Text
          style={[styles.label, { color, marginLeft, marginTop }, labelStyle]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      )
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor })
    }

    return label
  }

  _renderIcon = (scene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon
    } = this.props
    if (showIcon === false) {
      return null
    }
    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    )
  }

  _renderTestIDProps = (scene) => {
    const testIDProps =
      this.props.getTestIDProps && this.props.getTestIDProps(scene)
    return testIDProps
  }

  renderCenterButton () {
    const { navigation, jumpToIndex, getOnPress } = this.props
    const { routes } = navigation.state
    const route = routes[this.coachIndex]
    const focused = this.coachIndex === navigation.state.index
    const scene = { route, index: this.coachIndex, focused }
    const previousScene = routes[navigation.state.index]
    const onPress = getOnPress(previousScene, scene)
    return (
      <Fragment>
        <View style={styles.borderMask} />
        <View style={styles.centerButtonContainer}>
          <CoachButton
            navigation={navigation}
            onPress={() =>
              onPress
                ? onPress({ previousScene, scene, jumpToIndex })
                : jumpToIndex(this.coachIndex)
            }
          />
        </View>
      </Fragment>
    )
  }

  // small bulge over center button
  renderBump () {
    return (
      <Fragment>
        <View style={styles.centerButtonBump} />
        <View style={styles.centerButtonBumpMask} />
      </Fragment>
    )
  }

  render () {
    const {
      position,
      navigation,
      jumpToIndex,
      getOnPress,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      animateStyle,
      tabStyle
    } = this.props
    const { routes } = navigation.state
    const previousScene = routes[navigation.state.index]
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)]

    const tabBarStyle = [styles.tabBar, style]

    // Notice for 'renderBump' (small bulge over centered tab) position in markup:
    // To show the overflowing part of the bump on android, the corresponding jsx (renderBumb)
    // needs to be outside of the main-view. On IOS, it needs to be within SafeAreaView, to
    // prevent layout errors on iphonex.
    return (
      <Fragment>
        {/* Remove wrapping view to cover whole screen with blur */}
        <View
          pointerEvents={'box-none'}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <TaskActionContent showModal={this.props.screenProps.showModal} />
        </View>
        {this.renderBump()}
        <Animated.View style={[styles.wrapper, animateStyle]}>
          <View style={[tabBarStyle]}>
            {routes.map((route, index) => {
              const focused = index === navigation.state.index
              const scene = { route, index, focused }
              const onPress = getOnPress(previousScene, scene)

              const outputRange = inputRange.map((inputIndex) =>
                inputIndex === index
                  ? activeBackgroundColor
                  : inactiveBackgroundColor
              )
              const backgroundColor = position.interpolate({
                inputRange,
                outputRange
              })
              const extraProps = this._renderTestIDProps(scene) || {}
              const { testID, accessibilityLabel } = extraProps
              return (
                <TouchableWithoutFeedback
                  key={route.key}
                  testID={testID}
                  accessibilityLabel={accessibilityLabel}
                  onPress={() =>
                    onPress
                      ? onPress({
                        previousScene,
                        scene,
                        jumpToIndex
                      })
                      : jumpToIndex(index)
                  }
                >
                  <Animated.View
                    style={[styles.tab, { backgroundColor }, tabStyle]}
                  >
                    {this._renderIcon(scene)}
                    {this._renderLabel(scene)}
                  </Animated.View>
                </TouchableWithoutFeedback>
              )
            })}
          </View>
        </Animated.View>
        {this.renderCenterButton()}
        {isIphoneX() ? (
          <View
            style={{
              height: IPHONEX_OFFSET,
              backgroundColor: Colors.tabBar.background
            }}
          />
        ) : null}
      </Fragment>
    )
  }
}

const IPHONEX_OFFSET = isIphoneX() ? 20 : 0
const LABEL_LEFT_MARGIN = 20
const LABEL_TOP_MARGIN = 0
const centerButtonBackgroundWidth = 56 + StyleSheet.hairlineWidth
const centerButtonMaskWidth = 56
const styles = StyleSheet.create({
  centerButtonBump: {
    position: 'absolute',
    height: centerButtonBackgroundWidth,
    width: centerButtonBackgroundWidth,
    bottom: 18 + IPHONEX_OFFSET,
    borderRadius: centerButtonBackgroundWidth / 2,
    left: '50%',
    transform: [{ translateX: -(centerButtonBackgroundWidth / 2) }],
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },
  centerButtonBumpMask: {
    position: 'absolute',
    height: centerButtonMaskWidth,
    width: centerButtonMaskWidth,
    bottom: 18 + IPHONEX_OFFSET,
    borderRadius: centerButtonMaskWidth / 2,
    left: '50%',
    transform: [{ translateX: -(centerButtonMaskWidth / 2) }],
    backgroundColor: Colors.tabBar.background
  },
  borderMask: {
    position: 'absolute',
    height: 2,
    width: 52,
    bottom: 54 + IPHONEX_OFFSET,
    left: '50%',
    transform: [{ translateX: -26 }],
    backgroundColor: Colors.tabBar.background
  },
  centerButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 56,
    bottom: 18 + IPHONEX_OFFSET,
    left: '50%',
    borderRadius: 28,
    transform: [{ translateX: -28 }]
  },
  tabBar: {
    backgroundColor: Colors.tabBar.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
    height: 56
  },
  tab: {
    height: 56,
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  icon: {
    flexGrow: 1
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 3,
    backgroundColor: 'transparent'
  }
})

export default TabBarBottom

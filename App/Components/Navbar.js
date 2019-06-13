import React, { Component } from 'react'
import { Platform, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { Metrics, Colors } from '../Themes/'
import NavBarButton from './NavBarButton'
import GUIActions from '../Redux/GUIRedux'
import Badge from './Badge'
import AppConfig from '../Config/AppConfig'

class PMNavigationBar extends Component {
  constructor (props) {
    super(props)
    this.defaultLeftButton = (
      <NavBarButton
        position='left'
        icon='ios-menu'
        onPress={() => this.props.toggleSideMenu()}
      />
    )
  }

  render () {
    const { title, toggleSideMenu, rightButton, leftButton } = this.props
    return (
      <View style={styles.wrapper}>
        <NavigationBar
          {...NavigationBarStyles}
          title={{
            title: title,
            tintColor: NavigationBarStyles.title.tintColor
          }}
          leftButton={leftButton || this.defaultLeftButton}
          rightButton={rightButton}
        />
        <Badge
          containerStyle={styles.badgeContainer}
          onPress={() => toggleSideMenu()}
        />
      </View>
    )
  }
}

let badgeTopPosition = Metrics.navbarHeight / 2 - 19

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.navigationBar.background,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2
    },
    // We don't need zIndex on Android, disable it since it's buggy
    zIndex: Platform.OS === 'android' ? 0 : 1
  },
  badgeContainer: {
    position: 'absolute',
    elevation: 5,
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            top: badgeTopPosition + 40
          },
          {
            top: badgeTopPosition + 20
          }
        )
      },
      android: {
        top: badgeTopPosition + Metrics.statusBarMargin
      }
    }),
    left: 24,
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
})

const NavigationBarStyles = {
  containerStyle: {
    ...Platform.select({
      ios: {
        height: Metrics.navbarHeight + 20,
        ...ifIphoneX({
          height: Metrics.navbarHeight + 41,
          paddingTop: 20
        })
      },
      android: {
        marginTop: Metrics.statusBarMargin,
        height: Metrics.navbarHeight
      }
    }),
    justifyContent: 'center',
    backgroundColor: Colors.navigationBar.background
  },
  statusBar: {
    style: 'light-content',
    hidden: false
  },
  title: {
    tintColor: 'white',
    height: 50
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    coach: state.settings.coach,
    guistate: state.guistate
  }
}

const mapStateToDispatch = (dispatch) => ({
  toggleSideMenu: () => dispatch(GUIActions.toggleSideMenu())
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(PMNavigationBar)

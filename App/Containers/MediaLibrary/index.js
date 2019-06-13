import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TabBar, TabView, SceneMap } from 'react-native-tab-view'
import hexToRgba from 'hex-to-rgba'

import I18n from '../../I18n/I18n'
import { normalize } from '../../Utils/Common'
import PMNavigationBar from '../../Components/Navbar'
import { Colors } from '../../Themes/'
import Backpack from '../Backpack/Backpack'
import MediaLibrary from './MediaLibrary'

class DiaryContainer extends Component {
  constructor (props) {
    super(props)
    let initialTab = 0
    // If initial tab was passed as argument, use it
    if (
      props.navigation.state.params &&
      props.navigation.state.params.initialTab
    ) {
      initialTab = props.navigation.state.params.initialTab
    }
    this.state = {
      index: initialTab,
      routes: [
        {
          key: 'screen1',
          title: I18n.t('MediaLibrary.tabs.infocards')
        },
        { key: 'screen2', title: I18n.t('MediaLibrary.tabs.video') }
      ]
    }
  }

  _handleIndexChange = (index) => {
    this.setState({ index })
  }

  _renderTabBar = (props) => {
    return (
      <View style={styles.wrapper}>
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabStyle}
          renderLabel={this._renderLabel}
          pressColor={'rgba(0,0,0,0.5)'}
          tabStyle={{ paddingLeft: 0, paddingRight: 0 }}
        />
      </View>
    )
  }

  _renderLabel = ({ route }) => {
    return <Text style={styles.tabLabel}>{route.title}</Text>
  }

  _renderScene = SceneMap({
    screen1: () => (
      <Backpack
        hideTitle
        screenProps={{ showModal: this.props.screenProps.showModal }}
      />
    ),
    screen2: () => (
      <MediaLibrary
        hideTitle
        screenProps={{ showModal: this.props.screenProps.showModal }}
      />
    )
  })

  renderNavigationbar (props) {
    let title = I18n.t('MediaLibrary.header')
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderNavigationbar()}
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          // initialLayout={initialLayout}
        />
      </View>
    )
  }
}

export default DiaryContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  wrapper: {
    backgroundColor: Colors.main.appBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: hexToRgba(Colors.main.primary, 0.25),
    width: '100%',
    zIndex: 10
  },
  tabStyle: {
    height: 60,
    elevation: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center'
  },
  tabLabel: {
    fontWeight: '400',
    fontSize: normalize(12),
    marginBottom: 0,
    color: Colors.main.primary
  },
  indicator: {
    backgroundColor: Colors.main.primary
  }
})

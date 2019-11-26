import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Platform, Text } from 'react-native'
import { connect } from 'react-redux'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import ResponsiveImage from '../../Components/ResponsiveImage'
import { Colors, Metrics } from '../../Themes/'
import Chat from './Chat'
import I18n from '../../I18n/I18n'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import ImageFakeContainer from '../../Fixtures/ImageFakeContainer'
import StoryProgressActions from '../../Redux/StoryProgressRedux'

class MultiChannelChat extends Component {
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
        { key: 'channel1', title: I18n.t('Coaches.' + props.coach) },
        { key: 'channel2', title: 'Channel2' },
        { key: 'channel3', title: 'Channel3' }
      ]
    }
  }

  _renderLabel = ({ route }) => (
    <Text style={styles.tabLabel}>{route.title}</Text>
  )

  _handleIndexChange = (index) => {
      this.setState({ index })
  }

  _renderHeader = (props) => {
    return (
      <View style={styles.wrapper}>
        <TabBar
          {...props}
          renderLabel={this._renderLabel}
          style={styles.tabStyle}
          pressColor={'#000'}
          indicatorStyle={styles.indicator}
        />
      </View>
    )
  }

  _renderScene = SceneMap({
    channel1: () => <Chat {...this.props} hideNavigationBar />,
    // Note that props passed this way won't update on changes (see: https://github.com/react-native-community/react-native-tab-view/issues/241)
    // in this case this is not relevant though
    channel2: () => this.renderCoachChannel(),
    channel3: () => this.renderCompanyChannel()
  })

  renderCompanyChannel (source) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.main.chatBackground }}
      >
        <ImageFakeContainer
          source={require('../../Images/FakeScreens/chatCompany.jpg')}
        />
      </ScrollView>
    )
  }

  renderCoachChannel (source) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: Colors.main.chatBackground
          }}
        >
          <ImageFakeContainer
            source={require('../../Images/FakeScreens/chatcoach.jpg')}
          />
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <ResponsiveImage
            source={require('../../Images/FakeScreens/inputbar.png')}
          />
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          // initialLayout={initialLayout}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  coach: state.settings.coach
})

const mapStateToDispatch = (dispatch) => ({
  visitScreen: (visitedScreen) =>
    dispatch(StoryProgressActions.visitScreen(visitedScreen))
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(MultiChannelChat)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: Colors.main.primary,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  wrapper: {
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    // Android shadow
    elevation: 2,
    zIndex: 10
  },
  tabStyle: {
    backgroundColor: Colors.main.primary,
    height: Metrics.navbarHeight,
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {
        marginTop: 20,
        ...ifIphoneX({
          marginTop: 41
        })
      }
    })
  },
  tabLabel: {
    fontWeight: '500',
    fontSize: 17,
    marginBottom: 5,
    color: Colors.navigationBar.text
  },
  indicator: {
    backgroundColor: '#fff'
  }
})

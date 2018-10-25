import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { SuperGridSectionList } from 'react-native-super-grid'
import propTypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import StoryProgressRedux from '../../Redux/StoryProgressRedux'
import { connect } from 'react-redux'
import {Colors} from '../../Themes/'
import PMNavigationBar from '../../Components/Navbar'
import I18n from '../../I18n/I18n'
import Common from '../../Utils/Common'

const INITIAL_DELAY = 800
const DELAY = 300

class Item extends Component {
  static propTypes = {
    onPress: propTypes.func,
    delay: propTypes.number,
    title: propTypes.string,
    subtitle: propTypes.string,
    appearAnimation: propTypes.string
  }

  render () {
    return (
      <TouchableWithoutFeedback style={{backgroundColor: 'transparent'}} onPress={() => this.refs.view.pulse(250).then(() => this.props.onPress())}>
        <Animatable.View style={styles.cardContainer} useNativeDriver ref='view' delay={this.props.delay} duration={1800} animation={this.props.appearAnimation}>
          {this.renderTitles()}
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }

  renderTitles () {
    if (!Common.isBlank(this.props.subtitle)) {
      return (
        <View style={styles.cardView}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.subtitle}>{this.props.subtitle}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.cardView}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      )
    }
  }
}

class Backpack extends Component {
  constructor (props) {
    super(props)
    // Remember all info-cards which need to be marked as shown
    this.infoToBeMarkedAsShown = []
    this.infoArray = []
  }

  componentWillMount () {
    const {backpackInfo} = this.props
    // Mark all info-cards as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    let delay = INITIAL_DELAY
    Object.keys(backpackInfo).map((key, index) => {
      const infoItem = backpackInfo[key]
      let itemDelay = delay
      let appearAnimation
      // increment delay for every unplayed animation
      if (infoItem.appearAnimationPlayed === undefined || !infoItem.appearAnimationPlayed) {
        delay = delay + DELAY
        appearAnimation = 'bounceIn'
        // also remember this video card so it's animation can be marked as played
        this.infoToBeMarkedAsShown.push(key)
      }
      const info = {
        ...infoItem,
        key,
        appearAnimation,
        delay: itemDelay
      }
      this.infoArray.push(info)
    })
    // Sort Array from timestamp
    this.infoArray.sort((a, b) => {
      if (a.time > b.time) {
        return 1
      }
      if (a.time < b.time) {
        return -1
      }
      return 0
    })
  }

  renderNavigationbar (props) {
    let title = I18n.t('Backpack.header')
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    )
  }

  componentWillUnmount () {
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    this.infoToBeMarkedAsShown.map((info) => {
      this.props.setAnimationShown(info)
    })
  }

  render () {
    const {showModal} = this.props.screenProps
    return (
      <View style={styles.container}>
        {this.renderNavigationbar(this.props)}
        <View style={styles.content}>
          <Image source={require('../../Images/Backpack/backpack.jpg')} style={styles.backgroundImage} />
          <ScrollView style={styles.grid} indicatorStyle='white'>
            <SuperGridSectionList
              itemDimension={130}
              spacing={20}
              sections={[
                {
                  title: '',
                  data: this.infoArray
                }]
              }
              style={styles.gridView}
              renderItem={({item, index}) => {
                return (
                  <Item appearAnimation={item.appearAnimation} delay={item.delay} title={item.title} subtitle={item.subtitle} onPress={() => showModal('rich-text', {htmlMarkup: item.content})} />
                )
              }}
              renderSectionHeader={({ section }) => null}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    backpackInfo: state.storyProgress.backpackInfo
  }
}

const mapStateToDispatch = dispatch => ({
  setAnimationShown: (info) => dispatch(StoryProgressRedux.setInfoCardAnimationPlayed(info))
})

export default connect(mapStateToProps, mapStateToDispatch)(Backpack)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground
  },
  content: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  grid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  gridView: {
    paddingTop: 25,
    flex: 1
  },
  cardView: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  cardContainer: {
    // iOS shadow
    backgroundColor: Colors.modules.backpack.infoBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    borderRadius: 5,
    // Android shadow
    elevation: 2
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.modules.backpack.infoText
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.modules.backpack.infoText
  }
})

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { SuperGridSectionList } from 'react-native-super-grid'
import * as Animatable from 'react-native-animatable'
import propTypes from 'prop-types'

import StoryProgressRedux from '../../Redux/StoryProgressRedux'
import {Colors} from '../../Themes/'
import PMNavigationBar from '../../Components/Navbar'
import I18n from '../../I18n/I18n'

import Thumbnails from './Thumbnails'

const INITIAL_DELAY = 800
const DELAY = 300

class Item extends Component {
  static propTypes = {
    onPress: propTypes.func,
    delay: propTypes.number,
    thumbnail: Image.propTypes.source.isRequired,
    appearAnimation: propTypes.string
  }

  render () {
    return (
      <TouchableWithoutFeedback onPress={() => this.refs.view.pulse(250).then(() => this.props.onPress())}>
        <Animatable.View style={styles.cardContainer} useNativeDriver ref='view' delay={this.props.delay} duration={1800} animation={this.props.appearAnimation}>
          <View style={styles.cardView}>
            <Image
              source={this.props.thumbnail}
              resizeMode='contain'
              style={{width: '100%'}}
            />
            <Icon containerStyle={{position: 'absolute', alignSelf: 'center'}} color={'rgba(255,255,255,0.4)'} size={75} name='play-circle-o' type='font-awesome' />
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }
}

class MediaLibrary extends Component {
  constructor (props) {
    super(props)
    // Remember all videos which need to be marked as shown
    this.videosToBeMarkedAsShown = []
    this.videoArray = []
  }

  componentWillMount () {
    const {mediaLibrary} = this.props
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    let delay = INITIAL_DELAY

    Object.keys(mediaLibrary).map((key, index) => {
      const videoItem = mediaLibrary[key]

      let thumbnail = Thumbnails.default
      if (Thumbnails[videoItem.thumbnail]) thumbnail = Thumbnails[videoItem.thumbnail]

      let itemDelay = delay
      let appearAnimation
      // increment delay for every unplayed animation
      if (videoItem.appearAnimationPlayed === undefined || !videoItem.appearAnimationPlayed) {
        delay = delay + DELAY
        appearAnimation = 'bounceIn'
        // also remember this video card so it's animation can be marked as played
        this.videosToBeMarkedAsShown.push(key)
      }

      const video = {
        ...videoItem,
        thumbnail,
        key,
        appearAnimation,
        delay: itemDelay
      }
      this.videoArray.push(video)
    })

    // Sort Array from timestamp
    this.videoArray.sort((a, b) => {
      if (a.time > b.time) {
        return 1
      }
      if (a.time < b.time) {
        return -1
      }
      return 0
    })
  }

  componentWillUnmount () {
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    this.videosToBeMarkedAsShown.map((video) => {
      this.props.setAnimationShown(video)
    })
  }

  renderNavigationbar (props) {
    let title = I18n.t('MediaLibrary.header')
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    )
  }

  render () {
    const {showModal} = this.props.screenProps
    return (
      <View style={styles.container}>
        {this.renderNavigationbar(this.props)}
        <View style={styles.content}>
          {/* <Image source={require('../../Images/Backpack/backpack.jpg')} style={styles.backgroundImage} /> */}
          <ScrollView style={styles.grid} indicatorStyle='white'>
            <SuperGridSectionList
              itemDimension={130}
              spacing={20}
              sections={[
                {
                  title: '',
                  data: this.videoArray
                }]
              }
              style={styles.gridView}
              renderItem={({item, index}) => {
                return (
                  <Item thumbnail={item.thumbnail} appearAnimation={item.appearAnimation} delay={item.delay} onPress={() => showModal('fullscreen-video', {source: item.uri, initialPosition: 0, closeFullscreenCallback: () => null})} />
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
    mediaLibrary: state.storyProgress.mediaLibrary
  }
}

const mapStateToDispatch = dispatch => ({
  setAnimationShown: (video) => dispatch(StoryProgressRedux.setVideoCardAnimationPlayed(video))
})

export default connect(mapStateToProps, mapStateToDispatch)(MediaLibrary)

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
    backgroundColor: '#fff',
    aspectRatio: 16 / 9
  },
  cardContainer: {
    // iOS shadow
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
  }
})

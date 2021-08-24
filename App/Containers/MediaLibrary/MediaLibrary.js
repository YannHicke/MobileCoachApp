import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { SuperGridSectionList } from 'react-native-super-grid';
import * as Animatable from 'react-native-animatable';
import propTypes from 'prop-types';
import _ from 'lodash';

import ServerMessageActions from './../../Redux/MessageRedux';
import StoryProgressRedux from '../../Redux/StoryProgressRedux';
import { Colors, Metrics } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar';
import I18n from '../../I18n/I18n';
import Common, { normalize } from '../../Utils/Common';

import MediaInfo from './MediaInfo';

const INITIAL_DELAY = 200;
const DELAY = 300;
const ICON_SIZE = (Metrics.screenWidth - 100) / 2;

class Item extends Component {
  static propTypes = {
    onPress: propTypes.func,
    delay: propTypes.number,
    thumbnail: Image.propTypes.source.isRequired,
    appearAnimation: propTypes.string,
    title: propTypes.string,
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          this.refs.view.pulse(250).then(() => this.props.onPress())
        }>
        <Animatable.View
          style={styles.cardContainer}
          useNativeDriver
          ref="view"
          delay={this.props.delay}
          duration={1800}
          animation={this.props.appearAnimation}>
          {/*
            old layout with thumbnail
          <View style={styles.cardView}>
            <View style={{flex: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5, overflow: 'hidden', justifyContent: 'center'}}>
              <Image
                source={this.props.thumbnail}
                resizeMode='cover'
                style={{flex: 1, width: '100%'}}
                />
              <Icon containerStyle={{position: 'absolute', alignSelf: 'center'}} color={'rgba(255,255,255,0.4)'} size={75} name='play-circle-o' type='font-awesome' />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, padding: 10, marginBottom: 5 }}>
              <Text numberOfLines={2} style={{textAlign: 'center', flex: 1, fontSize: 16, color: Colors.buttons.common.text}}>{this.props.title}</Text>
            </View>
          </View>
          */}
          {this.renderTitles()}
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }

  renderTitles() {
    if (!Common.isBlank(this.props.subtitle)) {
      return (
        <View style={styles.cardView}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.subtitle}>{this.props.subtitle}</Text>
          <Icon
            containerStyle={{
              position: 'absolute',
              alignSelf: 'center',
            }}
            color={'rgba(255,255,255,0.1)'}
            size={ICON_SIZE}
            name="play-circle-o"
            type="font-awesome"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.cardView}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Icon
            containerStyle={{
              position: 'absolute',
              alignSelf: 'center',
            }}
            color={'rgba(255,255,255,0.1)'}
            size={ICON_SIZE}
            name="play-circle-o"
            type="font-awesome"
          />
        </View>
      );
    }
  }
}

class MediaLibrary extends Component {
  constructor(props) {
    super(props);
    // Remember all videos which need to be marked as shown
    this.videosToBeMarkedAsShown = [];
    this.videoArray = [];
  }

  componentWillUnmount() {
    this.unmount();
  }

  mount() {
    const { mediaLibrary } = this.props;
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    let delay = INITIAL_DELAY;

    Object.keys(mediaLibrary).map((key, index) => {
      const videoItem = mediaLibrary[key];
      if (!_.some(this.videoArray, videoItem)) {

        let mediaInfo = MediaInfo.default;
        if (MediaInfo[videoItem.medianame]) {
          mediaInfo = MediaInfo[videoItem.medianame];
        }

        let itemDelay = delay;
        let appearAnimation;
        // increment delay for every unplayed animation
        if (
          videoItem.appearAnimationPlayed === undefined ||
          !videoItem.appearAnimationPlayed
        ) {
          delay = delay + DELAY;
          appearAnimation = 'bounceIn';
          // also remember this video card so it's animation can be marked as played
          this.videosToBeMarkedAsShown.push(key);
        }

        const video = {
          ...videoItem,
          thumbnail: mediaInfo.thumbnail,
          title: mediaInfo.title,
          key,
          appearAnimation,
          delay: itemDelay,
        };
        this.videoArray.push(video);
      }
    });

    // Sort Array from timestamp
    this.videoArray.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });
  }

  unmount() {
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    this.videosToBeMarkedAsShown.map((video) => {
      this.props.setAnimationShown(video);
    });

    // Remember all info-cards which need to be marked as shown
    this.videosToBeMarkedAsShown = [];
    this.videoArray = [];
  }

  renderNavigationbar(props) {
    let title = I18n.t('MediaLibrary.header');
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    );
  }

  render() {
    const { hideTitle, mediaLibrary } = this.props;
    return (
      <View style={styles.container}>
        {hideTitle ? null : this.renderNavigationbar(this.props)}
        <View style={styles.content}>
          {_.isEmpty(mediaLibrary)
            ? this.renderEmptyNotice()
            : this.renderContent()}
        </View>
      </View>
    );
  }

  renderContent() {
    const { showModal } = this.props.route.params.screenProps;
    this.mount();
    return (
      <ScrollView style={styles.grid} indicatorStyle="white">
        <SuperGridSectionList
          itemDimension={150}
          spacing={0}
          sections={[
            {
              title: '',
              data: this.videoArray,
            },
          ]}
          style={styles.gridView}
          renderItem={({ item, index }) => {
            return (
              <Item
                thumbnail={item.thumbnail}
                title={item.title}
                subtitle={item.subtitle}
                appearAnimation={item.appearAnimation}
                delay={item.delay}
                onPress={() => {
                  this.props.sendIntention(
                    null,
                    'library-video',
                    item.medianame,
                  );
                  showModal('fullscreen-video', {
                    source: item.uri,
                    initialPosition: 0,
                    closeFullscreenCallback: () => null,
                  });
                }}
              />
            );
          }}
          renderSectionHeader={({ section }) => null}
        />
      </ScrollView>
    );
  }

  renderEmptyNotice() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 25,
          alignItems: 'center',
        }}>
        <Text
          style={{
            marginBottom: 10,
            fontSize: 20,
            color: Colors.main.grey1,
            textAlign: 'center',
          }}>
          {I18n.t('MediaLibrary.noDataTitle').toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.main.grey2,
            textAlign: 'center',
          }}>
          {I18n.t('MediaLibrary.noVideoData')}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mediaLibrary: state.storyProgress.mediaLibrary,
    currentScreen: state.guistate.currentScreen,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setAnimationShown: (video) =>
    dispatch(StoryProgressRedux.setVideoCardAnimationPlayed(video)),
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground,
  },
  content: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  grid: {
    paddingHorizontal: 7,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridView: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
  },
  cardView: {
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttons.common.background,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    // Android shadow
    elevation: 2,
  },
  cardContainer: {
    aspectRatio: 1,
    padding: 7,
  },
  title: {
    textAlign: 'center',
    fontSize: normalize(14),
    color: Colors.modules.infoCardsLibrary.infoText,
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: normalize(12),
    color: Colors.modules.infoCardsLibrary.infoText,
  },
});

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SuperGridSectionList } from 'react-native-super-grid';
import propTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ServerMessageActions from '../../Redux/MessageRedux';
import StoryProgressRedux from '../../Redux/StoryProgressRedux';
import { connect } from 'react-redux';
import { Colors, Metrics } from '../../Themes';
import PMNavigationBar from '../../Components/Navbar';
import I18n from '../../I18n/I18n';
import Common, { normalize } from '../../Utils/Common';

const INITIAL_DELAY = 200;
const DELAY = 300;
const ICON_SIZE = (Metrics.screenWidth - 120) / 2;

class Item extends Component {
  static propTypes = {
    onPress: propTypes.func,
    delay: propTypes.number,
    title: propTypes.string,
    subtitle: propTypes.string,
    appearAnimation: propTypes.string,
  };

  render() {
    return (
      <TouchableWithoutFeedback
        style={{ backgroundColor: 'transparent' }}
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
          <FontAwesome5
            style={{ position: 'absolute', alignSelf: 'center' }}
            color={'rgba(255,255,255,0.1)'}
            name={'lightbulb'}
            size={ICON_SIZE}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.cardView}>
          <Text style={styles.title}>{this.props.title}</Text>
          <FontAwesome5
            style={{ position: 'absolute', alignSelf: 'center' }}
            color={'rgba(255,255,255,0.1)'}
            name={'lightbulb'}
            size={ICON_SIZE}
          />
        </View>
      );
    }
  }
}

class InfoCardsLibrary extends Component {
  constructor(props) {
    super(props);
    // Remember all info-cards which need to be marked as shown
    this.infoToBeMarkedAsShown = [];
    this.infoArray = [];
  }

  mount() {
    const { infoCardsLibraryInfo } = this.props;
    // Mark all info-cards as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    let delay = INITIAL_DELAY;
    Object.keys(infoCardsLibraryInfo).map((key, index) => {
      const infoItem = infoCardsLibraryInfo[key];
      let itemDelay = delay;
      let appearAnimation;
      // increment delay for every unplayed animation
      if (
        infoItem.appearAnimationPlayed === undefined ||
        !infoItem.appearAnimationPlayed
      ) {
        delay = delay + DELAY;
        appearAnimation = 'bounceIn';
        // also remember this video card so it's animation can be marked as played
        this.infoToBeMarkedAsShown.push(key);
      }
      const info = {
        ...infoItem,
        key,
        appearAnimation,
        delay: itemDelay,
      };
      this.infoArray.push(info);
    });
    // Sort Array from timestamp
    this.infoArray.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });
  }

  // TODO: Needs to be refactored
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.currentScreen !== this.props.currentScreen) {
      if (newProps.currentScreen === 'Library') {
        // Navigating to library screen
        this.mount();
      } else {
        // Navigating away from library screen
        this.unmount();
      }
    }
  }

  unmount() {
    // Mark all videos as shown in Component-Will-Unmount to prevent unnessecary re-renders (props will change!).
    // (These updates are only from next mount-cycle!)
    this.infoToBeMarkedAsShown.map((info) => {
      this.props.setAnimationShown(info);
    });

    // Remember all info-cards which need to be marked as shown
    this.infoToBeMarkedAsShown = [];
    this.infoArray = [];
  }

  renderNavigationbar(props) {
    let title = I18n.t('InfoCardsLibrary.header');
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    );
  }

  render() {
    const { infoCardsLibrary, hideTitle } = this.props;

    return (
      <View style={styles.container}>
        {hideTitle ? null : this.renderNavigationbar(this.props)}
        <View style={styles.content}>
          {_.isEmpty(infoCardsLibrary)
            ? this.renderEmptyNotice()
            : this.renderContent()}
        </View>
      </View>
    );
  }

  renderContent() {
    const { showModal } = this.props.route.params.screenProps;
    return (
      <ScrollView style={styles.grid} indicatorStyle="white">
        <SuperGridSectionList
          itemDimension={130}
          spacing={20}
          sections={[
            {
              title: '',
              data: this.infoArray,
            },
          ]}
          style={styles.gridView}
          renderItem={({ item, index }) => {
            return (
              <Item
                appearAnimation={item.appearAnimation}
                delay={item.delay}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => {
                  this.props.sendIntention(null, 'library-info', item.key);
                  showModal('rich-text', {
                    htmlMarkup: item.content,
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
          {I18n.t('InfoCardsLibrary.noDataTitle').toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.main.grey2,
            textAlign: 'center',
          }}>
          {I18n.t('InfoCardsLibrary.noInfoCardsData')}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    infoCardsLibrary: state.storyProgress.infoCardsLibraryInfo,
    currentScreen: state.guistate.currentScreen,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setAnimationShown: (info) =>
    dispatch(StoryProgressRedux.setInfoCardAnimationPlayed(info)),
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoCardsLibrary);

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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  cardView: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardContainer: {
    // iOS shadow
    backgroundColor: Colors.modules.infoCardsLibrary.infoBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    borderRadius: 5,
    // Android shadow
    elevation: 2,
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import ResponsiveImage from './ResponsiveImage';
import I18n from '../I18n/I18n';
import Icon from 'react-native-vector-icons/Ionicons';
import ServerMessageActions from '../Redux/MessageRedux';
import StoryProgressActions from '../Redux/StoryProgressRedux';
import { Images, Colors, Metrics } from '../Themes/';
import { badgeStyles } from './Badge';

import Log from '../Utils/Log';
const log = new Log('Components/Menu');

const decapitalizeFirstLetter = function (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.screens = {
      chat: {
        name: 'Chat',
        label: 'Menu.Chat',
        leftIcon: (
          <View>
            <Icon
              name="ios-chatbubbles"
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          </View>
        ),
        modal: false,
        badge: () => this.getChatBadge(),
      },
      dashboardChat: {
        name: 'DashboardChat',
        label: 'Menu.DashboardChat',
        leftIcon: (
          <View>
            <Icon
              name="ios-chatbubbles"
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          </View>
        ),
        modal: false,
        badge: () => this.getDashboardChatBadge(),
      },
      infoCardsLibrary: {
        name: 'InfoCardsLibrary',
        label: 'Menu.InfoCardsLibrary',
        leftIcon: (
          <View>
            <Icon
              name="ios-information-circle"
              style={styles.actionButtonIcon}
            />
          </View>
        ),
        subtitle: '',
        modal: false,
      },
      mediaLibrary: {
        name: 'MediaLibrary',
        label: 'Menu.MediaLibrary',
        leftIcon: (
          <View>
            <Icon name="ios-play-circle" style={styles.actionButtonIcon} />
          </View>
        ),
        subtitle: '',
        modal: false,
      },
      faq: {
        name: 'Faq',
        label: 'Menu.Faq',
        leftIcon: (
          <View>
            <Icon
              name="ios-help-circle"
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          </View>
        ),
        subtitle: '',
        modal: false,
      },
      settings: {
        name: 'Settings',
        label: 'Menu.Settings',
        leftIcon: (
          <View>
            <Icon
              name="ios-settings"
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          </View>
        ),
        subtitle: '',
        modal: false,
      },
      /**
       * This Menu-Item is shown as disabled and will be inaktive until there comes a command 'activate-disabled' from the server
       * It needs a rightIcon-prop which in this case is a lock-symbol.
       * The propertie disengageable says if a Menu-Item can be active/inactive.
       **/
      disabled: {
        name: 'Disabled',
        label: 'Menu.Disabled',
        leftIcon: (
          <View>
            <Icon name="ios-nutrition" style={styles.actionButtonIcon} />
          </View>
        ),
        rightIcon: (
          <View>
            <Icon name="ios-lock" style={styles.actionButtonIcon} />
          </View>
        ),
        subtitle: '',
        modal: false,
        disengageable: true,
      },
    };
  }

  getChatBadge() {
    if (this.props.unreadMessages === 0) {
      return null;
    } else {
      let value = this.props.unreadMessages;
      if (value > 99) {
        value = '99+';
      }
      return {
        value,
        textStyle: badgeStyles.textStyle,
        containerStyle: badgeStyles.containerStyle,
      };
    }
  }

  getDashboardChatBadge() {
    if (this.props.unreadDashboardMessages === 0) {
      return null;
    } else {
      let value = this.props.unreadDashboardMessages;
      if (value > 99) {
        value = '99+';
      }
      return {
        value,
        textStyle: badgeStyles.textStyle,
        containerStyle: badgeStyles.containerStyle,
      };
    }
  }

  // remember the screens visited before returning to chat
  storeVisitedScreen(screen) {
    if (!this.state.visitedScreens.includes(screen)) {
      this.setState({
        visitedScreens: [...this.state.visitedScreens, screen],
      });
    }
  }

  getList() {
    const { storyProgress } = this.props;
    let list = [this.screens.chat];
    // infoCardsLibraryActivated: false,
    if (storyProgress.dashboardChatActivated === true) {
      list.push(this.screens.dashboardChat);
    }
    if (storyProgress.infoCardsLibraryActivated === true) {
      list.push(this.screens.infoCardsLibrary);
    }
    if (storyProgress.mediaLibraryActivated === true) {
      list.push(this.screens.mediaLibrary);
    }
    list.push(this.screens.faq);
    list.push(this.screens.settings);
    // list.push(this.screens.disabled)
    return list;
  }

  onPressHandler(screen) {
    log.action('GUI', 'ScreenChange', screen.name);
    // Store the screen in visited screens
    if (screen.name === 'DashboardChat') {
      this.props.visitScreen('dashboardChat');
    }
    if (screen.name === 'InfoCardsLibrary') {
      this.props.visitScreen('infoCardsLibrary');
    }
    this.props.onItemSelected({
      screen: screen.name,
      modal: screen.modal,
      navigationOptions: screen.navigationOptions,
    });
  }

  getTitle(label) {
    let title = I18n.t(label);
    const { coach } = this.props;
    if (label === 'Menu.Chat') {
      title = I18n.t(label, { coach: I18n.t('Coaches.' + coach) });
    }
    return title;
  }

  renderListItem(l, i) {
    const { storyProgress } = this.props;
    if (!l.disengageable || l.disengageable === undefined) {
      return (
        <ListItem
          // roundAvatar
          onPress={() => this.onPressHandler(l)}
          leftIcon={l.leftIcon}
          key={i}
          title={this.getTitle(l.label)}
          // subtitle={l.subtitle}
          hideChevron
          badge={l.badge ? l.badge() : null}
          titleStyle={{ color: Colors.sideMenu.text }}
        />
      );
    } else {
      const activated =
        storyProgress[decapitalizeFirstLetter(l.name) + 'Activated'];
      return (
        <ListItem
          // roundAvatar
          onPress={activated ? () => this.onPressHandler(l) : () => {}}
          // leftIcon={l.leftIcon}
          rightIcon={l.rightIcon}
          hideChevron={activated}
          key={i}
          title={I18n.t(l.label, { locale: this.props.language })}
          // subtitle={l.subtitle}
          badge={l.badge ? l.badge() : null}
          titleStyle={{
            color: activated
              ? Colors.sideMenu.text
              : Colors.sideMenu.textDisabled,
          }}
        />
      );
    }
  }

  render() {
    let imageWidth = Math.min((2 / 3) * Metrics.screenWidth - 50, 300); // sidemenu is 2/3 of screen
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: 'center',
              marginTop: 40,
              marginBottom: 30,
              ...ifIphoneX({ paddingTop: 20 }),
            }}>
            <ResponsiveImage
              style={{ alignSelf: 'center', zIndex: 100 }}
              width={imageWidth}
              source={Images.appLogo}
            />
          </View>
          <View containerStyle={styles.listContainer}>
            {this.getList().map(this.renderListItem.bind(this))}
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
          }}>
          <ResponsiveImage
            style={{
              alignSelf: 'center',
              zIndex: 100,
              ...ifIphoneX({ paddingBottom: 20 }),
            }}
            width={imageWidth - 40}
            source={Images.poweredByLogo}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    storyProgress: state.storyProgress,
    coach: state.settings.coach,
    unreadMessages: state.guistate.unreadMessages,
    unreadDashboardMessages: state.storyProgress.unreadDashboardMessages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content)),
  resetVisitedScreens: () =>
    dispatch(StoryProgressActions.resetVisitedScreens()),
  visitScreen: (visitedScreen) =>
    dispatch(StoryProgressActions.visitScreen(visitedScreen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightColor: '#bbb',
    borderRightWidth: 1,
    backgroundColor: Colors.sideMenu.background,
  },
  listContainer: {
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: Colors.sideMenu.buttonBackground,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: Colors.sideMenu.actionButton,
  },

  image: { flex: 1, alignSelf: 'stretch', resizeMode: 'contain' },
});

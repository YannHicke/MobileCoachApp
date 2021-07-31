import { View, Alert, Platform } from 'react-native';
import React, { Component } from 'react';
import { GiftedChat, Day } from 'react-native-gifted-chat'; // import { GiftedChat, LoadEarlier, Message } from 'react-native-gifted-chat'
import PMNavigationBar from '../../Components/Navbar';
import ConnectionStateButton from '../../Components/ConnectionStateButton';
// Actions
import DashboardMessageRedux from './../../Redux/DashboardMessageRedux';
import StoryProgressRedux from './../../Redux/StoryProgressRedux';
// Helpers
import I18n from '../../I18n/I18n';
import { connect } from 'react-redux';
import uuid from 'uuid';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Ticks from '../../Components/CustomMessages/Ticks';
import PMTextBubble from '../../Components/CustomMessages/PMTextBubble';
import RepeatingBackgroundImage from '../../Components/RepeatingBackgroundImage';
import Styles, { TextBubbleStyle } from './Styles';
import { Images, Colors } from '../../Themes';
import InputToolbar from '../../Components/InputToolbar';
import { ConnectionStates } from '../../Redux/ServerSyncRedux';
import AppConfig from '../../Config/AppConfig';

import Log from '../../Utils/Log';
import GUIActions from '../../Redux/GUIRedux';
const log = new Log('Containers/Chat/DashboardChat');

const getGiftedChatMessages = (messages) => {
  const messagesArray = Object.values(messages).reverse();
  const giftedChatMessages = [];
  messagesArray.map((message) =>
    giftedChatMessages.push(message.giftedChatMessage),
  );
  return giftedChatMessages;
};

class Chat extends Component {

  componentDidMount() {
    this.setDashboardChatScreenState(true);
    // clear Unread-Messages badge
    this.props.clearUnreadDashboardMessages();
    this.setOnFocusAndBlurListener();
  }

  componentWillUnmount() {
    this.removeOnFocusAndBlurListener();
  }

  setOnFocusAndBlurListener = () => {
    this._onFocusListener = this.props.navigation.addListener('focus', this.dashboardChatOnFocusHandler);
    this._onBlurListener = this.props.navigation.addListener('blur', this.dashboardChatOnBlurHandler);
  }

  removeOnFocusAndBlurListener = () => {
    this._onFocusListener();
    this._onBlurListener();
  }

  dashboardChatOnFocusHandler = () => {
    this.setDashboardChatScreenState(true)
    this.props.clearUnreadDashboardMessages();
  };

  dashboardChatOnBlurHandler = () => {
    this.setDashboardChatScreenState(false);
  };

  setDashboardChatScreenState = (screenState) => {
    if (this.props.guistate.dashboardChatScreenOpen != screenState) {
      this.props.toggleDashboardChatScreenState();
    }
  }

  getChatProperties = () => {
    return {
      // general configuration (Locale, Time, user, etc.)
      locale: I18n.locale,
      timeFormat: 'LT',
      dateFormat: 'LL',
      minInputToolbarHeight: 0,
      user: { _id: 1 },
      onLongPress: () => {
        return null;
      },
      onPressAvatar: () => { }, // { this.showModal('image-lightbox', {source: Images.coaches[this.props.coach]}) },
      keyboardShouldPersistTaps: 'always',
      renderAvatarOnTop: true,
      // Source of messages to display
      messages: this.props.messages,
      // Custom Render Methods to override default renders
      // 1. Messages -> Container for Chat-Bubbles
      // renderMessage: this.renderMessage,
      // 2. Chat-Bubbles
      renderBubble: this.renderBubble,
      // 3. Message-Text inside Chat-Bubbles
      // renderMessageText: this.renderMessageText,
      // 4. Custom Views: Custom Messages, e.g. OpenComponent (determined by 'currentMessage.type')
      // renderCustomView: this.renderCustomView,
      // 5. Render Date-Display
      renderDay: this.renderDay.bind(this),
      // Render-Methods for various other components
      // loadEarlier: this.props.guistate.showLoadEarlier,
      // onLoadEarlier: this.props.loadEarlier,
      renderFooter: this.renderFooter.bind(this),
      // renderLoadEarlier: this.renderLoadEarlier,
      renderTicks: this.renderTicks,
      showModal: this.showModal,
      placeholder: I18n.t('DashboardChat.placeholder'),
      label: I18n.t('DashboardChat.send'),
      // textInputProps: {blurOnSubmit: true},
      renderInputToolbar: () => null,
      // OnSend: Callback when user sends a message (not relevant because no input)
      // onSend: (messages) => this.onSend(messages)
    };
  };

  onSend(message) {
    const { role } = AppConfig.config.serverSync;
    log.debug('Sending message:', message);
    const id = uuid.v4();
    this.props.sendMessageToServer(id, message, new Date(), role);
  }

  renderTicks(currentMessage) {
    return <Ticks currentMessage={currentMessage} />;
  }

  renderBubble(props) {
    const { currentMessage } = props;
    currentMessage.user.avatar = Images.coachGeneric;
    currentMessage.user.name = I18n.t(
      'DashboardChat.user.' + currentMessage.user._id,
    );

    return (
      <PMTextBubble
        chatProps={props}
        wrapperStyle={TextBubbleStyle.wrapperStyle}
        textStyle={TextBubbleStyle.textStyle}
        appearInAnimationLeft="bounceIn"
      />
    );
  }

  renderFooter() {
    return (
      <View style={[Styles.footerContainer, { paddingBottom: 10 }]}>
        <InputToolbar
          placeholder={I18n.t('DashboardChat.placeholder')}
          onSubmit={(message) => this.onSend(message)}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }

  showConnectionStateMessage = (connectionState) => {
    log.action('GUI', 'ConnectionCheck', connectionState);

    let alertMessage = null;
    switch (connectionState) {
      case ConnectionStates.INITIALIZING:
      case ConnectionStates.INITIALIZED:
        alertMessage = I18n.t('ConnectionStates.initialized');
        break;
      case ConnectionStates.CONNECTING:
      case ConnectionStates.RECONNECTING:
        alertMessage = I18n.t('ConnectionStates.connecting');
        break;
      case ConnectionStates.CONNECTED:
      case ConnectionStates.SYNCHRONIZATION:
        alertMessage = I18n.t('ConnectionStates.connected');
        break;
      case ConnectionStates.SYNCHRONIZED:
        alertMessage = I18n.t('ConnectionStates.synchronized');
        break;
    }

    Alert.alert(
      I18n.t('ConnectionStates.connectionToCoach'),
      alertMessage,
      [{ text: I18n.t('Common.ok'), onPress: () => true }],
      { cancelable: false },
    );
  };

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{ color: Colors.modules.dashboardChat.date }}
      />
    );
  }

  render() {
    return (
      <View style={Styles.chatContainer}>
        <RepeatingBackgroundImage source={Images.chatBg}>
          {this.renderNavigationbar(this.props)}
          <GiftedChat
            ref={(ref) => {
              this.giftedChat = ref;
            }}
            {...this.getChatProperties(this.props)}
          />
        </RepeatingBackgroundImage>
      </View>
    );
  }

  renderNavigationbar(props) {
    const { connectionState } = props;
    let title = I18n.t('DashboardChat.title');
    return (
      <PMNavigationBar
        title={title}
        rightButton={
          <View>
            <ConnectionStateButton
              onPress={() => {
                this.showConnectionStateMessage(connectionState);
              }}
              connectionState={connectionState}
            />
          </View>
        }
        props={props}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    messages: getGiftedChatMessages(state.dashboardMessages),
    guistate: state.guistate,
    storyProgress: state.storyProgress,
    connectionState: state.serverSyncStatus.connectionState,
  };
};

// TODO: Do we still need messageAnsweredByGiftedChat?
const mapDispatchToProps = (dispatch) => ({
  sendMessageToServer: (id, text, timestamp) =>
    dispatch(DashboardMessageRedux.sendDashboardMessage(id, text, timestamp)),
  clearUnreadDashboardMessages: (messageId) =>
    dispatch(StoryProgressRedux.clearUnreadDashboardMessages()),
  toggleDashboardChatScreenState: () =>
    dispatch(GUIActions.toggleDashboardChatScreenState()),
  // loadEarlier: () => dispatch(GUIActions.loadEarlier()),
  // markAnimationAsShown: (messageId) => clearUnreadMessages: (messageId) => dispatch(GUIActions.clearUnreadMessages())
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

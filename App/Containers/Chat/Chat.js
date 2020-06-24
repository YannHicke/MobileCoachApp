import React, { Component } from 'react'
import { View, Alert, Linking, Platform } from 'react-native'
import { GiftedChat, LoadEarlier, Message, Day } from 'react-native-gifted-chat'
import PMNavigationBar from '../../Components/Navbar'
import { addNavigationHelpers } from 'react-navigation'
import ConnectionStateButton from '../../Components/ConnectionStateButton'
// import {Icon} from 'react-native-elements'
// Actions
import ServerMessageActions from './../../Redux/MessageRedux'
import StoryProgressActions from '../../Redux/StoryProgressRedux'
import GUIActions from '../../Redux/GUIRedux'
import GiftedChatMessageActions from '../../Redux/GiftedChatMessageRedux'
// Helpers
import I18n from '../../I18n/I18n'
import { connect } from 'react-redux'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import SplashScreen from 'react-native-splash-screen'
import { ifIphoneX } from 'react-native-iphone-x-helper'

// Components
// TODO: Create index.js of components to be able to import directly from directory
import SelectOneButton from '../../Components/CustomMessages/SelectOneButton'
import RepeatingBackgroundImage from '../../Components/RepeatingBackgroundImage'
import PMMessageText from '../../Components/CustomMessages/PMMessageText'
import OpenComponent from '../../Components/CustomMessages/OpenComponent'
import TextOrNumberInputBubble from '../../Components/CustomMessages/TextOrNumberInputBubble'
import MediaInput from '../../Components/CustomMessages/MediaInput'
import DateInput from '../../Components/CustomMessages/DateInput'
import Likert from '../../Components/CustomMessages/Likert'
import LikertSlider from '../../Components/CustomMessages/LikertSlider'
import EmptyChatIndicator from '../../Components/EmptyChatIndicator'
import TypingIndicator from '../../Components/CustomMessages/TypingIndicator'
import OfflineStatusIndicator from '../../Components/CustomMessages/OfflineStatusIndicator'
import Ticks from '../../Components/CustomMessages/Ticks'
import SelectManyComponent from '../../Components/CustomMessages/SelectManyComponent'
import PMTextBubble from '../../Components/CustomMessages/PMTextBubble'
import BlankMessage from '../../Components/CustomMessages/BlankMessage'
import BlankBubble from '../../Components/CustomMessages/BlankBubble'
import InfoMessage from '../../Components/InfoMessage'
// Config
import AppConfig from '../../Config/AppConfig'
// Styles & Themes
import Styles, { TextBubbleStyle } from './Styles'
import { Images, Colors, Metrics } from '../../Themes'
// Redux
import { ConnectionStates } from '../../Redux/ServerSyncRedux'
import { getGiftedChatMessages } from '../../Redux/Selectors'

// Bug: This is needed for localizing the dates. See https://github.com/FaridSafi/react-native-gifted-chat/issues/614
import 'moment/locale/de'

import Log from '../../Utils/Log'
const log = new Log('Containers/Chat/Chat')

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      renderInputBar: false
    }
    this.renderCustomView = this.renderCustomView.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this)
    this.showModal = this.showModal.bind(this)

    // If there are still visited-screens in storyProgress-Redux (e.g. user visited screen and left app before returning to chat), send visited-screen intention now!
    const { visitedScreens } = props.storyProgress
    if (visitedScreens.length > 0) {
      visitedScreens.forEach((screen) => {
        this.props.sendIntention(null, screen + '-opened', null)
      })
      // clear visited screens again
      this.props.resetVisitedScreens()
    }
  }

  componentDidMount () {
    SplashScreen.hide()

    // clear Unread-Messages badge
    this.props.clearUnreadMessages()
  }

  componentWillReceiveProps (newProps) {
    const oldScreen = this.props.guistate.currentScreen
    const newScreen = newProps.guistate.currentScreen
    if (oldScreen !== newScreen && newScreen === 'Chat') {
      log.info('User navigated to Chat.')
      this.props.clearUnreadMessages()
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
        return null
      },
      onPressAvatar: () => {
        this.showModal('image-lightbox', {
          source: Images.coaches[this.props.coach]
        })
      },
      keyboardShouldPersistTaps: 'handled',
      renderAvatarOnTop: true,
      // Source of messages to display
      messages: this.props.messages,
      // Custom Render Methods to override default renders
      // 1. Messages -> Container for Chat-Bubbles
      renderMessage: this.renderMessage,
      // 2. Chat-Bubbles
      renderBubble: this.renderBubble,
      // 3. Message-Text inside Chat-Bubbles
      renderMessageText: this.renderMessageText,
      // 4. Custom Views: Custom Messages, e.g. OpenComponent (determined by 'currentMessage.type')
      renderCustomView: this.renderCustomView,
      // 5. Render Date-Display
      renderDay: this.renderDay,
      // Render-Methods for various other components
      loadEarlier: this.props.guistate.showLoadEarlier,
      onLoadEarlier: this.props.loadEarlier,
      renderFooter: this.renderFooter,
      renderLoadEarlier: this.renderLoadEarlier,
      renderTicks: this.renderTicks,
      showModal: this.showModal,
      // No input-bar for now
      renderInputToolbar: () => null

      // Settings we dont need right now, but still might be helpful for some usecases
      // (Check default props: https://github.com/FaridSafi/react-native-gifted-chat/blob/dda1f9db5c962efb458518a9c8a2803aa37bd959/src/GiftedChat.js)

      // Can be used to display an activity indicator while loading earlier messages
      // isLoadingEarlier: this.props.isLoadingEarlier,

      // No input toolbar for now (Only relevant with input toolbar)
      // placeholder: I18n.t('Chat.placeholder'),
      // label: I18n.t('Chat.send'),

      // OnSend: Callback when user sends a message (not relevant because no input)
      // onSend: (messages) => this.onSend(messages)

      // We don't need this now because we use own Action Button Component
      // renderActions: this.renderCustomActions,
      // renderComposer: () => null
    }
  }

  onPressInfoMessage () {
    console.warn(this.props.versionInfo.link[Platform.OS])
    Alert.alert(
      this.props.versionInfo.title[I18n.locale]
        ? this.props.versionInfo.title[I18n.locale]
        : this.props.versionInfo.title.default,
      this.props.versionInfo.message[I18n.locale]
        ? this.props.versionInfo.message[I18n.locale]
        : this.props.versionInfo.message.default,
      [
        { text: I18n.t('Common.ok'), onPress: () => true },
        {
          text: this.props.versionInfo.button[I18n.locale]
            ? this.props.versionInfo.button[I18n.locale]
            : this.props.versionInfo.button.default,
          onPress: () => {
            this.handleOpenLink(this.props.versionInfo.link[Platform.OS])
          }
        }
      ],
      { cancelable: false }
    )
  }

  handleOpenLink = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }

  renderMessage (props) {
    const { currentMessage } = props
    // render unanswered questions as textbubble
    if (currentMessage.custom && currentMessage.custom.unanswered) {
      if (AppConfig.config.messages.showAnswerExpiredMessage) {
        let unansweredMessage = {
          ...currentMessage,
          type: 'text',
          text: I18n.t('Common.answerExpired'),
          user: { ...currentMessage.user, _id: 1 }
        }
        return <Message {...props} currentMessage={unansweredMessage} />
      }
      // Alternative layout
      // else if (AppConfig.config.messages.showExpiryAlert) {
      //   // const {showExpiryAlert} = CommonUtils
      //   return (
      //     <View style={{paddingBottom: 30, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderTopColor: 'rgba(181,181,181,0.1)', borderBottomColor: 'rgba(181,181,181,0.3)'}}>
      //       <BlankMessage {...props} />
      //       <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(181,181,181,0.2)'}}>
      //         <TouchableOpacity>
      //           <View style={{flex: 1, backgroundColor: 'green'}} />
      //         </TouchableOpacity>
      //         <View style={{position: 'absolute', flexDirection: 'row', justifyContent: 'center', bottom: 10, left: 0, right: 0}}>
      //           <Icon color={Colors.main.grey2} size={12} name='timer-sand-empty' type='material-community' /><Text style={{marginLeft: 3, color: Colors.main.grey2}}>Der Antwortzeitraum ist abgelaufen</Text>
      //         </View>
      //       </View>
      //     </View>
      //   )
      // }
    }

    switch (currentMessage.type) {
      case 'select-one-button':
      case 'open-component':
      case 'select-many':
      case 'select-many-modal':
      case 'likert':
      case 'likert-silent':
      case 'likert-slider':
      case 'likert-silent-slider':
      case 'free-text':
      case 'free-numbers':
      case 'date-input':
        // Blank Message = no Avatar or Date are displayed
        return <BlankMessage {...props} />
      default:
        return <Message {...props} />
    }
  }

  renderBubble (props) {
    // return (
    //   <ChatBubble {...props} coach={this.props.coach} />
    // )
    const { currentMessage } = props

    // render unanswered questions as textbubble
    if (
      currentMessage.custom &&
      currentMessage.custom.unanswered &&
      AppConfig.config.messages.showAnswerExpiredMessage
    ) {
      let unansweredMessage = {
        ...currentMessage,
        type: 'text',
        text: I18n.t('Common.answerExpired'),
        user: { ...currentMessage.user, _id: 1 }
      }
      return (
        <PMTextBubble
          chatProps={{ ...props, currentMessage: unansweredMessage }}
          wrapperStyle={TextBubbleStyle.wrapperStyle}
          textStyle={{
            left: {
              ...TextBubbleStyle.textStyle.left,
              fontStyle: 'italic'
            },
            right: {
              ...TextBubbleStyle.textStyle.right,
              fontStyle: 'italic'
            }
          }}
        />
      )
    }

    switch (currentMessage.type) {
      case 'image-message':
      case 'text':
      case 'intention':
        return this.renderTextBubble(props)
      case 'select-one-button':
      case 'open-component':
      case 'select-many':
      case 'select-many-modal':
      case 'likert':
      case 'likert-silent':
      case 'likert-slider':
      case 'likert-silent-slider':
      case 'free-text':
      case 'free-numbers':
      case 'date-input':
      case 'audio':
      case 'image':
      case 'video':
        return this.renderBlankBubble(props)
      default:
        return null
    }
  }

  renderTextBubble (props) {
    return (
      <PMTextBubble
        chatProps={props}
        wrapperStyle={TextBubbleStyle.wrapperStyle}
        textStyle={TextBubbleStyle.textStyle}
        appearInAnimationLeft='bounceIn'
      />
    )
  }

  renderCustomView (props) {
    const { currentMessage } = props
    switch (currentMessage.type) {
      case 'intention':
      case 'text':
        return null
      case 'select-one-button':
        return this.renderSelectButton(props)
      case 'select-many':
        return this.renderSelectManyButton(props)
      case 'open-component':
      case 'select-many-modal':
        return this.renderOpenComponent(props)
      case 'likert':
      case 'likert-silent':
        return this.renderLikert(props)
      case 'likert-slider':
      case 'likert-silent-slider':
        return this.renderLikertSlider(props)
      case 'free-text':
      case 'free-numbers':
        return this.renderTextOrNumberInputBubble(props)
      case 'image':
      case 'audio':
      case 'video':
        return this.renderMediaInput(props)
      case 'date-input':
        return this.renderDateInput(props)
      default:
        return null
    }
  }

  renderBlankBubble (props) {
    return <BlankBubble {...props} />
  }

  renderSelectButton (props) {
    // suitable fadeIn Animations: bounceInRight, fadeInRight, fadeInUp, zoomInRight
    return (
      <SelectOneButton
        onPress={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        fadeOutAnimation='fadeOutRight'
        fadeOutSelectedAnimation='bounceOut'
        duration={350}
        delayOffset={100}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderSelectManyButton (props) {
    return (
      <SelectManyComponent
        onPress={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderTextOrNumberInputBubble (props) {
    return (
      <TextOrNumberInputBubble
        onSubmit={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderMediaInput (props) {
    return (
      <MediaInput
        {...props}
        type={props.currentMessage.type}
        onSubmit={(intention, text, value, relatedMessageId, containsMedia) =>
          this.answerAction(
            intention,
            text,
            value,
            relatedMessageId,
            containsMedia
          )
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderDateInput (props) {
    return (
      <DateInput
        onSubmit={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderLikert (props) {
    return (
      <Likert
        onPress={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        delayOffset={100}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderLikertSlider (props) {
    return (
      <LikertSlider
        onSubmit={(intention, text, value, relatedMessageId) =>
          this.answerAction(intention, text, value, relatedMessageId)
        }
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
      />
    )
  }

  renderOpenComponent (props) {
    const { type } = props.currentMessage
    return (
      <OpenComponent
        onPress={() => this.openComponent(props.currentMessage)}
        onPressSecondButton={() => this.openComponent(props.currentMessage, 1)}
        currentMessage={props.currentMessage}
        fadeInAnimation='fadeInRight'
        duration={350}
        setAnimationShown={(id) => this.props.markAnimationAsShown(id)}
        icon={this.getAppropriateIcon(type, 0)}
        iconType={this.getAppropriateIcon(type, 1)}
        iconPosition={this.getAppropriateIcon(type, 2)}
      />
    )
  }

  getAppropriateIcon (type, field) {
    switch (type) {
      case 'show-infoCardsLibrary-info':
        return ['info-with-circle', 'entypo', 'left'][field]
      case 'show-link':
        return ['external-link', 'feather', 'right'][field]
      default:
        break
    }
    return undefined
  }

  renderMessageText (props) {
    return (
      <PMMessageText
        {...props}
        linkStyle={TextBubbleStyle.textStyle.link}
        currentMessage={props.currentMessage}
        onPress={() =>
          this.openComponent({
            custom: { component: 'progress' }
          })
        }
      />
    )
}

  renderTicks (currentMessage) {
    return <Ticks currentMessage={currentMessage} />
  }

  /*
   * The Camera Button is just for Debugging
   */
  renderNavigationbar () {
    const { hideNavigationBar, coach, connectionState } = this.props
    if (hideNavigationBar) return null
    else {
      let title = I18n.t('Chat.title', {
        coach: I18n.t('Coaches.' + coach)
      })
      return (
        <PMNavigationBar
          title={title}
          props={this.props}
          rightButton={
          <View>
            <ConnectionStateButton
              onPress={() => {
                this.showConnectionStateMessage(connectionState)
              }}
              connectionState={connectionState}
            />
          </View>
          }
        />
      )
    }
  }

  renderLoadEarlier = (props) => {
    return (
      <LoadEarlier
        {...props}
        label={I18n.t('Chat.loadEarlier')}
        containerStyle={{ marginTop: 20 }}
      />
    )
  }

  /* Parameters:
   * intention: string to distinguish between diffrent kind of actions
   *            to fire when the user selects one option
   *            (in most cases this will be to send a answer message to the server)
   * payload:   Object which contains any kind of data we might need from our original message object
   */
  answerAction (
    intention,
    text,
    value,
    relatedMessageId,
    containsMedia = false
  ) {
    switch (intention) {
      case 'answer-to-server-invisible': {
        // Send the textmessage to server
        this.props.sendInvisibleMessageToServer(value, relatedMessageId)
        break
      }
      case 'answer-to-server-visible': {
        // Send the textmessage to server
        this.props.sendMessageToServer(
          text,
          value,
          relatedMessageId,
          containsMedia
        )
        break
      }
      default: {
        log.warn(
          'No answer-action found for intentention of type: ' +
            intention +
            ' relatedMessageId (if set): ' +
            relatedMessageId
        )
        break
      }
    }
  }

  showConnectionStateMessage = (connectionState) => {
    log.action('GUI', 'ConnectionCheck', connectionState)

    let alertMessage = null
    switch (connectionState) {
      case ConnectionStates.INITIALIZING:
      case ConnectionStates.INITIALIZED:
        alertMessage = I18n.t('ConnectionStates.initialized')
        break
      case ConnectionStates.CONNECTING:
      case ConnectionStates.RECONNECTING:
        alertMessage = I18n.t('ConnectionStates.connecting')
        break
      case ConnectionStates.CONNECTED:
      case ConnectionStates.SYNCHRONIZATION:
        alertMessage = I18n.t('ConnectionStates.connected')
        break
      case ConnectionStates.SYNCHRONIZED:
        alertMessage = I18n.t('ConnectionStates.synchronized')
        break
    }

    Alert.alert(
      I18n.t('ConnectionStates.connectionToCoach'),
      alertMessage,
      [{ text: I18n.t('Common.ok'), onPress: () => true }],
      { cancelable: false }
    )
  }

  notifyServer (component, currentMessage = null) {
    if (currentMessage && currentMessage.custom.deactivated) return
    switch (component) {
      case 'rich-text-closed': {
        log.debug('Rich text closed sent')
        if (currentMessage.custom.infoId) {
          let intention = 'info-' + currentMessage.custom.infoId + '-closed'
          this.props.sendIntention(null, intention, null)
        } else {
          log.warn(
            'Cannot send info-closed-notification for message: ' +
              currentMessage.text +
              ', because "info-id" is undefined.'
          )
        }
        break
      }
      case 'rich-text-completed': {
        let relatedMessageId = currentMessage._id.substring(
          0,
          currentMessage._id.lastIndexOf('-')
        )
        log.debug(
          'Rich text closed and completed sent for message',
          relatedMessageId
        )
        this.props.markMessageAsDisabled(relatedMessageId)
        if (currentMessage.custom.infoId) {
          let intention = 'info-' + currentMessage.custom.infoId + '-closed'
          this.props.sendIntention(null, intention, null)
          intention = 'info-' + currentMessage.custom.infoId + '-completed'
          this.props.sendIntention(null, intention, null)
        } else {
          log.warn(
            'Cannot send info-closed-notification for message: ' +
              currentMessage.text +
              ', because "info-id" is undefined.'
          )
        }
        break
      }
      case 'infoCardsLibrary-info-opened': {
        if (currentMessage.custom.content) {
          let intention = 'info-' + currentMessage.custom.content + '-opened'
          this.props.sendIntention(null, intention, null)
        } else {
          log.warn(
            'Cannot send infoCardsLibrary info-opened-notification for message: ' +
              currentMessage.text +
              ', because "content" is undefined.'
          )
        }
        break
      }
      case 'infoCardsLibrary-info-closed': {
        if (currentMessage.custom.content) {
          let intention = 'info-' + currentMessage.custom.content + '-closed'
          this.props.sendIntention(null, intention, null)
        } else {
          log.warn(
            'Cannot send infoCardsLibrary info-closed-notification for message: ' +
              currentMessage.text +
              ', because "content" is undefined.'
          )
        }
        break
      }
      case 'web-closed': {
        log.debug('Web closed sent')
        this.props.sendIntention(null, 'web-closed', null)
        break
      }
      case 'web-completed': {
        let relatedMessageId = currentMessage._id.substring(
          0,
          currentMessage._id.lastIndexOf('-')
        )
        log.debug('Web closed and completed sent for message', relatedMessageId)
        this.props.markMessageAsDisabled(relatedMessageId)
        this.props.sendIntention(null, 'web-closed', null)
        this.props.sendIntention(null, 'web-completed', null)
        break
      }
      case 'select-many-modal': {
        this.props.sendIntention(null, 'select-many-modal-closed', null)
        break
      }
    }
  }

  // This function determines for each component type (e.g. set Rich Component) the
  // corresponding "openComponent"-Function (= Function which is called when user presses the openComponent Button)
  openComponent (currentMessage, clickedButton = 0) {
    const { showModal } = this.props.screenProps
    const { component, content } = currentMessage.custom
    const navigation = addNavigationHelpers({
      dispatch: this.props.navigation.dispatch,
      state: this.props.nav
    })
    // Component specific Logic (e.g. show Modal)
    switch (component) {
      case 'rich-text': {
        let onClose = (completed) => {
          if (completed) {
            this.notifyServer('rich-text-completed', currentMessage)
          } else this.notifyServer('rich-text-closed', currentMessage)
        }
        showModal(component, { htmlMarkup: content }, onClose)
        break
      }
      case 'infoCardsLibrary-info': {
        let onClose = () => {
          this.notifyServer('infoCardsLibrary-info-closed', currentMessage)
        }
        this.notifyServer('infoCardsLibrary-info-opened', currentMessage)
        showModal(
          'rich-text',
          {
            htmlMarkup: this.props.storyProgress.infoCardsLibraryInfo[content].content
          },
          onClose
        )
        break
      }
      case 'web': {
        let onClose = (completed) => {
          if (completed) this.notifyServer('web-completed', currentMessage)
          else this.notifyServer('web-closed', currentMessage)
        }
        showModal(component, { url: content }, onClose)
        break
      }
      case 'progress': {
        showModal(component)
        break
      }
      case 'link': {
        Linking.openURL(content)
        break
      }
      case 'infoCardsLibrary': {
        navigation.navigate('InfoCardsLibrary')
        // remember that user visited that scree for intentions
        this.props.visitScreen('infoCardsLibrary')
        break
      }
      case 'select-many-modal': {
        let onClose = (submitted) => {
          // if no answer was selected, notify server to enable serverside reactions
          if (!submitted) {
            this.notifyServer(component, currentMessage)
          }
        }
        showModal(
          component,
          {
            answerAction: this.answerAction.bind(this),
            currentMessage
          },
          onClose
        )
        break
      }
      default:
        break
    }
  }

  // This function determines for each component type (e.g. set Rich Component) the
  // corresponding "openComponent"-Function (= Function which is called when user presses the openComponent Button)
  showModal (component, content, onClose) {
    const { showModal } = this.props.screenProps
    showModal(component, content, onClose)
  }

  setRenderInputBar = (value) => {
    this.setState({ renderInputBar: value })
  }

  toggleRenderInputBar = () => {
    if (AppConfig.config.dev.allowDebugKeyboard) {
      let value = !this.state.renderInputBar
      this.setState({ renderInputBar: value })
    }
  }

  openModalCameraWindow () {
    Alert.alert('Auswahl der Komponente', '', [
      { text: 'Foto', onPress: () => this.showModal('take-photo') },
      { text: 'Video', onPress: () => this.showModal('take-video') },
      { text: 'Scan QR', onPress: () => this.showModal('scan-qr') }
    ])
  }

  openModalRecordAudioWindow () {
    this.showModal('record-audio')
  }

  renderFooter (props) {
    const {
      coachIsTyping,
      currentlyFurtherMessagesExpected
    } = this.props.guistate
    const { connectionState } = this.props

    let showOfflineStatusMessage = false

    if (!currentlyFurtherMessagesExpected) {
      switch (connectionState) {
        case ConnectionStates.INITIALIZING:
        case ConnectionStates.INITIALIZED:
        case ConnectionStates.CONNECTING:
        case ConnectionStates.RECONNECTING:
        case ConnectionStates.CONNECTED:
          showOfflineStatusMessage = true
          break
        case ConnectionStates.SYNCHRONIZATION:
        case ConnectionStates.SYNCHRONIZED:
          showOfflineStatusMessage = false
          break
      }
    }

    let showTypingIndicator = false
    let showOfflineIndicator = false

    // TODO: unnecessary first condition?
    if ((coachIsTyping && showOfflineStatusMessage) || coachIsTyping) {
      showTypingIndicator = true
    } else if (showOfflineStatusMessage) {
      showOfflineIndicator = true
    }

    return (
      <View style={Styles.footerContainer}>
        {showTypingIndicator ? <TypingIndicator {...props} /> : null}
        {this.props.stickyMessages.map((message) => {
          return (
            <Message
              {...this.getChatProperties()}
              key={message._id}
              currentMessage={message}
            />
          )
        })}
        <OfflineStatusIndicator active={showOfflineIndicator} />
      </View>
    )
  }

  renderLoadingIndicator () {
    return (
      <EmptyChatIndicator
        active={
          this.props.messages.length === 0 && !this.props.guistate.coachIsTyping
        }
        emptyChatMessage={
          AppConfig.config.messages.showEmptyChatMessage
            ? I18n.t('Chat.emptyChatMessage')
            : ''
        }
      />
    )
  }

  renderDay (props) {
    return <Day {...props} textStyle={{ color: Colors.modules.chat.date }} />
  }

  render () {
    return (
      <View style={Styles.chatContainer}>
        <RepeatingBackgroundImage source={Images.chatBg}>
          {this.renderLoadingIndicator()}
          {this.renderNavigationbar()}
          <GiftedChat {...this.getChatProperties()} />
          {this.props.versionInfo &&
          this.props.versionInfo.level === 'orange' ? (
            <InfoMessage
              message={
                this.props.versionInfo.teaser[I18n.locale]
                  ? this.props.versionInfo.teaser[I18n.locale]
                  : this.props.versionInfo.teaser.default
              }
              containerStyle={{
                position: 'absolute',
                zIndex: 100,
                alignSelf: 'center',
                ...Platform.select({
                  ios: {
                    top: Metrics.navbarHeight + 30
                  },
                  android: {
                    top: Metrics.navbarHeight + 10
                  }
                }),
                ...ifIphoneX({
                  top: Metrics.navbarHeight + 50
                })
              }}
              onPress={() => this.onPressInfoMessage()}
            />
          ) : null}
          {Platform.OS === 'android' ? (
            <KeyboardSpacer topSpacing={-60} />
          ) : null}
        </RepeatingBackgroundImage>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    coach: state.settings.coach,
    messages: getGiftedChatMessages(state).messages,
    stickyMessages: getGiftedChatMessages(state).stickyMessages,
    guistate: state.guistate,
    storyProgress: state.storyProgress,
    connectionState: state.serverSyncStatus.connectionState,
    versionInfo: state.serverSyncSettings.versionInfo,
  }
}

// TODO: Do we still need messageAnsweredByGiftedChat?
const mapStateToDispatch = (dispatch) => ({
  sendMessageToServer: (text, value, relatedMessageId = null, containsMedia) =>
    dispatch(
      ServerMessageActions.sendMessage(
        text,
        value,
        relatedMessageId,
        containsMedia
      )
    ),
  sendInvisibleMessageToServer: (value, relatedMessageId = null) =>
    dispatch(
      ServerMessageActions.sendInvisibleMessage(value, relatedMessageId)
    ),
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content)),
  loadEarlier: () => dispatch(GUIActions.loadEarlier()),
  messageAnsweredByGiftedChat: (relatedMessageId) =>
    dispatch(
      ServerMessageActions.messageAnsweredByGiftedChat(relatedMessageId)
    ),
  visitScreen: (visitedScreen) =>
    dispatch(StoryProgressActions.visitScreen(visitedScreen)),
  resetVisitedScreens: () =>
    dispatch(StoryProgressActions.resetVisitedScreens()),
  markMessageAsDisabled: (relatedMessageId) =>
    dispatch(ServerMessageActions.disableMessage(relatedMessageId)),
  markAnimationAsShown: (messageId) =>
    dispatch(
      GiftedChatMessageActions.setMessageAnimationFlag(messageId, false)
    ),
  clearUnreadMessages: (messageId) => dispatch(GUIActions.clearUnreadMessages())
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Chat)

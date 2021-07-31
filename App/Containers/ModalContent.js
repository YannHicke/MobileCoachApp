import React, { Component } from 'react';
import { Modal, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import WebRichContent from '../Components/WebRichContent';
import WebViewContent from '../Components/WebViewContent';
import Lightbox from '../Components/Lightbox';
import FullscreenVideo from '../Components/Video/FullscreenVideo';
import CameraComponent from './../Components/CameraComponent';
//import RecordAudioComponent from './../Components/RecordAudioComponent'
import SelectManyModal from './../Components/SelectManyModal';
import FeedbackForm from './Settings/FeedbackForm';
import ServerMessageActions from '../Redux/MessageRedux';
import GUIActions from '../Redux/GUIRedux';
import { Metrics } from '../Themes';
import I18n from '../I18n/I18n';

// In specific cases, using the real Modal can cause issues.
// E.g. when using panResponder (see: https://github.com/facebook/react-native/issues/14295)
// When useFakeModal is set, a View-Component is used instead.
// const fakeModalTypes = [
//   'image-lightbox',
//   'record-video',
//   'take-photo',
//   'record-audio',
//   'fullscreen-video',
//   'schedule',
// ]

class ModalContent extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    // General Type of the modal content (e.g. 'rich-content')
    type: PropTypes.string,
    // Function to be called when Modal is closed
    onClose: PropTypes.func,
    // Function to set Demo-Dialogue state
    setDemoDialogueState: PropTypes.func,
    // Any other data / functions we might need for a custom modal
    content: PropTypes.object,
  };

  // TODO: can be deleted?
  onSend = (messages = []) => {
    messages.forEach((msg) => {
      // Send the textmessage to server
      this.props.sendMessageToServer(msg.text, msg.text);
    });
  };

  // TODO: Maybe theres a more perfomant way?
  // TODO: Needs to be refactored
  UNSAFE_componentWillReceiveProps(nextProps) {
    // We only need to update disableGestures manually for fakeModal-Screens,
    // on the real modal we can use onShow / onDismiss
    // if (fakeModalTypes.includes(nextProps.type)) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        this.props.disableSidemenuGestures();
      } else {
        this.props.enableSidemenuGestures();
      }
    }
    // }
  }

  render() {
    // if (fakeModalTypes.includes(this.props.type)) return this.renderFakeModal()
    // else return this.renderModal()
    return this.renderFakeModal();
  }

  renderFakeModal() {
    if (this.props.visible) {
      return (
        <Animatable.View
          animation="fadeIn"
          duration={350}
          style={styles.fakeModalStyle}
          useNativeDriver>
          {this.renderContent()}
        </Animatable.View>
      );
    } else {
      return null;
    }
  }

  renderModal() {
    return (
      <Modal
        onShow={() => {
          this.props.disableSidemenuGestures();
        }}
        onDismiss={() => {
          this.props.enableSidemenuGestures();
        }}
        animationType={'fade'}
        transparent
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose();
        }} // for android
      >
        {this.renderContent()}
      </Modal>
    );
  }

  renderContent() {
    switch (this.props.type) {
      case 'rich-text':
        return (
          <WebRichContent
            withHeader
            headerTitle={this.props.content.headerTitle}
            onClose={this.props.onClose}>
            {this.props.content.htmlMarkup}
          </WebRichContent>
        );
      case 'web':
        return (
          <WebViewContent onClose={this.props.onClose}>
            {this.props.content.url}
          </WebViewContent>
        );
      case 'image-lightbox':
        return (
          <Lightbox
            source={this.props.content.source}
            onClose={this.props.onClose}
          />
        );
      case 'fullscreen-video':
        return (
          <FullscreenVideo
            videoPlayer={this.props.content.videoPlayer}
            source={this.props.content.source}
            initialPosition={this.props.content.initialPosition}
            paused={this.props.content.paused}
            closeFullscreenCallback={this.props.content.closeFullscreenCallback}
            onClose={this.props.onClose}
          />
        );
      case 'feedback-form':
        return (
          <FeedbackForm
            onSubmit={(name, email, feedback) => {
              this.props.content.onSubmit(name, email, feedback);
              this.props.onClose();
            }}
            onClose={this.props.onClose}
          />
        );
      case 'take-photo':
        return (
          <CameraComponent
            usage="photo"
            onBack={this.props.onClose}
            title={I18n.t('Common.recordPhoto')}
            onSubmitMedia={this.props.content.onSubmitMedia}
          />
        );
      case 'record-video':
        return (
          <CameraComponent
            usage="video"
            onBack={this.props.onClose}
            title={I18n.t('Common.recordVideo')}
            onSubmitMedia={this.props.content.onSubmitMedia}
          />
        );
      case 'select-many-modal':
        return (
          <SelectManyModal
            onClose={this.props.onClose}
            currentMessage={this.props.content.currentMessage}
            answerAction={this.props.content.answerAction}
          />
        );
      case 'scan-qr':
        return (
          <CameraComponent
            usage="qr"
            onBack={this.props.onClose}
            title={I18n.t('Common.scanQRCode')}
          />
        );
      /*case 'record-audio':
        return (
          <RecordAudioComponent
            onClose={this.props.onClose}
            onSubmitMedia={this.props.content.onSubmitMedia}
          />
        )*/
      default:
        return null;
    }
  }
}
const styles = {
  fakeModalStyle: {
    zIndex: 100,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 0,
      },
      android: {
        top: Metrics.statusBarMargin,
      },
    }),
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
};
const mapDispatchToProps = (dispatch) => ({
  sendMessageToServer: (text, value, relatedMessageId = null) =>
    dispatch(ServerMessageActions.sendMessage(text, value, relatedMessageId)),
  enableSidemenuGestures: () => dispatch(GUIActions.enableSidemenuGestures()),
  disableSidemenuGestures: () => dispatch(GUIActions.disableSidemenuGestures()),
});

export default connect(null, mapDispatchToProps)(ModalContent);

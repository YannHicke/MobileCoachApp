import { takeEvery, all, fork, call, actionChannel } from 'redux-saga/effects';
import { channel, buffers } from 'redux-saga';

/* ------------- Actions ------------- */

import { StartupActions } from '../Redux/StartupRedux';
import { GUIActions } from '../Redux/GUIRedux';
import { MessageActions } from '../Redux/MessageRedux';
import { DashboardMessageActions } from '../Redux/DashboardMessageRedux';
import { SettingsActions } from '../Redux/SettingsRedux';

/* ------------- Sagas ------------- */

import {
  initializeGiftedChat,
  loadEarlierMessages,
} from './GiftedChatMessageSaga';
import {
  sendMessage,
  sendInvisibleMessage,
  sendIntention,
  sendVariableValue,
  sendVariableValues,
  disableMessage,
  executeCommand,
  watchMessageUpdateChannel,
} from './MessageSagas';
import { sendDashboardMessage } from './DashboardMessageSagas';
import {
  setChannels,
  initializeServerSync,
  handleCommands,
  handleNewClientCreatedMessages,
  watchConnectionStateChannel,
  watchIncomingMessageChannel,
  watchOutgoingMessageChannel,
} from './ServerSyncSagas';
import { updateLanguage } from './SettingsSagas';
import { watchAddDashboardMessages } from './StoryProgressSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Actions To Sagas ------------- */

export default function* root() {
  // Server Messages
  const connectionStateChannel = yield call(channel, buffers.expanding());
  const incomingMessageChannel = yield call(channel, buffers.expanding());
  const outgoingMessageChannel = yield call(channel, buffers.expanding());
  setChannels(
    connectionStateChannel,
    incomingMessageChannel,
    outgoingMessageChannel,
  );

  // GiftedChat Messages
  const buffer = buffers.expanding();
  const newOrUpdatedMessagesChannel = yield actionChannel(
    MessageActions.NEW_OR_UPDATED_MESSAGE_FOR_GIFTED_CHAT,
    buffer,
  );

  yield all([
    // Settings Saga
    takeEvery(SettingsActions.CHANGE_LANGUAGE, updateLanguage),

    // StoryProgress Saga
    takeEvery(
      DashboardMessageActions.ADD_OR_UPDATE_DASHBOARD_MESSAGE,
      watchAddDashboardMessages,
    ),

    // GiftedChat (top layer)
    takeEvery(StartupActions.STARTUP, initializeGiftedChat, {
      buffer,
      newOrUpdatedMessagesChannel,
    }),
    takeEvery(GUIActions.LOAD_EARLIER, loadEarlierMessages),

    // Messages (middle layer)
    takeEvery(MessageActions.SEND_MESSAGE, sendMessage),
    takeEvery(MessageActions.SEND_INVISIBLE_MESSAGE, sendInvisibleMessage),
    takeEvery(MessageActions.SEND_INTENTION, sendIntention),
    takeEvery(MessageActions.SEND_VARIABLE_VALUE, sendVariableValue),
    takeEvery(MessageActions.SEND_VARIABLE_VALUES, sendVariableValues),
    takeEvery(MessageActions.DISABLE_MESSAGE, disableMessage),
    takeEvery(MessageActions.EXECUTE_COMMAND, executeCommand),

    takeEvery(
      DashboardMessageActions.SEND_DASHBOARD_MESSAGE,
      sendDashboardMessage,
    ),

    yield fork(watchMessageUpdateChannel),

    // Server Sync (bottom layer)
    takeEvery(StartupActions.STARTUP, initializeServerSync),
    takeEvery(StartupActions.MANUALLY_CONNECT, initializeServerSync),
    takeEvery(MessageActions.COMMAND_TO_EXECUTE, handleCommands),
    takeEvery(
      MessageActions.ADD_OR_UPDATE_MESSAGE,
      handleNewClientCreatedMessages,
    ),
    takeEvery(
      DashboardMessageActions.ADD_OR_UPDATE_DASHBOARD_MESSAGE,
      handleNewClientCreatedMessages,
    ),

    // // User triggered App-Update
    // takeEvery(ServerSyncActions.PERFORM_UPDATE, performUpdate),

    yield fork(watchConnectionStateChannel),
    yield fork(watchIncomingMessageChannel),
    yield fork(watchOutgoingMessageChannel),
  ]);
}

import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import R from 'ramda';

import Log from '../Utils/Log';
const log = new Log('Redux/DashboardMessageRedux');

/* ------------- Actions and Action Creators ------------- */

const { Types, Creators } = createActions({
  sendDashboardMessage: ['id', 'text', 'timestamp'], // saga
  addOrUpdateDashboardMessage: ['message', 'status'],
});

export const MessageStates = {
  PREPARED_FOR_SENDING: 'PREPARED_FOR_SENDING',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
};
export const AuthorTypes = { SERVER: 'SERVER', USER: 'USER' };

export const DashboardMessageActions = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({});

/* ------------- Minimal convert method ------------- */

const formatForGiftedChat = (serverMessage, status) => {
  // user ids: participant: 1, team-manager: 2
  let userId = 1;
  if (serverMessage.role !== 'participant') {
    userId = 2;
  }
  let timestamp = serverMessage['server-timestamp'];
  if (serverMessage['client-timestamp']) {
    timestamp = serverMessage['client-timestamp'];
  }
  let messageStatus = status;
  if (serverMessage.status) {
    messageStatus = serverMessage.status;
  }
  if (serverMessage['client-status']) {
    messageStatus = serverMessage['client-status'];
  }
  // Normalize messages-states (received -> sent)
  if (messageStatus === MessageStates.RECEIVED) {
    messageStatus = MessageStates.SENT;
  }

  let giftedChatMessage = {};
  giftedChatMessage._id = serverMessage['client-id'];
  giftedChatMessage.text = serverMessage['user-message'];
  giftedChatMessage.createdAt = timestamp;
  giftedChatMessage.custom = {
    clientStatus: messageStatus,
  };
  giftedChatMessage.user = {
    _id: userId,
    name: serverMessage.role,
  };
  return giftedChatMessage;
};

/* ------------- Reducers ------------- */

// Add or update dashboard message
export const addOrUpdateDashboardMessage = (state, { message, status }) => {
  log.debug('Add or update dashboard message:', message);
  const mergedMessageToStore = R.mergeDeepRight(
    state[message['client-id']],
    message,
  );
  mergedMessageToStore.giftedChatMessage = formatForGiftedChat(message, status);

  // Set new status
  if (status !== undefined && status !== null) {
    mergedMessageToStore.status = status;
  }

  return { ...state, [message['client-id']]: mergedMessageToStore };
};

/* ------------- Hookup Reducers To Actions ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_OR_UPDATE_DASHBOARD_MESSAGE]: addOrUpdateDashboardMessage,
});

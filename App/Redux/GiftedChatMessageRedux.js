import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import R from 'ramda';

import Common from '../Utils/Common';
import { MessageStates, MessageActions } from '../Redux/MessageRedux';

import Log from '../Utils/Log';
const log = new Log('Redux/GiftedChatMessageRedux');

/* ------------- Actions and Action Creators ------------- */

/* Redux-Sauce automatically creates actions according to the following scheme:
 * loginRequest: ['username', 'password'] =>
 * (username, password) => {
 *    type: LOGIN_REQUEST
 *    username: username,
 *    password: password
 *  }
 */

const { Types, Creators } = createActions({
  // This action will directly add or update the new message in the redux-store
  giftedChatAddMessage: ['message', 'addToStart'],
  // Update giftedchat messages relating to the given server message
  giftedChatUpdateMessages: ['serverMessage'],
  // This action can be invoked externally (e.g. from components)
  giftedChatHandleNewOrUpdatedMessages: ['messages'],
  // This action can be invoked externally (e.g. from components)
  setMessageAnimationFlag: ['messageId', 'value'],
});

export const GiftedChatMessageActions = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  messageObjects: {},
  // Store array of keys for sorting
  messageIds: [],
});

/* ------------- Reducers ------------- */

// add new messages
export const giftedChatAddMessage = (
  state,
  { message, addToStart = false },
) => {
  // This will either add the new message to the state
  // if new message was added, add id to array
  if (Common.isBlank(state.messageObjects[message._id])) {
    if (addToStart) {
      // add to start of array
      state = state.set('messageIds', [message._id].concat(state.messageIds));
    } else {
      // add to end of array
      state = state.set('messageIds', state.messageIds.concat([message._id]));
    }
  }
  // or update the old version of an exisitng message by using recursive deepmerge
  return state.setIn(
    ['messageObjects', message._id],
    R.mergeDeepRight(state.messageObjects[message._id], message),
  );
};

// update wether a message should be animated or not
export const setMessageAnimationFlag = (state, { messageId, value }) => {
  let updatedMessage = R.clone(state.messageObjects[messageId]);
  updatedMessage.custom.shouldAnimate = value;
  return state.setIn(['messageObjects', messageId], updatedMessage);
};

// update GiftedChat Messages relating to the given server message
export const giftedChatUpdateMessages = (state, { serverMessage }) => {
  let updatedMessages = {};
  let subId = 0;
  let messageId = serverMessage['client-id'];
  messageId = messageId + '-' + subId++;
  while (state.messageObjects[messageId]) {
    const oldMsg = state.messageObjects[messageId];

    // update the relevant fields
    let newMsg = {};
    newMsg.custom = {
      clientVersion: serverMessage['client-version'],
      clientStatus: serverMessage['client-status'],
      disabled: serverMessage.disabled,
      sticky: serverMessage.sticky,
    };

    // If message is answered don't render it (anymore)
    if (
      oldMsg.type !== 'text' &&
      (serverMessage['client-status'] === MessageStates.ANSWERED_ON_CLIENT ||
        serverMessage['client-status'] ===
          MessageStates.ANSWERED_AND_PROCESSED_BY_SERVER)
    ) {
      newMsg.custom = {
        ...newMsg.custom,
        visible: false,
      };
    }

    // If message is not answered render it differently
    if (
      oldMsg.type !== 'text' &&
      serverMessage['client-status'] ===
        MessageStates.NOT_ANSWERED_AND_PROCESSED_BY_SERVER
    ) {
      newMsg.custom = {
        ...newMsg.custom,
        unanswered: true,
      };
    }

    // gather all updated messages in one object
    updatedMessages[messageId] = newMsg;
    // increase subId
    messageId = serverMessage['client-id'];
    messageId = messageId + '-' + subId++;
  }
  // Merge old state with updated messages
  return R.mergeDeepRight(state, updatedMessages);
};

// Definition Disabled / Deactivated:
// For answer formats (e.g. select-one) both states are eqaul, but for other Components (e.g. InfoCardsLibrary, WebViews, etc.) the following applies:
// Deactivated: User may still press Button and open Modals (e.g. InfoCardsLibrary), but no intentions will be triggered.
// Disabled: Button will be disabled completely
export const deactivatePreviousMessages = (state, { timestamp }) => {
  for (let i = 0; i < state.messageIds.length; i++) {
    const messageId = state.messageIds[i];
    if (state.messageObjects.hasOwnProperty(messageId)) {
      const message = { ...state.messageObjects[messageId] };
      if (message.custom && message.custom.timestamp < timestamp) {
        // Message older than timestamp: mark as deactivated!
        const deactivatedMessage = R.merge(message, {
          custom: {
            ...message.custom,
            deactivated: true,
            'client-version': message['client-version'] + 1,
          },
        });
        state = state.setIn(['messageObjects', messageId], deactivatedMessage);
      }
    } else {
      log.warn(
        `Tried to deactivate message with id: ${messageId} which couldn't be found in store.`,
      );
    }
  }
  return state;
};

/* ------------- Hookup Reducers To Actions ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GIFTED_CHAT_ADD_MESSAGE]: giftedChatAddMessage,
  [Types.GIFTED_CHAT_UPDATE_MESSAGES]: giftedChatUpdateMessages,
  [Types.SET_MESSAGE_ANIMATION_FLAG]: setMessageAnimationFlag,
  [MessageActions.DEACTIVATE_PREVIOUS_MESSAGES]: deactivatePreviousMessages,
});

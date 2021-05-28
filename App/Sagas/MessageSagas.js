import { select, put, take } from 'redux-saga/effects';
import { channel, buffers } from 'redux-saga';

import { MessageActions, MessageStates } from '../Redux/MessageRedux';

import Log from '../Utils/Log';
const log = new Log('Sagas/MessageSagas');

const selectMessages = (state) => state.messages.messageObjects;

export const MessageTypes = {
  PLAIN: 'PLAIN',
  INTENTION: 'INTENTION',
  VARIABLE: 'VARIABLE',
  VARIABLES: 'VARIABLES',
};

export const messageUpdateChannel = channel(buffers.expanding());

/* --- Send message --- */
export function* sendMessage(action) {
  log.info('Send message...');
  log.action('Dialog', 'SendMessage', 'Timestamp', new Date());

  const { text, value, relatedMessageId, containsMedia } = action;
  let messages = yield select(selectMessages);

  const message = createMessage(
    text,
    value,
    relatedMessageId,
    null,
    null,
    MessageTypes.PLAIN,
    false,
    messages,
    containsMedia,
  );

  let relatedMessage = messages[relatedMessageId];

  if (
    relatedMessageId !== undefined &&
    relatedMessageId !== null &&
    relatedMessage !== undefined
  ) {
    yield put({
      type: MessageActions.MESSAGE_ANSWERED,
      messageId: relatedMessageId,
    });
    messages = yield select(selectMessages);
    relatedMessage = messages[relatedMessageId];
    messageUpdateChannel.put({
      type: MessageActions.NEW_OR_UPDATED_MESSAGE_FOR_GIFTED_CHAT,
      message: relatedMessage,
    });
  }

  yield put({
    type: MessageActions.ADD_OR_UPDATE_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

/* --- Send invisible message --- */
export function* sendInvisibleMessage(action) {
  log.info('Send invisible message...');
  log.action('Dialog', 'SendInvisibleMessage', 'Timestamp', new Date());

  const { value, relatedMessageId } = action;
  let messages = yield select(selectMessages);

  const message = createMessage(
    null,
    value,
    relatedMessageId,
    null,
    null,
    MessageTypes.PLAIN,
    true,
    messages,
  );

  let relatedMessage = messages[relatedMessageId];

  if (
    relatedMessageId !== undefined &&
    relatedMessageId !== null &&
    relatedMessage !== undefined
  ) {
    yield put({
      type: MessageActions.MESSAGE_ANSWERED,
      messageId: relatedMessageId,
    });
    messages = yield select(selectMessages);
    relatedMessage = messages[relatedMessageId];
    messageUpdateChannel.put({
      type: MessageActions.NEW_OR_UPDATED_MESSAGE_FOR_GIFTED_CHAT,
      message: relatedMessage,
    });
  }

  yield put({
    type: MessageActions.ADD_OR_UPDATE_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

/* --- Send intention --- */
export function* sendIntention(action) {
  log.info('Send intention...');
  log.action('Dialog', 'SendIntention', 'Timestamp', new Date());

  const { text, intention, content } = action;
  const messages = yield select(selectMessages);

  let invisible = true;
  if (text !== null) {
    invisible = false;
  }

  const message = createMessage(
    text,
    null,
    null,
    intention,
    typeof content === 'string' ? content : JSON.stringify(content),
    MessageTypes.INTENTION,
    invisible,
    messages,
  );

  yield put({
    type: MessageActions.ADD_OR_UPDATE_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

/* --- Send variable value --- */
export function* sendVariableValue(action) {
  log.info('Send variable value...');
  log.action('Dialog', 'SendVariableValue', 'Timestamp', new Date());

  const { variable, value } = action;
  const messages = yield select(selectMessages);

  const message = createMessage(
    variable.startsWith('$') ? variable : '$' + variable,
    value,
    null,
    null,
    null,
    MessageTypes.VARIABLE,
    true,
    messages,
  );

  yield put({
    type: MessageActions.ADD_OR_UPDATE_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

/* --- Send variable values --- */
export function* sendVariableValues(action) {
  log.info('Send variable values...');
  log.action('Dialog', 'SendVariableValues', 'Timestamp', new Date());

  const { variablesWithValues } = action;
  const messages = yield select(selectMessages);

  const message = createMessage(
    null,
    variablesWithValues,
    null,
    null,
    null,
    MessageTypes.VARIABLES,
    true,
    messages,
  );

  yield put({
    type: MessageActions.ADD_OR_UPDATE_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

/* --- Disable message --- */
export function* disableMessage(action) {
  log.info('Disabling message...');

  const { messageId } = action;
  let messages = yield select(selectMessages);

  let message = messages[messageId];

  if (messageId !== undefined && messageId !== null && message !== undefined) {
    yield put({
      type: MessageActions.MESSAGE_DISABLED_BY_GIFTED_CHAT,
      messageId: messageId,
    });
    // TODO: why second select? (We already have messages)
    messages = yield select(selectMessages);
    message = messages[messageId];
    messageUpdateChannel.put({
      type: MessageActions.NEW_OR_UPDATED_MESSAGE_FOR_GIFTED_CHAT,
      message,
    });
  }
}

/* --- Execute command if it was not already executed --- */
export function* executeCommand(action) {
  log.info('Check command for execution...');

  const { messageId } = action;

  const messages = yield select(selectMessages);
  const relatedMessage = messages[messageId];

  if (relatedMessage !== undefined) {
    if (
      relatedMessage['client-command-executed'] === undefined ||
      !relatedMessage['client-command-executed']
    ) {
      log.info('Command not executed yet, so execute it now...');
      // Special case for commands from messages containing media (command to add-video can't be read from message content in this case)
      if (
        relatedMessage['media-name'] &&
        relatedMessage['media-type'] === 'video'
      ) {
        yield put({
          type: MessageActions.COMMAND_TO_EXECUTE,
          command: 'add-video ' + relatedMessage['media-name'],
          content: {
            title: relatedMessage['media-title'],
            uri: relatedMessage['contains-media'],
          },
          timestamp: relatedMessage['message-timestamp'],
        });
        yield put({ type: MessageActions.COMMAND_EXECUTED, messageId });
      } else {
        yield put({
          type: MessageActions.COMMAND_TO_EXECUTE,
          command: relatedMessage['server-message'],
          content: relatedMessage.content,
          timestamp: relatedMessage['message-timestamp'],
          media: relatedMessage['contains-media'],
          mediaName: relatedMessage['media-name'],
          mediaType: relatedMessage['media-type'],
        });
        yield put({ type: MessageActions.COMMAND_EXECUTED, messageId });
      }
    }
  }
}

/* --- Inform GUI about message changes --- */
export function* watchMessageUpdateChannel() {
  while (true) {
    const action = yield take(messageUpdateChannel);
    log.info('Message update...', action.message);
    yield put(action);
  }
}

/* --- Create a client created message in redux --- */
function createMessage(
  text,
  value,
  relatedMessageId,
  intention,
  content,
  type,
  invisible,
  messages,
  containsMedia = false,
) {
  // Create message
  let message = {};
  switch (type) {
    case MessageTypes.PLAIN:
      message.type = MessageTypes.PLAIN;

      message['user-message'] = text;

      // Optional fields
      if (value !== undefined && value !== null) {
        message['user-value'] = value;
      }
      if (relatedMessageId !== null) {
        message['related-message-id'] = relatedMessageId;
      }
      if (containsMedia) {
        let mediaType = 'image';
        const fileExtension = containsMedia.split('.').pop();
        if (
          fileExtension === 'mp4' ||
          fileExtension === 'mov' ||
          fileExtension === 'm4v'
        ) {
          mediaType = 'video';
        }
        if (fileExtension === 'aac') {
          mediaType = 'audio';
        }
        message['contains-media'] = containsMedia;
        message['media-type'] = mediaType;
      }

      break;
    case MessageTypes.INTENTION:
      message.type = MessageTypes.INTENTION;

      message['user-intention'] = intention;

      // Optional fields
      if (text !== undefined && text !== null) {
        message['user-message'] = text;
      }
      if (content !== undefined && content !== null) {
        message['user-content'] = content;
      }

      break;
    case MessageTypes.VARIABLE:
      message.type = MessageTypes.VARIABLE;

      message.variable = text;
      message.value = value;

      break;
    case MessageTypes.VARIABLES:
      message.type = MessageTypes.VARIABLES;

      message.variablesWithValues = value;

      break;
  }

  // Set invisible if necessary
  message.invisible = invisible;

  // Determine unique client timestamp
  let messageClientTimestamp = new Date().getTime();
  while (messages['c-' + messageClientTimestamp] !== undefined) {
    messageClientTimestamp++;
  }
  message['user-timestamp'] = messageClientTimestamp;
  return message;
}

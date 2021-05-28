import { put } from 'redux-saga/effects';

import AppConfig from '../Config/AppConfig';
import {
  DashboardMessageActions,
  MessageStates,
} from '../Redux/DashboardMessageRedux';

import Log from '../Utils/Log';
const log = new Log('Sagas/DashboardMessageSagas');

/* --- Send dashboard message --- */
export function* sendDashboardMessage(action) {
  log.info('Send dashboard message...');
  const { id, text, timestamp } = action;
  log.action('Dialog', 'SendDashboardMessage', 'Timestamp', timestamp);

  const message = {
    'client-id': id,
    'user-message': text,
    'client-timestamp': timestamp,
    role: AppConfig.config.serverSync.role,
  };

  yield put({
    type: DashboardMessageActions.ADD_OR_UPDATE_DASHBOARD_MESSAGE,
    message,
    status: MessageStates.PREPARED_FOR_SENDING,
  });
}

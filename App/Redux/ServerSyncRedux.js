import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

import AppConfig from '../Config/AppConfig';

import PushNotifications from '../Utils/PushNotifications';

import Log from '../Utils/Log';
const log = new Log('Redux/ServerSyncRedux');

/* ------------- Actions and Action Creators ------------- */

const { Types, Creators } = createActions({
  initialize: [], // saga
  handleCommands: ['command'], // saga
  rememberRegistration: ['deepstreamUser', 'deepstreamSecret'],
  rememberPushTokenRequested: [],
  rememberPushTokenShared: [],
  rememberLatestUserTimestamp: ['timestamp'],
  rememberLatestDashboardTimestamp: ['timestamp'],
  rememberPushToken: ['platform', 'token'],
  rememberServerSync: ['serverSync'],
  rememberVersionInfo: ['versionInfo'],
  connectionStateChange: [
    'connectionState',
    'deepstreamUser',
    'deepstreamSecret',
  ],
});

export const ConnectionStates = {
  INITIALIZING: 'INITIALIZING',
  INITIALIZED: 'INITIALIZED',
  CONNECTING: 'CONNECTING',
  RECONNECTING: 'RECONNECTING',
  CONNECTED: 'CONNECTED',
  SYNCHRONIZATION: 'SYNCHRONIZATION',
  SYNCHRONIZED: 'SYNCHRONIZED',
};

export const ServerSyncActions = Types;
export default Creators;

/* ------------- Initial State ------------- */

// Settings (stored, long-term)
export const SETTINGS_INITIAL_STATE = Immutable({
  timestamp: 0,
  timestampDashboard: 0,
  registered:
    AppConfig.config.serverSync.role === 'observer' ||
    AppConfig.config.serverSync.role === 'team-manager',
  deepstreamUser:
    (AppConfig.config.serverSync.role === 'observer' ||
      AppConfig.config.serverSync.role === 'team-manager') &&
    AppConfig.config.dev.deepstreamUserForDebugging !== null
      ? AppConfig.config.dev.deepstreamUserForDebugging
      : null,
  deepstreamSecret:
    (AppConfig.config.serverSync.role === 'observer' ||
      AppConfig.config.serverSync.role === 'team-manager') &&
    AppConfig.config.dev.deepstreamSecretForDebugging !== null
      ? AppConfig.config.dev.deepstreamSecretForDebugging.substring(0, 64)
      : null,
  restUser: null, // Must be "ds:"+user
  pushPlatform: null,
  pushToken: null,
  pushRequested: false,
  pushShared: false,
  versionInfo: null,
  serverSync: null,
});

// Status (not stored, current state)
export const STATUS_INITIAL_STATE = Immutable({
  connectionState: ConnectionStates.INITIALIZING,
});

/* ------------- Reducers ------------- */

// Settings modification called by sagas
export const rememberRegistration = (state, action) => {
  log.debug('Remember registration');

  const { deepstreamUser, deepstreamSecret } = action;

  PushNotifications.getInstance().storeDeepstreamUser(deepstreamUser);

  return state.merge({
    registered: true,
    deepstreamUser,
    deepstreamSecret,
    restUser: 'ds:' + deepstreamUser,
  });
};

export const rememberLatestUserTimestamp = (state, action) => {
  log.debug('Remember latest user timestamp:', action);

  const { timestamp } = action;
  if (state.timestamp < timestamp) {
    return state.merge({ timestamp });
  } else {
    return state;
  }
};

export const rememberLatestDashboardTimestamp = (state, action) => {
  log.debug('Remember latest dashboard timestamp:', action);

  const { timestamp } = action;
  if (state.timestampDashboard < timestamp) {
    return state.merge({ timestampDashboard: timestamp });
  } else {
    return state;
  }
};

export const rememberPushTokenRequested = (state) => {
  log.debug('Remember push token requested');

  return state.merge({ pushRequested: true });
};

export const rememberPushTokenShared = (state) => {
  log.debug('Remember push token shared');

  return state.merge({ pushShared: true });
};

// Status modification called by sagas
export const connectionStateChange = (state, action) => {
  log.debug('Connection state change:', action.connectionState);

  const { connectionState } = action;
  return state.merge({ connectionState });
};

// Settings modification called by notification module
export const rememberPushToken = (state, action) => {
  log.debug('Remember push token:', action);

  const { platform, token } = action;

  if (state.pushToken !== null) {
    return state.merge({
      pushPlatform: platform,
      pushToken: token,
      pushShared: false,
    });
  } else {
    return state.merge({ pushPlatform: platform, pushToken: token });
  }
};

export const rememberServerSync = (state, action) => {
  log.debug('Remember server sync settings');

  return state.merge({ serverSync: action.serverSync });
};

export const rememberVersionInfo = (state, action) => {
  log.debug('Remember server sync settings');

  return state.merge({ versionInfo: action.versionInfo });
};

/* ------------- Hookup Reducers To Actions ------------- */

// Settings
export const settingsReducer = createReducer(SETTINGS_INITIAL_STATE, {
  [Types.REMEMBER_REGISTRATION]: rememberRegistration,
  [Types.REMEMBER_PUSH_TOKEN_REQUESTED]: rememberPushTokenRequested,
  [Types.REMEMBER_PUSH_TOKEN_SHARED]: rememberPushTokenShared,
  [Types.REMEMBER_LATEST_USER_TIMESTAMP]: rememberLatestUserTimestamp,
  [Types.REMEMBER_LATEST_DASHBOARD_TIMESTAMP]: rememberLatestDashboardTimestamp,
  [Types.REMEMBER_PUSH_TOKEN]: rememberPushToken,
  [Types.REMEMBER_SERVER_SYNC]: rememberServerSync,
  [Types.REMEMBER_VERSION_INFO]: rememberVersionInfo,
});

// Status
export const statusReducer = createReducer(STATUS_INITIAL_STATE, {
  [Types.CONNECTION_STATE_CHANGE]: connectionStateChange,
});

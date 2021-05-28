import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import moment from 'moment';

import Common from '../Utils/Common';
import { MessageActions } from './MessageRedux';
import R from 'ramda';

import Log from '../Utils/Log';
const log = new Log('Redux/StoryProgressRedux');
/* ------------- Actions and Action Creators ------------- */

const { Types, Creators } = createActions({
  visitScreen: ['visitedScreen'],
  resetVisitedScreens: [],
  setVideoCardAnimationPlayed: ['video'],
  setInfoCardAnimationPlayed: ['info'],
  addInfoCardsLibraryInfo: ['infoCardsLibraryInfoMessage'],
  incrementUnreadDashboardMessages: [],
  clearUnreadDashboardMessages: [],
});

export const StoryProgressActions = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  visitedScreens: [],
  registrationTimestamp: moment().valueOf(),
  dashboardChatActivated: true,
  infoCardsLibraryActivated: true,
  mediaLibraryActivated: true,
  disabledActivated: false,
  infoCardsLibraryInfo: {},
  mediaLibrary: {},
  unreadDashboardMessages: 0,
});

/* ------------- Reducers ------------- */

export const setInfoCardAnimationPlayed = (state, { info }) => {
  let newLibrary = R.clone(state.infoCardsLibraryInfo);
  // Only set if video really exists! (Prevent this reducer from accidentally adding new Videocard!)
  if (newLibrary[info]) {
    newLibrary[info].appearAnimationPlayed = true;
    return {
      ...state,
      infoCardsLibraryInfo: newLibrary,
    };
  } else {
    log.warn(
      `Tried to set animationPlayed-Flag for info-id ${info} which could not be found in libray!`,
    );
    return state;
  }
};

export const setVideoCardAnimationPlayed = (state, { video }) => {
  let newMediaLibrary = R.clone(state.mediaLibrary);
  // Only set if video really exists! (Prevent this reducer from accidentally adding new Videocard!)
  if (newMediaLibrary[video]) {
    newMediaLibrary[video].appearAnimationPlayed = true;
    return {
      ...state,
      mediaLibrary: newMediaLibrary,
    };
  } else {
    log.warn(
      `Tried to set animationPlayed-Flag for video ${video} which could not be found in media-libray!`,
    );
    return state;
  }
};

export const handleProgressCommand = (
  state,
  { command, content, timestamp, media },
) => {
  const parsedCommand = Common.parseCommand(command);
  switch (parsedCommand.command) {
    case 'activate-dashboard-chat':
      return {
        ...state,
        dashboardChatActivated: true,
      };
    case 'activate-infoCardsLibrary':
      return {
        ...state,
        infoCardsLibraryActivated: true,
      };
    case 'activate-medialibrary':
      return {
        ...state,
        mediaLibraryActivated: true,
      };
    case 'show-infoCardsLibrary-info':
      const info = Common.formatInfoMessage(content, timestamp);
      let newInfoCardsLibraryInfo = R.clone(state.infoCardsLibraryInfo);
      const id = parsedCommand.value;
      // Add new info under the given ID
      if (id) {
        newInfoCardsLibraryInfo[id] = info;
      } else {
        log.warn(
          'Could not add InfoCardsLibraryInfo to Redux-Store, because no ID was defined. (Info-Title: ' +
            info.title +
            ')',
        );
      }
      return {
        ...state,
        infoCardsLibraryInfo: newInfoCardsLibraryInfo,
      };
    case 'add-video':
      const uri = content.uri;
      const title = content.title;

      let newMediaLibrary = R.clone(state.mediaLibrary);
      const videoName = parsedCommand.value;
      const video = {
        uri,
        timestamp: timestamp,
        medianame: videoName,
        mediaTitle: title,
      };
      // Add new info under the given name
      if (videoName) {
        newMediaLibrary[videoName] = video;
      } else {
        log.warn(
          'Could not add Video to Media-Library, because no ID was defined. (Info-Title: ' +
            video.uri +
            ')',
        );
      }
      return {
        ...state,
        mediaLibrary: newMediaLibrary,
      };
    case 'activate-disabled':
      return {
        ...state,
        disabledActivated: true,
      };
    default:
      return state;
  }
};

export const visitScreen = (state, { visitedScreen }) => {
  let newVisitedScreens = [...state.visitedScreens];
  if (!newVisitedScreens.includes(visitedScreen)) {
    newVisitedScreens.push(visitedScreen);
  }
  return {
    ...state,
    visitedScreens: newVisitedScreens,
  };
};

export const resetVisitedScreens = (state) => {
  return {
    ...state,
    visitedScreens: [],
  };
};

export const incrementUnreadDashboardMessages = (state) => {
  let unreadDashboardMessages = state.unreadDashboardMessages + 1;
  return {
    ...state,
    unreadDashboardMessages,
  };
};

export const clearUnreadDashboardMessages = (state) => {
  return {
    ...state,
    unreadDashboardMessages: 0,
  };
};

/* ------------- Hookup Reducers To Actions ------------- */

// {
// type: 'COMMAND_TO_EXECUTE',
// command: 'activate-add-meal'
// }
export const reducer = createReducer(INITIAL_STATE, {
  [MessageActions.COMMAND_TO_EXECUTE]: handleProgressCommand,
  [Types.VISIT_SCREEN]: visitScreen,
  [Types.RESET_VISITED_SCREENS]: resetVisitedScreens,
  [Types.SET_VIDEO_CARD_ANIMATION_PLAYED]: setVideoCardAnimationPlayed,
  [Types.SET_INFO_CARD_ANIMATION_PLAYED]: setInfoCardAnimationPlayed,
  [Types.INCREMENT_UNREAD_DASHBOARD_MESSAGES]: incrementUnreadDashboardMessages,
  [Types.CLEAR_UNREAD_DASHBOARD_MESSAGES]: clearUnreadDashboardMessages,
});

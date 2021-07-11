import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { CommonActions as NavigationActions } from '@react-navigation/native';

import Log from '../Utils/Log';
const log = new Log('Redux/GUIRedux');

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
  showCoachIsTyping: [],
  hideCoachIsTyping: [],
  setCurrentlyFurtherMessagesExpected: ['currentlyFurtherMessagesExpected'],
  toggleSideMenu: [],
  showLoadEarlier: [],
  hideLoadEarlier: [],
  loadEarlier: [], // saga
  closeSideMenu: [],
  setCurrentScreen: ['routeName'],
  disableSidemenuGestures: [],
  enableSidemenuGestures: [],
  addUnreadMessage: ['count'],
  clearUnreadMessages: [],
  toggleChatScreenState: [],
  toggleDashboardChatScreenState: [],
});

export const GUIActions = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  coachIsTyping: false,
  currentlyFurtherMessagesExpected: false,
  showLoadEarlier: false,
  sideMenuOpen: false,
  sideMenuGestures: false,
  unreadMessages: 0,
  // TODO: initial screen shoud not be hardcoded
  currentScreen: 'LoadingContainer',
  chatScreenOpen: true,
  dashboardChatScreenOpen: false,
});

/* ------------- Reducers ------------- */

// show Coach is Typing message
export const showCoachIsTyping = (state) => {
  return {
    ...state,
    coachIsTyping: true,
  };
};

// hide Coach is Typing message
export const hideCoachIsTyping = (state) => {
  return {
    ...state,
    coachIsTyping: false,
  };
};

// remember if further messages are in the pipeline to be shown
export const setCurrentlyFurtherMessagesExpected = (
  state,
  { currentlyFurtherMessagesExpected },
) => {
  return {
    ...state,
    currentlyFurtherMessagesExpected,
  };
};

// toggle sidemenu
export const toggleSideMenu = (state) => {
  const currentSideMenuState = state.sideMenuOpen;
  log.action('GUI', 'ToggleMenu', !currentSideMenuState);
  return {
    ...state,
    sideMenuOpen: !currentSideMenuState,
  };
};

export const closeSideMenu = (state, { isOpen }) => {
  log.action('GUI', 'ToggleMenu', false);
  return {
    ...state,
    sideMenuOpen: false,
  };
};

export const showLoadEarlier = (state) => {
  return {
    ...state,
    showLoadEarlier: true,
  };
};

export const hideLoadEarlier = (state) => {
  return {
    ...state,
    showLoadEarlier: false,
  };
};

export const enableSidemenuGestures = (state) => {
  return {
    ...state,
    sideMenuGestures: true,
  };
};

export const disableSidemenuGestures = (state) => {
  return {
    ...state,
    sideMenuGestures: false,
  };
};

export const addUnreadMessage = (state, { count }) => {
  // dont increment when in Chat
  // if (state.currentScreen === 'Chat') { <-- Previously it was tracked using currentScreen variable
  if (state.chatScreenOpen == true) {
    return state;
  } else {
    if (count === undefined) {
      count = 1;
    }
    let unreadMessages = state.unreadMessages + count;
    return {
      ...state,
      unreadMessages,
    };
  }
};

export const clearUnreadMessages = (state) => {
  return {
    ...state,
    unreadMessages: 0,
  };
};

export const setCurrentScreen = (state, { routeName }) => {
  return {
    ...state,
    currentScreen: routeName,
  };
};

export const toggleChatScreenState = (state) => {
  let isOpen = state.chatScreenOpen == true ? false : true;
  return {
    ...state,
    chatScreenOpen: isOpen,
  };
};

export const toggleDashboardChatScreenState = (state) => {
  let isOpen = state.dashboardChatScreenOpen == true ? false : true;
  return {
    ...state,
    dashboardChatScreenOpen: isOpen,
  };
};


/* ------------- Hookup Reducers To Actions ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SHOW_COACH_IS_TYPING]: showCoachIsTyping,
  [Types.HIDE_COACH_IS_TYPING]: hideCoachIsTyping,
  [Types.SET_CURRENTLY_FURTHER_MESSAGES_EXPECTED]:
    setCurrentlyFurtherMessagesExpected,
  [Types.SHOW_LOAD_EARLIER]: showLoadEarlier,
  [Types.HIDE_LOAD_EARLIER]: hideLoadEarlier,
  [Types.TOGGLE_SIDE_MENU]: toggleSideMenu,
  [Types.CLOSE_SIDE_MENU]: closeSideMenu,
  [Types.DISABLE_SIDEMENU_GESTURES]: disableSidemenuGestures,
  [Types.ENABLE_SIDEMENU_GESTURES]: enableSidemenuGestures,
  [Types.CLEAR_UNREAD_MESSAGES]: clearUnreadMessages,
  [Types.ADD_UNREAD_MESSAGE]: addUnreadMessage,
  [Types.TOGGLE_CHAT_SCREEN_STATE]: toggleChatScreenState,
  [Types.TOGGLE_DASHBOARD_CHAT_SCREEN_STATE]: toggleDashboardChatScreenState,
  [NavigationActions.navigate]: setCurrentScreen,
});

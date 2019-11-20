import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import moment from 'moment'

import Common from '../Utils/Common'
import { MessageActions } from './MessageRedux'
import R from 'ramda'

import Log from '../Utils/Log'
const log = new Log('Redux/StoryProgressRedux')
/* ------------- Actions and Action Creators ------------- */

const { Types, Creators } = createActions({
  visitScreen: ['visitedScreen'],
  resetVisitedScreens: [],
  setVideoCardAnimationPlayed: ['video'],
  setInfoCardAnimationPlayed: ['info'],
  addBackpackInfo: ['backpackInfoMessage'],
  incrementUnreadDashboardMessages: [],
  clearUnreadDashboardMessages: []
})

export const StoryProgressActions = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  foodTutorialActive: true,
  visitedScreens: [],
  registrationTimestamp: moment().valueOf(),
  dashboardChatActivated: true,
  backpackActivated: true,
  mediaLibraryActivated: true,
  diaryActivated: false,
  tourActivated: false,
  recipesActivated: false,
  actionButtonActive: false,
  disabledActivated: false,
  taskActionButtonActive: false,
  backpackInfo: {},
  mediaLibrary: {},
  unreadDashboardMessages: 0,
})

/* ------------- Reducers ------------- */

export const setInfoCardAnimationPlayed = (state, { info }) => {
  let newLibrary = R.clone(state.backpackInfo)
  // Only set if video really exists! (Prevent this reducer from accidentally adding new Videocard!)
  if (newLibrary[info]) {
    newLibrary[info].appearAnimationPlayed = true
    return {
      ...state,
      backpackInfo: newLibrary
    }
  } else {
    log.warn(
      `Tried to set animationPlayed-Flag for info-id ${info} which could not be found in libray!`
    )
    return state
  }
}

export const setVideoCardAnimationPlayed = (state, { video }) => {
  let newMediaLibrary = R.clone(state.mediaLibrary)
  // Only set if video really exists! (Prevent this reducer from accidentally adding new Videocard!)
  if (newMediaLibrary[video]) {
    newMediaLibrary[video].appearAnimationPlayed = true
    return {
      ...state,
      mediaLibrary: newMediaLibrary
    }
  } else {
    log.warn(
      `Tried to set animationPlayed-Flag for video ${video} which could not be found in media-libray!`
    )
    return state
  }
}

export const handleProgressCommand = (
  state,
  { command, content, timestamp, media }
) => {
  const parsedCommand = Common.parseCommand(command)
  switch (parsedCommand.command) {
    case 'complete-tutorial':
      return {
        ...state,
        foodTutorialActive: false
      }
    case 'activate-dashboard-chat':
      return {
        ...state,
        dashboardChatActivated: true
      }
    case 'activate-backpack':
      return {
        ...state,
        backpackActivated: true
      }
    case 'activate-medialibrary':
      return {
        ...state,
        mediaLibraryActivated: true
      }
    case 'activate-recipes':
      return {
        ...state,
        recipesActivated: true
      }
    case 'activate-tour':
      return {
        ...state,
        tourActivated: true
      }
    case 'activate-diary':
      return {
        ...state,
        diaryActivated: true
      }
    case 'tracking-period-started':
      return {
        ...state,
        actionButtonActive: true
      }
    case 'tracking-period-complete':
      return {
        ...state,
        actionButtonActive: false
      }
    case 'activate-action-button':
      return {
        ...state,
        taskActionButtonActive: true
      }
    case 'show-backpack-info':
      const info = Common.formatInfoMessage(content, timestamp)
      let newBackpackInfo = R.clone(state.backpackInfo)
      const id = parsedCommand.value
      // Add new info under the given ID
      if (id) newBackpackInfo[id] = info
      else {
        log.warn(
          'Could not add BackpackInfo to Redux-Store, because no ID was defined. (Info-Title: ' +
            info.title +
            ')'
        )
      }
      return {
        ...state,
        backpackInfo: newBackpackInfo
      }
    case 'add-video':
      const uri = content.uri
      const title = content.title

      let newMediaLibrary = R.clone(state.mediaLibrary)
      const videoName = parsedCommand.value
      const video = {
        uri,
        timestamp: timestamp,
        medianame: videoName,
        mediaTitle: title
      }
      // Add new info under the given name
      if (videoName) newMediaLibrary[videoName] = video
      else {
        log.warn(
          'Could not add Video to Media-Library, because no ID was defined. (Info-Title: ' +
            video.uri +
            ')'
        )
      }
      return {
        ...state,
        mediaLibrary: newMediaLibrary
      }
    case 'activate-disabled':
      return {
        ...state,
        disabledActivated: true
      }
    default:
      return state
  }
}

export const visitScreen = (state, { visitedScreen }) => {
  let newVisitedScreens = [...state.visitedScreens]
  if (!newVisitedScreens.includes(visitedScreen)) {
    newVisitedScreens.push(visitedScreen)
  }
  return {
    ...state,
    visitedScreens: newVisitedScreens
  }
}

export const resetVisitedScreens = (state) => {
  return {
    ...state,
    visitedScreens: []
  }
}

export const incrementUnreadDashboardMessages = (state) => {
  let unreadDashboardMessages = state.unreadDashboardMessages + 1
  return {
    ...state,
    unreadDashboardMessages
  }
}

export const clearUnreadDashboardMessages = (state) => {
  return {
    ...state,
    unreadDashboardMessages: 0
  }
}

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
  [Types.CLEAR_UNREAD_DASHBOARD_MESSAGES]: clearUnreadDashboardMessages
})

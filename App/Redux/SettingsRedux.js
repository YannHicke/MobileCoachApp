import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { StartupActions } from '../Redux/StartupRedux'
import moment from 'moment'

import I18n from '../I18n/I18n'
import AppConfig from '../Config/AppConfig'
import { onboardingNav } from '../Containers/Onboarding/OnboardingNav'
import Common from '../Utils/Common'
import { MessageActions } from './MessageRedux'

import Log from '../Utils/Log'
const log = new Log('Redux/SettingsRedux')

/* ------------- Actions and Action Creators ------------- */
const { Types, Creators } = createActions({
  changeLanguage: ['language'],
  chooseCoach: ['coach'],
  completeTutorial: ['tutorialCompleted'],
  changeSyncedSetting: ['variable', 'value', 'localValue', 'asIntention']
})

export const SettingsActions = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  language: I18n.currentLocale(), // take over the recognized, or default if not recognized, language locale as initial state
  coach: null,
  tutorialCompleted: false,
  tutorialStep: null,
  syncedSettings: {
    name: undefined,
    birthday: undefined,
    syncHeartAge: undefined,
    syncMedicationCompliance: undefined,
    syncBMI: undefined,
    syncHeight: undefined,
    syncWeight: undefined,
    syncMedication: undefined,
    syncSmoker: undefined,
    syncDiabetes: undefined
  }
})

/* ------------- Reducers ------------- */

export const startup = (state, action) => {
  log.debug('Set language:', state.language)
  I18n.locale = state.language
  moment.locale(state.language)

  return state
}

export const changeLanguage = (state, { language }) => {
  let twoDigitLanguage = language.substr(0, 2)
  if (AppConfig.config.supportedLanguages.includes(twoDigitLanguage)) {
    log.debug('New language:', language)
    log.action('App', 'Language', language)
    return state.merge({
      language: language.substr(0, 2)
    })
  } else {
    log.debug('Did not set language', language)
    return state
  }
}

export const chooseCoach = (state, { coach }) => {
  log.debug('New coach:', coach)
  log.action('App', 'Coach', coach)
  return state.merge({
    coach
  })
}

export const completeTutorial = (state, { tutorialCompleted }) => {
  log.action('App', 'TutorialCompleted')
  return state.merge({
    tutorialCompleted
  })
}

export const rememberTutorialStep = (state, { routeName }) => {
  if (!state.tutorialCompleted && routeName !== onboardingNav) {
    log.action('App', 'TutorialStep', routeName)
    return state.merge({
      tutorialStep: routeName
    })
  } else {
    return state
  }
}

export const changeSyncedSetting = (
  state,
  { variable, value, localValue = null, asIntention }
) => {
  log.debug('Change setting', variable, 'to', value, ' - local:', localValue)
  log.action('App', 'SettingsChange')

  const newState = changeSynedSettingState(
    state,
    variable,
    localValue === null ? value : localValue
  )

  return state.merge(newState)
}

export const handleProgressCommand = (
  state,
  { command, content, timestamp }
) => {
  const parsedCommand = Common.parseCommand(command)
  switch (parsedCommand.command) {
    case 'settings':
      const newState = changeSynedSettingState(
        state,
        parsedCommand.value,
        parsedCommand.contentWithoutFirstValue
      )
      return state.merge(newState)
    default:
      return state
  }
}

const changeSynedSettingState = (state, variable, value) => {
  let newState = { ...state }

  if (newState.syncedSettings === undefined) {
    newState = Immutable.setIn(newState, ['syncedSettings'], {})
  }

  let ns = Immutable.setIn(newState, ['syncedSettings', variable], value)
  return ns
}

/* ------------- Hookup Reducers To Actions ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [StartupActions.STARTUP]: startup,
  [MessageActions.COMMAND_TO_EXECUTE]: handleProgressCommand,
  [Types.CHANGE_LANGUAGE]: changeLanguage,
  [Types.CHOOSE_COACH]: chooseCoach,
  [Types.COMPLETE_TUTORIAL]: completeTutorial,
  [Types.CHANGE_SYNCED_SETTING]: changeSyncedSetting,
  'Navigation/NAVIGATE': rememberTutorialStep
})

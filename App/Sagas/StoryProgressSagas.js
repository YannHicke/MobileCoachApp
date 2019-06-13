import { put, select } from 'redux-saga/effects'

import { StoryProgressActions } from '../Redux/StoryProgressRedux'
import DropDownHolder from '../Components/DropDownAlertHolder'
import Common from '../Utils/Common'
import I18n from '../I18n/I18n'

import Log from '../Utils/Log'
const log = new Log('Sagas/StoryProgressSagas')

/* --- Send dashboard message --- */
export function * watchAddDashboardMessages (action) {
  const currentScreen = yield select((state) => state.guistate.currentScreen)
  if (currentScreen !== 'DashboardChat') {
    log.info(
      'Received DashboardMessage while not in DashboardChat: Incrementing unread Dashboard Messages badge.'
    )
    yield put({
      type: StoryProgressActions.INCREMENT_UNREAD_DASHBOARD_MESSAGES
    })
  }
}

/* --- Show notifications for new service channel news --- */
export function * watchServiceChannelNews (action) {
  const { command } = action
  const parsedCommand = Common.parseCommand(command)

  if (parsedCommand.command === 'service-channel-news') {
    const newItem = JSON.parse(parsedCommand.content)
    if (!newItem.deleted) {
      // if (newItem.popup) {
      //   // TODO: Show reminder
      // } else {
      //   // Show notification
      DropDownHolder.getDropDown().alertWithType(
        'info',
        I18n.t('ServiceChannel.newItem'),
        newItem.category.toUpperCase() + ': ' + newItem.title
      )
      // }
    }
  }
}

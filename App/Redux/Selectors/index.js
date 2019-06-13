import { createSelector } from 'reselect'
import { DOMParser } from 'react-native-html-parser'

import I18n from '../../I18n/I18n'
import { Images } from '../../Themes'
/* ------------- Selectors ------------- */

const getMessageRedux = (state) => {
  return state.messages
}
const getGiftedChatRedux = (state) => {
  return state.giftedchatmessages
}
const getCoach = (state) => {
  return state.settings.coach
}

export const getGiftedChatMessages = createSelector(
  [getGiftedChatRedux, getCoach],
  (messageRedux, coach) => {
    const { messageIds, messageObjects } = messageRedux
    const messages = []
    const stickyMessages = []
    for (let i = messageIds.length - 1; i >= 0; i--) {
      const messageId = messageIds[i]
      let message = { ...messageObjects[messageId] }
      if (message.custom.visible) {
        const avatar = Images.coaches[coach]
        if (message.user._id === 2) {
          message.user = {
            ...message.user,
            name: I18n.t('Coaches.' + coach),
            avatar: avatar
          }
        }
        if (!message.custom.sticky) messages.push(message)
        else stickyMessages.push(message)
      }
    }
    return { messages, stickyMessages }
  }
)

export const getActiveTrackingPeriod = (state) => {
  return state.fooddiary.trackingPeriods[state.fooddiary.activeTrackingPeriod]
}

export const getMealsOfDate = (state, date) => {
  let meals = []
  state.fooddiary.trackingPeriods.forEach((trackingPeriod) => {
    meals = [...meals, ...trackingPeriod.meals]
  })
  return meals.filter((meal) => {
    return meal.mealDate === date
  })
}

export const getActiveScreen = (state) => {
  return state.nav.routes[state.nav.index].routeName
}

// returns all days that have either been finally marked complete or incomplete
export const getNonEditableDays = (state) => {
  let nonEditableDays = []
  state.fooddiary.trackingPeriods.forEach((trackingPeriod) => {
    // concat arrays of non-editable days while removing duplicates (even though there shouldn't be any..)
    nonEditableDays = [
      ...nonEditableDays,
      ...trackingPeriod.trackedDaysComplete,
      ...trackingPeriod.trackedDaysIncomplete
    ]
  })
  return nonEditableDays
}

const getCommandMessages = createSelector(
  [getMessageRedux],
  (messageRedux) => {
    let commandMessages = []
    for (let messageId in messageRedux.messageObjects) {
      if (
        messageRedux.messageObjects.hasOwnProperty(messageId) &&
        messageRedux.messageObjects[messageId].type === 'COMMAND'
      ) {
        commandMessages.push(messageRedux.messageObjects[messageId])
      }
    }
    return commandMessages
  }
)

// show-backpack-info
export const getBackpackInformation = createSelector(
  [getCommandMessages],
  (commandMessages) => {
    let information = []
    let filtered = commandMessages.filter(
      (message) => message['server-message'] === 'show-backpack-info'
    )
    filtered.forEach((serverMessage) => {
      let content = serverMessage.content // .replace(/\\n/g, '')
      let parsedTags = new DOMParser().parseFromString(content, 'text/html')
      let metas = parsedTags.getElementsByTagName('meta')
      let title = ''
      let subtitle = ''
      for (let i in metas) {
        const meta = metas[i]
        if (
          meta.getAttribute !== undefined &&
          meta.getAttribute('title') !== undefined
        ) {
          title = meta.getAttribute('title').replace(/\\n/g, '\n')
          if (meta.getAttribute('subtitle')) {
            subtitle = meta.getAttribute('subtitle').replace(/\\n/g, '\n')
          }
        }
      }

      // Remove Button
      const pattern = new RegExp('<button>(.*)</button>', 'g')
      const regExpResult = pattern.exec(content)
      if (regExpResult) {
        content = content.replace(regExpResult[0], '')
      }
      let info = {
        // Info-Content delievered by server in DS-Message
        content,
        // Component to be opened on Tap
        component: 'rich-text',
        title,
        subtitle,
        time: serverMessage['message-timestamp']
      }
      information.push(info)
    })
    return information
  }
)

// https://coolors.co/50514f-f25f5c-ffe066-247ba0-70c1b3
// https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557
import Brand from './Brand'
import { Platform } from 'react-native'

const button = {
  background: Brand.colors.buttonBackground,
  text: Brand.colors.buttonText,
  disabled: Brand.colors.grey2,
  disabledText: Brand.colors.grey3,
  skipAnswer: '#E2E2E2',
  submit: Brand.colors.buttonText,
  cancel: '#E2E2E2',
  placeholder: '#E2E2E2',
  invalid: '#E74C3C'
}

const colors = {
  brand: Brand,
  main: {
    appBackground: Brand.colors.grey3,
    chatBackground: Brand.colors.backgroundMain,
    headline: Brand.colors.textMain,
    paragraph: Brand.colors.textMain,
    hyperlink: Brand.colors.buttonBackground,
    loadingContainer: Brand.colors.primary,
    primary: Brand.colors.primary,
    grey1: Brand.colors.grey1,
    grey2: Brand.colors.grey2,
    grey3: Brand.colors.grey3,
    success: '#2aa87d',
    warn: '#fda428',
    error: '#E74C3C'
  },
  onboarding: {
    background: Brand.colors.primary,
    text: Brand.colors.buttonText,
    loadingIndicator: Brand.colors.buttonBackground
  },
  statusBar: {
    background: Platform.OS === 'ios' ? 'transparent' : '#000'
  },
  navigationBar: {
    background: Brand.colors.primary,
    text: '#fff'
  },
  sideMenu: {
    background: Brand.colors.backgroundMain,
    buttonBackground: Brand.colors.backgroundMain,
    text: Brand.colors.textMain,
    textDisabled: Brand.colors.grey2,
    actionButton: Brand.colors.primary
  },
  tabBar: {
    text: Brand.colors.textMain,
    background: '#fff',
    textFocused: Brand.colors.buttonBackground
  },
  messageBubbles: {
    left: {
      background: Brand.colors.background1,
      text: Brand.colors.text1,
      activityIndicator: Brand.colors.text1,
      progressIndicator: Brand.colors.text1
    },
    right: {
      background: Brand.colors.background2,
      text: Brand.colors.text2,
      activityIndicator: Brand.colors.text2,
      progressIndicator: Brand.colors.text2
    },
    system: {
      background: '#B5B5B5',
      text: '#fff'
    },
    ticks: {
      unread: Brand.colors.text2,
      read: Brand.colors.buttonBackground
    }
  },
  activityIndicator: Brand.colors.primary,
  buttons: {
    common: {
      ...button
    },
    selectOne: {
      ...button
    },
    likert: {
      ...button
    },
    likertSlider: {
      button,
      background: Brand.colors.background2,
      text: Brand.colors.text2,
      thumb: Brand.colors.text2, // slider handle
      minTint: button.background, // slider background left
      maxTint: button.background // slider background right
    },
    openComponent: {
      ...button
    },
    selectMany: {
      submitButton: {
        ...button
      },
      items: {
        background: Brand.colors.backgroundMain,
        text: Brand.colors.textMain,
        border: Brand.colors.background1
      }
    },
    freeText: {
      ...button,
      selection: Brand.colors.text2
    },
    datePicker: {
      ...button
    },
    actionButton: {
      ...button,
      items: {
        text: Brand.colors.textMain,
        background: Brand.colors.backgroundMain
      }
    }
  },
  modal: {
    headerBackground: Brand.colors.background1,
    headerText: Brand.colors.text1,
    background: Brand.colors.backgroundMain,
    text: Brand.colors.textMain,
    loadingIndicator: Brand.colors.textMain
  },
  toast: {
    text: '#FFF',
    background: Brand.colors.primary
  },
  video: {
    thumb: button.text, // slider handle
    minTint: Brand.colors.buttonBackground, // slider background left
    maxTint: Brand.colors.grey1, // slider background right
    activityIndicator: '#FFF'
  },
  playAudio: {
    progressbarBackground: Brand.colors.buttonBackground
  },
  connectionIndicator: {
    neutralState: '#FFFFFF',
    intermediateState: '#fda428',
    successState: '#FFF'
  },
  badge: {
    background: '#E74C3C',
    text: Brand.colors.primaryText
  },
  modules: {
    chat: {
      date: Brand.colors.grey2
    },
    dashboardChat: {
      date: Brand.colors.grey2
    },
    infoCardsLibrary: {
      infoBackground: button.background,
      infoText: button.text
    },
  }
}

export default colors

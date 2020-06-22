jest
  // exclude react-native-fabric from tests (as it would cause errors)
  .mock('react-native-fabric', () => {
    return {
      Crashlytics: {
        crash: () => {},
        log: () => {}
      },
      Answers: {
        logCustom: () => {},
        logContentView: () => {}
      }
    }
  })
  // .mock('react-native-fetch-blob', () => {
  //   return {
  //     DocumentDir: () => {}
  //   }
  // })
  .mock('rn-fetch-blob', () => {
    return {
      DocumentDir: () => {}
    }
  })
  .mock('react-native-cached-image', () => {
    return {
      fs: () => {},
      ImageCacheManager: () => {}
    }
  })
  .mock('../App/Containers/App', () => {
    return {
      getState: () => {}
    }
  })
  .mock('react-native-fs', () => {
    return {
      fs: () => {}
    }
  })
  .mock('react-native-image-resizer', () => {
    return {
      createResizedImage: () => {}
    }
  })

  .mock('react-navigation', () => {
    return {
      withNavigation: (component) => component,
      StackNavigator: () => {},
      DrawerNavigator: () => {},
      NavigationActions: {
        navigate: 'default'
      }
    }
  })
  .mock('react-native-vector-icons/Ionicons', () => {
    return {
      Aspect: {}
    }
  })
  .mock('react-native-camera', () => {})
  .mock('react-native-audio', () => {})
  // .mock('moment/locale/en-gb', () => {})
  // .mock('moment/locale/de', () => {})
  // .mock('moment/locale/fr', () => {})
  // .mock('moment/locale/it', () => {})
  // .mock('moment', () => {
  //   return {
  //     locale: () => {},
  //     defineLocale: () => 'en'
  //   }
  // })
  .mock('react-native-sound', () => {
    return {
      IsAndroid: () => false
    }
  })
  .mock('@expo/react-native-action-sheet', () => {})
  .mock('react-native-i18n', () => {
    const english = require('../App/I18n/languages/english.json')
    const keys = require('ramda')
    const replace = require('ramda')
    const forEach = require('ramda')

    return {
      t: (key, replacements) => {
        let value = english[key]
        if (!value) return key
        if (!replacements) return value
        forEach((r) => {
          value = replace(`{{${r}}}`, replacements[r], value)
        }, keys(replacements))
        return value
      },
      locale: 'en',
      currentLocale: () => 'en'
    }
  })

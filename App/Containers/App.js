import React, { Component } from 'react';
import { AppState, StatusBar } from 'react-native';
import { setCustomText } from 'react-native-global-props';
import { Provider } from 'react-redux';

import '../I18n/I18n'; // import this before RootContainer as RootContainer is using react-native-i18n, and I18n.js needs to be initialized before that!
import RootContainer from './RootContainer';
import AppConfig from '../Config/AppConfig';
import StartupRedux from '../Redux/StartupRedux';
import createStore from '../Redux';
import { Fonts, Metrics } from '../Themes';

import Log from '../Utils/Log';
const log = new Log('Containers/App');

const customTextProps = {
  style: {
    fontFamily: Fonts.type.family,
  },
};

const { config } = AppConfig;

let store = createStore();

export const getState = () => {
  // TODO fabian: This is nasty. getState should never be exposed. Any Component that needs access to state, will use connect() from redux.

  if (store) {
    return store.getState();
  } else {
    log.warn('Tried to access state before it was initialized!');
    return null;
  }
};

// Track user activity
if (!__DEV__) {
  log.enableUserTracking();
}
log.action('App', 'Startup', 'Timestamp', new Date()); // TODO fabian: What are these for?
log.action('GUI', 'AppInForeground', true);

class App extends Component {
  constructor() {
    super();

    setCustomText(customTextProps);
    this.appStateHandler = this.appStateHandler.bind(this);
  }

  componentDidMount() {
    // Register AppState-Handler
    AppState.addEventListener('change', this.appStateHandler); // TODO fabian: only for store?
    if (AppConfig.config.dev.disableYellowbox) {
      console.disableYellowBox = true;
    }
    // actively set statusbar to translucent to prevent some display errors on android
    if (Metrics.androidStatusBarTranslucent) {
      StatusBar.setTranslucent(true);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }

  appStateHandler(newAppState) {
    console.log('fabian: App.js:appStateHandler:', newAppState);
    store.dispatch(StartupRedux.appStateChange(newAppState));
  }
}

export default App;

import React, { Component } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ServerSyncActions from '../Redux/ServerSyncRedux';
import PropTypes from 'prop-types';
import { MenuProvider } from 'react-native-popup-menu';

import { Colors, Metrics } from '../Themes/';
class RootContainer extends Component {
  onRef = (ref) => {
    this.popupMenu = ref;
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    // TODO fabian. Move to componentDidUpdate
    console.log(
      'fabian: RootContainer.js:componentWillReceivProps',
      this.props,
      newProps,
    );
    const oldScreen = this.props ? this.props.currentScreen : null;
    const newScreen = newProps.guistate
      ? newProps.guistate.currentScreen
      : null;

    if (oldScreen !== newScreen) {
      if (this.popupMenu && this.popupMenu.isMenuOpen()) {
        this.popupMenu.closeMenu();
      }
    }
  }

  componentDidUpdate(prevProps) {
    console.log('fabian: RootContainer.js:componentDidUpdate', prevProps);
  }

  render() {
    console.log('fabian: RootContainer.js:render');
    const { hydrationCompleted } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {hydrationCompleted ? (
          <MenuProvider name="popup-menu-provider" ref={this.onRef}>
            <StatusBar
              translucent={Metrics.androidStatusBarTranslucent}
              backgroundColor={Colors.statusBar.background}
              barStyle="light-content"
            />
            <ReduxNavigation />
          </MenuProvider>
        ) : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  hydrationCompleted: state.hydrationCompleted.hydrationCompleted,
  currentScreen: state.guistate.currentScreen,
});

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  serverSyncInitialize: () => dispatch(ServerSyncActions.initialize()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

RootContainer.propTypes = {
  startup: PropTypes.func.isRequired,
};

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { CommonActions as NavigationActions } from '@react-navigation/native';

// import LoadingOverlay from '../Components/LoadingOverlay'
import { Colors } from '../Themes';
import GUIActions from '../Redux/GUIRedux';

/* Redirect to the direct screen when redux persist values are loaded. Until then show a loading screen image */
class LoadingContainer extends Component {
  constructor() {
    super();
    this.didJump = false;
  }

  // TODO: Needs to be refactored
  UNSAFE_componentWillMount() {
    const { hydrationCompleted } = this.props.hydrationCompleted;
    this.setState({ hydrationCompleted });
  }

  // TODO: Needs to be refactored
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { hydrationCompleted } = nextProps.hydrationCompleted;
    this.setState({ hydrationCompleted });
  }

  componentDidMount() {
    this.navigateIfNeeded();
  }

  componentDidUpdate() {
    this.navigateIfNeeded();
  }

  navigateIfNeeded() {
    if (!this.didJump) {
      if (this.state.hydrationCompleted) {
        this.didJump = true;
        if (this.props.tutorialCompleted) {
          this.props.enableSidemenuGestures();
          this.navigateToPrimaryNav();
        } else {
          this.props.disableSidemenuGestures();
          this.navigateToOnboarding();
        }
      }
    }
  }

  navigateToPrimaryNav() {
    const navigateAction = NavigationActions.navigate('MainNavigation'); // TODO fabian put this back

    this.props.navigation.dispatch(navigateAction);
  }

  navigateToOnboarding() {
    const navigateAction = NavigationActions.navigate({
      name: 'OnboardingNav',
      // TODO: Make this configurable in App configuration
      action: null, // this.props.tutorialStep != null ? NavigationActions.navigate({ routeName: this.props.tutorialStep }) : null
    });

    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return <View style={styles.fullScreenStyle} />;
  }
}

const styles = {
  fullScreenStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.main.loadingContainer,
  },
};

const mapStateToProps = (state) => {
  return {
    tutorialStep: state.settings.tutorialStep,
    tutorialCompleted: state.settings.tutorialCompleted,
    hydrationCompleted: state.hydrationCompleted,
  };
};

const mapDispatchToProps = (dispatch) => ({
  enableSidemenuGestures: () => dispatch(GUIActions.enableSidemenuGestures()),
  disableSidemenuGestures: () => dispatch(GUIActions.disableSidemenuGestures()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingContainer);

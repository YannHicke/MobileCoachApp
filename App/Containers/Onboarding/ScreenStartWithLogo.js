import React, { Component } from 'react';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import NextButton from '../../Components/NextButton';
import { Colors, Images } from '../../Themes/';
import { normalize } from '../../Utils/Common';
import I18n from '../../I18n/I18n';
import MessageActions from '../../Redux/MessageRedux';
import SettingsActions from '../../Redux/SettingsRedux';

// Adjust to the appropriate next screen
const nextScreen = 'ScreenWelcomeByCoach';

class ScreenStartWithLogo extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const { sendPlatformIntention } = this.props;
    const { changeLanguage } = this.props;
    const { sendLanguageIntention } = this.props;
    const { chooseCoach } = this.props;
    const { sendCoachIntention } = this.props;
    const { navigate } = this.props.navigation;
    const coaches = Images.coaches;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={Images.appLogo} />
          </View>
          <View style={styles.poweredByContainer}>
            <Image
              style={styles.poweredByImage}
              source={Images.poweredByLogo}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{I18n.t('Onboarding.title')}</Text>
          <Text style={styles.subtitle}>{I18n.t('Onboarding.subtitle')}</Text>
          <NextButton
            text={I18n.t('Onboarding.next')}
            onPress={() => {
              sendPlatformIntention(Platform.OS);
              changeLanguage('en-GB');
              sendLanguageIntention('en-GB');
              chooseCoach(0);
              sendCoachIntention(I18n.t('Coaches.0'));
              navigate(nextScreen);
            }}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendPlatformIntention: (platform) =>
    dispatch(MessageActions.sendIntention(null, 'platform', platform)),
  changeLanguage: (newLang) =>
    dispatch(SettingsActions.changeLanguage(newLang)),
  sendLanguageIntention: (language) =>
    dispatch(MessageActions.sendIntention(null, 'language', language)),
  chooseCoach: (coach) => dispatch(SettingsActions.chooseCoach(coach)),
  sendCoachIntention: (coachName) =>
    dispatch(MessageActions.sendIntention(null, 'coach', coachName)),
});

export default connect(null, mapDispatchToProps)(ScreenStartWithLogo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.onboarding.background,
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: '#fff',
    ...ifIphoneX({ paddingTop: 40 }),
  },
  logoContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  poweredByContainer: { height: 40, alignItems: 'center' },
  logoImage: { flex: 1, resizeMode: 'contain' },
  poweredByImage: { flex: 1, resizeMode: 'contain' },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: normalize(25),
    fontWeight: 'bold',
    color: Colors.onboarding.text,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.onboarding.text,
    textAlign: 'center',
    fontSize: normalize(18),
  },
});

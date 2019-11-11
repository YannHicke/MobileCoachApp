import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'

import NextButton from '../../Components/NextButton'
import I18n from '../../I18n/I18n'
import SettingsActions from '../../Redux/SettingsRedux'
import MessageActions from '../../Redux/MessageRedux'
import { Colors } from '../../Themes/'

// Adjust to the appropriate next screen
// const nextScreen = 'ScreenScreeningSurvey'
// const nextScreen = 'ScreenAuthorizeUser'
const nextScreen = 'ScreenCoachSelection'

class ScreenLanguageSelection extends Component {
  render () {
    const { changeLanguage } = this.props
    const { sendLanguageIntention } = this.props
    const { navigate } = this.props.navigation

    return (
      <View style={Styles.container}>
        <View style={Styles.containerMargin} />
        <View style={Styles.buttonContainer}>
          <NextButton
            text='Deutsch'
            onPress={() => {
              changeLanguage('de-CH')
              sendLanguageIntention('de-CH')
              navigate(nextScreen)
            }}
          />
          <NextButton
            text='English'
            onPress={() => {
              changeLanguage('en-GB')
              sendLanguageIntention('en-GB')
              navigate(nextScreen)
            }}
          />
        </View>
        <View style={Styles.textContainer}>
          <Text style={Styles.subtitle}>
            {I18n.t('Onboarding.chooseLanguage')}
          </Text>
        </View>
      </View>
    )
  }
}

const mapStateToDispatch = (dispatch) => ({
  changeLanguage: (newLang) =>
    dispatch(SettingsActions.changeLanguage(newLang)),
  sendLanguageIntention: (language) =>
    dispatch(MessageActions.sendIntention(null, 'language', language))
})

export default connect(
  null,
  mapStateToDispatch
)(ScreenLanguageSelection)

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.onboarding.background,
    ...ifIphoneX({ paddingTop: 40 })
  },
  containerMargin: { flex: 0.15 },
  buttonContainer: {
    marginHorizontal: 30,
    flex: 0.5,
    justifyContent: 'space-around',
    alignSelf: 'stretch'
  },
  image: { flex: 1, alignSelf: 'stretch', resizeMode: 'contain' },
  textContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 30
  },
  subtitle: {
    color: Colors.onboarding.text,
    textAlign: 'center',
    fontSize: 20
  }
})

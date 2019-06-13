import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import Immutable from 'seamless-immutable'
import moment from 'moment'
import { FormLabel, CheckBox, Icon } from 'react-native-elements'
import Dialog from 'react-native-dialog'
import Datepicker from 'react-native-datepicker'
import ServerMessageActions from './../../Redux/MessageRedux'

import SettingsActions from './../../Redux/SettingsRedux'
import I18n from '../../I18n/I18n'
import NextButton from '../../Components/NextButton'
import { Colors } from './../../Themes'

class UserSettings extends Component {
  constructor (props) {
    super(props)

    this.initialState = Immutable({
      currentNickname: this.props.syncedSettings['name'],
      dialogVisible: false,
      exercises: [
        'treatment1',
        'treatment2',
        'treatment3',
        'treatment4',
        'treatment6',
        'treatment7'
      ],
      values: ['1', '2', '3', '4', '6', '7']
    })

    this.state = this.initialState
  }

  render () {
    return (
      <View>
        {this.renderNicknameForm()}

        {this.renderPainButtonForm()}

        {this.renderExercisesForm()}

        {this.renderReminderForm()}

        {this.renderNameChangeDialogBox()}
      </View>
    )
  }

  renderNicknameForm () {
    if (this.props.syncedSettings['name'] !== undefined) {
      return (
        <View style={styles.paddedView}>
          <FormLabel labelStyle={styles.labelStyle}>
            {I18n.t('Settings.individualUserSettings.nickname')}
          </FormLabel>

          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({
                dialogVisible: true,
                currentNickname: this.props.syncedSettings['name']
              })
            }
          >
            <View style={styles.fakeFormInput}>
              <Text style={styles.textStyle}>
                {this.props.syncedSettings['name']}
              </Text>
              <Icon
                style={styles.editIcon}
                name='edit'
                type='material'
                color={Colors.buttons.settings.background}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  renderPainButtonForm () {
    if (
      this.props.syncedSettings['painButtonActivated'] !== undefined &&
      this.props.syncedSettings['painButtonActivated'] === 'true'
    ) {
      let hasPain = false

      if (this.props.syncedSettings['hasPain'] === '1') {
        hasPain = true
      }

      const buttonText = hasPain
        ? I18n.t('Settings.individualUserSettings.pain.hasNoPain')
        : I18n.t('Settings.individualUserSettings.pain.hasPain')

      return (
        <View style={styles.paddedView}>
          <FormLabel labelStyle={styles.labelStyle}>
            {I18n.t('Settings.individualUserSettings.pain.title')}
          </FormLabel>

          <View style={{ flex: 1 }}>
            <NextButton
              styleButton={styles.button}
              styleText={styles.buttonText}
              text={buttonText}
              onPress={() => {
                Alert.alert(
                  hasPain
                    ? I18n.t(
                      'Settings.individualUserSettings.pain.hasNoPainConfirmation'
                    )
                    : I18n.t(
                      'Settings.individualUserSettings.pain.hasPainConfirmation'
                    ),
                  '',
                  [
                    {
                      text: I18n.t('Settings.no'),
                      onPress: () => {},
                      style: 'cancel'
                    },
                    {
                      text: I18n.t('Settings.yes'),
                      onPress: () => {
                        this.changePainStatus(!hasPain)
                        this.props.sendIntention(buttonText, 'ignore')
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }}
            />
          </View>
        </View>
      )
    }
  }

  renderExercisesForm () {
    if (
      this.props.syncedSettings['exerciseSelectionActivated'] !== undefined &&
      this.props.syncedSettings['exerciseSelectionActivated'] === 'true'
    ) {
      return (
        <View style={styles.paddedView}>
          <FormLabel labelStyle={styles.labelStyle}>
            {I18n.t('Settings.individualUserSettings.exerciseSelection')}
          </FormLabel>

          {this.getExcerciseOptions()}
        </View>
      )
    }
  }

  renderReminderForm () {
    if (
      this.props.syncedSettings['reminderActivated'] !== undefined &&
      this.props.syncedSettings['reminderActivated'] === 'true'
    ) {
      return (
        <View style={styles.paddedView}>
          <FormLabel labelStyle={styles.labelStyle}>
            {I18n.t('Settings.individualUserSettings.reminder.title')}
          </FormLabel>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between'
            }}
          >
            <Text style={[styles.textStyle, { flex: 1 }]}>
              {I18n.t('Common.frequency') + ': '}
            </Text>
            <View
              style={[
                styles.fakeFormInput,
                {
                  borderBottomColor: Colors.buttons.common.disabled,
                  flex: 3
                }
              ]}
            >
              <Text style={[{ color: Colors.buttons.common.disabled }]}>
                {(this.props.syncedSettings['exerciseFrequency'] === undefined
                  ? '1'
                  : this.props.syncedSettings['exerciseFrequency']) +
                  'x ' +
                  I18n.t('Settings.individualUserSettings.reminder.frequency')}
              </Text>
            </View>
          </View>
          <View style={styles.datepickerContainer}>
            <View style={styles.textBeforeTimeContainer}>
              <Text style={styles.textStyle}>{I18n.t('Common.time')}: </Text>
            </View>
            <Datepicker
              is24Hour
              placeholder={
                this.props.syncedSettings['startingTime'] === undefined
                  ? ' '
                  : this.props.syncedSettings['startingTime']
              }
              style={styles.datepicker}
              mode='time'
              confirmBtnText={I18n.t('Common.confirm')}
              cancelBtnText={I18n.t('Common.abort')}
              format='LT'
              locale={moment.locale()}
              iconComponent={
                <Icon
                  style={{ marginRight: 8 }}
                  name='clock'
                  type='material-community'
                  color={Colors.buttons.common.background}
                />
              }
              customStyles={{
                dateInput: {
                  alignItems: 'flex-start',
                  borderWidth: 0
                },
                placeholderText: {
                  color: Colors.main.paragraph
                }
              }}
              onDateChange={(timeString, date) => {
                const momentDate = moment(date)
                const minutes =
                  '0' + Math.floor((momentDate.format('mm') / 60) * 100)
                const timeToSend =
                  momentDate.format('HH') +
                  '.' +
                  minutes.substring(minutes.length - 2, minutes.length)
                this.props.changeSyncedSetting(
                  'startingTime',
                  timeToSend,
                  timeString,
                  true
                )
              }}
            />
          </View>
        </View>
      )
    }
  }

  getExcerciseOptions () {
    let output = []

    for (let i in this.state.exercises) {
      const exercise = this.state.exercises[i]
      const value = this.state.values[i]
      output.push(
        this.getExcerciseOption(
          I18n.t('Settings.individualUserSettings.exercises.' + exercise),
          i !== '0',
          exercise,
          value
        )
      )
    }

    return output
  }

  getExcerciseOption (name, changeable = false, key, value) {
    let checked = false

    if (
      this.props.syncedSettings[key] !== undefined &&
      this.props.syncedSettings[key] !== '0'
    ) {
      checked = true
    }

    return (
      <CheckBox
        key={key}
        title={name}
        checked={checked}
        containerStyle={[styles.checkBoxStyle, { paddingBottom: 0 }]}
        textStyle={
          changeable
            ? { fontWeight: 'normal' }
            : {
              fontWeight: 'normal',
              color: Colors.buttons.common.disabled
            }
        }
        onIconPress={() => {
          this.changeExerciseOption(changeable, key, value)
        }}
        onPress={() => {
          this.changeExerciseOption(changeable, key, value)
        }}
        iconType='ionicon'
        checkedIcon='md-checkbox'
        checkedColor={
          changeable
            ? Colors.buttons.common.background
            : Colors.buttons.common.disabled
        }
        uncheckedIcon='md-square'
        uncheckedColor={
          changeable
            ? Colors.buttons.common.background
            : Colors.buttons.common.disabled
        }
      />
    )
  }

  changeExerciseOption (changeable, key, newSetValue) {
    if (changeable) {
      let newValue = '0'
      if (
        this.props.syncedSettings[key] === undefined ||
        this.props.syncedSettings[key] === '0'
      ) {
        newValue = newSetValue
      }

      this.props.changeSyncedSetting(key, newValue, null, true)
    } else {
      Alert.alert(
        I18n.t('Settings.individualUserSettings.cannotBeChanged'),
        '',
        [
          {
            text: I18n.t('Common.ok'),
            onPress: () => {
              return true
            }
          }
        ]
      )
      return false
    }
  }

  changePainStatus (newPainStatus) {
    this.props.changeSyncedSetting(
      'hasPain',
      newPainStatus ? '1' : '0',
      null,
      true
    )
    this.props.navigate('Chat')
  }

  renderNameChangeDialogBox () {
    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>
            {I18n.t('Settings.individualUserSettings.nickname')}
          </Dialog.Title>
          <Dialog.Input
            value={this.state.currentNickname}
            onChangeText={(nickname) =>
              this.setState({ currentNickname: nickname })
            }
          />
          <Dialog.Button
            label='Abbrechen'
            onPress={() => {
              this.setState({ dialogVisible: false })
            }}
          />
          <Dialog.Button
            label='Speichern'
            onPress={() => {
              if (this.state.currentNickname !== '') {
                this.setState({ dialogVisible: false })
                this.props.changeSyncedSetting(
                  'name',
                  this.state.currentNickname,
                  null,
                  true
                )
              }
            }}
          />
        </Dialog.Container>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  paddedView: {
    paddingBottom: 10
  },
  formInput: {
    marginLeft: 0,
    marginRight: 0,
    width: undefined,
    color: Colors.main.paragraph
  },
  button: {
    backgroundColor: Colors.buttons.common.background,
    borderRadius: 20,
    marginVertical: 10
  },
  fakeFormInput: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3c3c3c'
  },
  inputContainer: {
    marginLeft: 0,
    marginRight: 0
  },
  editIcon: {
    marginRight: 8
  },
  headline: {
    color: Colors.main.headline,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  checkBoxStyle: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    width: undefined,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  labelStyle: {
    marginLeft: 0,
    marginRight: 0,
    color: Colors.main.headline,
    fontWeight: 'bold',
    width: undefined
  },
  textStyle: {
    fontWeight: 'normal',
    color: '#43484d'
  },
  buttonText: {
    color: Colors.buttons.common.text,
    fontSize: 16
  },
  datepickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  datepicker: {
    flex: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#3c3c3c'
  },
  textBeforeTimeContainer: {
    flex: 2
  }
})

const mapStateToProps = (state) => {
  return {
    syncedSettings: state.settings.syncedSettings
  }
}

const mapStateToDispatch = (dispatch) => ({
  changeSyncedSetting: (variable, value, localValue, asIntention) =>
    dispatch(
      SettingsActions.changeSyncedSetting(
        variable,
        value,
        localValue,
        asIntention
      )
    ),
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content))
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(UserSettings)

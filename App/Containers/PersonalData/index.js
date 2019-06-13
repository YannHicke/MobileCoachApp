import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import Dialog from 'react-native-dialog'
import SettingsRedux from '../../Redux/SettingsRedux'
import I18n from '../../I18n/I18n'
import { Colors } from '../../Themes'
import HeaderBar from '../../Components/HeaderBar'
import PMCardView from '../../Components/PMCardView'

class PersonalData extends PureComponent {
  static defaultProps = {}

  static propTypes = {
    syncedSettings: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      settings: this.getCurrentSettings()
    }
  }

  getCurrentSettings = () => {
    let { syncedSettings } = this.props

    let object = { survey: {}, information: {} }

    if (syncedSettings.name !== undefined) {
      object.survey['name'] = syncedSettings.name
    }
    if (syncedSettings.systemUniqueId !== undefined) {
      object.survey['systemUniqueId'] = syncedSettings.systemUniqueId
    }
    if (syncedSettings.syncHeartAge !== undefined) {
      object.survey['syncHeartAge'] = syncedSettings.syncHeartAge
    }
    if (syncedSettings.syncMedicationCompliance !== undefined) {
      object.survey['syncMedicationCompliance'] =
        syncedSettings.syncMedicationCompliance
    }

    if (syncedSettings.birthday !== undefined) {
      object.information['birthday'] = syncedSettings.birthday
    }
    if (syncedSettings.syncBMI !== undefined) {
      object.information['syncBMI'] = syncedSettings.syncBMI
    }
    if (syncedSettings.syncHeight !== undefined) {
      object.information['syncHeight'] = syncedSettings.syncHeight
    }
    if (syncedSettings.syncWeight !== undefined) {
      object.information['syncWeight'] = syncedSettings.syncWeight
    }
    if (syncedSettings.syncMedication !== undefined) {
      object.information['syncMedication'] = syncedSettings.syncMedication
    }
    if (syncedSettings.syncSmoker !== undefined) {
      object.information['syncSmoker'] = syncedSettings.syncSmoker
    }
    if (syncedSettings.syncDiabetes !== undefined) {
      object.information['syncDiabetes'] = syncedSettings.syncDiabetes
    }

    return object
  }

  componentDidUpdate (prevProps) {
    if (this.props.syncedSettings !== prevProps.syncedSettings) {
      this.setState({ settings: this.getCurrentSettings() })
    }
  }

  renderDataChangeDialogBox = () => {
    let {
      currentDialogParamValue,
      dialogVisible,
      currentDialogParamName
    } = this.state

    return (
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>
          {I18n.t(`Me.personalData.${currentDialogParamName}`)}
        </Dialog.Title>
        <Dialog.Input
          value={`${currentDialogParamValue}`}
          onChangeText={(val) =>
            this.setState({ currentDialogParamValue: val })
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
            if (currentDialogParamValue !== '') {
              this.setState({
                dialogVisible: false
              })
              this.props.onChangeSyncedSetting(
                currentDialogParamName,
                currentDialogParamValue
              )
            }
          }}
        />
      </Dialog.Container>
    )
  }

  render () {
    let { settings } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title={I18n.t('Me.personalData.title')}
          onBack={() => {
            const redirect = this.props.navigation.goBack
            redirect()
          }}
        />
        {settings.survey && settings.survey.systemUniqueId
          ? this.renderContent()
          : this.renderEmptyNotice()}
        {this.renderDataChangeDialogBox()}
      </View>
    )
  }

  renderContent () {
    let { settings } = this.state
    return (
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18 }}
        style={styles.scrollViewContainer}
      >
        {Object.keys(settings).map((item, index) => {
          const items = Object.keys(settings[item])

          return (
            <PMCardView
              key={index}
              items={items}
              headerTitle={
                items.length > 0
                  ? I18n.t(`Me.personalData.${item}`).toUpperCase()
                  : undefined
              }
              renderItem={(field) => {
                switch (field) {
                  case 'name':
                  case 'systemUniqueId':
                  case 'syncHeight':
                  case 'syncWeight':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <Text
                          style={{
                            color: '#999',
                            fontSize: 16
                          }}
                        >
                          {field === 'syncWeight'
                            ? I18n.t(`Me.personalData.weightExpression`, {
                              value: settings[item][field]
                            })
                            : field === 'syncHeight'
                              ? I18n.t(`Me.personalData.heightExpression`, {
                                value: settings[item][field]
                              })
                              : settings[item][field]}
                        </Text>
                      </View>

                      // <View
                      //   style={{
                      //     flexDirection: 'row',
                      //     alignItems: 'center',
                      //     justifyContent: 'space-between',
                      //     width: '100%',
                      //     paddingVertical: 5
                      //   }}>
                      //   <Text style={{ fontSize: 15 }}>
                      //     {I18n.t(`Me.personalData.${field}`)}
                      //   </Text>
                      //   <TouchableWithoutFeedback
                      //     onPress={() =>
                      //       this.setState({
                      //         dialogVisible: true,
                      //         currentDialogParamName: field,
                      //         currentDialogParamValue: settings[item][field]
                      //       })
                      //     }>
                      //     <View style={styles.fakeFormInput}>
                      //       <Text style={styles.textStyle}>
                      //         {field === 'syncWeight'
                      //           ? I18n.t(`Me.personalData.weightExpression`, {
                      //             value: settings[item][field]
                      //           })
                      //           : field === 'syncHeight'
                      //             ? I18n.t(`Me.personalData.heightExpression`, {
                      //               value: settings[item][field]
                      //             })
                      //             : settings[item][field]}
                      //       </Text>
                      //       <Icon
                      //         style={styles.editIcon}
                      //         name='edit'
                      //         type='material'
                      //         color={Colors.main.primary}
                      //       />
                      //     </View>
                      //   </TouchableWithoutFeedback>
                      // </View>
                    )

                  case 'syncMedicationCompliance':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={styles.textStyle}>
                            {I18n.t(`Me.personalData.${field}Result`, {
                              value: settings[item][field].toFixed(2)
                            })}
                          </Text>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              Alert.alert(
                                I18n.t(`Me.personalData.${field}`),
                                I18n.t(`Me.personalData.${field}Info`),
                                [
                                  {
                                    text: I18n.t('Common.ok'),
                                    onPress: () => {}
                                  }
                                ],
                                {
                                  cancelable: false
                                }
                              )
                            }}
                          >
                            <Icon
                              name='info-with-circle'
                              type='entypo'
                              color={Colors.main.grey2}
                            />
                          </TouchableWithoutFeedback>
                        </View>
                      </View>
                    )

                  case 'syncHeartAge':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={styles.textStyle}>
                            {settings[item][field]}
                          </Text>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              Alert.alert(
                                I18n.t(`Me.personalData.${field}`),
                                I18n.t(`Me.personalData.${field}Info`),
                                [
                                  {
                                    text: I18n.t('Common.ok'),
                                    onPress: () => {}
                                  }
                                ],
                                {
                                  cancelable: false
                                }
                              )
                            }}
                          >
                            <Icon
                              name='info-with-circle'
                              type='entypo'
                              color={Colors.main.grey2}
                            />
                          </TouchableWithoutFeedback>
                        </View>
                      </View>
                    )

                  case 'syncBMI':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <Text
                          style={{
                            color: '#999',
                            fontSize: 16
                          }}
                        >
                          {settings[item].syncBMI}
                        </Text>
                      </View>
                    )

                  case 'birthday':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <Text
                          style={{
                            color: '#999',
                            fontSize: 16
                          }}
                        >
                          {settings[item][field]}
                        </Text>
                      </View>
                    )

                  case 'syncMedication':
                  case 'syncSmoker':
                  case 'syncDiabetes':
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingVertical: 5
                        }}
                      >
                        <Text style={styles.label}>
                          {I18n.t(`Me.personalData.${field}`)}
                        </Text>
                        <Text
                          style={{
                            color: '#999',
                            fontSize: 16
                          }}
                        >
                          {settings[item][field]
                            ? I18n.t('Common.yes')
                            : I18n.t('Common.no')}
                        </Text>
                        {/* <FormItemButtonGroup
                        items={[I18n.t('Common.yes'), I18n.t('Common.no')]}
                        labelStyle={{ color: '#000', fontSize: 15 }}
                        label={I18n.t(`Me.personalData.${field}`)}
                        containerStyle={{ paddingVertical: 0 }}
                        onChange={value => {
                          this.props.onChangeSyncedSetting(field, value)
                        }
                        }
                        defaultValue={convertDefaultValueToIndex(
                          settings[item][field]
                        )}
                      /> */}
                      </View>
                    )
                  default:
                    return null
                }
              }}
              itemContainerStyle={{ paddingVertical: 10 }}
            />
          )
        })}
      </ScrollView>
    )
  }
  renderEmptyNotice () {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 25,
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            marginBottom: 10,
            fontSize: 20,
            color: Colors.main.grey1,
            textAlign: 'center'
          }}
        >
          {I18n.t('Me.personalData.noDataTitle').toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.main.grey2,
            textAlign: 'center'
          }}
        >
          {I18n.t('Me.personalData.noData')}
        </Text>
      </View>
    )
  }
}

// const convertDefaultValueToIndex = value => {
//   if (value === '') return undefined
//   else {
//     if (value) return 0
//     else return 1
//   }
// }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.appBackground,
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  scrollViewContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1
  },
  fakeFormInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    fontWeight: 'normal',
    marginRight: 15,
    fontSize: 16
  },
  label: {
    fontSize: 15,
    color: Colors.main.paragraph
  }
})

const mapStateToProps = (state) => {
  return {
    syncedSettings: state.settings.syncedSettings
  }
}

const mapStateToDispatch = (dispatch) => ({
  onChangeSyncedSetting: (field, value) => {
    dispatch(SettingsRedux.changeSyncedSetting(field, value))
  }
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(PersonalData)

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import {
  handleTextInput,
  withTouched,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm
} from 'react-native-formik'
// import PropTypes from 'prop-types'
import { Formik, FieldArray } from 'formik'
import { compose } from 'recompose'
import hexToRgba from 'hex-to-rgba'
import uuid from 'uuid'
import { Icon } from 'react-native-elements'
import * as Yup from 'yup'
import _ from 'lodash'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import I18n from '../../I18n/I18n'
import { Colors } from '../../Themes'
import PickerInput from '../../Components/Forms/PickerInput'
import PMButton from '../../Components/PMButton'
import {
  FormItemDateTime,
  FormItemText
} from '../../Containers/Triage/FormItems'
import SelectWeekDays from '../../Components/SelectWeekDays'
import HeaderBar from '../../Components/HeaderBar'
import Common from '../../Utils/Common'
import DropDownHolder from '../../Components/DropDownAlertHolder'
import {
  TASK_TYPES,
  INTERVAL_TYPES
} from '../../Containers/TaskModule/TaskMetrics'
import TaskRedux from '../../Redux/TaskRedux'
import GUIRedux from '../../Redux/GUIRedux'

const FormikTextInput = compose(
  handleTextInput,
  withTouched,
  withNextInputAutoFocusInput
)(FormItemText)
const FormikFormItemDateTime = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(FormItemDateTime)

const Form = withNextInputAutoFocusForm(View)

const DOSAGE_TYPES = ['pills', 'drops', 'spray', 'plaster', 'solution']

class AddMedication extends Component {
  static defaultProps = {
    medication: {}
  }

  constructor (props) {
    super(props)

    const { medication } = props
    this.editMode = !_.isEmpty(medication)
    this.validationSchema = Yup.object().shape({
      medicationText: Yup.string().required(
        I18n.t('Me.addMedication.validation.missingName')
      ),
      dosageValue: Yup.number()
        .min(0.01, I18n.t('Me.addMedication.validation.doseValueOutOfRange'))
        .max(100, I18n.t('Me.addMedication.validation.doseValueOutOfRange'))
        .required(I18n.t('Me.addMedication.validation.missingDose'))
        .typeError(I18n.t('Me.addMedication.validation.missingDose')),
      ingestions: Yup.array()
        .of(Yup.string().length(5))
        .required()
    })

    this.initialValue = {
      medicationInputText: medication.title || '',
      // medicationInputTextInvalid: false,
      dosageValue: (medication.dosis && medication.dosis.value) || '',
      typeRhythm:
        medication.intervalType === INTERVAL_TYPES.SELECTED_DAYS ? 2 : 1,
      dosageType: this.editMode ? medication.dosis.unit : 'pills',
      iterationDays:
        medication.intervalType === INTERVAL_TYPES.SELECTED_DAYS
          ? medication.iterationDays
          : [],
      ingestions: medication.iterationTimes
        ? [...medication.iterationTimes]
        : ['']
    }

    this.rythmValues = [
      {
        value: 1,
        label: I18n.t(`Me.addMedication.rhythm.${INTERVAL_TYPES.DAILY}`)
      },
      {
        value: 2,
        label: I18n.t(`Me.addMedication.rhythm.${INTERVAL_TYPES.SELECTED_DAYS}`)
      }
    ]
    this.dosageTypes = DOSAGE_TYPES.map((type, index) => {
      return {
        value: type,
        label: I18n.t(`Me.addMedication.dosage.${type}`)
      }
    })
    this.customValidate = this.customValidate.bind(this)

    this.state = {
      submitting: false
    }
  }

  customValidate (values, props /* only available when using withFormik */) {
    const { typeRhythm, iterationDays } = values
    let errors = {}

    // type = selected day BUT no day selected...
    if (typeRhythm === 2 && iterationDays.length === 0) {
      errors.iterationDays = I18n.t('Me.addMedication.validation.selectDay')
    }

    return errors
  }

  handlePressSubmit = (values) => {
    const { medication, onTaskUpdate, onTaskCreate, onSubmit } = this.props
    const { typeRhythm, iterationDays, ingestions, dosageType } = values

    let result = {
      ...medication,
      reminderActive: this.editMode ? medication.reminderActive : true,
      title: values.medicationText,
      createdAt: this.editMode ? medication.createdAt : moment().valueOf(),
      startingTime: this.editMode
        ? medication.startingTime
        : moment().valueOf(),
      type: TASK_TYPES.MEDICATION,
      iterationTimes: ingestions.sort(),
      id: this.editMode ? medication.id : uuid.v4(),
      intervalType:
        typeRhythm === 1 ? INTERVAL_TYPES.DAILY : INTERVAL_TYPES.SELECTED_DAYS,

      dosis: { value: values.dosageValue, unit: dosageType }
    }

    if (typeRhythm !== 1) result.iterationDays = iterationDays

    this.editMode ? onTaskUpdate(result) : onTaskCreate(result)
    const alertTitle = this.editMode
      ? I18n.t('Tasks.editAlertTitle')
      : I18n.t('Tasks.createAlertTitle')
    const alertMessage = this.editMode
      ? I18n.t('Tasks.editAlert')
      : I18n.t('Tasks.createAlert')
    DropDownHolder.getDropDown().alertWithType(
      'success',
      alertTitle,
      alertMessage
    )

    onSubmit()
  }

  render () {
    const {
      typeRhythm,
      dosageValue,
      medicationInputText,
      iterationDays,
      dosageType,
      ingestions
    } = this.initialValue

    return (
      <View style={styles.container}>
        {/* TODO: the view below is just a quick fix for the statusbar backround-color, there should be a more generic solution.. */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 30,
            backgroundColor: Colors.main.primary
          }}
        />
        <HeaderBar
          title={
            this.editMode
              ? I18n.t('Me.addMedication.editMedication')
              : I18n.t('Me.addMedication.addMedication')
          }
          onBack={() => {
            this.props.onClose()
          }}
        />
        <Formik
          onSubmit={(values) => {
            this.props.hideTaskList()
            // set small timeout to ensure tasklist was hidden (prevent "flickering")
            setTimeout(() => {
              this.setState(
                {
                  submitting: true
                },
                () => this.handlePressSubmit(values)
              )
            }, 100)
          }}
          validationSchema={this.validationSchema}
          validate={this.customValidate}
          isInitialValid={this.editMode}
          initialValues={{
            medicationText: medicationInputText,
            typeRhythm: typeRhythm,
            iterationDays: iterationDays,
            dosageValue: dosageValue,
            ingestions: ingestions,
            dosageType: dosageType
          }}
          render={(props) => {
            return (
              <Form
                onSubmit={props.handleSubmit}
                style={{
                  width: '100%',
                  flex: 1,
                  justifyContent: 'space-between'
                }}
              >
                <ScrollView
                  ref={(ref) => {
                    this.scrollView = ref
                  }}
                  style={styles.scrollViewContainer}
                >
                  <FormikTextInput
                    label={I18n.t(`Me.addMedication.medication`).toUpperCase()}
                    // labelStyle={{ fontSize: 12 }}
                    placeholder={I18n.t(`Me.addMedication.name`)}
                    onChangeText={props.handleChange('medicationText')}
                    invalid={
                      props.touched.medicationText &&
                      !!props.errors.medicationText
                    }
                    name='medicationText'
                    invalidMessage={props.errors.medicationText}
                    onBlur={props.setFieldTouched}
                    value={props.values.medicationText}
                  />
                  <View>
                    <PickerInput
                      initialValue={typeRhythm}
                      onChange={props.handleChange('typeRhythm')}
                      items={this.rythmValues}
                      label={I18n.t(`Me.addMedication.rhythmus`).toUpperCase()}
                      labelStyle={{
                        alignSelf: 'flex-start'
                      }}
                      containerStyle={styles.rhythmInputContainer}
                      iconRight={null}
                    />
                    {props.values.typeRhythm === 2 ? (
                      <SelectWeekDays
                        label={I18n.t(
                          `Me.addMedication.rhythm.weekdays`
                        ).toUpperCase()}
                        iterationDays={iterationDays}
                        containerStyle={styles.marginBottom}
                        onChange={props.handleChange('iterationDays')}
                        invalid={!Common.isBlank(props.errors.iterationDays)}
                        invalidMessage={props.errors.iterationDays}
                      />
                    ) : null}
                  </View>
                  <FieldArray
                    name='ingestions'
                    render={(arrayHelpers) => (
                      <View>
                        <Text
                          style={{
                            color: 'rgba(35, 38, 43, 0.8)',
                            marginBottom: 5
                          }}
                        >
                          {I18n.t(`Me.addMedication.times`).toUpperCase()}
                        </Text>
                        {props.values.ingestions.map((ingestion, index) => (
                          <View
                            style={styles.ingestionWrapper}
                            key={`ingestion${index}`}
                          >
                            <View
                              style={{
                                width: '58%',
                                flexDirection: 'row',
                                justifyContent: 'center'
                              }}
                            >
                              <FormikFormItemDateTime
                                defaultValue={ingestion}
                                value={ingestion}
                                icon='clock'
                                format='HH:mm'
                                placeholder={I18n.t(`Me.addMedication.time`)}
                                mode='time'
                                textStyle={{
                                  fontSize: 14
                                }}
                                innerWrapperStyle={{
                                  width: '100%'
                                }}
                                containerStyle={{
                                  height: 56,
                                  alignItems: 'center'
                                }}
                                onChange={(timestring, time) => {
                                  arrayHelpers.replace(index, timestring)
                                  props.handleChange('ingestions')
                                }}
                                onBlur={props.setFieldTouched}
                                invalid={
                                  props.touched.ingestions &&
                                  props.touched.ingestions[index] &&
                                  !ingestions[index] &&
                                  props.errors.ingestions &&
                                  !!props.errors.ingestions[index]
                                }
                                name={`ingestions.${index}`}
                                invalidMessage={I18n.t(
                                  'Me.addMedication.validation.missingTime'
                                )}
                              />
                            </View>
                            <View style={styles.ingestionControlWrapper}>
                              <Text style={styles.ingestionLabel}>{`${index +
                                1}. ${I18n.t(
                                'Me.addMedication.ingestion'
                              )}`}</Text>
                              {index !== 0 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    arrayHelpers.remove(index)
                                    props.handleChange('ingestions')
                                  }}
                                >
                                  <Icon
                                    type='font-awesome'
                                    size={28}
                                    name='trash'
                                    containerStyle={{
                                      marginBottom: 2
                                    }}
                                    color={Colors.main.grey1}
                                  />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        ))}
                        <View
                          style={{
                            alignItems: 'flex-end',
                            marginBottom: 25
                          }}
                        >
                          <PMButton
                            onPress={() => {
                              if (props.values.ingestions.length >= 10) {
                                Alert.alert(
                                  I18n.t('Schedule.maxMedicationCountTitle'),
                                  I18n.t('Schedule.maxIngestionsCountText'),
                                  [
                                    {
                                      text: 'OK',
                                      onPress: () => null
                                    }
                                  ]
                                )
                              } else {
                                arrayHelpers.push('')
                                props.handleChange('ingestions')
                                setTimeout(() => {
                                  this.scrollView &&
                                    this.scrollView.scrollToEnd({
                                      animated: true
                                    })
                                }, 250)
                              }
                            }}
                            containerStyle={{
                              paddingHorizontal: 0
                            }}
                            title={I18n.t('Me.addMedication.addIngestion')}
                            icon='plus'
                            secondary
                          />
                        </View>
                      </View>
                    )}
                  />
                  <View style={styles.quantityWrapper}>
                    <FormikTextInput
                      numericOnly
                      keyboardType='numeric'
                      value={`${props.values.dosageValue}`}
                      containerStyle={{ width: '48%' }}
                      label={I18n.t(
                        `Me.addMedication.dosage.title`
                      ).toUpperCase()}
                      // labelStyle={{ fontSize: 12 }}
                      placeholder={I18n.t(`Me.addMedication.dosage.quantity`)}
                      onChangeText={props.handleChange('dosageValue')}
                      invalid={
                        props.touched.dosageValue && !!props.errors.dosageValue
                      }
                      name='dosageValue'
                      invalidMessage={props.errors.dosageValue}
                      onBlur={props.setFieldTouched}
                    />
                    <View
                      style={{
                        marginTop: 24,
                        width: '48%'
                      }}
                    >
                      <PickerInput
                        containerStyle={{
                          marginBottom: 25
                        }}
                        initialValue={dosageType}
                        onChange={props.handleChange('dosageType')}
                        items={this.dosageTypes}
                        iconRight={null}
                      />
                    </View>
                  </View>
                </ScrollView>
                {Platform.OS === 'ios' ? (
                  <KeyboardSpacer topSpacing={-70} />
                ) : null}
                <View style={styles.bottomContainer}>
                  <PMButton
                    containerStyle={{ padding: 10 }}
                    title={
                      this.editMode
                        ? I18n.t('Common.save')
                        : I18n.t('Me.addMedication.addMedication')
                    }
                    onPress={props.handleSubmit}
                    disabled={this.state.submitting}
                  />
                </View>
              </Form>
            )
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapStateToDispatch = (dispatch) => ({
  onTaskCreate: (res) => dispatch(TaskRedux.scheduleCreateTask(res)),
  onTaskUpdate: (res) =>
    dispatch(TaskRedux.scheduleUpdateTask(res, moment().valueOf())),
  hideTaskList: () => dispatch(GUIRedux.hideTaskList())
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(AddMedication)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollViewContainer: {
    padding: 18,
    width: '100%'
  },
  ingestionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  ingestionControlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  ingestionLabel: {
    color: Colors.main.paragraph
  },
  rhythmInputContainer: {
    height: 56,
    padding: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingHorizontal: 8,
    marginBottom: 25
  },
  marginBottom: {
    marginBottom: 25
  },
  quantityWrapper: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContainer: {
    backgroundColor: Colors.main.appBackground,
    padding: 10,
    paddingBottom: 10,
    borderTopColor: hexToRgba(Colors.main.primary, 0.2),
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 70,
    width: '100%'
  }
})

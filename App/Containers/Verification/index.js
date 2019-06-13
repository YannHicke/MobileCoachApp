import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import * as Yup from 'yup'
import {
  handleTextInput,
  withTouched,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm
} from 'react-native-formik'
import { Formik } from 'formik'
import { compose } from 'recompose'
import moment from 'moment'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import I18n from '../../I18n/I18n'
import { Images, Colors, ApplicationStyles } from '../../Themes'
import HeaderBar from '../../Components/HeaderBar'
import PMButton from '../../Components/PMButton'
import {
  FormItemDateTime,
  FormItemText
} from '../../Containers/Triage/FormItems'

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

class Verification extends PureComponent {
  static defaultProps = {}

  constructor (props) {
    super(props)

    this.state = {
      validationButtonActive: true,
      validationSchema: Yup.object().shape({
        userNumber: Yup.string()
          .transform(function (value, originalvalue) {
            let re = /\.|-/gi
            value = originalvalue.replace(re, '')
            return value.length === 8 && !isNaN(value) && value
          })
          .required(),
        dateOfBirth: Yup.date().required()
      })
    }
  }

  handlePressSubmit = (values) => {
    const { onSubmit } = this.props

    // Deactivate button
    this.setState({ validationButtonActive: false })

    // TODO: Do verification and close window
    onSubmit()
  }

  render () {
    const { onClose, syncedSettings } = this.props
    const { validationButtonActive, validationSchema } = this.state
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
        <HeaderBar title={I18n.t('Verification.title')} onBack={onClose} />
        <Formik
          onSubmit={(values) => this.handlePressSubmit(values)}
          validationSchema={validationSchema}
          initialValues={{
            userNumber: '',
            dateOfBirth: moment(syncedSettings.birthday, 'DD.MM.YYYY').toDate()
          }}
          render={(props) => {
            return (
              <Form
                style={{ width: '100%', flex: 1 }}
                onSubmit={props.handleSubmit}
              >
                <ScrollView style={styles.scrollViewContainer}>
                  <View style={{ paddingTop: 20 }}>
                    <Image
                      source={Images.appLogo}
                      style={{
                        width: '100%',
                        height: 50
                      }}
                      resizeMode={'contain'}
                    />
                  </View>
                  <View style={{ paddingVertical: 25 }}>
                    <Text
                      style={{
                        color: Colors.main.paragraph
                      }}
                    >
                      {I18n.t('Verification.info')}
                    </Text>
                  </View>
                  <FormikTextInput
                    inputStyle={{
                      backgroundColor: Colors.main.grey3
                    }}
                    label={I18n.t('Verification.userNumber')}
                    keyboardType='numbers-and-punctuation'
                    placeholder={I18n.t('Verification.userNumberPlaceholder')}
                    onChangeText={props.handleChange('userNumber')}
                    invalid={
                      props.touched.userNumber && !!props.errors.userNumber
                    }
                    name='userNumber'
                    invalidMessage={I18n.t('Verification.userNumberError')}
                    onBlur={props.setFieldTouched}
                    value={props.values.userNumber}
                  />
                  <FormikFormItemDateTime
                    value={props.values.dateOfBirth}
                    format='DD.MM.YYYY'
                    placeholder={I18n.t('Verification.dateOfBirthPlaceholder')}
                    textStyle={{ fontSize: 16 }}
                    innerWrapperStyle={{ width: '100%' }}
                    containerStyle={{
                      height: 50,
                      backgroundColor: Colors.main.grey3,
                      alignItems: 'center'
                    }}
                    onChange={(timestring, time) => {
                      props.setFieldValue('dateOfBirth', time)
                    }}
                    onBlur={props.setFieldTouched}
                    invalid={
                      props.touched.dateOfBirth &&
                      props.errors.dateOfBirth &&
                      !!props.errors.dateOfBirth
                    }
                    label={I18n.t('Verification.dateOfBirth')}
                    name={'dateOfBirth'}
                    // I18n.t('Verification.dateOfBirthError')
                    invalidMessage={props.errors.dateOfBirth}
                  />
                </ScrollView>

                {Platform.OS === 'ios' ? (
                  <KeyboardSpacer topSpacing={-70} />
                ) : null}
                <View style={ApplicationStyles.bottomButtonContainer}>
                  <PMButton
                    title={
                      validationButtonActive
                        ? I18n.t('Verification.register')
                        : I18n.t('Verification.pleaseWait')
                    }
                    onPress={props.handleSubmit}
                    disabled={!validationButtonActive}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  scrollViewContainer: {
    padding: 18,
    width: '100%'
  }
})

const mapStateToProps = (state) => {
  return {
    syncedSettings: state.settings.syncedSettings
  }
}

const mapStateToDispatch = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Verification)

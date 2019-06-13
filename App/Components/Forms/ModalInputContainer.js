import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import PMButton from '../PMButton'
import Modal from 'react-native-modal'
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import I18n from '../../I18n/I18n'
import { Colors } from '../../Themes'

class ModalInputContainer extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    buttonTitle: PropTypes.string,
    submitButtonTitle: PropTypes.string,
    renderButton: PropTypes.func,
    isValid: PropTypes.bool,
    onSubmitInvalid: PropTypes.func,
    onShow: PropTypes.func,
    onHide: PropTypes.func
  }

  static defaultProps = {
    onSubmit: () => null,
    onSubmitInvalid: () => null,
    isValid: true,
    onShow: () => null,
    onHide: () => null
  }

  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }

  onSubmit () {
    const { isValid, onSubmit, onSubmitInvalid } = this.props
    if (isValid) {
      onSubmit()
      this.hideModal()
    } else {
      onSubmitInvalid()
    }
  }

  showModal () {
    this.props.onShow()
    this.setState({ modalVisible: true })
  }

  hideModal () {
    this.props.onHide()
    this.setState({ modalVisible: false })
  }

  render () {
    const { buttonTitle, submitButtonTitle, renderButton } = this.props
    const { modalVisible } = this.state
    return (
      <View>
        {renderButton ? (
          renderButton(this.showModal)
        ) : (
          <PMButton
            title={buttonTitle}
            icon='plus'
            secondary
            containerStyle={{
              paddingVertical: 5,
              paddingHorizontal: 0
            }}
            onPress={this.showModal}
          />
        )}
        <Modal
          hideModalContentWhileAnimating
          isVisible={modalVisible}
          // increase timing for fade-out a little because it seems faster then fadein (cause of easing)
          animationOutTiming={500}
          useNativeDriver
          onBackdropPress={() => this.hideModal()}
          style={styles.modal}
        >
          <View style={styles.container}>
            <View style={styles.headlineContainer}>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  {/* <FontAwesome5
                        name='chevron-left'
                        size={16}
                        style={{marginRight: 8}}
                        color={Colors.main.grey1}
                    /> */}
                  <TouchableWithoutFeedback onPress={this.hideModal}>
                    <Text style={[styles.headline, { paddingVertical: 10 }]}>
                      {I18n.t('Common.abort').toUpperCase()}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <PMButton
                  title={submitButtonTitle || I18n.t('Common.save')}
                  titleStyle={{ fontSize: 16 }}
                  onPress={this.onSubmit}
                  secondary
                  containerStyle={{ paddingHorizontal: 0 }}
                />
              </View>
            </View>
            {this.props.children}
            {/*
                <PMButton
                  title={submitButtonTitle || I18n.t('Common.save')}
                  onPress={this.onSubmit}
                  containerStyle={{borderRadius: 0, paddingVertical: 25}}
                />
              */}
          </View>
        </Modal>
      </View>
    )
  }
}

export default ModalInputContainer

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  container: {
    alignItems: 'stretch',
    padding: 0,
    backgroundColor: '#fff'
  },
  headline: {
    fontSize: 16,
    fontWeight: '100',
    color: Colors.main.grey1
  },
  headlineContainer: {
    backgroundColor: Colors.main.grey3,
    height: 55,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

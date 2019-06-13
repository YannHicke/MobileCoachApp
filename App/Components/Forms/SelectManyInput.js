import React, { PureComponent } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ModalInputContainer from './ModalInputContainer'
import {
  FormItemCheckboxGroup,
  FormItemCheckbox
} from '../../Containers/Triage/FormItems'
import { Colors, Metrics } from '../../Themes'

class MultiSelectModalButton extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    title: PropTypes.string
  }

  static defaultProps = {
    onChange: () => null
  }

  constructor (props) {
    super(props)
    const { defaultValue } = props
    this.state = {
      values: defaultValue || []
    }
  }

  handleChange (value, item) {
    let newValues = [...this.state.values]
    // checkbox was set
    if (value) {
      newValues.push(item)
      // checkbox was unset
    } else {
      newValues = newValues.filter((element) => element !== item)
    }
    this.setState({
      values: newValues
    })
  }

  render () {
    const { buttonTitle, items, defaultValues } = this.props
    return (
      <ModalInputContainer
        buttonTitle={buttonTitle}
        onSubmit={() => this.props.onChange(this.state.values)}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <FormItemCheckboxGroup
              containerStyle={{
                backgroundColor: '#fff',
                marginBottom: 0
              }}
            >
              {items.map((item, i) => {
                return (
                  <FormItemCheckbox
                    key={i}
                    label={item.label}
                    onChange={(value) => this.handleChange(value, item.value)}
                    defaultValue={
                      defaultValues ? defaultValues.includes(item.value) : false
                    }
                  />
                )
              })}
            </FormItemCheckboxGroup>
          </View>
        </ScrollView>
      </ModalInputContainer>
    )
  }
}

export default MultiSelectModalButton

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: Colors.main.appBackground
  },
  scrollView: {
    backgroundColor: '#fff',
    maxHeight: Metrics.screenHeight * 0.35
  }
})

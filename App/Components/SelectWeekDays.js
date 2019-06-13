import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'

import DayOfWeek from './DayOfWeek'
import { Colors } from '../Themes'
import { DAYS } from '../Containers/TaskModule/TaskMetrics'

import moment from 'moment'

export default class SelectWeekDays extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    iterationDays: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    invalid: PropTypes.bool,
    invalidMessage: PropTypes.string
  }

  static defaultProps = {
    iterationDays: [],
    onChange: () => null
  }

  constructor (props) {
    super(props)
    let { iterationDays } = props

    this.state = {
      daysOfWeekSelected: new Map([
        [0, iterationDays.includes(DAYS[1])],
        [1, iterationDays.includes(DAYS[2])],
        [2, iterationDays.includes(DAYS[3])],
        [3, iterationDays.includes(DAYS[4])],
        [4, iterationDays.includes(DAYS[5])],
        [5, iterationDays.includes(DAYS[6])],
        [6, iterationDays.includes(DAYS[7])]
      ])
    }
  }

  handleSelected = (index) => {
    let daysOfWeekSelected = new Map([...this.state.daysOfWeekSelected])
    daysOfWeekSelected.set(index, !this.state.daysOfWeekSelected.get(index))

    this.setState(
      {
        daysOfWeekSelected
      },
      () => {
        let { daysOfWeekSelected } = this.state
        let days = []
        daysOfWeekSelected.forEach((value, key) => {
          if (value) {
            days.push(DAYS[key + 1])
          }
        })
        this.props.onChange(days)
      }
    )
  }

  render () {
    const { containerStyle, invalid, invalidMessage, label } = this.props
    const { daysOfWeekSelected } = this.state
    const daysOfWeek = []
    const day = moment().startOf('week')

    for (let j = 0; j < 7; j++) {
      const dayOfWeekKey = 'dayOfWeek' + j
      daysOfWeek.push(
        <DayOfWeek
          key={dayOfWeekKey}
          index={j}
          date={day.clone()}
          format={'dd'}
          onSelected={this.handleSelected}
          active={daysOfWeekSelected.get(j)}
        />
      )
      day.add(1, 'days')
    }

    return (
      <View style={containerStyle}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.container}>{daysOfWeek}</View>
        {invalid ? (
          <Text
            style={[
              styles.label,
              {
                marginTop: 5,
                marginBottom: 0,
                color: Colors.main.error
              }
            ]}
          >
            {invalidMessage}
          </Text>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden'
  },
  label: {
    fontSize: 14,
    color: 'rgba(35, 38, 43, 0.8)',
    marginBottom: 5
  }
})

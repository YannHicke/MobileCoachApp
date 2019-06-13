import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import I18n from '../I18n/I18n'
import HeaderBar from './HeaderBar'

export default class CustomView extends Component {
  render () {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column'
        }}
      >
        <HeaderBar
          title={I18n.t('Common.information')}
          onClose={this.props.onClose}
        />
        <ScrollView style={styles.container}>{this.props.children}</ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20
  }
})

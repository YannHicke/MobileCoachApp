import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Colors } from '../Themes';

const DayOfWeek = (props) => {
  const {
    date,
    format,
    containerStyles,
    textStyle,
    onSelected,
    index,
    active,
  } = props;

  return (
    <TouchableWithoutFeedback onPress={() => onSelected(index)}>
      <View
        style={[
          styles.container,
          containerStyles,
          active ? { backgroundColor: Colors.main.primary } : null,
        ]}>
        <Text
          style={[
            { color: Colors.main.paragraph },
            textStyle,
            active ? { color: '#fff' } : null,
          ]}>
          {date.format(format).toUpperCase()}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main.grey3,
  },
});

DayOfWeek.propTypes = {
  date: PropTypes.instanceOf(moment).isRequired,
  format: PropTypes.string,
};

export default DayOfWeek;

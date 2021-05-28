import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default ({ title, onPress, style, containerStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.closeButtonContainer, containerStyle]}
      onPress={onPress}>
      <Text style={[styles.closeButton, style]}>{title}</Text>
      <Icon
        name="md-close"
        type="ionicon"
        style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    fontSize: 20,
    color: '#fff',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    ...ifIphoneX({
      top: 55,
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

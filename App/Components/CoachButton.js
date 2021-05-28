import React, { PureComponent } from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import Badge from '../Components/Badge';
import { Images } from '../Themes';

class CoachButton extends PureComponent {
  static propTypes = {
    navigation: propTypes.object,
    onPress: propTypes.func,
  };

  render() {
    const { onPress, coach, navigation, unreadMessages } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        style={{ width: 56, height: 56 }}>
        <View style={{ position: 'relative' }}>
          <Image style={styles.coachImage} source={Images.coaches[coach]} />
          {navigation.state.routes[navigation.state.index].routeName !==
            'Chat' &&
            unreadMessages > 0 && (
              <Badge
                containerStyle={{
                  position: 'absolute',
                  top: -6,
                  right: -3,
                }}
              />
            )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  coachImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
});

const mapStateToProps = (state) => {
  return {
    unreadMessages: state.guistate.unreadMessages,
    unreadDashboardMessages: state.storyProgress.unreadDashboardMessages,
    coach: state.settings.coach,
  };
};

export default connect(mapStateToProps)(CoachButton);

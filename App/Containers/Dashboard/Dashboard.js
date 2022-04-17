// TODO for improvement check: https://github.com/idibidiart/react-native-responsive-grid/blob/master/UniversalTiles.md

import React, { Component } from 'react';
// import get_user_msg from '../../../App/Sagas/ServerSyncSagas'; -> This causes error in tests
import { connect } from 'react-redux';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Collapsible from 'react-native-collapsible';
import propTypes from 'prop-types';
import { Icon, Card, Button } from 'react-native-elements';
import Star from "./Star";
import EmptyStar from './empty-star.png';

// import { CommonActions as NavigationActions } from '@react-navigation/native';
import { Colors } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar';
import I18n from '../../I18n/I18n';

import Log from '../../Utils/Log';
import { autoRehydrate } from 'redux-persist';
import { relativeTimeRounding } from 'moment';
// import { BorderlessButton } from 'react-native-gesture-handler';
const log = new Log('Containers/Settings/Settings');

/*
const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = {}

const connectToStore = connect(mapStateToProps, mapDispatchToProps)
const ConnectedComponent = connectToStore(Component)

connect(mapStateToProps, mapDispatchToProps)(Component)
*/

class Dashboard extends Component {
  state = {
    activeSection: false,
    collapsed: true,
    rating: 0,
    star_states: [1, 1, 1, 0, 0, 0, 0], // 1 represents filled-in star, 0 represents empty star
    num_points: 0,
    num_interactions: 79 // the total number of points an user collects
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = (section) => {
    this.setState({ activeSection: section });
  };

  renderNavigationbar(props) {
    let title = I18n.t('Dashboard.dashboardTitle');
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    );
  }

  /** [count_on] counts the number of stars that are filled in. */
  count_on() {
    var num_ones = 0;
    this.state.star_states.forEach((v) => (v === 1 && num_ones++));
    return num_ones;
  }

  /** [switch] fills a new star in (is called when a user finishes all daily tasks). */
  switch() {
    const { num_on } = this.count_on();
    if (num_on < this.state.star_states.length) {
      this.state.star_states[num_on] = 1;
    }
  }

  /** [is_on] checks whether the [pos+1]th star from the left is on or off. */
  is_on(pos) {
    if (this.state.star_states[pos] == 1) {
      return true;
    }
    else {
      return false;
    }
  }

  /** [server_retrieve] is a sample function (for testing) that logs a user's response. */
  server_retrieve() {
    console.log(get_user_msg);
  }

  /** [render] is the entry point of [Dashboard.js]. */
  render() {
    // this.server_retrieve();
    const { openURL } = this.props.route.params.screenProps;
    var paths = [];

    for (var i = 0; i < 7; i++) {
      if (this.is_on(i)) {
        paths.push({ key: i, value: require('./filled-star.png') });
      }
      else {
        paths.push({ key: i, value: require('./empty-star.png') });
      }
    }

    return (
      <ScrollView style={styles.content} indicatorStyle="white">
        <View style={{ justifyContent: 'space-between' }}>
          {this.renderNavigationbar(this.props)}
          <Card
            title={I18n.t('Dashboard.dashboardTitle')}
            titleStyle={styles.cardTitle}
            containerStyle={{ marginBottom: 15 }}>
            <Text>Welcome to MobileCoach!</Text>
            <Text>Below, you will find your progress. Each star corresponds to task completion for a single day.</Text>
          </Card>
          <View style={{ flexDirection: 'row', flex: 2 }}>
            <Image
              style={styles.stretch}
              source={paths[0].value}
            />
            <Image
              style={styles.stretch}
              source={paths[1].value}
            />
            <Image
              style={styles.stretch}
              source={paths[2].value}
            />
            <Image
              style={styles.stretch}
              source={paths[3].value}
            />
            <Image
              style={styles.stretch}
              source={paths[4].value}
            />
            <Image
              style={styles.stretch}
              source={paths[5].value}
            />
            <Image
              style={styles.stretch}
              source={paths[6].value}
            />
          </View>
          <View>
            <Image
              style={styles.circle}
              source={require('./blue-circle.png')}
            />
            <Text style={styles.numInteraction}>
              {this.state.num_interactions}
            </Text>
          </View>
        </View>
        {/*<Text style={{textAlignVertical: "center", textAlign: "center", color: "blue"}}>
          You have a total of {this.state.num_points} points!
        </Text>
        */}
      </ScrollView>
    );
  }
}

export default Dashboard;

/** the stylesheet of the Dashboard page */
const styles = StyleSheet.create({
  url: {
    color: Colors.buttons.common.background,
  },
  headline: {
    color: Colors.main.headline,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground,
    justifyContent: 'space-between',
  },
  stretch: {
    width: 55,
    height: 60,
    resizeMode: 'stretch',
  },
  circle: {
    width: 200,
    height: 200,
    left: 100,
    marginTop: 20,
    justifyContent: 'center',
  },
  numInteraction: {
    textAlign: "center",
    color: "white",
    fontWeight: 'bold',
    fontSize: 50,
    left: 0,
    bottom: 130,
  },
  cardTitle: {
    textAlign: 'left',
    color: Colors.main.headline,
  },
  content: {
    flex: 1,
  },

});

import React, { Component } from 'react';
import {
  Text ,
  TextInput,
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView, 
  TouchableOpacity, 
  ImageBackground
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Collapsible from 'react-native-collapsible';
import propTypes from 'prop-types';
import { Icon, Card, Button } from 'react-native-elements';
import { CircularProgressbar } from 'react-circular-progressbar';

// import { CommonActions as NavigationActions } from '@react-navigation/native';
import { Colors } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar';
import I18n from '../../I18n/I18n';

import Log from '../../Utils/Log';
import { requestData } from '../../Sagas/ServerSyncSagas';
const log = new Log('Containers/Dashboard');

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
    star_states: [0, 0, 0, 0, 0, 0, 0], // 1 represents filled-in star, 0 represents empty star
    stars: 0,
    // num_points: 0,
    // num_interactions: 79 // the total number of points an user collects
    // star_states: [1,1,1,0,0,0,0], // 1 represents filled-in star, 0 represents empty star
    num_points: 0, // the total number of points an user collects
    last_week: 0,
    highest: 0,
    totTasks: 0,
    // plans: ["Watch a lecture", "Reading 1", "completing quiz 1"],
    task1Complete: 0,
    task2Complete: 0,
    task3Complete: 0,
    task4Complete: 0,
    task5Complete: 0,
    task1: "",
    task2: "",
    task3: "",
    task4: "",
    task5: "",
    proportion_tasks_complete: 0
  };

  componentDidMount() {
    requestData()
    .then(data => {
      if (parseInt(data.numericData[8]) != 0) {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'last_week': data.numericData[2],
          'task1Complete': data.numericData[3], 'task2Complete': data.numericData[4], 'task3Complete': data.numericData[5], 
          'task4Complete': data.numericData[6], 'task5Complete': data.numericData[7], 'totTasks': data.numericData[8], 'task1': data.textData[0], 'task2': data.textData[1], 'task3': data.textData[2], 'task4': data.textData[3], 'task5': data.textData[4],
          'proportion_tasks_complete': (parseInt(data.numericData[3]) + parseInt(data.numericData[4]) + parseInt(data.numericData[5]) + parseInt(data.numericData[6]) + parseInt(data.numericData[7])) / parseInt(data.numericData[8]) * 100});
      }
      else {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'last_week': data.numericData[2],
          'task1Complete': data.numericData[3], 'task2Complete': data.numericData[4], 'task3Complete': data.numericData[5], 
          'task4Complete': data.numericData[6], 'task5Complete': data.numericData[7], 'totTasks': data.numericData[8], 'task1': data.textData[0], 'task2': data.textData[1], 'task3': data.textData[2], 'task4': data.textData[3], 'task5': data.textData[4],
          'proportion_tasks_complete': 0});
      }
    });
  }

  componentDidUpdate() {
    requestData()
    .then(data => {
      if (parseInt(data.numericData[8]) != 0) {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'last_week': data.numericData[2],
          'task1Complete': data.numericData[3], 'task2Complete': data.numericData[4], 'task3Complete': data.numericData[5], 
          'task4Complete': data.numericData[6], 'task5Complete': data.numericData[7], 'totTasks': data.numericData[8], 'task1': data.textData[0], 'task2': data.textData[1], 'task3': data.textData[2], 'task4': data.textData[3], 'task5': data.textData[4],
          'proportion_tasks_complete': (parseInt(data.numericData[3]) + parseInt(data.numericData[4]) + parseInt(data.numericData[5]) + parseInt(data.numericData[6]) + parseInt(data.numericData[7])) / parseInt(data.numericData[8]) * 100});
      }
      else {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'last_week': data.numericData[2],
          'task1Complete': data.numericData[3], 'task2Complete': data.numericData[4], 'task3Complete': data.numericData[5], 
          'task4Complete': data.numericData[6], 'task5Complete': data.numericData[7], 'totTasks': data.numericData[8], 'task1': data.textData[0], 'task2': data.textData[1], 'task3': data.textData[2], 'task4': data.textData[3], 'task5': data.textData[4],
          'proportion_tasks_complete': 0});
      }
    });
  }

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

  /** [completion_indicator] returns a string with the name of the task and its status. */
  completion_indicator(task, isComplete) {
    task = task.replace(/\s/g, ''); // removes all spaces from string [task]
    if (task === "") { //  if there is no task entered by user
      return "";
    }
    else { // if there is a task entered by user
      progress = "";
      if (isComplete == 1) {
        progress = "Complete";
      }
      else {
        progress = "Incomplete";
      }
      return task + '  [' + progress + ']';
    }
  }

  /** [server_retrieve] is a sample function (for testing) that logs a user's response. */
  server_retrieve() {
    console.log(get_user_msg);
  }

  /** [render] is the entry point of [Dashboard.js]. */
  render() {
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
              source={(this.state.stars >= 1 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 2 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 3 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 4 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 5 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 6 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
            <Image
              style={styles.stretch}
              source={(this.state.stars >= 7 ? require('./filled-star.png') : require('./empty-star.png'))}
            />
          </View>
          <View>
            <Image
              style={styles.circle}
              source={require('./blue-circle.png')}
            />
            <Text style={styles.numInteraction}>
              {this.state.proportion_tasks_complete + '%'}
            </Text>
          </View>
        </View>
        <Text/>
      <View style={styles.subsection}>
        <Text style={styles.heading}>
            Your Plan
        </Text>
        <Text style={styles.bullet}>
          {this.completion_indicator(this.state.task1, this.state.task1Complete)}
        </Text>
        <Text style={styles.bullet}>
          {this.completion_indicator(this.state.task2, this.state.task2Complete)}
        </Text>
        <Text style={styles.bullet}>
          {this.completion_indicator(this.state.task3, this.state.task3Complete)}
        </Text>
        <Text style={styles.bullet}>
          {this.completion_indicator(this.state.task4, this.state.task4Complete)}
        </Text>
        <Text style={styles.bullet}>
          {this.completion_indicator(this.state.task5, this.state.task5Complete)}
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.heading}>
            Your Past Accomplishments
        </Text>
        <Text style={styles.bullet}>
          Last week: {this.state.last_week} stars
        </Text>
        <Text  style={styles.bullet}>
          Highest: {this.state.highest} stars
        </Text>
      </View>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  label: {
    marginLeft: 12
  },
  heading: {
    marginTop: 5,
    marginLeft: 12,
    textAlign: "left",
    fontSize: 28,
    fontWeight: 'bold'
  },
  bullet: {
    marginTop: 5,
    marginLeft: 12,
    textAlign: "left",
    fontSize: 18
  },
  subsection: {
    marginBottom: 20
  }
});

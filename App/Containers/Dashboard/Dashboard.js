//
//  Dashboard.js
//
//  Copyright (c) 2022 Rayan Wali, Yann Hicke, Jayesh Paunikar, Elena Stoeva, Ashley Yu, Yixin Zhang, Angela Lau. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//


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
import { Icon, Card, Button } from 'react-native-elements';
import { Colors } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar.js';
import I18n from '../../I18n/I18n';
import ProgressCircle from 'react-native-progress-circle';

import Log from '../../Utils/Log.js';
import { requestData } from '../../Sagas/ServerSyncSagas.js';
const log = new Log('Containers/Dashboard');


class Dashboard extends Component {
  state = {
    activeSection: false,
    collapsed: true,
    starStates: [0,0,0,0,0,0,0], // 1 represents filled-in star, 0 represents empty star
    stars: 0, // the number of stars from the current week
    numPoints: 0, // the total number of points an user collects
    currentWeek: 1, // the current week
    lastWeek: 0, // the number of stars from the last week
    highest: 0, // the maximum stars from all weeks
    course: "", // the course name the user enters
    totTasks: 0, // the total number of tasks an user enters
    dynamicTasks: [], // the total list of tasks an user enters
    dynamicTasksCompletion: [], // completion status for each task an user enters
    proportionTasksComplete: 0, // the proportion of tasks an user enters that are complete
  };

  /* first time data is requested */
  componentDidMount() {
    requestData()
    .then(data => {
      if (parseInt(data.numericData[8]) != 0) {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'lastWeek': data.numericData[2], 'totTasks': data.numericData[8], 'course': data.textData[5],
          'proportionTasksComplete': Math.round((parseInt(data.numericData[3]) + parseInt(data.numericData[4]) + parseInt(data.numericData[5]) + parseInt(data.numericData[6]) + parseInt(data.numericData[7])) / parseInt(data.numericData[8]) * 100)});
        for (let i = 0; i < data.numericData[8]; i++) {
          this.state.dynamicTasks[i] = data.textData[i];
          this.state.dynamicTasksCompletion[i] = data.numericData[i+3];
        }
      }
      else {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'lastWeek': data.numericData[2], 'totTasks': data.numericData[8], 'course': data.textData[5],
          'proportionTasksComplete': 0, 'currentWeek': data.numericData[9]-1});
          this.state.dynamicTasks = [];
          this.state.dynamicTasksCompletion = [];
      }
    });
  }

  /* automatically updates state as data changes */
  componentDidUpdate() {
    requestData()
    .then(data => {
      if (parseInt(data.numericData[8]) != 0) {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'lastWeek': data.numericData[2], 'totTasks': data.numericData[8], 'course': data.textData[5],
          'proportionTasksComplete': Math.round((parseInt(data.numericData[3]) + parseInt(data.numericData[4]) + parseInt(data.numericData[5]) + parseInt(data.numericData[6]) + parseInt(data.numericData[7])) / parseInt(data.numericData[8]) * 100)});
        for (let i = 0; i < data.numericData[8]; i++) {
          this.state.dynamicTasks[i] = data.textData[i];
          this.state.dynamicTasksCompletion[i] = data.numericData[i+3];
        }
      }
      else {
        this.setState({'stars': data.numericData[0], 'highest': data.numericData[1], 'lastWeek': data.numericData[2], 'totTasks': data.numericData[8], 'course': data.textData[5],
          'proportionTasksComplete': 0, 'currentWeek': data.numericData[9]-1});
          this.state.dynamicTasks = [];
          this.state.dynamicTasksCompletion = [];
      }
    });
  }

  // toggleExpanded = () => {
  //   this.setState({ collapsed: !this.state.collapsed });
  // };

  // setSection = (section) => {
  //   this.setState({ activeSection: section });
  // };

  renderNavigationbar(props) {
    let title = I18n.t('Dashboard.dashboardTitle');
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    );
  }

  /** Counts the number of stars that are filled in. */
  // countOn() {
  //   const { numOnes } = 0;
  //   this.state.starStates.forEach((v) => (v === 1 && numOnes++));
  //   return numOnes;
  // }

  /** Fills in a new star (called when a user finishes all daily tasks). */
  // switch() {
  //   const { numOn } = this.countOn();
  //   if (numOn < this.state.starStates.length) {
  //     this.state.starStates[numOn] = 1;
  //   }
  // }

  /** Checks whether the [pos+1]th star from the left is on or off. */
  isOn(pos) {
    if (this.state.starStates[pos] == 1) {
      return true;
    }
    else {
      return false;
    }
  }

  /** Returns a string with the name of the task and its status. */
  completionIndicator(task, isComplete) {
    progress = "";
    if (isComplete == 1) {
      progress = "Complete";
    }
    else {
      progress = "Incomplete";
    }
    return task + '  [' + progress + ']';
  }

  /** Displays components on application dashboard. */
  render() {
    return (
      <ScrollView style={styles.content} indicatorStyle="white">
        <View style={{ justifyContent: 'space-between' }}>
          {this.renderNavigationbar(this.props)}
          <Card
            title={'Course: ' + this.state.course + ' '.repeat(35) + 'Week ' + this.state.currentWeek}
            titleStyle={styles.cardTitle}
            containerStyle={{ marginBottom: 15 }}>
            <Text style={styles.TextElement}>Below, you will find your progress. Each star corresponds to task completion for a single day.</Text>
            <Text></Text><Text></Text>

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

          <View style={styles.circle}>
            <ProgressCircle 
            percent={Number(this.state.proportionTasksComplete)} radius={100} borderWidth={18}
            color="#154c79" shadowColor='#999' bgColor='#fff'>
              <Text style={{fontSize: 38, fontWeight: 'bold'}}>{this.state.proportionTasksComplete + '%'}</Text>
            </ProgressCircle>
          </View>

          <Text></Text>

          <View style={styles.subsection}>
            <Text style={styles.heading}>
            Your Plan
            </Text>
          <View>
            {
              this.state.dynamicTasks.map((item,index) => {
                return <Text style={styles.bullet}>{this.completionIndicator(item, this.state.dynamicTasksCompletion[index])}</Text>
              })
            }
          </View>
        </View>

        <View style={styles.subsection}>
        <Text style={styles.heading}>
            Your Past Accomplishments
        </Text>
        <Text style={styles.bullet}>
          Last week: {this.state.lastWeek} stars
        </Text>
        <Text  style={styles.bullet}>
          Highest: {this.state.highest} stars
        </Text>
        </View>

        </Card>
      </View>
    </ScrollView>
    );
  }
}

export default Dashboard;

/** Generates the stylesheet of the Dashboard page. */
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
    width: 48,
    height: 50,
    resizeMode: 'stretch',
  },
  circle: {
    width: 175,
    height: 175,
    left: 85,
    marginTop: 40,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  numInteraction: {
    textAlign: "center",
    color: "white",
    fontWeight: 'bold',
    fontSize: 50,
    left: 15,
    bottom: 120,
  },
  cardTitle: {
    textAlign: 'left',
    color: Colors.main.headline,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  textElement: {
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  label: {
    marginLeft: 12,
  },
  heading: {
    marginTop: 5,
    marginLeft: 12,
    textAlign: "left",
    fontSize: 25,
    fontWeight: 'bold',
  },
  bullet: {
    marginTop: 5,
    marginLeft: 12,
    textAlign: "left",
    fontSize: 16,
  },
  subsection: {
    marginBottom: 20,
  }
});
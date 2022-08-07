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
import { Icon, Card, Button, withTheme, colors } from 'react-native-elements';
import { Colors } from '../../Themes/';
import { Fonts } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar.js';
import I18n from '../../I18n/I18n';
import ProgressCircle from 'react-native-progress-circle';

import Log from '../../Utils/Log.js';
import { requestData } from '../../Sagas/ServerSyncSagas.js';
import { capitalize } from 'lodash';
const log = new Log('Containers/Dashboard');


class Dashboard extends Component {
  state = {
    activeSection: false,
    collapsed: true,
    starStates: [0,0,0,0,0,0,0], // 1 represents filled-in star, 0 represents empty star
    stars: 0, // the number of stars from the current week
    numPoints: 500, // the total number of points an user collects
    currentWeek: 1, // the current week
    lastWeek: 0, // the number of stars from the last week
    highest: 0, // the maximum stars from all weeks
    course: "INFO 1260", // the course name the user enters
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
        <View style={{ justifyContent: 'space-between', fontFamily: Fonts.type.family, marginBottom: 20}}>
          {this.renderNavigationbar(this.props)}
          <Card
            title={this.state.course}
            titleStyle={styles.cardTitle}
            borderRadius={15}
            backgroundColor={"#fff"}
            // for iOS
            shadowColor={'#000'}
            shadowRadius={2}
            shadowOpacity={0.25}
            // for Android
            elevation={5}
            >
            <Text style={styles.week}>{'Week ' + this.state.currentWeek}</Text>
            <Text></Text>

            <View style={{flexDirection: 'column', flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
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
            </View>

            <View style={{flexDirection: 'row'}}>
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
          </View>

          <View style={styles.circle}>
            <ProgressCircle 
            percent={Number(this.state.proportionTasksComplete)} radius={80} borderWidth={15}
            color="#00A7BF" shadowColor='#EEF1F5' bgColor='#fff'>
            </ProgressCircle>
          </View>

          <View> 
            <TouchableOpacity style={styles.infobutton}
            onPress={() => {
              alert('Each star corresponds to task completion for a single day!');
            }}  
            title='i'
            >
              <Text style={{color: '#fff', fontWeight: 'bold', alignSelf: 'center'}}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.heading}>
            YOUR PLAN
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
            PAST ACCOMPLISHMENTS
        </Text>
        <View style={styles.subsection2}>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: '8%'}}>
        <Text style={{color: '#031036'}}>
          Last week
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.bullet}>
          {this.state.lastWeek}
          </Text>
        <Image
              style={styles.stretch2}
              source={require('./filled-star.png')}
            />
            </View>
            </View>
        
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '8%'}}>
        <Text style={{color: '#031036'}}>
          Highest
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.bullet}>
          {this.state.highest}
          </Text>
          <Image
              style={styles.stretch2}
              source={require('./filled-star.png')}
            />
            </View>
            </View>
        </View>
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
    textTransform: 'capitalize',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground,
    justifyContent: 'space-between',
  },
  stretch: {
    width: 48,
    height: 48,
    resizeMode: 'stretch',
    margin: '1%',
  },
  stretch2: {
    width: 42,
    height: 42,
    resizeMode: 'stretch',
    marginLeft: 3,
  },
  circle: {
    width: '50%',
    left: '25%',
    right: '25%',
    marginTop: '5%',
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
    fontWeight: 'bold',
    fontSize: 28,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.appBackground,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#031036",
  },
  bullet: {
    fontSize: 48,
    color: "#E7C039",
    fontWeight: 'bold',
    marginRight: 3,
  },
  subsection: {
    marginBottom: 20,
  },
  subsection2: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
  week: {
    color: '#286BCF',
    fontWeight: 'bold',
    fontFamily: 'nunito',
  },
  infobutton: {
    width: 20,
    height: 20,
    backgroundColor: '#ACADAE',
    borderRadius: 15,
    alignSelf: 'flex-end',
    right: '25%',
    marginBottom: '5%',
  }
});
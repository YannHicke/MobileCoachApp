import React, { Component } from 'react';
// import get_user_msg from '../../../App/Sagas/ServerSyncSagas';  // this is causing another error

export default class TestD extends Component {
  constructor() {
    super();
    this.state = {
      activeSection: false,
      collapsed: true,
      rating: 0,
      star_states: [1, 1, 1, 0, 0, 0, 0], // 1 represents filled-in star, 0 represents empty star
      num_points: 0,
      num_interactions: 79, // the total number of points an user collects
    };
  }

  greet() {
    console.log('I am here.');
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
    this.state.star_states.forEach((v) => v === 1 && num_ones++);
    return num_ones;
  }

  /** [switch] fills a new star in (is called when a user finishes all daily tasks). */
  switch() {
    const { num_on } = this.count_on();
    if (num_on < this.state.star_states.length) {
      this.state.star_states[num_on] = 1;
    }
  }

  is_on(pos) {
    if (this.state.star_states[pos] == 1) {
      return true;
    } else {
      return false;
    }
  }

  /** [server_retrieve] is a sample function (for testing) that logs a user's response. */
  server_retrieve() {
    console.log(get_user_msg);
  }

  /** [render] is the entry point of [Dashboard.js]. */
  render() {
    this.server_retrieve();
    const { openURL } = this.props.route.params.screenProps;
    var paths = [];

    for (var i = 0; i < 7; i++) {
      if (this.is_on(i)) {
        paths.push({ key: i, value: require('./filled-star.png') });
      } else {
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
            <Text />
            <Text>
              Below, you will find your progress. Each star corresponds to task
              completion for a single day.
            </Text>
          </Card>
          <Text />
          <View style={{ flexDirection: 'row', flex: 2 }}>
            <Image style={styles.stretch} source={paths[0].value} />
            <Image style={styles.stretch} source={paths[1].value} />
            <Image style={styles.stretch} source={paths[2].value} />
            <Image style={styles.stretch} source={paths[3].value} />
            <Image style={styles.stretch} source={paths[4].value} />
            <Image style={styles.stretch} source={paths[5].value} />
            <Image style={styles.stretch} source={paths[6].value} />
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
        <Text />
        {/*<Text style={{textAlignVertical: "center", textAlign: "center", color: "blue"}}>
            You have a total of {this.state.num_points} points!
          </Text>
      */}
      </ScrollView>
    );
  }
}

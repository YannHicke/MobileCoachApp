//
//  Faq.js
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

// TODO for improvement check: https://github.com/idibidiart/react-native-responsive-grid/blob/master/UniversalTiles.md

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Collapsible from 'react-native-collapsible';
import propTypes from 'prop-types';
import { Icon, Card } from 'react-native-elements';
import { Colors } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar.js';
import I18n from '../../I18n/I18n';
import Log from '../../Utils/Log';
const log = new Log('Containers/Settings/Settings');

const questions = [];
const references = [];

/* adds the FAQ questions and answers to array [questions] */
for (let i = 1; i <= 7; i++) {
  questions.push({
    title: `Faq.questions.${i}.title`,
    answer: `Faq.questions.${i}.answer`,
  });
}

/* adds the references to array [references] */
for (let i = 1; i <= 12; i++) {
  references.push(I18n.t(`Faq.references.${i}`))
}

class CollapsibleView extends Component {
  static propTypes = {
    title: propTypes.string,
  };
  state = {
    collapsed: true,
  };

  render() {
    const { title } = this.props;
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setState({ collapsed: !this.state.collapsed })}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginRight: 15,
          }}>
          <Icon
            name={this.state.collapsed ? 'chevron-right' : 'chevron-down'}
            type="font-awesome"
            containerStyle={{ marginTop: 3, width: 15, marginRight: 5 }}
            iconStyle={[styles.headline, { fontSize: 14 }]}
          />
          <Text style={[styles.headline, { marginRight: 15 }]}>{title}</Text>
        </TouchableOpacity>
        <Collapsible collapsed={this.state.collapsed}>
          {this.props.children}
        </Collapsible>
      </View>
    );
  }
}

class Faq extends Component {
  state = {
    activeSection: false,
    collapsed: true,
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = (section) => {
    this.setState({ activeSection: section });
  };

  renderNavigationbar(props) {
    let title = I18n.t('Faq.header');
    return (
      <PMNavigationBar title={title} props={props} rightButton={<View />} />
    );
  }

  /** Displays components on application FAQ page. */
  render() {
    const { open_url } = this.props.route.params.screenProps;
    return (
      <View style={styles.container}>
        {this.renderNavigationbar(this.props)}
        <ScrollView style={styles.content} indicatorStyle="white">
          <Card
            title={I18n.t('Faq.faqTitle')}
            titleStyle={styles.cardTitle}
            containerStyle={{ marginBottom: 15 }}>
            <View key={1}>
              {questions.map((question, i) => (
                <CollapsibleView
                  key={i}
                  title={i + 1 + '. ' + I18n.t(question.title)}>
                  <View style={{ flex: 1 }}>
                    <ParsedText
                      style={styles.paragraph}
                      parse={[
                        {
                          type: 'email',
                          style: styles.url,
                          onPress: (mail) => open_url('mailto:' + mail),
                        },
                      ]}>
                      {I18n.t(question.answer)}
                    </ParsedText>
                  </View>
                </CollapsibleView>
              ))}
            </View>
            <Text></Text><Text></Text>
            <Text style={styles.referenceHeading}>References</Text>
            <Text></Text>
            <View>
              {
                  references.map((item,index) => {
                  return <Text style={styles.referenceText}>{'[' + (index+1) + '] ' + item + '\n'}</Text>
                })
              }
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

export default Faq;

/** Generates the stylesheet of the FAQ page. */
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
  referenceHeading: {
    marginTop: 5,
    marginLeft: 0,
    textAlign: "left",
    fontSize: 18,
    fontWeight: 'bold',
  },
  referenceText: {
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground,
  },
  cardTitle: {
    textAlign: 'left',
    color: Colors.main.headline,
  },
  content: {
    flex: 1,
  },
});

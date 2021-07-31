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

// import { CommonActions as NavigationActions } from '@react-navigation/native';
import { Colors } from '../../Themes/';
import PMNavigationBar from '../../Components/Navbar';
import I18n from '../../I18n/I18n';

import Log from '../../Utils/Log';
const log = new Log('Containers/Settings/Settings');

const questions = [];

for (let i = 1; i <= 4; i++) {
  questions.push({
    title: `Faq.questions.${i}.title`,
    answer: `Faq.questions.${i}.answer`,
  });
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

  render() {
    const { openURL } = this.props.route.params.screenProps;
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
                          onPress: (mail) => openURL('mailto:' + mail),
                        },
                      ]}>
                      {I18n.t(question.answer)}
                    </ParsedText>
                  </View>
                </CollapsibleView>
              ))}
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

export default Faq;

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
  },
  cardTitle: {
    textAlign: 'left',
    color: Colors.main.headline,
  },
  content: {
    flex: 1,
  },
});

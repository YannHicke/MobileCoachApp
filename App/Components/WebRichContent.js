import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';

import I18n from '../I18n/I18n';
import HeaderBar from './HeaderBar';
import ServerMessageActions from '../Redux/MessageRedux';

// HTML Templates
import PlainTextTemplate from './../../WebTemplates/PlainTextTemplate';
import SliderPageTemplate from './../../WebTemplates/SliderPageTemplate';

import Log from '../Utils/Log';
const log = new Log('Components/WebRichContent');

/*
 * Supported commands:
 *  window.postMessage('{"variable":"$result", "value": 20}');
 *  window.postMessage('close');
 *  window.postMessage('complete');
 */

class WebRichContent extends Component {
  static defaultProps = { withHeader: false };

  constructor(props) {
    super(props);

    if (Platform.OS === 'ios') {
      this.baseUrl = 'Web/';
    } else if (Platform.OS === 'android') {
      this.baseUrl = 'file:///android_asset/web/';
    }

    // Get Template-Content as JSON-Object
    const template = this.getTemplateContent();
    // Create appropriate HTML content for view
    this.htmlContent = this.generateHtmlContent(template);
  }

  /**
   * This function defines the contentType of the WebView
   * TODO: Type should be defined by the server and inside of the message-object
   */
  getTemplateContent() {
    const page = {};
    let contentType = null;
    const html = this.props.children;

    if (html.includes('<head id="force">')) {
      // Page with own additional headers
      page.pageHeader = html.substr(
        html.indexOf('<head id="force">') + 17,
        html.indexOf('</head>') - html.indexOf('<head id="force">') - 17,
      );
    } else {
      // Page without additional header
      page.pageHeader = '';
    }

    if (html.includes('<page>')) {
      // Page with slider pages
      contentType = 'slider-page';

      let cleanedPages = html.split('<page>');

      // After split first element of the array is the meta-tag
      // We don't need this tag so we take it out of the array
      cleanedPages.shift();

      //  runs through each page-element and creates the object which will be used inside of the template
      cleanedPages = cleanedPages.map((element) => {
        const newElement = element.substr(0, element.indexOf('</page>'));

        const elementObject = {
          content: newElement,
        };
        return elementObject;
      });

      page.pages = cleanedPages;
    } else if (html.includes('<body>')) {
      // Regular page
      contentType = 'plain';

      page.pageContent = html.substr(
        html.indexOf('<body>') + 6,
        html.indexOf('</body>') - html.indexOf('<body>') - 6,
      );
    } else {
      // Regular page content (without body)
      contentType = 'plain';

      page.pageContent = html;
    }

    return { contentType, templateContent: page };
  }

  // Templates will be generated with ES6 template-strings
  // Each Template is a single file which will be imported. It receives the templateContent
  generateHtmlContent(template) {
    let htmlContent = '';

    switch (template.contentType) {
      case 'plain':
        htmlContent = PlainTextTemplate(template.templateContent);
        break;
      case 'slider-page':
        htmlContent = SliderPageTemplate(template.templateContent);
        break;
    }

    return htmlContent;
  }

  render() {
    if (this.htmlContent != null) {
      if (this.props.withHeader) {
        return (
          <View style={styles.container}>
            <HeaderBar
              title={
                this.props.headerTitle
                  ? this.props.headerTitle
                  : I18n.t('Common.information')
              }
              onClose={this.props.onClose}
            />
            <View style={styles.webViewContainer}>
              <WebView
                source={{
                  html: this.htmlContent,
                  baseUrl: this.baseUrl,
                }}
                originWhitelist={['file://']}
                useWebKit={true}
                style={styles.webView}
                scalesPageToFit={!(Platform.OS === 'ios')}
                javaScriptEnabled
                domStorageEnabled={false}
                onMessage={this.onEvent.bind(this)}
              />
              {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.webViewContainer}>
            <WebView
              source={{
                html: this.htmlContent,
                baseUrl: this.baseUrl,
              }}
              originWhitelist={['file://']}
              useWebKit={true}
              style={styles.webView}
              scalesPageToFit={!(Platform.OS === 'ios')}
              javaScriptEnabled
              domStorageEnabled={false}
              onMessage={this.onEvent.bind(this)}
            />
            {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
          </View>
        );
      }
    } else {
      return null;
    }
  }

  onEvent = (event) => {
    const { data } = event.nativeEvent;
    log.debug('Event:', data);

    switch (data) {
      case 'close':
        this.props.onClose(false);
        break;
      case 'complete':
        this.props.onClose(true);
        break;
      default:
        const jsonData = JSON.parse(data);
        log.debug('Communicating value change to server:', jsonData);
        this.props.sendVariableValue(jsonData.variable, jsonData.value);
        break;
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  webViewContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
  },
  webView: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  sendVariableValue: (variable, value) =>
    dispatch(ServerMessageActions.sendVariableValue(variable, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebRichContent);

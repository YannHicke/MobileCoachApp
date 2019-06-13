import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Linking,
  Platform
} from 'react-native'
import HTML from 'react-native-render-html'
import moment from 'moment'
import DeviceInfo from 'react-native-device-info'

import AppConfig from '../../Config/AppConfig'
import { Colors } from '../../Themes/'
import HeaderBar from '../../Components/HeaderBar'
import I18n from '../../I18n/I18n'
import PMButton from '../../Components/PMButton'

import Log from '../../Utils/Log'
const log = new Log('Containers/Me/Support')

class Support extends PureComponent {
  renderbutton (title, btnTitle) {
    return (
      <React.Fragment>
        {/*
          <HTML
            html={`<web><h2 class="title">${title}</h2></web>`}
            imagesMaxWidth={Dimensions.get('window').width}
            tagsStyles={{
              web: {
                color: Colors.messageBubbles.left.text
              },
              h2: {
                textTransform: 'uppercase'
              }
            }}
            classesStyles={{
              title: {
                paddingTop: 10,
                marginBottom: 10,
                fontWeight: '500',
                fontSize: 18
              }
            }}
            containerStyle={{}}
            baseFontStyle={{}}
          />
        */}
        <PMButton
          title={btnTitle}
          iconRight
          icon='external-link-alt'
          containerStyle={{ height: 40, borderRadius: 8 }}
          onPress={() => {
            const email = '---'
            const title = AppConfig.projectName + ' User Feedback'
            const description = `
Date: ${moment().format('DD.MM.YYYY')}
Version: ${DeviceInfo.getVersion()}
Build-Nr.: ${DeviceInfo.getBuildNumber()}

My Device:
-------------------------------------
Platform: ${Platform.OS} ${
              Platform.OS === 'android'
                ? ` (API-Level: ${DeviceInfo.getAPILevel()})`
                : ''
            }
Version: ${DeviceInfo.getSystemVersion()}
Brand: ${DeviceInfo.getBrand()}
Model: ${DeviceInfo.getModel()} (${DeviceInfo.getDeviceId()})
Country: ${DeviceInfo.getDeviceCountry()}
System-Language: ${DeviceInfo.getDeviceLocale()}
`
            const feedbackUrl = `mailto:${email}?subject=${title}&body=${description}`
            Linking.canOpenURL(feedbackUrl)
              .then((supported) => {
                if (!supported) {
                  log.warn("Can't handle url: " + feedbackUrl)
                } else {
                  return Linking.openURL(feedbackUrl)
                }
              })
              .catch((err) =>
                log.warn(
                  'An error occurred while trying to send Feedback: ',
                  err
                )
              )
          }}
        />
      </React.Fragment>
    )
  }

  render () {
    const htmlContent = `
      <div>
      <h2>${I18n.t('Me.support.title')}</h2>
      <p>${I18n.t('Me.support.text1')} <a href="mailto:---">---</a>.</br></p>
      <p>${I18n.t('Me.support.text2')}</br></p>
      <p>${I18n.t('Me.support.text3')}</p>
      </div>
    `
    return (
      <View style={styles.container}>
        <HeaderBar
          title={I18n.t('Me.support.title')}
          onBack={() => {
            const redirect = this.props.navigation.goBack
            redirect()
          }}
        />
        <ScrollView>
          <View style={styles.content}>
            <HTML
              html={'<web>' + htmlContent + '</web>'}
              imagesMaxWidth={Dimensions.get('window').width}
              onLinkPress={(e, url) => {
                Linking.canOpenURL(url).then((supported) => {
                  if (!supported) {
                    log.warn('No handler for URL:', url)
                  } else {
                    Linking.openURL(url)
                  }
                })
              }}
              tagsStyles={{
                web: {
                  color: Colors.messageBubbles.left.text
                },
                p: {
                  fontSize: 15
                },
                div: {
                  marginBottom: 25
                },
                a: {
                  color: '#228B22',
                  textDecorationLine: 'none'
                },
                h2: {
                  textTransform: 'uppercase',
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontWeight: 'bold',
                  fontSize: 20
                }
              }}
              classesStyles={{}}
              containerStyle={{}}
              baseFontStyle={{}}
            />
            {this.renderbutton(
              I18n.t('Me.support.btnTitle'),
              I18n.t('Me.support.btnText')
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Support

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.appBackground
  },
  content: {
    flex: 1,
    backgroundColor: Colors.main.appBackground,
    padding: 20,
    paddingHorizontal: 15
  }
})

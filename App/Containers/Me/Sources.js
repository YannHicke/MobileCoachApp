import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, Linking } from 'react-native'
import HTML from 'react-native-render-html'

import { Colors } from '../../Themes/'
import HeaderBar from '../../Components/HeaderBar'
import PMButton from '../../Components/PMButton'
import I18n from '../../I18n/I18n'

import QuellenContent from '../../../Web/StaticContentQuellen'

import Log from '../../Utils/Log'
const log = new Log('Containers/Me/Sources')

class Sources extends PureComponent {
  render () {
    const htmlContent = `
    <h2>${I18n.t('Me.sources.title')}</h2>
      <div>
        <p>${I18n.t('Me.sources.textSectionOne')}</p>
      </div>
      <div>
        <p>${I18n.t(
          'Me.sources.textSectionTwoPartOne'
        )} <a href="https://academic.oup.com/eurheartj/article/39/33/3021/5079119">https://academic.oup.com/eurheartj/article/39/33/3021/5079119</a> ${I18n.t(
      'Me.sources.textSectionTwoPartTwo'
    )}</p>
      </div>
      <div>
        <p>${I18n.t('Me.sources.textSectionThree')}</p>
      </div>
      <div>
        <p>${I18n.t(
          'Me.sources.textSectionFourPartOne'
        )} <a href="https://www.hochdruckliga.de">https://www.hochdruckliga.de</a> ${I18n.t(
      'Me.sources.textSectionFourPartTwo'
    )}</p>
      </div>
    `
    return (
      <View style={styles.container}>
        <HeaderBar
          title={I18n.t('Me.sources.title')}
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
            <PMButton
              title={I18n.t('Me.sources.btnText')}
              containerStyle={{ height: 40, borderRadius: 8 }}
              onPress={() =>
                this.props.screenProps.showModal('rich-text', {
                  headerTitle: I18n.t('Me.sources.title'),
                  htmlMarkup: QuellenContent
                })
              }
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Sources

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

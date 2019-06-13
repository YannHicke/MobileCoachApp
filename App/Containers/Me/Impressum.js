import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, Linking } from 'react-native'
import HTML from 'react-native-render-html'

import { Colors } from '../../Themes/'
import HeaderBar from '../../Components/HeaderBar'
import I18n from '../../I18n/I18n'
import PMButton from '../../Components/PMButton'

import DatenschutzerklaerungContent from '../../../Web/StaticContentDatenschutzererklaerung'
import AGBContent from '../../../Web/StaticContentAGB'
// import LizenzenContent from '../../../Web/StaticContentLizenzen'

import Log from '../../Utils/Log'
const log = new Log('Containers/Me/Impressum')

class Impressum extends PureComponent {
  renderbutton (title, btnTitle, content) {
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
                paddingTop: 15,
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: 20
              }
            }}
            containerStyle={{}}
            baseFontStyle={{}}
          />
        */}
        <PMButton
          title={btnTitle}
          containerStyle={{
            height: 40,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10
          }}
          onPress={() =>
            this.props.screenProps.showModal('rich-text', {
              headerTitle: title,
              htmlMarkup: content
            })
          }
        />
      </React.Fragment>
    )
  }

  render () {
    const htmlContent = `
      <div>
        <h3 class="subtitle">${I18n.t('Me.impressum.sectionOneSubTitle')}</h3>
        <p>${I18n.t('Me.impressum.sectionOneTextPartOne')}<br/>${I18n.t(
      'Me.impressum.sectionOneTextPartTwo'
    )}<br/>${I18n.t('Me.impressum.sectionOneTextPartThree')}<br/>${I18n.t(
      'Me.impressum.sectionOneTextPartFour'
    )}<br/>
          <a href="http://---">http://---</a><br>
          <a href="mailto:---">---</a>
        </p>
      </div>
      <div>
        <h3 class="subtitle">${I18n.t('Me.impressum.sectionTwoSubTitle')}</h3>
        <p>${I18n.t('Me.impressum.sectionTwoText')}</p>
      </div>
      <div>
        <h3 class="subtitle">${I18n.t('Me.impressum.sectionThreeSubTitle')}</h3>
        <p>${I18n.t('Me.impressum.sectionThreeTextPartOne')}<br>${I18n.t(
      'Me.impressum.sectionThreeTextPartTwo'
    )}</p>
      </div>
      <div>
        <h3 class="subtitle">${I18n.t('Me.impressum.sectionFourSubTitle')}</h3>
        <p>${I18n.t('Me.impressum.sectionFourText')}</p>
      </div>
    </div>
    `
    return (
      <View style={styles.container}>
        <HeaderBar
          title={I18n.t('Me.impressum.title')}
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
                h2: {
                  textTransform: 'uppercase'
                },
                h3: {
                  margin: 0,
                  padding: 0
                },
                p: {
                  fontSize: 15
                },
                div: {
                  marginBottom: 15
                },
                a: {
                  color: '#228B22',
                  textDecorationLine: 'none'
                }
              }}
              classesStyles={{
                title: {
                  marginBottom: 10,
                  fontWeight: 'bold',
                  fontSize: 20
                },
                subtitle: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 3
                }
              }}
              containerStyle={{}}
              baseFontStyle={{ fontSize: 16 }}
            />
            {this.renderbutton(
              I18n.t('Me.impressum.btnOneTitle'),
              I18n.t('Me.impressum.btnOneText'),
              DatenschutzerklaerungContent
            )}
            {this.renderbutton(
              I18n.t('Me.impressum.btnTwoTitle'),
              I18n.t('Me.impressum.btnTwoText'),
              AGBContent
            )}
            {/*
            {this.renderbutton(
              I18n.t('Me.impressum.btnThreeTitle'),
              I18n.t('Me.impressum.btnThreeText'),
              LizenzenContent
            )} */}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Impressum

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

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, ScrollView, Linking } from 'react-native'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CachedImage } from 'react-native-cached-image'

import StoryProgressRedux from '../../Redux/StoryProgressRedux'
import ServerMessageActions from '../../Redux/MessageRedux'
import HeaderBar from '../../Components/HeaderBar'
import PMButton from '../../Components/PMButton'
import I18n from '../../I18n/I18n'
import { Colors } from '../../Themes'

class ServiceChannel extends PureComponent {
  static defaultProps = {
    news: []
  }

  componentWillUnmount () {
    let { news, onReadAllNews } = this.props
    let newNews = news.map((item) => {
      return {
        ...item,
        read: true
      }
    })
    console.log('unmount')
    onReadAllNews(newNews)
  }

  handleOpenLink = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }

  render () {
    const { onClose } = this.props
    const { news } = this.props

    return (
      <View style={styles.container}>
        {/* TODO: the view below is just a quick fix for the statusbar backround-color, there should be a more generic solution.. */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 30,
            backgroundColor: Colors.main.primary
          }}
        />
        <HeaderBar title={I18n.t('ServiceChannel.title')} onBack={onClose} />
        <ScrollView style={styles.scrollViewContainer}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text style={styles.topDescription}>
              {I18n.t('ServiceChannel.topDescription')}
            </Text>
            <PMButton
              title={I18n.t('ServiceChannel.topButtonLabel')}
              titleStyle={{ fontSize: 16 }}
              icon='external-link-alt'
              iconRight
              onPress={() => {
                this.props.sendIntention(
                  null,
                  'news-button-clicked',
                  'contact-button'
                )
                this.handleOpenLink(I18n.t('ServiceChannel.topButtonURL'))
              }}
              containerStyle={{ height: 40, borderRadius: 8 }}
            />
          </View>
          {news.map((item) =>
            !item.deleted ? (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.category}>
                    {item.category.toUpperCase()}
                  </Text>
                  <View>
                    {!item.read ? (
                      <View style={styles.badgeContainer}>
                        <Text style={{ color: '#fff' }}>NEU</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <CachedImage
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode={'cover'}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
                <View
                  style={{
                    padding: 0,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}
                  >
                    {item.button2 && item.url2 ? (
                      <PMButton
                        containerStyle={{
                          height: 40,
                          borderRadius: 8,
                          marginBottom: 10
                        }}
                        icon='external-link-alt'
                        iconRight
                        onPress={() => {
                          this.props.sendIntention(
                            null,
                            'news-second-button-clicked',
                            item.id
                          )
                          this.handleOpenLink(item.url2)
                        }}
                        title={item.button2.toUpperCase()}
                      />
                    ) : null}
                    <PMButton
                      containerStyle={{
                        height: 40,
                        borderRadius: 8
                      }}
                      icon='external-link-alt'
                      iconRight
                      onPress={() => {
                        this.props.sendIntention(
                          null,
                          'news-first-button-clicked',
                          item.id
                        )
                        this.handleOpenLink(item.url)
                      }}
                      title={item.button.toUpperCase()}
                    />
                  </View>
                </View>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.appBackground,
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  scrollViewContainer: {
    width: '100%',
    paddingVertical: 16,
    flex: 1
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingBottom: 16
  },
  topDescription: {
    paddingBottom: 10,
    textAlign: 'center'
  },
  image: {
    width: '100%',
    height: 200
  },
  category: {
    fontSize: 20,
    color: Colors.modules.serviceChannel.categoryTitle
  },
  title: {
    fontSize: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: Colors.modules.serviceChannel.title
  },
  text: {
    fontSize: 14,
    paddingHorizontal: 16,
    color: Colors.modules.serviceChannel.text
  },
  itemHeader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badgeContainer: {
    backgroundColor: '#fb946a',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 25
  }
})

const mapStateToProps = (state) => {
  return {
    news: state.storyProgress.serviceChannel
  }
}

const mapStateToDispatch = (dispatch) => ({
  onReadAllNews: (news) =>
    dispatch(StoryProgressRedux.clearUnreadServiceMessages(news)),
  sendIntention: (text, intention, content) =>
    dispatch(ServerMessageActions.sendIntention(text, intention, content))
})

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(ServiceChannel)

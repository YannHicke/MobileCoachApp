import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes, Text, StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CommonUtils from '../Utils/Common'

export class CardViewItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    onPress: PropTypes.func,
    showEllipsis: PropTypes.bool,
    onPressEllipsis: PropTypes.func,
    rightIconComponent: PropTypes.node,
    ellipsisComponent: PropTypes.node
  }

  render () {
    const {
      title,
      subTitle,
      rightIconComponent,
      ellipsisComponent
    } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View style={{ flex: 1, paddingLeft: 3 }}>
          <Text style={Styles.itemTitle}>{title}</Text>
          {subTitle ? (
            <Text style={Styles.itemSubTitle}>{subTitle}</Text>
          ) : null}
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {rightIconComponent}
          {ellipsisComponent}
        </View>
      </View>
    )
  }
}

class CardView extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.string,
    headerIcon: PropTypes.string,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    searchTerm: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    items: PropTypes.array,
    renderItem: PropTypes.func,
    itemContainerStyle: ViewPropTypes.style,
    renderRightIcon: PropTypes.func,
    renderEllipsis: PropTypes.func,
    titleStyle: ViewPropTypes.style
  }

  render () {
    const {
      containerStyle,
      headerTitle,
      headerIcon,
      items,
      renderItem,
      renderFooter,
      itemContainerStyle,
      renderRightIcon,
      renderEllipsis,
      titleStyle
    } = this.props
    const containerStyles = [Styles.cardContainer, containerStyle]
    return (
      <View style={Styles.wrapper}>
        {headerTitle || headerIcon ? (
          <View style={Styles.header}>
            {headerIcon ? (
              <Icon
                style={Styles.icon}
                color={Colors.main.paragraph}
                name={headerIcon}
                size={Metrics.icons.tiny}
                solid
              />
            ) : null}
            {headerTitle ? (
              <Text style={[Styles.title, titleStyle]}>{headerTitle}</Text>
            ) : null}
          </View>
        ) : null}
        <View style={containerStyles}>
          {items.map((item, index) => {
            const itemContainerStyles = [
              Styles.itemContainer,
              itemContainerStyle
            ]
            if (
              index === items.length - 1 &&
              CommonUtils.isBlank(renderFooter)
            ) {
              itemContainerStyles.push(Styles.itemContainerLast)
            }
            return (
              <View key={index} style={itemContainerStyles}>
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <CardViewItem
                    title={item.title}
                    subTitle={item.subTitle}
                    rightIconComponent={
                      renderRightIcon && renderRightIcon(item)
                    }
                    ellipsisComponent={renderEllipsis && renderEllipsis(item)}
                  />
                )}
              </View>
            )
          })}
          {renderFooter ? renderFooter() : null}
        </View>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  wrapper: {
    marginBottom: 25
  },
  cardContainer: {
    ...ApplicationStyles.shadowMedium,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5
  },
  icon: {
    marginRight: 5
  },
  title: {
    fontSize: 16,
    fontWeight: '200'
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(35, 38, 43, 0.2)',
    marginHorizontal: 15,
    paddingVertical: 13
  },
  itemTitle: {
    color: Colors.main.paragraph,
    fontSize: 16
  },
  itemSubTitle: {
    marginTop: 3,
    fontWeight: '200',
    color: 'rgba(35, 38, 43, 0.8)',
    fontSize: 14
  },
  itemContainerLast: {
    borderBottomWidth: 0
  }
})

export default CardView

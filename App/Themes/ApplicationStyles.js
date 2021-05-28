import { StyleSheet } from 'react-native';
import hexToRgba from 'hex-to-rgba';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';
// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    container: {
      flex: 1,
      paddingTop: Metrics.baseMargin,
      backgroundColor: Colors.transparent,
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin,
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin,
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text,
    },
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin,
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow,
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center',
  },
  shadowWeak: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 3,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 30,
  },
  screenTitleContainer: {
    marginTop: 20,
    padding: 0,
    justifyContent: 'center',
    height: Metrics.navbarHeight,
    width: '100%',
  },
  bottomButtonContainer: {
    backgroundColor: Colors.main.appBackground,
    padding: 10,
    borderTopColor: hexToRgba(Colors.main.primary, 0.2),
    borderTopWidth: StyleSheet.hairlineWidth,
    ...ifIphoneX({
      paddingBottom: 20,
    }),
    width: '100%',
  },
};

export default ApplicationStyles;

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Badge } from 'react-native-elements';
import { Colors } from '../Themes';
import Icon from 'react-native-vector-icons/Ionicons';
import { Images } from '../Themes';

import LoadingContainer from '../Containers/LoadingContainer';

import Chat from '../Containers/Chat/Chat';
import DashboardChat from '../Containers/Chat/DashboardChat';
import InfoCardsLibrary from '../Containers/InfoCardsLibrary/InfoCardsLibrary';
import MediaLibrary from '../Containers/MediaLibrary/MediaLibrary';
import Settings from '../Containers/Settings/Settings';
import Faq from '../Containers/FAQ/Faq';
import Dashboard from '../Containers/Dashboard/Dashboard';

import ScreenStartWithLogo from '../Containers/Onboarding/ScreenStartWithLogo';
import ScreenLanguageSelection from '../Containers/Onboarding/ScreenLanguageSelection';
import ScreenCoachSelection from '../Containers/Onboarding/ScreenCoachSelection';
import ScreenWelcomeByCoach from '../Containers/Onboarding/ScreenWelcomeByCoach';

import I18n from '../I18n/I18n';
import { connect } from 'react-redux';

const StackOnboarding = createStackNavigator();

export const initialRouteName = 'ScreenStartWithLogo';
function Onboarding() {
  return (
    <StackOnboarding.Navigator
      initialRouteName
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <StackOnboarding.Screen
        name="ScreenStartWithLogo"
        component={ScreenStartWithLogo}
      />
      <StackOnboarding.Screen
        name="ScreenLanguageSelection"
        component={ScreenLanguageSelection}
      />
      <StackOnboarding.Screen
        name="ScreenCoachSelection"
        component={ScreenCoachSelection}
      />
      <StackOnboarding.Screen
        name="ScreenWelcomeByCoach"
        component={ScreenWelcomeByCoach}
      />
    </StackOnboarding.Navigator>
  );
}

const DrawerSideMenu = createDrawerNavigator();
function SideMenu({
  route,
  navigation,
  lang,
  coach,
  unreadMessages,
  unreadDashboardMessages,
}) {
  const { screenProps } = route.params;
  return (
    <DrawerSideMenu.Navigator
      initialRouteName={'Chat'}
      screenOptions={{
        swipeEnabled: false,
      }}
      drawerType="slide"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <DrawerSideMenu.Screen
        name="Chat"
        component={Chat}
        initialParams={{ screenProps }}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-chatbubbles"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>
                {I18n.t('Menu.Chat', { locale: lang, coach: I18n.t('Coaches.' + coach )})}
              </Text>
              <Badge
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
                value={unreadMessages}
              />
            </View>
          ),
        }}
      />
      <DrawerSideMenu.Screen
        name="DashboardChat"
        component={DashboardChat}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-chatbubbles"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.DashboardChat', { locale: lang })}</Text>
              <Badge
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
                value={unreadDashboardMessages}
              />
            </View>
          ),
        }}
      />
      <DrawerSideMenu.Screen
        name="InfoCardsLibrary"
        component={InfoCardsLibrary}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-information-circle"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.InfoCardsLibrary', { locale: lang })}</Text>
            </View>
          ),
        }}
        initialParams={{ screenProps }}
      />
      <DrawerSideMenu.Screen
        name="MediaLibrary"
        component={MediaLibrary}
        initialParams={{ screenProps }}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-play-circle"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.MediaLibrary', { locale: lang })}</Text>
            </View>
          ),
        }}
      />
      <DrawerSideMenu.Screen
        name="Faq"
        component={Faq}
        initialParams={{ screenProps }}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-help-circle"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.Faq', { locale: lang })}</Text>
            </View>
          ),
        }}
      />
      <DrawerSideMenu.Screen
        name="Dashboard"
        component={Dashboard}
        initialParams={{ screenProps }}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-analytics-outline"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.Dashboard', { locale: lang })}</Text>
            </View>
          ),
        }}
      />
      <DrawerSideMenu.Screen
        name="Settings"
        component={Settings}
        initialParams={{ screenProps }}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon
              name="ios-settings"
              size={size}
              type="ionicon"
              style={styles.actionButtonIcon}
            />
          ),
          drawerLabel: () => (
            <View style={styles.drawerLabel}>
              <Text>{I18n.t('Menu.Settings', { locale: lang })}</Text>
            </View>
          ),
        }}
      />
    </DrawerSideMenu.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* <View>
        <Image style={styles.coachAvater} source={Images.coachGeneric} />
        <Text style={styles.coachName}>Coach</Text>
      </View> */}
      <DrawerItemList {...props} />
      {/* <View style={styles.versionInfo}>
        <Text>This is a version number</Text>
      </View> // TODO*/}
    </DrawerContentScrollView>
  );
}

const StackNavigatorRoot = createStackNavigator();
function RootStack({ screenProps }) {
  return (
    <StackNavigatorRoot.Navigator
      initialRouteName={LoadingContainer}
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <StackNavigatorRoot.Screen
        name="LoadingContainer"
        component={LoadingContainer}
      />
      <StackNavigatorRoot.Screen name="OnboardingNav" component={Onboarding} />
      <StackNavigatorRoot.Screen
        name="MainNavigation"
        component={SideMenuContainer}
        initialParams={{ screenProps }}
      />
    </StackNavigatorRoot.Navigator>
  );
}

// Connecting Redux to Components in React-Navigation
const SideMenuContainer = connect((state) => ({
  lang: state.settings.language, // TODO(cslim): Language selection for "Francais" is defaulted to en. To fix
  coach: state.settings.coach,
  unreadMessages: state.guistate.unreadMessages,
  unreadDashboardMessages: state.storyProgress.unreadDashboardMessages,
}))(SideMenu);

export default function App(props) {
  return (
    <NavigationContainer>
      <RootStack screenProps={props.screenProps} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: Colors.sideMenu.actionButton,
  },
  bottom: {
    flex: 0,
  },
  versionInfo: {
    alignItems: 'center',
    top: '45%',
  },
  coachAvater: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: 10,
  },
  coachName: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  drawerLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: Colors.sideMenu.actionButton,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

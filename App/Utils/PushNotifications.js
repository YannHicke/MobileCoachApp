import { AppState, Alert, Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import store from 'react-native-simple-store';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import Log from './Log';
import AppConfig from '../Config/AppConfig';

const log = new Log('Utils/PushNotifications');

let maximumPushMessagesWhenInactive = AppConfig.config.pushNotification.maximumPushMessagesWhenInactive
let channelId = AppConfig.config.pushNotification.androidChannelId
let secret = AppConfig.config.pushNotification.secret
let tokenURL = AppConfig.config.pushNotification.tokenURL

let instance = null;

let PushNotificationsHandler = null;

const STORE_NAME = 'push-notification-store';
const STORE_DEEPSTREAM_USER = 'deepstreamID';

let handlers = [];

let initialized = false;

let encKey = null;
let parsedEncKey = null;

let token = null;
let platform = null;

let badges = 0;
let appInBackground = true;

let handler = () => null;

export const setHandler = function (cb) {
  handler = cb;
};

export default class PushNotifications {
  static getInstance() {
    if (instance == null) {
      instance = new PushNotifications();
    }

    return instance;
  }

  init(resetStore, androidSenderId, requestPermissions) {
    log.debug('Init push notifications...');
    if (!initialized) {
      // Reset store if required
      if (resetStore) {
        this.reset();
      }

      // Sender ID
      if (Platform.OS === 'android') {
        log.debug('Sender ID:', androidSenderId);
      }

      // Create instance
      PushNotificationsHandler = require('react-native-push-notification');

      // Function to be called for encrypted notifications
      var decryptIfNecessaryAndShow = function (data, message) {
        log.debug('decryptIfNecessaryAndShow data: ' + data)
        log.debug('decryptIfNecessaryAndShow message: ' + message)
        let messageToShow = '';
        if (message === null) {
          log.debug('Decrypt and show notification - 1');
          const iv = CryptoJS.enc.Utf8.parse('4537823546456123');
          log.debug('Decrypt and show notification parsedEncKey', parsedEncKey);
          const decrypted = CryptoJS.AES.decrypt(data, parsedEncKey, {
            iv: iv,
            padding: CryptoJS.pad.ZeroPadding,
          });
          log.debug('Decrypt and show notification - 3', decrypted);
          messageToShow = decrypted.toString(CryptoJS.enc.Utf8);
          log.debug('Decrypt and show notification - 4');
        } else {
          log.debug('Show notification');
          messageToShow = message;
        }

        log.debug('Decrypt and show notification: messageToShow', messageToShow);        

        PushNotificationsHandler.localNotification({
          channelId: AppConfig.config.pushNotification.androidChannelId,
          message: messageToShow,
          playSound: true,
          soundName: 'default',
        });

        log.debug('Decrypt and show notification end');
      };


      var sendRegsitrationToServerNotificationURL = function(token, platform) {
        log.debug("sendRegsitrationToServerNotificationURL called")
        // get the url from STORE
        store.get(STORE_DEEPSTREAM_USER).then((result) => {
          if (result !== null) {
            deepstreamUser = result.deepstreamUser;
            if (deepstreamUser !== null) {
              let url = tokenURL + "?" + "secret=" + secret 
                        + "&token=" + token
                        + "&platform=" + platform
                        + "&deepstreamID=" + deepstreamUser;
              log.debug("Full url for token notifications:" + url);          
              fetch(url, {
                method: 'post'
              }).then(response => log.debug(response));
            }
            else {
              log.debug("deepstreamUser is null")
            }
          } else {
            log.warn("The store is empty");
          }
        }).catch(error => {
          log.warn(error);
        });
      }

      var resetBadges = function () {
        badges = 0;
        PushNotificationsHandler.setApplicationIconBadgeNumber(badges);

        PushNotificationsHandler.cancelAllLocalNotifications()
        log.debug('Reset badges to 0');
      };

      // Reset badges
      PushNotificationsHandler.setApplicationIconBadgeNumber(badges);

      // Initialize push notifications
      PushNotificationsHandler.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (data) {
          log.debug('Push token', data.token, 'on platform', data.os);

          PushNotifications.getInstance().rememberToken(data.token, data.os);

          if (
            AppState.currentState === null ||
            AppState.currentState !== 'active'
          ) {
            sendRegsitrationToServerNotificationURL(data.token, data.os);
          }
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
          log.debug('Push notification:', notification);
          log.debug('Push notification badge:', notification.badge);
          log.debug('Current badges:', badges);

          // Only care for push notifications when app is active (and prevent inifinte loop)
          let data = null;
          let key = null;

          if (
            notification.data !== undefined &&
            notification.data !== null &&
            notification.data.key !== undefined &&
            notification.data.key !== null &&
            notification.data.blob !== undefined &&
            notification.data.blob !== null   
          ) {
            data = notification.data.blob
            key = notification.data.key
          }

          if (
            AppState.currentState === null ||
            AppState.currentState !== 'active'
          ) {
            // Set badges for encrypted push notifications
            if (data !== null) {
              badges++;
              PushNotificationsHandler.setApplicationIconBadgeNumber(badges);
              log.debug('Set badges (for encrypted notifications) to', badges);
            }

            // Set badges for unencrypted push notifications on Android
            if (
              Platform.OS === 'android' &&
              data == null &&
              notification.badge !== undefined &&
              notification.badge !== null
            ) {
              badges = parseInt(notification.badge);
              PushNotificationsHandler.setApplicationIconBadgeNumber(badges);
              log.debug(
                'Set badges (for unencrypted notifications) to',
                badges,
              );
            }

            // Show local notification for encrypted push notifications
            if (data !== null) {
              // Push only first message
              if (badges <= maximumPushMessagesWhenInactive) {
                if (parsedEncKey === null) {
                  if (encKey === null) {
                    store.get(STORE_NAME).then((res) => {
                      // Show notification after retrieving encKey and calculating parsedEncKey and confirm
                      const encKeyEncrypted = res.encKey;

                      log.debug('encKeyEncrypted: ', encKeyEncrypted);

                      const iv = CryptoJS.enc.Utf8.parse('4537823546456123');
                      const decrypted = CryptoJS.AES.decrypt(
                        encKeyEncrypted,
                        CryptoJS.enc.Utf8.parse(key),
                        {
                          iv: iv,
                          padding: CryptoJS.pad.ZeroPadding,
                        },
                      );
                      encKey = decrypted.toString(CryptoJS.enc.Utf8);

                      parsedEncKey = CryptoJS.enc.Utf8.parse(encKey);
                      decryptIfNecessaryAndShow(data, null);
                      if (Platform.OS === 'ios') {
                        notification.finish(
                          PushNotificationIOS.FetchResult.NoData,
                        );
                      }
                    });
                  } else {
                    // Show notification after calculating parsedEncKey and confirm
                    parsedEncKey = CryptoJS.enc.Utf8.parse(encKey);
                    decryptIfNecessaryAndShow(data, null);
                    if (Platform.OS === 'ios') {
                      notification.finish(
                        PushNotificationIOS.FetchResult.NoData,
                      );
                    }
                  }
                } else {
                  // Show notification with already available parsedEncKey and confirm
                  decryptIfNecessaryAndShow(data, null);
                  if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                  }
                }
              } else if (badges === maximumPushMessagesWhenInactive+1) {
                // Show ... and confirm
                decryptIfNecessaryAndShow(null, '...');
                if (Platform.OS === 'ios') {
                  notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
              }
            } else {
              // No notification to show, but confirm
              if (Platform.OS === 'ios') {
                notification.finish(PushNotificationIOS.FetchResult.NoData);
              }
            }
            // When App is running, trigger cb-function
          } else {
            handler();
            if (Platform.OS === 'ios') {
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            }
          }
        },

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
        senderID: androidSenderId,

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: false,

        /*
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: false,
      });

      // create android channel
      if (Platform.OS === 'android') {
        log.debug("Creating notification channel if it does not exist");
        
        PushNotificationsHandler.channelExists(channelId, function (exists) {
          if (!exists) {
            log.debug("Creating notification channel as it does not exist");
            PushNotificationsHandler.createChannel(
              {
                channelId: channelId,
                channelName: AppConfig.config.pushNotification.androidChannelName
              },
              (created) => log.debug(`Create channel returned '${created}'`)
            );
          }
          else {
            log.debug("Notification channel exists");
          }
        });
      }

      // automatically request permissions (if defined this way)
      if (requestPermissions) {
        this.requestPermissions();
      }

      // Care about app state changes
      AppState.addEventListener('change', function (newAppState) {
        log.debug('New app state:', newAppState);

        // Remove badge icon on resume of app
        if (newAppState === 'active') {
          if (appInBackground) {
            resetBadges();
          }

          appInBackground = false;
        } else if (newAppState === 'inactive') {
          // No change
        } else if (newAppState === 'background') {
          if (!appInBackground) {
            resetBadges();
          }

          appInBackground = true;
        }
      });

      if (AppState.currentState === 'active') {
        appInBackground = false;
      }

      log.debug(
        'Current app state:',
        appInBackground ? 'background' : 'foreground',
      );

      initialized = true;
      log.debug('Init push notifications done');
    }
  }

  reset() {
    log.debug('Resetting store');
    store.delete(STORE_NAME);
    store.delete(STORE_DEEPSTREAM_USER);
  }

  getToken() {
    log.debug('Get token', token);
    return token;
  }

  getPlatform() {
    log.debug('Get platform', platform);
    return platform;
  }

  requestPermissions() {
    try {
      PushNotificationsHandler.requestPermissions();
    } catch (error) {
      log.warn('Error at requesting push permissions:', error);
    }
  }

  rememberToken(tokenToRemember, platformToRemember) {
    log.debug(
      'Remember token',
      tokenToRemember,
      'for platform',
      platformToRemember,
    );
    token = tokenToRemember;
    platform = platformToRemember;

    this.fireRegistration(token, platform);
  }

  setEncryptionKey(encKeyToStore, passwordForKeyStore) {
    log.debug('Storing encrypted encryption key');
    encKey = encKeyToStore;

    const iv = CryptoJS.enc.Utf8.parse('4537823546456123');
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({encKeyToStore}),
      CryptoJS.enc.Utf8.parse(passwordForKeyStore),
      { iv: iv, padding: CryptoJS.pad.ZeroPadding },
    );
    const encKeyEncrypted = encrypted.toString();

    log.debug('setEncryptionKey encKeyEncrypted: ', encKeyEncrypted);
    store.update(STORE_NAME, { encKey: encKeyEncrypted });
  }

  subscribeRegistration(fn) {
    log.debug('New subscription for push notifications');
    if (handlers.indexOf(fn) === -1) {
      handlers.push(fn);
    }

    if (token !== null && platform !== null) {
      fn(token, platform);
    }
  }

  unsubscribeRegistration(fn) {
    log.debug('Removing subscription for push notifications');
    handlers = handlers.filter(function (item) {
      if (item !== fn) {
        return item;
      }
    });
  }

  fireRegistration(token, platform) {
    log.debug('Inform listeners about push notification token registration');
    handlers.forEach(function (item) {
      item.call(this, token, platform);
    });
  }

  storeDeepstreamUser(deepstreamUserParam) {
    log.debug('StoreDeepstreamUser function called with parameter: ' + deepstreamUserParam);
    store.update(STORE_DEEPSTREAM_USER, { deepstreamUser: deepstreamUserParam });
  }

  localNotification(notification) {
    PushNotificationsHandler.localNotification(notification);
  }

  scheduleLocalNotification(notification) {
    log.info(`Scheduled local notification (title: ${notification.title})`);
    PushNotificationsHandler.localNotificationSchedule(notification);
  }

  cancelLocalNotification(notificationId) {
    log.info(`Cancel notification (id: ${notificationId})`);
    PushNotificationsHandler.cancelLocalNotification({
      id: notificationId,
    });
  }

  cancelAllLocalNotifications() {
    PushNotificationsHandler.cancelAllLocalNotifications();
  }

  alert(text) {
    Alert.alert(text, '', [{ text: 'Ok', onPress: () => true }]);
  }
}

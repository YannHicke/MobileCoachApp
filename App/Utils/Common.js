import { DOMParser } from 'react-native-html-parser';
import ImageResizer from 'react-native-image-resizer';
import { Alert, PanResponder, Platform, PixelRatio } from 'react-native';
import RNFS from 'react-native-fs';
import moment from 'moment';

import { Metrics } from '../Themes/';
import I18n from '../I18n/I18n';
import AppConfig from '../Config/AppConfig';
import { getState } from '../Containers/App'; // TODO fabian: cyclic dependency for passing down getState. Root of all evil
import * as PerfLog from './PerfLog';

import Log from './Log';
const log = new Log('Utils/Common');

export { PerfLog };

const TTL = 365 * 24 * 3600;

const convertUriToFilePath = function (uri) {
  let path = uri;
  if (path.startsWith('file://')) {
    path = path.substring(7);
  }
  return path;
};
// Returns url with authentification-Token if neccecary
export const authTokenUri = function (uri) {
  const { mediaUploadSecurityCheck, remoteMediaURL, role } =
    AppConfig.config.serverSync;

  const tokenRequired =
    mediaUploadSecurityCheck && uri.startsWith(remoteMediaURL + 'MC_');

  if (!tokenRequired) {
    return uri;
  } else {
    const state = getState();
    const { deepstreamUser, deepstreamSecret } = state.serverSyncSettings;

    return `${uri}?c=ds&u=${deepstreamUser}&t=${deepstreamSecret.substring(
      0,
      32,
    )}&r=${role}`;
  }
};

export const getStore = getState;

export default class Common {
  static parseCommand(commandString, contentStart = null) {
    const commandArray = commandString.split(' ');
    let command = commandArray[0];
    let value = null;
    if (commandArray.length > 1) {
      value = commandArray[1];
    }

    const valuesOnlyArray = commandArray.slice(1);

    return {
      command,
      value,
      values: valuesOnlyArray,
      content:
        contentStart == null
          ? valuesOnlyArray.join(' ')
          : valuesOnlyArray.slice(contentStart).join(' '),
      contentWithoutFirstValue: valuesOnlyArray.slice(1).join(' '),
    };
  }

  static showExpiryAlert() {
    if (AppConfig.config.messages.showExpiryAlert) {
      Alert.alert(I18n.t('Common.expiryNotice'), '', [
        { text: 'Ok', onPress: () => true },
      ]);
    }
  }

  static formatInfoMessage(content, timestamp) {
    // let content = serverMessage.content  // .replace(/\\n/g, '')
    let parsedTags = new DOMParser().parseFromString(content, 'text/html');
    let metas = parsedTags.getElementsByTagName('meta');
    let title = '';
    let subtitle = '';
    for (let i in metas) {
      const meta = metas[i];
      if (
        meta.getAttribute !== undefined &&
        meta.getAttribute('title') !== undefined
      ) {
        title = meta.getAttribute('title').replace(/\\n/g, '\n');
        if (meta.getAttribute('subtitle')) {
          subtitle = meta.getAttribute('subtitle').replace(/\\n/g, '\n');
        }
      }
    }

    // Remove Button
    const pattern = new RegExp('<button>(.*)</button>', 'g');
    const regExpResult = pattern.exec(content);
    if (regExpResult) {
      content = content.replace(regExpResult[0], '');
    }
    return {
      // Info-Content delievered by server in DS-Message
      content,
      // Component to be opened on Tap
      component: 'rich-text',
      title,
      subtitle,
      time: timestamp,
    };
  }

  static deleteLocalFile(filePath) {
    return RNFS.unlink(filePath);
  }

  static isBlank(object) {
    if (object === undefined || object === null || object === '') {
      return true;
    } else {
      return false;
    }
  }

  static userCanEdit(currentMessage) {
    const role = AppConfig.config.serverSync.role;
    if (role === 'supervisor' || role === 'observer') {
      return false;
    } else if (role === 'participant' && currentMessage.custom) {
      const { type } = currentMessage;
      const { unanswered, deactivated, disabled } = currentMessage.custom;
      // Special case for Open-Comonent: users might still open Components
      // but no intentions will be sent onclose
      // if (deactivated && type !== 'open-component') return true
      if (
        unanswered ||
        disabled ||
        (deactivated && type !== 'open-component')
      ) {
        return false;
      }
    }
    // default = true
    return true;
  }

  // Convert client times and dates for server
  static formatDateForServer(date, format = 'date') {
    switch (format) {
      case 'time': {
        const momentDate = moment(date);
        const minutes = '0' + Math.floor((momentDate.format('mm') / 60) * 100);
        return (
          momentDate.format('HH') +
          '.' +
          minutes.substring(minutes.length - 2, minutes.length)
        );
      }
      case 'date': {
        return moment(date).format('DD.MM.YYYY');
      }
      case 'datetime':
      default: {
        const momentDate = moment(date);
        const minutes = '0' + Math.floor((momentDate.format('mm') / 60) * 100);
        return (
          moment(date).format('DD.MM.YYYY') +
          ',' +
          momentDate.format('HH') +
          '.' +
          minutes.substring(minutes.length - 2, minutes.length)
        );
      }
    }
  }

  // Convert server times and dates for client
  static formatDateForClient(date, format = 'date') {
    switch (format) {
      case 'time': {
        const hour = Math.floor(Number(date));
        const minute = Math.round((Number(date) - hour) * 60);
        const timeString = hour + ':' + minute;
        return moment(timeString, 'HH:mm').toDate();
      }
      case 'date': {
        return moment(date, 'DD.MM.YYYY').toDate();
      }
      case 'datetime':
      default: {
        const dateTimeArray = date.split(',');
        const hour = Math.floor(Number(dateTimeArray[1]));
        const minute = Math.round((Number(dateTimeArray[1]) - hour) * 60);
        const timeString = hour + ':' + minute;
        return moment(
          dateTimeArray[0] + ' ' + timeString,
          'DD.MM.YYYY HH:mm',
        ).toDate();
      }
    }
  }
}

const panResponder = PanResponder.create({
  // Ask to be the responder:
  onStartShouldSetPanResponder: (evt, gestureState) => true,
  onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
  onMoveShouldSetPanResponder: (evt, gestureState) => true,
  onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  onPanResponderTerminationRequest: (evt, gestureState) => true,
  onPanResponderRelease: (evt, gestureState) => {
    if (AppConfig.config.messages.showExpiryAlert) {
      Common.showExpiryAlert();
    }
  },
  onShouldBlockNativeResponder: (evt, gestureState) => {
    // Dont block native events (e.g. ScrollView Scroll)
    return false;
  },
});

export function normalize(size) {
  // based on iphone 5s's scale
  const scale = Metrics.screenWidth / 320;
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const tapBlockingHandlers = panResponder.panHandlers;

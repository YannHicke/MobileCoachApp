import store from 'react-native-simple-store';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import Immutable from 'seamless-immutable';

import I18n from '../I18n/I18n';
import {
  ITERATION_STATUS_TYPES,
  TASK_TYPES,
  convertAnyDueTime,
} from '../Containers/TaskModule/TaskMetrics';
import PushNotifications from '../Utils/PushNotifications';
import AppConfig from '../Config/AppConfig';
import Common from '../Utils/Common';

import Log from '../Utils/Log';
const log = new Log('Services/LocalNotifications');

const STORE_NAME = 'local-notification-store';

export let exportedNotifications = [];

// initial vector for encryption
const IV = CryptoJS.enc.Utf8.parse('4537823546456123');

const DEMO_KEY = '45378fsdasadf6123';

const pushManager = PushNotifications.getInstance();

// export const setEncryptionKey = async function (encKeyToStore, passwordForKeyStore) {
//   log.debug('Storing encrypted encryption key')
//   encKey = encKeyToStore

//   const iv = CryptoJS.enc.Utf8.parse('4537823546456123')
//   const encrypted = CryptoJS.AES.encrypt(encKeyToStore, CryptoJS.enc.Utf8.parse(passwordForKeyStore), {iv: iv, padding: CryptoJS.pad.ZeroPadding})
//   const encKeyEncrypted = encrypted.toString()

//   store.update(STORE_NAME, { 'encKey': encKeyEncrypted })
// }

// create schedule for today an also one day in advance to have a safe buffer
// *
// Params: current tasks, timestamp: timestamp (millis) of current-time, id-Counter to create unique id's
// *
export const createSchedule = function (currentTasks, currentTime, idCounter) {
  const notifications = [];
  for (let i = 0; i < currentTasks.length; i++) {
    const task = currentTasks[i];
    // only care for uncompleted tasks, where reminder wasn't deactivated
    if (!task.status.completed && task.reminderActive !== false) {
      const { currentIterations } = task.status;
      for (let j = 0; j < currentIterations.length; j++) {
        const iteration = currentIterations[j];
        // only care for open iterations, with a due-time in the future
        const dueTime =
          iteration.time === 'ANY'
            ? convertAnyDueTime(iteration.dueTime)
            : iteration.dueTime;
        if (
          dueTime > currentTime &&
          iteration.status === ITERATION_STATUS_TYPES.OPEN
        ) {
          notifications.push(createNotification(task, iteration, idCounter++));
        }
      }
    }
  }

  const newSchedule = Immutable({
    notifications,
    idCounter,
    lastUpdated: currentTime,
  });
  return newSchedule;
};

const getNotificationStrings = function (task) {
  let title = I18n.t('Reminder.title');
  let message = task.title;
  const { id } = task;

  return { title, message };
};

// create configuration-object for local notification
const createNotification = function (task, iteration, id) {
  const { title, message } = getNotificationStrings(task);
  const dueTime =
    iteration.time === 'ANY'
      ? convertAnyDueTime(iteration.dueTime)
      : iteration.dueTime;
  let notification = {
    /* iOS and Android properties */
    title, // (optional)
    message, // (required)
    date: dueTime,

    /* Android only properties */
    id: id.toString(), // Android-id: needs to be string which can be parsed to int..

    /* iOS only properties */
    userInfo: { id: id.toString() },

    alertAction: 'view', // (optional) default: view
  };
  return notification;
};

// Function to compare two Arrays filled with notification items
// ID-Fields are activley ignored because they will be different each time

// function compareArrays (otherArray) {
//   return function (current) {
//     return otherArray.filter(function (other) {
//       // remove id's for comparison (they will always be different)
//       const a = {...current, id: undefined, userInfo: undefined}
//       const b = {...other, id: undefined, userInfo: undefined}
//       return R.equals(a, b)
//     }).length === 0
//   }
// }

// updates Scheduled local Push-Notifications if needed
// Params:
// currentTasks: due tasks for the next two days
// calledFromBackgroundTask: flag set true if function was called brom background-task
export const updateSchedule = async function (
  currentTasks,
  calledFromBackgroundTask = false,
) {
  // load stored cache for local notifications
  let schedule = await store.get(STORE_NAME);

  // only init push-manager from background task
  if (calledFromBackgroundTask) {
    pushManager.init(
      AppConfig.config.dev.purgeStoreAtStartup,
      AppConfig.config.serverSync.androidSenderId,
      true,
    );
  }

  // initialize new notification-cache if no previous schedule was found
  if (Common.isBlank(schedule) || AppConfig.config.dev.purgeStoreAtStartup) {
    pushManager.cancelAllLocalNotifications();
    schedule = {
      // notifications: [],
      idCounter: 0,
      lastUpdated: moment().valueOf(),
    };
  }

  const lastUpdated = schedule.lastUpdated;
  // const currentNotifications = schedule.notifications
  let idCounter = schedule.idCounter;

  // if update request was sent from background-task: only update schedule, if not already updated today
  if (
    !calledFromBackgroundTask ||
    (calledFromBackgroundTask &&
      moment(lastUpdated).endOf('day').valueOf() < moment().valueOf())
  ) {
    log.info('Recalculate schedule for local notifications.');
    // calculate updated schedule for today
    const newSchedule = createSchedule(
      currentTasks,
      moment().valueOf(),
      idCounter,
    );
    const newNotifications = newSchedule.notifications;

    // const onlyInOldSchedule = currentNotifications.filter(compareArrays(newNotifications))
    // const onlyInNewSchedule = newNotifications.filter(compareArrays(currentNotifications))

    // // iterate 'expired' notifications to remove them from schedule
    // for (let i = 0; i < onlyInOldSchedule.length; i++) {
    //   // remove expired notifications
    //   removeScheduledNotification(onlyInOldSchedule[i].id)
    // }

    pushManager.cancelAllLocalNotifications();

    // iterate all new notifications to add them to schedule
    for (let i = 0; i < newNotifications.length; i++) {
      // add notification to schedule
      addScheduledNotification(newNotifications[i]);
    }

    // Store local copy of notifications
    exportedNotifications = newSchedule.notifications;

    // save new schedule-cache
    await store.save(STORE_NAME, {
      idCounter: newSchedule.idCounter,
      lastUpdated: newSchedule.lastUpdated,
    });
  } else {
    log.info(
      'Skipped recalculation because schedule was already updated today.',
    );
  }

  return true;
};

// add a new local notification to schedule
const addScheduledNotification = function (notificationConfig) {
  // convert timestamp to date-object before adding notification
  pushManager.scheduleLocalNotification({
    ...notificationConfig,
    // DEBUG: set time to now + 5 seconds:
    date: moment(notificationConfig.date).toDate(),
  });
};

// test function for debug purpouses
export const sendTestNotification = function () {
  pushManager.requestPermissions();
  const notificationConfig = {
    /* iOS and Android properties */
    title: 'TEST', // (optional)
    message: 'TESTMESSAGE', // (required)
    date: new Date(Date.now() + 10 * 1000), // in 30 secs,

    /* Android only properties */
    id: '9999', // Android-id: needs to be string which can be parsed to int..

    /* iOS only properties */
    userInfo: { id: 9999 },

    alertAction: 'view', // (optional) default: view
  };
  addScheduledNotification(notificationConfig);
};

// remove a local notification from schedule
// const removeScheduledNotification = function (notificationId) {
//   pushManager.cancelLocalNotification(notificationId)
// }

export const encryptObject = function (data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), DEMO_KEY, {
    iv: IV,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString();
};

export const decryptObject = function (data) {
  return JSON.parse(
    CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(data, DEMO_KEY, {
        iv: IV,
        padding: CryptoJS.pad.ZeroPadding,
      }),
    ),
  );
};

export const encryptStringToHex = function (stringObject) {
  return CryptoJS.AES.encrypt(stringObject, DEMO_KEY, {
    iv: IV,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString(CryptoJS.enc.Hex);
};

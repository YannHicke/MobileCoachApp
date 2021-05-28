const PerformanceNow =
  global.performanceNow ||
  global.nativePerformanceNow ||
  require('fbjs/lib/performanceNow');

const DEFAULT_LABEL = 'default';
const DEFAULT_PREC = 3;

let counts = {};
let startTimes = {};

export const time = (label = DEFAULT_LABEL) => {
  startTimes[label] = PerformanceNow();
};
export const timeLog = (label = DEFAULT_LABEL, desc) => timeRecord(label, desc);
export const timeEnd = (label = DEFAULT_LABEL) =>
  timeRecord(label, undefined, true);
export const count = (label = DEFAULT_LABEL) => {
  if (!counts[label]) {
    counts[label] = 0;
  }
  counts[label]++;
  console.log(`${label}: ${counts[label]}`);
};

export const countReset = (label = DEFAULT_LABEL) => {
  if (counts[label]) {
    counts[label] = 0;
  } else {
    console.warn(`Count for '${label}' does not exist`);
  }
};

function timeRecord(label, desc, final) {
  const endTime = PerformanceNow();
  const startTime = startTimes[label];
  if (startTime) {
    const delta = endTime - startTime;
    if (desc) {
      console.log(`${label}: ${delta.toFixed(DEFAULT_PREC)}ms ${desc}`);
    } else {
      console.log(`${label}: ${delta.toFixed(DEFAULT_PREC)}ms`);
    }
    if (final) {
      delete startTimes[label];
    }
  } else {
    console.warn(`Timer '${label}' does not exist`);
  }
}

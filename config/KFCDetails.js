const positionHierarchy = {
  RGM: {
    ARGM: {
      SR: ["BOH", "MOH", "FOH"],
    },
  },
};

const storeWorkHoursSpan = {
  "open - close": ["m", "t", "w", "th", "f", "s", "su"],
};

const workingHours = {
  "11:00 - 22:00": ["m", "tue", "wed", "sun", "mon", "m"],
  "11:00 - 23:00": ["thu", "sat", "fri"],
};

const staffList = {
  Georgi: {
    firstName: "Georgi",
    surname: "Urumov",
    positions: ["ARGM"],
    roleType: "fullTime",
    availability: { "open - 16:00": ["m", "t", "w", "th", "f", "s", "su"] },
    daysOff: {
      count: 2,
      consecutive: true
    },
    minHours: 36,
    lockSchedule: true,
  },
  Rita: {
    firstName: "Rita",
    surname: "Sunuwar",
    positions: ["SR"],
    roleType: "fullTime",
    availability: { "12:00 - close": ["m", "t", "w", "th", "f", "su"] },
    daysOff: {
      count: 1,
    },
    minHours: 53,
    lockSchedule: false,
  },
  Sean: {
    firstName: "Sean",
    surname: "Batchelor",
    positions: ["SR"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "th", "f", "s"] },
    daysOff: {
      count: 2,
      consecutive: false,
    },
    minHours: 37,
    lockSchedule: false,
  },
  Callum: {
    firstName: "Callum",
    surname: "Grice",
    positions: ["RGM"],
    roleType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: {
      count: 2,
      consecutive: false,
    },
    minHours: 36,
    lockSchedule: false,
  },
  Abdul: {
    firstName: "Abdul",
    surname: "Qayum",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "09:00 - 17:00": ["t", "w", "th"] },
    daysOff: {
      count: 4,
      consecutive: false,
    },
    minHours: 21,
    lockSchedule: true,
  },
  Amy: {
    firstName: "Amy",
    surname: "Bowden",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: { "15:00 - close": ["m", "t", "w", "th", "f", "s"] },
    daysOff: 2,
    minHours: 20,
    lockSchedule: false,
  },
  Bimala: {
    firstName: "Bimala",
    surname: "Sharma",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "open - 17:00": ["s"], "open - 20:00": ["su"] },
    daysOff: {
      count: 5,
    },
    minHours: 16,
    lockSchedule: true,
  },
  Bruno: {
    firstName: "Bruno",
    surname: "Bataraga",
    positions: ["MOH"],
    roleType: "fullTime",
    availability: { "16:30 - 21:45": ["m", "t", "w", "th", "s"] },
    daysOff: {
      count: 2,
      consecutive: false
    },
    minHours: 25,
    lockSchedule: true,
  },
  Ganga: {
    firstName: "Ganga",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "f", "s", "su"] },
    daysOff: {
      count: 1,
    },
    minHours: 42,
    lockSchedule: false,
  },
  Hikmat: {
    firstName: "Hikmat",
    surname: "Rai",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "12:00 - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: 45,
    lockSchedule: false,
  },
  Kelly: {
    firstName: "Kelly",
    surname: "Bentley",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "17:00 - 21:00": ["f", "s", "su"] },
    daysOff: 3,
    minHours: 18,
    lockSchedule: true,
  },
  Layla: {
    firstName: "Layla",
    surname: "Aykac",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "16:30 - 21:45": ["s", "su"] },
    daysOff: 4,
    minHours: 8,
    lockSchedule: true,
  },
  Palraj: {
    firstName: "Palraj",
    surname: "Abirami",
    positions: ["FOH"],
    roleType: "partTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    minHours: 8,
    lockSchedule: false,
  },
  Richard: {
    firstName: "Richard",
    surname: "Barnshaw",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    minHours: 30,
    lockSchedule: false,
  },
  Santosh: {
    firstName: "Santosh",
    surname: "Ghale",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: 45,
    lockSchedule: false,
  },
  Sijan: {
    firstName: "Sijan",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "open - 17:00": ["su"] },
    daysOff: 6,
    minHours: 8,
    lockSchedule: true,
  },
  Zivile: {
    firstName: "Zivile",
    surname: "Butkuviene",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "09:15 - 14:00": ["m", "tu", "w", "th"] },
    daysOff: 2,
    minHours: 17,
    lockSchedule: true,
  },
};

const events = {
  'cook': {
    markerType: 'timeFrame',
    times: storeWorkHoursSpan,
    positions: { 
      BOH: {
        staff:1,
      } 
    },
  },
  'cashier': {
    markerType: 'timeFrame',
    times: storeWorkHoursSpan,
    positions: { 
      FOH: {
        staff:1,
      } 
    },
  },
  'sr': {
    markerType: 'timeFrame',
    times: storeWorkHoursSpan,
    positions: { 
      SR: {
        staff:1,
      } 
    },
  },
  'open': {
    markerType: 'completeBefore',
    times: {
      "open": ["m", "t", "w", "th", "f", "s", "su"],
    },
    positions: { 
      SR: {
        staff:1,
        hours: '01:00'
      }, 
      BOH: {
        staff:1,
        hours: '02:00'
      }, 
      FOH: {
        staff:1,
        hours: '01:00'
      }, 
      MOH: {
        staff:1,
        hours: '01:00'
      }, 
    },
  },
  'close': {
    markerType: 'completeAfter',
    times: {
      "close": ["m", "t", "w", "th", "f", "s", "su"],
    },
    positions: { 
      SR: {
        staff:1,
        hours: '00:30'
      }, 
      BOH: {
        staff:1,
        hours: '01:00'
      }, 
      FOH: {
        staff:1,
        hours: '00:30'
      }, 
      MOH: {
        staff:1,
        hours: '00:30'
      }, 
    },
  },
  'delivery': {
    markerType: 'timeFrame',
    times: {
      "07:00 - 09:00": ["m", "w", "f"],
    },
    positions: { 
      all: {
        staff: 2,
      } 
    },
  },
  'admin': {
    markerType: 'timeFrame',
    times: {
      "09:00 - 17:00": ["m"],
    },
    positions: { 
      RGM: {
        staff: 1,
      } 
    },
  },
  'lunchPeak': {
    markerType: 'timeFrame',
    times: {
      "12:00 - 14:00": ["m", "t", "w", "th", "f"],
    },
    positions: { 
      FOH: {
        staff:2
      },
      MOH: {
        staff:2
      }
    },
  },
  'eveningPeak': {
    markerType: 'timeFrame',
    times: {
      "17:00 - 21:00": ["m", "t", "w", "th", "f"],
    },
    positions: { 
    
    },
  },
  'weekendPeak': {
    markerType: 'timeFrame',
    times: {
      "12:00 - 20:00": ["s", "su"],
    },
    positions: { 
    
    },
  },
}

export { workingHours, staffList, positionHierarchy, events };

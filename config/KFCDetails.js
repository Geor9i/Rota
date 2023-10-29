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
    daysOff: 2,
    minHours: 36,
  },
  Rita: {
    firstName: "Rita",
    surname: "Sunuwar",
    positions: ["SR"],
    roleType: "fullTime",
    availability: { "12:00 - close": ["m", "t", "w", "th", "f", "su"] },
    daysOff: 1,
    minHours: 53,
  },
  Sean: {
    firstName: "Sean",
    surname: "Batchelor",
    positions: ["SR"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "th", "f", "s"] },
    daysOff: 2,
    minHours: 37,
  },
  Callum: {
    firstName: "Callum",
    surname: "Grice",
    positions: ["RGM"],
    roleType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    minHours: 36,
  },
  Abdul: {
    firstName: "Abdul",
    surname: "Qayum",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "09:00 - 17:00": ["t", "w", "th"] },
    daysOff: 4,
    minHours: 21,
  },
  Amy: {
    firstName: "Amy",
    surname: "Bowden",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: { "15:00 - close": ["m", "t", "w", "th", "f", "s"] },
    daysOff: 2,
    minHours: 20,
  },
  Bimala: {
    firstName: "Bimala",
    surname: "Sharma",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "open - 17:00": ["s"], "open - 20:00": ["su"] },
    daysOff: 5,
    minHours: 16,
  },
  Bruno: {
    firstName: "Bruno",
    surname: "Bataraga",
    positions: ["MOH"],
    roleType: "fullTime",
    availability: { "16:30 - 21:45": ["m", "t", "w", "th", "s"] },
    daysOff: 2,
    minHours: 25,
  },
  Ganga: {
    firstName: "Ganga",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "f", "s", "su"] },
    daysOff: 1,
    minHours: 42,
  },
  Hikmat: {
    firstName: "Hikmat",
    surname: "Rai",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "12:00 - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: 45,
  },
  Kelly: {
    firstName: "Kelly",
    surname: "Bentley",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "17:00 - 21:00": ["f", "s", "su"] },
    daysOff: 3,
    minHours: 18,
  },
  Layla: {
    firstName: "Layla",
    surname: "Aykac",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "16:30 - 21:45": ["s", "su"] },
    daysOff: 4,
    minHours: 8,
  },
  Palraj: {
    firstName: "Palraj",
    surname: "Abirami",
    positions: ["FOH"],
    roleType: "partTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    minHours: 8,
  },
  Richard: {
    firstName: "Richard",
    surname: "Barnshaw",
    positions: ["FOH", "MOH"],
    roleType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    minHours: 30,
  },
  Santosh: {
    firstName: "Santosh",
    surname: "Ghale",
    positions: ["BOH"],
    roleType: "fullTime",
    availability: { "open - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: 45,
  },
  Sijan: {
    firstName: "Sijan",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "open - 17:00": ["su"] },
    daysOff: 6,
    minHours: 6,
  },
  Zivile: {
    firstName: "Zivile",
    surname: "Butkuviene",
    positions: ["FOH", "MOH"],
    roleType: "partTime",
    availability: { "09:15 - 14:00": ["m", "tu", "w", "th"] },
    daysOff: 2,
    minHours: 17,
  },
};

const events = {
  'cook': {
    markerType: 'timeSpan',
    times: storeWorkHoursSpan,
    positions: { 
      BOH: {
        staff:1,
      } 
    },
  },
  'cashier': {
    markerType: 'timeSpan',
    times: storeWorkHoursSpan,
    positions: { 
      FOH: {
        staff:1,
      } 
    },
  },
  'sr': {
    markerType: 'timeSpan',
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
    markerType: 'timeSpan',
    times: {
      "07:00 - 09:00": ["m", "w", "f"],
    },
    positions: { 
      all: {
        staff: 2,
      } 
    },
  },
  'lunchPeak': {
    markerType: 'timeSpan',
    times: {
      "12:00 - 14:00": ["m", "t", "w", "th", "f"],
    },
    positions: { 
     
    },
  },
  'eveningPeak': {
    markerType: 'timeSpan',
    times: {
      "17:00 - 21:00": ["m", "t", "w", "th", "f"],
    },
    positions: { 
    
    },
  },
  'weekendPeak': {
    markerType: 'timeSpan',
    times: {
      "12:00 - 20:00": ["s", "su"],
    },
    positions: { 
    
    },
  },
}

export { workingHours, staffList, positionHierarchy, events };

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
    contractType: "fullTime",
    availability: { 
      "open - 16:00": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      }
    },
  daysOff: {
    amount: {
      value: 2,
      priority: "strict",
    },
    consecutive: {
      value: true,
      priority: "strict",
    },
  },
  minHours: {
    value: 36,
    priority: "strict",
  },
},
  Rita: {
    firstName: "Rita",
    surname: "Sunuwar",
    positions: ["SR"],
    contractType: "fullTime",
    availability: {
      "14:00 - close":{ 
        value: ["m", "t", "w", "th", "f", "su"],
        priority: 'important'
      } 
    },
    minHours: {
      value: 53,
      priority: 'strict'
    },
  },
  Sean: {
    firstName: "Sean",
    surname: "Batchelor",
    positions: ["SR"],
    contractType: "fullTime",
    availability: {
       "open - close": {
      value: ["m", "t", "w", "th", "f", "s"],
      priority: 'optional'
    } 
  },
    daysOff: {
      amount: 2,
      consecutive: {
        value: false,
        priority: 'optional'
      },
    },
    minHours: {
      value: 37,
      priority: 'strict'
    },
    priority: 'important'
  },
  Callum: {
    firstName: "Callum",
    surname: "Grice",
    positions: ["RGM"],
    contractType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: {
      amount: 2,
      consecutive: {
        value: false,
        priority: 'optional'
      },
    },
    minHours: 36,
    priority: 'strict'
  },
  Abdul: {
    firstName: "Abdul",
    surname: "Qayum",
    positions: ["BOH"],
    contractType: "fullTime",
    availability: {
       "09:00 - 17:00":{
        value:  ["t", "w", "th"],
        priority: 'strict'
      }
    },
    minHours: 21,
  },
  Amy: {
    firstName: "Amy",
    surname: "Bowden",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: { 
      "15:00 - close": ["m", "t", "w", "th", "f", "s"] 
    },
    daysOff: 2,
    minHours: {
      value: 20,
      priority: 'important'
    },
    priority: 'optional'
  },
  Bimala: {
    firstName: "Bimala",
    surname: "Sharma",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: {
       "open - 17:00": {
        value:["s"],
        priority: 'strict'
      }, "open - 20:00": {
        value: ["su"],
        priority: 'strict'
      } 
    },
    },
  Bruno: {
    firstName: "Bruno",
    surname: "Bataraga",
    positions: ["MOH"],
    contractType: "fullTime",
    availability: {
       "16:30 - 21:45": {
      value: ["m", "t", "w", "th", "s"],
      priority: 'important'
    },
   },
    daysOff: {
      amount: 2,
      consecutive: false,
    },
    minHours: 25,
    priority: 'important'
  },
  Ganga: {
    firstName: "Ganga",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "f", "s", "su"] },
    minHours: {
      value: 42,
      priority: 'strict'
    },
    priority: 'important'
  },
  Hikmat: {
    firstName: "Hikmat",
    surname: "Rai",
    positions: ["BOH"],
    contractType: "fullTime",
    availability: { "12:00 - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: 45,
    priority: 'important'
  },
  Kelly: {
    firstName: "Kelly",
    surname: "Bentley",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability:{
       "09:15 - 14:00": {
        value: ["m", "t", "th", 'f'],
        priority: 'strict'
      } 
    },
    minHours: 18,
  },
  Layla: {
    firstName: "Layla",
    surname: "Aykac",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: { "16:30 - 21:45": ["s", "su"] },
    priority: 'important'
  },
  Palraj: {
    firstName: "Palraj",
    surname: "Abirami",
    positions: ["FOH"],
    contractType: "partTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    priority: 'optional'
  },
  Richard: {
    firstName: "Richard",
    surname: "Barnshaw",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: storeWorkHoursSpan,
    minHours: 30,
    priority: 'optional'
  },
  Santosh: {
    firstName: "Santosh",
    surname: "Ghale",
    positions: ["BOH"],
    contractType: "overtime",
    availability:{ 
        "open - 21:00": {
          value: ["m", "w", "th", "f", "s", "su"],
          priority: 'important'
        } 
      },
    minHours: 45,
    priority: 'important'
  },
  Sijan: {
    firstName: "Sijan",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: { "open - 17:00": ["su"] },
    priority: 'strict'
  },
  Zivile: {
    firstName: "Zivile",
    surname: "Butkuviene",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: {
      "09:15 - 14:00": { 
        value: ["m", "tu", "w", "th"],
        priority: 'important'
      }
    },
    minHours: {
      value: 17,
      priority: 'strict'
    },
  },
};

const events = {
  cook: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      },
    },
    positions: {
      BOH: {
        staff: {
          value: 2,
          priority: 'optional'
        },
      },
    },
  },
  cashier: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      },
    },
    positions: {
      FOH: {
        staff: {
          value: 2,
          priority: 'optional'
        },
      },
    },
  },
  sr: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      },
    },
    positions: {
      SR: {
        staff: {
          value: 2,
          priority: 'optional'
        },
      },
    },
  },
  open: {
    markerType: "completeBefore",
    times: {
      "open": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      },
    },
    positions: {
        SR: "01:00",
        BOH: "02:00",
        FOH: "01:00",
        MOH: "01:00",
    },
    priority: 'strict'
  },
  close: {
    markerType: "completeAfter",
    times: {
      "close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: 'strict'
      },
    },
    positions: {
        SR: "00:30",
        BOH: "01:00",
        FOH: "00:30",
        MOH: "00:30",
    },
    priority: 'strict'
  },
  delivery: {
    markerType: "timeFrame",
    times: {
        "07:00 - 09:00": {
          value: ["m", "w", "f"],
          priority: 'strict'
      },
    },
    positions: {
      all: {
          staff: 2,
        },
      },
      priority: 'important'
    },
  admin: {
    priority: 'strict',
    markerType: "timeFrame",
    times: { "09:00 - 17:00": {
      value: ["m"],
      priority: 'important'
    }
   },
    positions: {
      RGM: {
        staff: 1
      }
    }
  },
  lunchPeak: {
    priority: 'important',
    markerType: "timeFrame",
    times: {
      "12:00 - 14:00": ["m", "t", "w", "th", "f"],
    },
    positions: {
      FOH: {
        staff: 2,
      },
      MOH: {
        staff: 2,
      },
    },
  },
  eveningPeak: {
    priority: 'important',
    markerType: "timeFrame",
    times: {
      "17:00 - 21:00": ["m", "t", "w", "th", "f"],
    },
    positions: {
      FOH: {
        staff: 2,
      },
      MOH: {
        staff: 2,
      },
      BOH: {
        staff: 2
      }
    },
  },
  weekendPeak: {
    priority: 'important',
    markerType: "timeFrame",
    times: {
      "12:00 - 20:00": ["s", "su"],
    },
    positions: {
      FOH: {
        staff: 2,
      },
      MOH: {
        staff: 2,
      },
      BOH: {
        staff: 2
      }
    },
  },
};

export { workingHours, staffList, positionHierarchy, events };

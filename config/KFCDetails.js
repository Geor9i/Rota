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
        priority: "strict",
      },
    },
    daysOff: { strict: 2 },
    consecutive: { strict: true },
    minHours: { strict: "36:00" },
  },
  Rita: {
    firstName: "Rita",
    surname: "Sunuwar",
    positions: ["SR"],
    contractType: "fullTime",
    availability: {
      "14:00 - close": {
        value: ["m", "t", "w", "th", "f", "su"],
        priority: "important",
      },
    },
    minHours: { strict: "53:00" },
  },
  Sean: {
    firstName: "Sean",
    surname: "Batchelor",
    positions: ["SR"],
    contractType: "fullTime",
    availability: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s"],
        priority: "optional",
      },
    },
    daysOff: 2,
    consecutive: { optional: false },
    minHours: { strict: "37:00" },
    priority: "important",
  },
  Callum: {
    firstName: "Callum",
    surname: "Grice",
    positions: ["RGM"],
    contractType: "fullTime",
    availability: storeWorkHoursSpan,
    daysOff: {
      amount: 2,
      consecutive: { optional: false },
    },
    minHours: "36:00",
    priority: "strict",
  },
  Abdul: {
    firstName: "Abdul",
    surname: "Qayum",
    positions: ["BOH"],
    contractType: "fullTime",
    availability: {
      "09:00 - 17:00": {
        value: ["t", "w", "th"],
        priority: "strict",
      },
    },
    minHours: { strict: "21:00" },
  },
  Amy: {
    firstName: "Amy",
    surname: "Bowden",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: {
      "15:00 - close": ["m", "t", "w", "th", "f", "s"],
    },
    daysOff: 2,
    minHours: { important: "20:00" },
    priority: "optional",
  },
  Bimala: {
    firstName: "Bimala",
    surname: "Sharma",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: {
      "open - 17:00": ["s"],
      "open - 20:00": ["su"]
    },
    priority: "strict",
  },
  Bruno: {
    firstName: "Bruno",
    surname: "Bataraga",
    positions: ["MOH"],
    contractType: "fullTime",
    availability: {
      "16:30 - 21:45": {
        value: ["m", "t", "w", "th", "s"],
        priority: "important",
      },
    },
    daysOff: 2,
    consecutive: false,
    minHours: "25:00",
    priority: "important",
  },
  Ganga: {
    firstName: "Ganga",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: { "open - close": ["m", "t", "w", "f", "s", "su"] },
    minHours: { strict: "42:00" },
    priority: "important",
  },
  Hikmat: {
    firstName: "Hikmat",
    surname: "Rai",
    positions: ["BOH"],
    contractType: "fullTime",
    availability: { "12:00 - close": ["m", "w", "th", "f", "s", "su"] },
    daysOff: 1,
    minHours: "45:00",
    priority: "strict",
  },
  Kelly: {
    firstName: "Kelly",
    surname: "Bentley",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: {
      "09:15 - 14:00": ["m", "t", "th", "f"],
    },
    minHours: "18:00",
    priority: "strict",
  },
  Layla: {
    firstName: "Layla",
    surname: "Aykac",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: { "16:30 - 21:45": ["s", "su"] },
    priority: "important",
  },
  Palraj: {
    firstName: "Palraj",
    surname: "Abirami",
    positions: ["FOH"],
    contractType: "partTime",
    availability: storeWorkHoursSpan,
    daysOff: 2,
    priority: "optional",
  },
  Richard: {
    firstName: "Richard",
    surname: "Barnshaw",
    positions: ["FOH", "MOH"],
    contractType: "fullTime",
    availability: storeWorkHoursSpan,
    minHours: "30:00",
    priority: "optional",
  },
  Santosh: {
    firstName: "Santosh",
    surname: "Ghale",
    positions: ["BOH"],
    contractType: "overtime",
    availability: {
      "open - 21:00": {
        value: ["m", "w", "th", "f", "s", "su"],
        priority: "important",
      },
      "open - close": {
        value: ["m", "w", "th", "f", "s", "su"],
        priority: "optional",
      },
    },
    minHours: "45:00",
    priority: "important",
  },
  Sijan: {
    firstName: "Sijan",
    surname: "Gurung",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: { "open - 17:00": ["su"] },
    priority: "strict",
  },
  Zivile: {
    firstName: "Zivile",
    surname: "Butkuviene",
    positions: ["FOH", "MOH"],
    contractType: "partTime",
    availability: {
      "09:15 - 14:00": {
        value: ["m", "tu", "w", "th"],
        priority: "strict",
      },
    },
    minHours: { strict: "17:00" },
  },
};

const events = {
  cook: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: "strict",
      },
    },
    positions: {
      BOH: { optional: 2 },
    },
  },
  cashier: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: "strict",
      },
    },
    positions: {
      FOH: { optional: 2 },
    },
  },
  sr: {
    markerType: "timeFrame",
    times: {
      "open - close": {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: "strict",
      },
    },
    positions: {
      SR: { optional: 2 },
    },
  },
  open: {
    markerType: "completeBefore",
    times: {
      open: {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: "strict",
      },
    },
    positions: {
      SR: "01:00",
      BOH: "02:00",
      FOH: "01:00",
      MOH: "01:00",
    },
    priority: "strict",
  },
  close: {
    markerType: "completeAfter",
    times: {
      close: {
        value: ["m", "t", "w", "th", "f", "s", "su"],
        priority: "strict",
      },
    },
    positions: {
      SR: "00:30",
      BOH: "01:00",
      FOH: "00:30",
      MOH: "00:30",
    },
    priority: "strict",
  },
  delivery: {
    markerType: "timeFrame",
    times: {
      "07:00 - 09:00": {
        value: ["m", "w", "f"],
        priority: "strict",
      },
    },
    positions: {
      all: 2,
    },
    priority: "important",
  },
  admin: {
    priority: "strict",
    markerType: "timeFrame",
    times: {
      "09:00 - 17:00": {
        value: ["m"],
        priority: "important",
      },
    },
    positions: {
      RGM: 1,
    },
  },
  lunchPeak: {
    priority: "important",
    markerType: "timeFrame",
    times: {
      "12:00 - 14:00": ["m", "t", "w", "th", "f"],
    },
    positions: {
      FOH: 2,
      MOH: 2,
    },
  },
  eveningPeak: {
    priority: "important",
    markerType: "timeFrame",
    times: {
      "17:00 - 21:00": ["m", "t", "w", "th", "f"],
    },
    positions: {
      FOH: 2,
      MOH: 2,
      BOH: 2,
    },
  },
  weekendPeak: {
    priority: "important",
    markerType: "timeFrame",
    times: {
      "12:00 - 20:00": ["s", "su"],
    },
    positions: {
      FOH: 2,
      MOH: 2,
      BOH: 2,
    },
  },
};

export { workingHours, staffList, positionHierarchy, events };

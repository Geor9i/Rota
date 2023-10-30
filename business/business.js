import { Util } from "../utils/util.js";

export class Business {
  constructor(name) {
    this.name = name;
    this.util = new Util();
    this.workHours = null;
    this.positions = {
      management: [],
      all: [],
    };
    this.staff = {
        list: {},
        members: {},
        management: {},
    },
    this.events = {};
  }


  event(events) {
    return {
      add:() => {
        let eventNames = Object.keys(events);
        eventNames.forEach(name => {
          if(!this.events.hasOwnProperty(name)) {
            this.events[name] = events[name];
            this.events[name].times = this.workDaysAndTimes(events[name].times)
          }
        })
      }
    }
  }

  workDaysAndTimes(timesObj) {
    let openingTimes = {};
    for (let time in timesObj) {
      let weekdaysArr = timesObj[time];
      weekdaysArr = this.util.weekdays(weekdaysArr, { sort: true });
      weekdaysArr.forEach((weekday) => {
        if (!openingTimes.hasOwnProperty(weekday)) {
          openingTimes[weekday] = time;
        } else if (openingTimes.hasOwnProperty(weekday)) {
            if(!Array.isArray(openingTimes[weekday])) {
              openingTimes[weekday] = [openingTimes[weekday]]
            }
          openingTimes[weekday].push(time)
        }
      });
    }
    return openingTimes;
  }

  positionHierarchy(hierarchy) {
    let extractPositions = (hierarchy) => {
      for (let pos in hierarchy) {
        if (typeof hierarchy[pos] === "object") {
          this.positions.all.push(pos);
          if (!Array.isArray(hierarchy[pos])) {
            extractPositions(hierarchy[pos]);
          } else {
            this.positions.management = [...this.positions.all];

            this.positions.management = this.util
            .string.format(this.positions.management);

            this.positions.all.push(...hierarchy[pos]);

            this.positions.all = this.util.string.format(this.positions.all);

            return;
          }
        }
      }
    };
    extractPositions(hierarchy);
  }

  employee() {
    if (this.positions.all.length < 1) {
      throw new Error("Available positions must be set first!");
    }
    return {
      add: (personData) => {
        const p = this.employee().validate(personData);
        const name = `${p.firstName} ${p.surname}`;

        let isManagement = p.positions.find(pos => this.positions.management.includes(pos));
        if (isManagement) {
            this.staff.management[name] = personData;
        } else {
            this.staff.members[name] = personData;
        }
        this.staff.list[name] = p;
      },

      addMany(staffList) {
        for (let person in staffList) {
          this.add(staffList[person]);
        }
      },
      remove: (name) => {
        let employee = this.employee().findByName(name, { asString: true });
        delete this.staff.list[employee];
      },

      findByName: (name, options) => {
        name = this.util.string.format(name);
        let namesArr = Object.keys(this.staff.list).filter((n) =>
          n.includes(name)
        );
        if (namesArr.length === 1) {
          let fullName = namesArr[0];
          return options?.asString ? fullName : this.staff.list[fullName];
        } else if (namesArr.length > 1) {
          throw new Error("More than one match found! Please enter fullName!");
        } else {
          throw new Error(`Cannot find ${name}`);
        }
      },
      get: (name) => {
        if (typeof name === "string") {
          name = this.employee().findByName(name);
          return name;
        }
        throw new Error(`Name must be of type String`);
      },
      isInList: (dataObj) => {
        let scheduleArr = Object.values(this.staff.list);
        let result = scheduleArr.find((el) => {
          return JSON.stringify(dataObj) === JSON.stringify(el);
        });
        return result ? true : false;
      },

      validate: (personData) => {
        let {
          firstName,
          surname,
          positions,
          roleType,
          availability,
          daysOff,
          minHours,
        } = personData;

        let required = [
          "firstName",
          "surname",
          "positions",
          "roleType",
          "availability",
          "daysOff",
          "minHours",
          "lockSchedule"
        ];
        for (let attr of required) {
          if (!personData.hasOwnProperty(attr)) {
            throw new Error(
              `Person must have: firstName, surname, positions, roleType, availability`
            );
          }
        }

        let hasAdditional = Object.keys(personData).find(
          (x) => !required.includes(x)
        );
        if (hasAdditional) {
          throw new Error(
            `Person must have only: 'firstName', 'surname', 'positions', 'roleType', 'availability', 'daysOff', 'minHours', 'lockSchedule' !`
          );
        }

        if (!Array.isArray(positions)) {
          throw new Error("Positions must be an array!");
        }
        if (!typeof availability === "object") {
          throw new Error("availability must be an object!");
        }
        availability = this.workDaysAndTimes(availability);
        roleType = this.util.string.format(roleType);
        if (
          !roleType.includes("part") &&
          !roleType.includes("full") &&
          !roleType.includes("student")
        ) {
          throw new Error("Enter fullTime/partTime/student roleType!");
        }
        positions = this.util.string.format(positions);
        if (!this.employee().validatePositions(positions)) {
          throw new Error("One or more positions not available!");
        }
        if (isNaN(Number(daysOff)) && !daysOff.count) {
          throw new Error("Days off must be a number!");
        }
        if (isNaN(Number(minHours))) {
          throw new Error("Minimum hours must be a number!");
        }

        firstName = this.util.string.format(firstName);
        surname = this.util.string.format(surname);
        if (this.staff.list.hasOwnProperty(`${firstName} ${surname}`)) {
          throw new Error("Employee with the same name is employed");
        }

        return {
          firstName,
          surname,
          positions,
          roleType,
          availability,
          daysOff,
          minHours,
        };
      },

      validatePositions: (positions) => {
        positions = this.util.string.format(positions);
        let isValid = positions.filter((pos) => {
          return this.positions.all.find((x) => x === pos) ? true : false;
        });
        return isValid ? true : false;
      },
    };
  }
}

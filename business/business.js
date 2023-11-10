import { DateUtil } from "../utils/dateUtil.js";
import { Util } from "../utils/util.js";

export class Business {
  constructor(name) {
    this.name = name;
    this.util = new Util();
    this.date = new DateUtil();
    this.workHours = null;
    this.positions = {
      management: [],
      all: [],
    };
    (this.staff = {
      list: {},
      members: {},
      management: {},
    }),
      (this.events = {});
  }

  event(events) {
    return {
      add: () => {
        let eventNames = Object.keys(events);
        eventNames.forEach((name) => {
          if (!this.events.hasOwnProperty(name)) {
            this.events[name] = { ...events[name] };
            this.events[name].times = this.util.setConfig(
              events[name].times,
              this.workDaysAndTimes.bind(this)
            );
          }
        });
      },
    };
  }

  workDaysAndTimes(weekdayData, timeFrame = null) {
    if (Array.isArray(weekdayData) && timeFrame) {
      let result = this.date.getWeekdays(weekdayData, { sort: true });
      return this.workDaysAndTimes({ [timeFrame]: result });
    }

    let openingTimes = {};
    for (let time in weekdayData) {
      let weekdaysArr = weekdayData[time];
      weekdaysArr = this.date.getWeekdays(weekdaysArr, { sort: true });
      weekdaysArr.forEach((weekday) => {
        if (!openingTimes.hasOwnProperty(weekday)) {
          openingTimes[weekday] = time;
        } else if (openingTimes.hasOwnProperty(weekday)) {
          if (!Array.isArray(openingTimes[weekday])) {
            openingTimes[weekday] = [openingTimes[weekday]];
          }
          openingTimes[weekday].push(time);
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

            this.positions.management = this.util.string.format(
              this.positions.management
            );

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
        let person = { ...personData };
        this.employee().validate(personData);
        person = this.employee().populateEmployeeDetails(person);
        const fullName = `${person.firstName} ${person.surname}`;

        let isManagement = person.positions.find((pos) =>
          this.positions.management.includes(pos)
        );
        if (isManagement) {
          this.staff.management[fullName] = person;
        } else {
          this.staff.members[fullName] = person;
        }
        this.staff.list[fullName] = person;
      },

      addMany(staffList) {
        for (let person in staffList) {
          this.add(staffList[person]);
        }
      },

      populateEmployeeDetails: (employee) => {
        let person = { ...employee };
        person.firstName = this.util.string.format(person.firstName);
        person.surname = this.util.string.format(person.surname);
        person.positions = this.util.string.format(person.positions);
        person.contractType = this.util.string.format(person.contractType);
        person.availability = this.util.setConfig(person, 'availability', this.workDaysAndTimes.bind(this));
        if (person.daysOff) {
          person.daysOff = this.util.setConfig(person, 'daysOff', this.date.getWeekdays.bind(this.date), {sort:true});
        }
        return person;
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
        let person = { ...personData };

        let required = [
          "firstName",
          "surname",
          "positions",
          "contractType",
          "availability",
        ];
        for (let attr of required) {
          if (!person.hasOwnProperty(attr)) {
            throw new Error(
              `Person must have: firstName, surname, positions, contractType, availability`
            );
          }
        }
        if (!Array.isArray(person.positions)) {
          throw new Error("Positions must be an array!");
        }
        if (
          !["parttime", "fulltime", "student", "overtime"].includes(
            person.contractType.toLowerCase()
          )
        ) {
          throw new Error(
            "Enter fullTime/partTime/student/overtime contractType!"
          );
        }
        if (!this.employee().validatePositions(person.positions)) {
          throw new Error("One or more positions not available!");
        }
        if (
          this.staff.list.hasOwnProperty(
            `${person.firstName.toLowerCase()} ${person.surname.toLowerCase()}`
          )
        ) {
          throw new Error("Employee with the same name is employed");
        }
        return true;
      },

      validatePositions: (positions) => {
        positions = this.util.string.format(positions);
        let isValid = positions.filter((pos) =>
          this.positions.all.find((x) => x === pos) ? true : false
        );
        return isValid ? true : false;
      },
    };
  }
}

import { Scheduler } from "./scheduler.js";
import { Util } from "../utils/util.js";

export class Rota {
  constructor(business) {
    this.scheduler = new Scheduler();
    this.positions = business.positions;
    this.businessName = business.name;
    this.staff = business.staff;
    this.util = new Util();
    this.events = business.events;
    this.dailyLabourHoursSpan = this.util.weekdays({});
    this.openTimes = business.workHours;
    this.hourlyAvailability = {};
  }

  create(date) {
    date = this.util.date(date).getMonday();
    this.openTimes = this.util.iterate(
      this.openTimes,
      this.util.clock.time().toObj
    );
    const weekGuide = this.util.weekdays([]);
    const requiredHours = {};

    for (let weekday of weekGuide) {
      requiredHours[weekday] = this.getTotalRequiredDailyHours(weekday);
    }
  }

  getTotalRequiredDailyHours(weekday) {
    let totalPositionHours = this.util.iterate(this.positions.all, this.util.string.toUpperCase);
    totalPositionHours = this.util.reduceToObj(totalPositionHours, '00:00');
    totalPositionHours.all = '00:00';
    for (let entry in this.events) {
      const event = this.events[entry];
      if (event.markerType === 'timeSpan' && event.times[weekday]) {
        let timeSpan = this.fillOpenCloseTimes(event.times[weekday], weekday);
        let timeLength = this.util.clock.time().timeSpanLength(timeSpan);
        for (let position in event.positions) {
          let staffCount = event.positions[position].staff;
          let totalHours = this.util.clock.math().multiplyNormal(timeLength, staffCount);
          totalPositionHours[position] = this.util.clock.math().add(totalPositionHours[position], totalHours);
        }
      } else if (['completeBefore', 'completeAfter'].includes(event.markerType) && event.times[weekday]) {
        for (let position in event.positions) {
          let staffCount = event.positions[position].staff;
          let timeLength = event.positions[position].hours;
          let totalHours = this.util.clock.math().multiplyNormal(timeLength, staffCount);
          totalPositionHours[position] = this.util.clock.math().add(totalPositionHours[position], totalHours);
        }
      }
    }
    let total = Object.keys(totalPositionHours).reduce((timeStr, curr) => {
      timeStr = this.util.clock.math().add(totalPositionHours[curr], timeStr);
      return timeStr;
    }, '00:00');
    totalPositionHours.total = total;
    console.log(totalPositionHours);
  }

  eventHandler(weekday, event) {
    return {
      timeSpan: () => {},
      completeBefore: () => {},
      completeAfter: () => {},
    };
  }

  availability(weekday) {
    let availableStaff = {};
    let list = this.staff.list;
    for (let employee in list) {
      if (list[employee].availability.hasOwnProperty(weekday)) {
        availableStaff[employee] = this.fillOpenCloseTimes(
          list[employee].availability[weekday],
          weekday,
          true
        );
      }
    }
    return availableStaff;
  }

  populateHourlyAvailability(staff, weekdayHours) {
    let population = {
      weekdayHours: { ...weekdayHours },
      staffCount: Object.keys(staff).length,
    };
    for (let hour in weekdayHours) {
      for (let employee in staff) {
        if (
          this.util.clock.time(hour).isWithin(staff[employee], { hour: true })
        ) {
          population.weekdayHours[hour][employee] = true;
        }
      }
    }

    return population;
  }

  //? Replace open/close with actual store times
  fillOpenCloseTimes(timeSpan, weekday, totalHours = false) {
    let labourHours = totalHours ? this.dailyLabourHoursSpan : this.openTimes;
    if (timeSpan.includes(' - ')) {
      let [startShift, endShift] = timeSpan.split(" - ");
    [startShift, endShift] = [startShift, endShift].map((el) => {
      if (el === "open") {
        return labourHours[weekday].startTime; 
      } else if (el === "close") {
        return labourHours[weekday].endTime;
      }
      return el;
    });
    return `${startShift} - ${endShift}`;
    } else {
      if (timeSpan === "open") {
        return labourHours[weekday].startTime; 
      } else if (timeSpan === "close") {
        return labourHours[weekday].endTime;
      }
      return timeSpan;
    }
  }
}

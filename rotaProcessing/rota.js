import { Scheduler } from "./scheduler.js";
import { Util } from "../utils/util.js";
import { Employee } from "./employee.js";

export class Rota {
  constructor(business) {
    this.employee = new Employee();
    this.scheduler = new Scheduler();
    this.util = new Util();
    this.positions = business.positions;
    this.businessName = business.name;
    this.staff = business.staff;
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
    const hourlyDemandTimeline = {};
    for (let weekday of weekGuide) {
      let required = this.staffNeedsBetween("11:00 - 12:00", weekday);
      hourlyDemandTimeline[weekday] = this.totalLabourRequirement(weekday)
      console.log(required);
      return
    }

    console.log(hourlyDemandTimeline);
  }

  totalLabourRequirement(weekday) {
      let positionTotalHours = this.util.iterate(
        this.positions.all,
        this.util.string.toUpperCase
      );
    positionTotalHours = this.util.reduceToObj(
      positionTotalHours,
      "00:00"
    );
    positionTotalHours.all = "00:00";

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday] && event.markerType === "timeFrame") {
        let timeSpan = this.fillOpenCloseTimes(event.times[weekday], weekday);
        let timeLength = this.util.clock.time().timeSpanLength(timeSpan);
        for (let position in event.positions) {
          let staffCount = event.positions[position].staff;
          let totalHours = this.util.clock
            .math()
            .multiplyNormal(timeLength, staffCount);
          positionTotalHours[position] = this.util.clock
            .math()
            .add(positionTotalHours[position], totalHours);
        }
      } else if (
        ["completeBefore", "completeAfter"].includes(event.markerType) &&
        event.times[weekday]
      ) {
        for (let position in event.positions) {
          let staffCount = event.positions[position].staff;
          let timeLength = event.positions[position].hours;
          let totalHours = this.util.clock
            .math()
            .multiplyNormal(timeLength, staffCount);
          positionTotalHours[position] = this.util.clock
            .math()
            .add(positionTotalHours[position], totalHours);
        }
      }
    }
    let total = Object.keys(positionTotalHours).reduce(
      (timeStr, curr) => {
        timeStr = this.util.clock
          .math()
          .add(positionTotalHours[curr], timeStr);
        return timeStr;
      },
      "00:00"
    );
    positionTotalHours.total = total;
    return positionTotalHours;
  }

  staffNeedsBetween(queryTime, weekday) {
    let staffTime = this.util.iterate(this.positions.all, this.util.string.toUpperCase);
    staffTime = this.util.reduceToObj(staffTime, 0);
    staffTime.all = 0;
    const timeFrame = this.util.clock.time().toObj(queryTime);
    let currentTime = timeFrame.startTime;
    timeFrame.startTime = this.util.clock.time().toMinutes(timeFrame.startTime);
    timeFrame.endTime = this.util.clock.time().toMinutes(timeFrame.endTime);
    for (let i = timeFrame.startTime; i <= timeFrame.endTime; i++) {
      let snapshot = this.labourSnapshot(currentTime, weekday);
      for (let position in snapshot) {
        staffTime[position] += snapshot[position];
      }
      console.log(`${currentTime} :`, staffTime);
      currentTime = this.util.clock.math().add(currentTime, 1);

    }

    staffTime = Object.keys(staffTime).reduce((acc, curr) => {
      acc[curr] = this.util.clock.time().toTime(staffTime[curr], {fromMinutes: true});
      return acc;
    }, {})
    return staffTime;
  }

  labourSnapshot(queryTime, weekday) {
    // let queryType = this.util.clock.time().detect(queryTime);
    let staffRequirements = this.util.iterate(this.positions.all, this.util.string.toUpperCase);
    staffRequirements = this.util.reduceToObj(staffRequirements, 0);
    staffRequirements.all = 0;

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday] && event.markerType === "timeFrame") {
        let timeSpan = this.fillOpenCloseTimes(event.times[weekday], weekday);
        let eventIsAtThatTime = this.util.clock
          .time(queryTime)
          .isWithin(timeSpan);
        if (eventIsAtThatTime) {
          for (let pos in event.positions) {
            let staffCount = event.positions[pos].staff;
            if (staffRequirements[pos] < staffCount) {
              staffRequirements[pos] = staffCount
            }
          }
        }
    }
  }
  return staffRequirements;
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
  //? Replace open/close with actual store times
  fillOpenCloseTimes(timeSpan, weekday, totalHours = false) {
    let labourHours = totalHours ? this.dailyLabourHoursSpan : this.openTimes;
    if (timeSpan.includes(" - ")) {
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

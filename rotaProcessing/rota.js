import { LegalRequirements } from "../legal/legalRequirements.js";
import { Util } from "../utils/util.js";
import { Clock } from "../utils/clock.js";

export class Rota {
  constructor(business) {
    this.legal = new LegalRequirements();
    this.util = new Util();
    this.clock = new Clock();
    this.positions = business.positions;
    this.businessName = business.name;
    this.staff = business.staff;
    this.events = business.events;
    this.dayFrame = this.util.getWeekdays({});
    this.openTimes = business.workHours;
    this.hourlyAvailability = {};
  }

  create(date) {
    date = this.util.date(date).getMonday();
    this.openTimes = this.util.iterate(
      this.openTimes,
      this.clock.time().toObj
    );
    const [rota, staffAvailability] = this.init();
    console.log(rota);
    console.log(staffAvailability);
  }

  init() {
    const rota = this.util.getWeekdays({});
    const staffAvailability = {...rota};
    for (let weekday in rota) {
      this.dayFrame[weekday] = this.potentialDayLength(weekday);
      staffAvailability[weekday] = this.staffAvailability(weekday);
      let staff = { ...this.staff.list };

      for (let employee in staff) {
        rota[weekday][employee] = this.dayFrame[weekday]
      }
    }
  return [rota, staffAvailability];
  }

  potentialDayLength(weekday) {
    let openTimes = this.clock.time().toObj(this.openTimes[weekday]);

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday]) {
        if (event.markerType === "timeFrame") {
          let timeFrame = this.fillOpenCloseTimes(
            event.times[weekday],
            weekday
          );
          timeFrame = this.clock.time().toObj(timeFrame);
          if (
            this.clock
              .relativeTime(openTimes.startTime)
              .isBiggerThan(timeFrame.startTime)
          ) {
            openTimes.startTime = timeFrame.startTime;
          }
          if (
            this.clock
              .relativeTime(openTimes.endTime)
              .isLessThan(timeFrame.endTime)
          ) {
            openTimes.endTime = timeFrame.endTime;
          }
        } else if (
          ["completeBefore", "completeAfter"].includes(event.markerType)
        ) {
          let startTime = this.fillOpenCloseTimes(
            event.times[weekday],
            weekday
          );
          let sign = event.markerType === "completeAfter" ? 1 : -1;
          for (let position in event.positions) {
            let timeLength = event.positions[position].hours;
            let calcTime = this.clock
              .math()
              .calcClockTime(startTime, timeLength, sign);
            calcTime = this.clock.time().toTime(calcTime);
            if (
              this.clock
                .relativeTime(openTimes.startTime)
                .isBiggerThan(calcTime)
            ) {
              openTimes.startTime = calcTime;
            }
            if (
              this.clock
                .relativeTime(openTimes.endTime)
                .isLessThan(calcTime)
            ) {
              openTimes.endTime = calcTime;
            }
          }
        }
      }
    }
    return openTimes;
  }

  dailyLabour(weekday) {
    let positionTotalHours = this.util.iterate(
      this.positions.all,
      this.util.string.toUpperCase
    );
    positionTotalHours = this.util.reduceToObj(positionTotalHours, "00:00");
    positionTotalHours.all = "00:00";

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday] && event.markerType === "timeFrame") {
        let timeSpan = this.fillOpenCloseTimes(event.times[weekday], weekday);
        let timeLength = this.clock.time().timeSpanLength(timeSpan);
        for (let position in event.positions) {
          let staffCount = event.positions[position].staff;
          let totalHours = this.clock
            .math()
            .multiplyNormal(timeLength, staffCount);
          positionTotalHours[position] = this.clock
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
          let totalHours = this.clock
            .math()
            .multiplyNormal(timeLength, staffCount);
          positionTotalHours[position] = this.clock
            .math()
            .add(positionTotalHours[position], totalHours);
        }
      }
    }
    let total = Object.keys(positionTotalHours).reduce((timeStr, curr) => {
      timeStr = this.clock.math().add(positionTotalHours[curr], timeStr);
      return timeStr;
    }, "00:00");
    positionTotalHours.total = total;
    return positionTotalHours;
  }

  labourTimeline(weekday) {
    let timeline = {};

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday]) {
        if (event.markerType === "timeFrame") {
          let timeFrame = this.fillOpenCloseTimes(
            event.times[weekday],
            weekday
          );
          for (let position in event.positions) {
            let staffCount = event.positions[position].staff;
            if (!timeline.hasOwnProperty(position)) {
              timeline[position] = {};
            }
            if (!timeline[position].hasOwnProperty(timeFrame)) {
              timeline[position][timeFrame] = staffCount;
            }
          }
        } else if (
          ["completeBefore", "completeAfter"].includes(event.markerType)
        ) {
          for (let position in event.positions) {
            let eventTime = this.fillOpenCloseTimes(
              event.times[weekday],
              weekday
            );
            let staffCount = event.positions[position].staff;
            let timeLength = event.positions[position].hours;
            if (!timeline.hasOwnProperty(position)) {
              timeline[position] = {};
            }
            if (!timeline[position].hasOwnProperty(eventTime)) {
              timeline[position][eventTime] = {
                staffCount,
                timeLength,
                markerType: event.markerType,
              };
            }
          }
        }
      }
    }
    return timeline;
  }

  labourTimeFrame(queryTime, weekday) {
    let staffTime = this.util.iterate(
      this.positions.all,
      this.util.string.toUpperCase
    );
    staffTime = this.util.reduceToObj(staffTime, 0);
    staffTime.all = 0;
    const timeFrame = this.clock.time().toObj(queryTime);
    let currentTime = timeFrame.startTime;
    timeFrame.startTime = this.clock.time().toMinutes(timeFrame.startTime);
    timeFrame.endTime = this.clock.time().toMinutes(timeFrame.endTime);
    for (let i = timeFrame.startTime; i < timeFrame.endTime; i++) {
      let snapshot = this.labourSnapshot(currentTime, weekday);
      for (let position in snapshot) {
        staffTime[position] += snapshot[position];
      }
      currentTime = this.clock.math().add(currentTime, 1);
    }

    staffTime = Object.keys(staffTime).reduce((acc, curr) => {
      acc[curr] = this.clock
        .time()
        .toTime(staffTime[curr], { fromMinutes: true });
      return acc;
    }, {});
    return staffTime;
  }

  labourSnapshot(queryTime, weekday) {
    // let queryType = this.clock.time().detect(queryTime);
    let staffRequirements = this.util.iterate(
      this.positions.all,
      this.util.string.toUpperCase
    );
    staffRequirements = this.util.reduceToObj(staffRequirements, 0);
    staffRequirements.all = 0;

    for (let entry in this.events) {
      const event = this.events[entry];

      if (event.times[weekday] && event.markerType === "timeFrame") {
        let timeSpan = this.fillOpenCloseTimes(event.times[weekday], weekday);
        let eventIsAtThatTime = this.clock
          .time(queryTime)
          .isWithin(timeSpan);
        if (eventIsAtThatTime) {
          for (let pos in event.positions) {
            let staffCount = event.positions[pos].staff;
            if (staffRequirements[pos] < staffCount) {
              staffRequirements[pos] = staffCount;
            }
          }
        }
      }
    }
    return staffRequirements;
  }

  staffAvailability(weekday) {
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
    let labourHours = totalHours ? this.dayFrame : this.openTimes;
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

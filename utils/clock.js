export class Clock {
  math() {
    return {
      add: (timeA, timeB) => this.math().calcTime(timeA, timeB, '+'),
      deduct: (timeA, timeB) => this.math().calcTime(timeA, timeB, '-'),
      multiply: (timeA, timeB) => this.math().calcTime(timeA, timeB, '*'),
      divide: (timeA, timeB) => this.math().calcTime(timeA, Math.max(timeB, 1), '/'),
      multiplyNormal: (time, number) => this.math().calcTime(time, number, 'multiply'),
      divideNormal: (time, number) => this.math().calcTime(time, number, 'divide'),
      calcTime: (timeA, param2, sign) => {
        timeA = this.time().toMinutes(timeA);
        param2 = typeof param2 === 'number' ? param2 : this.time().toMinutes(param2); 
        let methods = {
          '+': () => timeA + param2,
          '-': () => timeA - param2,
          '*': () => ((timeA / 60) * (param2 / 60)) * 60,
          '/': () => ((timeA / 60) / (param2 / 60)) * 60,
          'multiply': () => timeA * param2,
          'divide': () => timeA / param2,
        }
        let result = methods[sign]();
        let resultSign = Math.sign(result) === 1 ? '' : '-';
        result = Math.abs(result);
        let h = Math.floor(result / 60);
        let m = Math.floor(result - (h * 60));
        let lz = (num) => Math.abs(num) < 10 ? '0' : '';
        return `${resultSign}${lz(h)}${h}:${lz(m)}${m}`;
      },
      calcClockTime: (time, modTime, sign = "+") => {
        sign = sign === "+" ? 1 : -1;
        let clockHours = this.time().toObj(time);
        let modHours = this.time().toObj(modTime);
        let dayCount = Math.floor(modHours.h / 24);
        let minToHour = Math.floor(modHours.m / 60);
        modHours.m = modHours.m - minToHour * 60;
        clockHours.h += modHours.h + minToHour * sign;
        clockHours.h =
          clockHours.h < 0 || clockHours.h > 24
            ? clockHours.h + 24 * Math.max(dayCount, 1) * -1
            : clockHours.h;
        clockHours.m = clockHours.m + modHours.m * sign;
        if (clockHours.m < 0) {
          clockHours.m += 60;
          clockHours.h =
            clockHours.h - 1 < 0 ? clockHours.h - 1 + 24 : clockHours.h - 1;
        } else if (clockHours.m > 60) {
          clockHours.m -= 60;
          clockHours.h =
            clockHours.h + 1 > 24 ? clockHours.h + 1 - 24 : clockHours.h + 1;
        }
        if (clockHours.h === 24) {
          clockHours.h = 0;
        }
        return clockHours;
      },
     
    };
  }

  weekdayHourly(weekDayOpenTimes) {
    let openTimes = this.time().toObj(weekDayOpenTimes);
    let [start, startMin] = openTimes.startTime.split(":");
    let [end, endMin] = openTimes.endTime.split(":");
    [start, end] = [start, end].map(Number);
    let result = {};
    for (let i = start; i <= end; i++) {
      let lz = i < 10 ? "0" : "";
      if (i === start || i === end) {
        result[`${lz}${i}:${i === start ? startMin : endMin}`] = {};
      } else {
        result[`${lz}${i}:00`] = {};
      }
    }
    return result;
  }

  time(time) {
    return {
      isEq: (compareTime) => {
        let compare = this.time().toMinutes(compareTime);
        return this.time().toMinutes(time) === compare;
      },
      isBiggerThan: (compareTime) => {
        let compare = this.time().toMinutes(compareTime);
        return this.time().toMinutes(time) > compare;
      },
      isLessThan: (compareTime) => {
        let compare = this.time().toMinutes(compareTime);
        return this.time().toMinutes(time) < compare;
      },
      isBiggerEqThan: (compareTime) => {
        let compare = this.time().toMinutes(compareTime);
        return this.time().toMinutes(time) >= compare;
      },
      isLessEqThan: (compareTime) => {
        let compare = this.time().toMinutes(compareTime);
        return this.time().toMinutes(time) <= compare;
      },
      isWithin: (timeFrame, options) => {
        let timeStart, timeEnd;
        if (options.hour) {
          [timeStart, timeEnd] = [time, time];
        } else {
          [timeStart, timeEnd] = time.split(" - ");
        }
        let [timeFrameStart, timeFrameEnd] = timeFrame.split(" - ");
        if (
          this.time(timeFrameStart).isLessEqThan(timeStart) &&
          this.time(timeFrameEnd).isBiggerEqThan(timeEnd)
        ) {
          return true;
        }
        return false;
      },
      timeSpanLength: (timeSpan) => {
        let isTimeSpan = this.validate(timeSpan);
        if(!isTimeSpan) return timeSpan;
        
        let timeObj = this.time().toObj(timeSpan);
        let biggerTime = this.time(timeObj.startTime).isBiggerThan(timeObj.endTime) ? timeObj.startTime : timeObj.endTime;
        let smallerTime = timeObj.startTime === biggerTime ? timeObj.endTime : timeObj.startTime;
        return this.math().deduct(biggerTime, smallerTime);
      },
      toMinutes: (time) => {
        let obj = this.time().toObj(time);
        return obj.h * 60 + obj.m;
      },
      toHours: (minutes) => {
        let hours = Math.trunc(Math.max(0, minutes / 60));
        return {
          h: hours,
          m: minutes - hours * 60,
        };
      },
      toTime(timeObj) {
        let lzH = timeObj.h < 10 ? "0" : "";
        let lzM = timeObj.m < 10 ? "0" : "";
        return `${lzH}${timeObj.h}:${lzM}${timeObj.m}`;
      },
      breakLength: (shift) => {
        let minutes = this.shiftLength(shift[0], shift[1]);
        if (minutes > 360) {
          return 30;
        } else if (minutes > 240) {
          return 15;
        } else {
          return 0;
        }
      },
      toObj: (time) => {
        if (typeof time === "object") {
          return time;
        }

        if (time.includes(" - ")) {
          return time.split(" - ").reduce((acc, curr, i) => {
            if (i === 0) {
              acc.startTime = curr;
            } else {
              acc.endTime = curr;
            }
            return acc;
          }, {});
        }
        let [h, m] = time.split(":").map(Number);
        return { h, m };
      },
    };
  }

  validate(time) {
    if(time.includes(' - ')) {
      return 'timeSpan'
    }
  }

  relativeTime(originTime) {
    let timeSpread = Array(12).fill(0);
    let orgTime = this.time().toObj(originTime);
    let orgIndex = 6;
    let forwardTime = { ...orgTime };
    let backwardTime = { ...orgTime };
    for (let i = orgIndex; i >= 0; i--) {
      timeSpread.splice(i, 1, { ...backwardTime });
      backwardTime = this.calc(backwardTime, "-01:00");
    }
    for (let i = orgIndex; i <= 12; i++) {
      timeSpread.splice(i, 1, { ...forwardTime });
      forwardTime = this.calc(forwardTime, "01:00");
    }
    return {
      isBiggerThan: (compareTime) => {
        let compare = this.time().toObj(compareTime);
        let compareIndex = timeSpread.findIndex((obj) => obj.h === compare.h);
        if (compareIndex !== -1) {
          return orgIndex > compareIndex;
        }
        return false;
      },
      isLessThan: (compareTime) => {
        let compare = this.time().toObj(compareTime);
        let compareIndex = timeSpread.findIndex((obj) => obj.h === compare.h);
        if (compareIndex !== -1) {
          return orgIndex < compareIndex;
        }
        return false;
      },
    };
  }

  sanitize(time) {
    if (!time) {
      return null;
    } else if (typeof time === "object") {
      return time;
    }

    if (time.includes("-")) {
      time = time.split(" - ");
      time = time.map((el) => el.split(":"));
      return time
        .map((el) => `${el[0].slice(-2)}:${el[1].slice(0, 2)}`)
        .join(" - ");
    }

    time = time.split(":");
    return `${time[0].slice(-2)}:${time[1].slice(0, 2)}`;
  }
}

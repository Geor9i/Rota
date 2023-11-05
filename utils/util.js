import { StringUtil } from "./stringUtil.js";

export class Util {
  constructor() {
    this.string = new StringUtil();
  }

  getWeekdays(data, options = {}) {
    let syntaxVariations = {
      monday: ["mon", "monday", "m", "mo", "1"],
      tuesday: ["tue", "tuesday", "tu", "t", "2"],
      wednesday: ["wed", "wednesday", "we", "w", "3"],
      thursday: ["thu", "thursday", "thur", "th", "4"],
      friday: ["fri", "friday", "fr", "f", "5"],
      saturday: ["sat", "saturday", "sa", "s", "6"],
      sunday: ["sun", "sunday", "su", "7"],
    };
    if (Array.isArray(data)) {
      let remove = options.remove
        ? options.remove.map((d) => this.getWeekdays(d))
        : [];
      if (options.sort) {
        return data
          .map((day) => this.getWeekdays(day))
          .filter((day, index, arr) => arr.indexOf(day) === index)
          .filter((day) => (remove.includes(day) ? false : true));
      }
      return Object.keys(syntaxVariations);
    } else if (typeof data === "object" && Object.keys(data).length === 0) {
      return this.reduceToObj(this.getWeekdays([]), {});
    }

    let string = data.toLowerCase();

    for (let day in syntaxVariations) {
      if (syntaxVariations[day].includes(string)) {
        return day;
      }
    }
  }

  includes(data, target) {
    let dataType = this.typeof(data);
    let targetType = this.typeof(target);
    if (!targetType || !dataType || ["number", "boolean"].includes(dataType))
      return null;

    if (
      ["string", "array"].includes(dataType) &&
      !["array", "object"].includes(targetType)
    ) {
      return data.includes(target);
    } else if (
      dataType === "string" &&
      ["array", "object"].includes(targetType)
    ) {
      return null;
    } else if (dataType === "array" && targetType === "array") {
      let tempArr = Array.from(data);
      let tempTargetArr = JSON.stringify(Array.from(target));
      for (let element of tempArr) {
        if (Array.isArray(element)) {
          let tempElement = JSON.stringify(Array.from(element));
          if (tempElement === tempTargetArr) {
            return true;
          }
        }
      }
      return false;
    } else if (dataType === "array" && targetType === "object") {
    }
  }

  iterate(data, callback) {
    if (Array.isArray(data)) {
      let result = [...data];
      return result.map((el) => callback(el));
    } else if (typeof data === "object") {
      let result = { ...data };
      return Object.keys(result).reduce((acc, curr) => {
        acc[curr] = callback(data[curr]);
        return acc;
      }, {});
    }
  }

  reduceToObj(arr, data) {
    return arr.reduce((acc, curr) => {
      let dataType = this.typeof(data);
      switch (dataType) {
        case "array":
          acc[curr] = [...data];
          break;
        case "object":
          acc[curr] = { ...data };
          break;
        default:
          acc[curr] = data;
          break;
      }
      return acc;
    }, {});
  }

  typeof(target) {
    let types = ["number", "string", "object", "boolean"];
    let targetType = typeof target;
    if (!types.includes(targetType)) return null;

    if (targetType !== "object") {
      return targetType;
    } else {
      return Array.isArray(target) ? "array" : "object";
    }
  }

  date(date) {
    this.result = date;
    return {
      format: (options = {}) => {
        options.delimiter = options.delimiter ? options.delimiter : "/";
        if (typeof this.result === "object") {
          let del = options.delimiter;
          return `${this.result.getFullYear()}${del}${
            this.result.getMonth() + 1
          }${del}${this.result.getDate()}`;
        }
        let datePattern =
          /(?<normal>(?<day>\d{1,2})(?<d>\D+)(?<month>\d{1,2})\k<d>(?<year>\d{2,4}))|(?<reverse>(?<year1>\d{2,4})(?<d1>\D+)(?<month1>\d{1,2})\k<d1>(?<day1>\d{1,2}))/;

        let dateMatch = this.result.match(datePattern);
        if (!dateMatch) {
          throw new Error("Wrong date format!");
        }

        let day, month, year;
        if (dateMatch.groups.normal) {
          [day, month, year] = [
            dateMatch.groups.day,
            dateMatch.groups.month,
            dateMatch.groups.year,
          ];
        } else if (dateMatch.groups.reverse) {
          [day, month, year] = [
            dateMatch.groups.day1,
            dateMatch.groups.month1,
            dateMatch.groups.year1,
          ];
        }
        let fullYearLength = 4;
        let yearStart = `${new Date().getFullYear()}`.slice(
          0,
          fullYearLength - `${year}`.length
        );
        year = `${yearStart}${year}`;
        return options.asString
          ? `${year}/${month}/${day}`
          : new Date(`${year}/${month}/${day}`);
      },

      getMonday: (options = {}) => {
        let step = options.next ? 1 : -1;
        let date = this.date(this.result).format();
        if (date.getDay() === 1 && !options.previous && !options.next) {
          return date;
        }
        date = new Date(date.setDate(date.getDate() + step));
        let day = date.getDay();
        while (day !== 1) {
          date = new Date(date.setDate(date.getDate() + step));
          day = date.getDay();
        }
        return date;
      },
    };
  }

  updateConfig(data, callback, ...params) {
    let dataType = this.typeof(data);
    if (["string", "number", "boolean"].includes(dataType)) {
      return callback(data, ...params);
    }
    if (dataType === "object") {
      let result = {};
      for (let entry in data) {
        let isConfig =
          data[entry].hasOwnProperty("value") &&
          data[entry].hasOwnProperty("priority");
        params.push(entry);
        if (isConfig) {
          let { priority, value } = data[entry];
          value = callback(value, ...params);
          for (let day in value) {
            value[day] = {
              value: value[day],
              priority: priority,
            };
          }
          result = { ...result, ...value };
        } else {
          result = { ...result, ...callback(data[entry], ...params) };
        }
      }
      return result;
    }
    return null;
  }
  isStrict(data) {
    let dataType = this.typeof(data);
    if (dataType === "object") {
      let isConfig =
        data.hasOwnProperty("value") && data.hasOwnProperty("priority");
      if (isConfig) {
        return data.priority === "strict"
          ? [data.value, true]
          : [data.value, false];
      } else {
        return [data.value, null];
      }
    }
    return [data, null];
  }

  getValueAndPriority(targetObject, valueName) {
    let globalPriority = targetObject.priority ? targetObject.priority : null;
    let targetValue = targetObject[valueName];
    let hasPriority = targetValue.priority && targetValue.value ? true : false;
    return hasPriority
      ? [targetValue.value, targetValue.priority]
      : [targetValue, globalPriority];
  }
}

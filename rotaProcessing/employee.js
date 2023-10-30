import { Util } from "../utils/util.js";

export class Employee {
  constructor() {
    this.util = new Util();
  }
  analyzeAvailability(employeeData) {
    let employee = { ...employeeData };
    let employeePotential = {};
    employeePotential.daysOff = this.setDaysOff(employee);
    

  }

  setDaysOff(employeeData) {
    let employee = { ...employeeData };
    let daysOff = {
        all: [],
    }
    const consecutiveDayCount = employee.daysOff.count
    const weekdays = this.util.weekdays([]);
    const availableDays = Object.keys(employee.availability);
    const nonAvailableDaysArr = weekdays.filter(
      (el) => !availableDays.includes(el)
    );
  }

  getConsecutiveDays(employeeData) {
    let employee = { ...employeeData };

    const weekdays = this.util.weekdays([]);
    const availableDays = Object.keys(employee.availability);
    
  }
}

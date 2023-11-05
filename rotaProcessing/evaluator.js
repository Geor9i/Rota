import { LegalRequirements } from "../legal/legalRequirements.js";
import { Clock } from "../utils/clock.js";
import { Util } from "../utils/util.js";

export class Evaluator {
    constructor(staff) {
        this.staff = staff;
        this.util = new Util();
        this.clock = new Clock();
        this.legal = new LegalRequirements();
    }

    report(currentRota) {
        let report = {};

        for (let employee in this.staff.list) {
            report[employee] = this.checkEmployee(employee, currentRota);
            
            
            return
        }

       
    }

    checkEmployee(employee, currentRota) {
        let report = {
            totalShifts: 0,
            workdays: 0,
            daysOffAmount: 0,
            totalHours: 0,
            workShifts: [],
            daysOff: [],
            consecutiveDaysOff: null,
            withinAvailability: null,
            hasMinHours: null,
            withinStrict: null,
            withinImportant: null,
            withinOptional: null,
        };
        let employeeConfig = this.staff.list[employee];
        let potential = this.getEmployeePotential(employeeConfig);
        console.log(employeeConfig);

        for (let weekday in currentRota) {
            let day = currentRota[weekday];
            if (day[employee]) {
                report.totalShifts++;
                report.workShifts.push(weekday);
            } else {
                report.daysOff.push(weekday);
            }
        }
        // console.log(report);
    }

    getEmployeePotential(employeeConfig) {
        let report = {
            daysOffAmount: {
                strict: 0,
                important: 0,
                optional: 0,
            },
            minHours: {
                strict: 0,
                important: 0,
                optional: 0,
            },
            availableWorkTimes: {
                strict: {},
                important: {},
                optional: {},
            },
            availableDaysOff:{
                strict: [],
                important: [],
                optional: [],
            },
            consecutiveDaysOff: {
                strict: null,
                important: null,
                optional: null,
            },
        };
        let globalPriority = employeeConfig.priority ? employeeConfig.priority : null;


    }
}
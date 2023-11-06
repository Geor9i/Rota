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
                strict: this.legal.daysOff.min,
                important: 0,
                optional: 0,
            },
            minHours: {
                strict: this.legal.weeklyHours.min,
                important: 0,
                optional: 0,
            },
            maxHours: {
                strict: this.legal.weeklyHours.max[employeeConfig.contractType],
                important: 0,
                optional: 0,
            },
            availableWorkTimes: {},
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

        const setValue = (reportValueName, employeeValueName) => {
            employeeValueName = employeeValueName ? employeeValueName : reportValueName;
            let [value, valuePriority] = this.util.getValueAndPriority(employeeConfig, employeeValueName);
                if (value) {
                    if (valuePriority) {
                        this.util.setNestedProperty(report, `${reportValueName}.${valuePriority}`, value );
                    } else {
                        this.util.setNestedProperty(report, `${reportValueName}.optional`, value );
                    }
                } else {
                    throw new Error('Cannot set Value!')
                }
            }

        try {
            setValue('minHours');
            setValue('consecutiveDaysOff', 'daysOff.consecutive');
            setValue('daysOffAmount', 'daysOff.amount');
            //? set Availability
            let availability = employeeConfig.availability;
            for (let priority in availability) {
                report.availableWorkTimes[priority] = employeeConfig.availability[priority];
            }
            //? set availableDaysOff
            this.util.findAvailableDaysOff(employeeConfig);

        } catch(err) {
            console.log({err: err.message, name: employeeConfig.firstName});
        }

        console.log(report);
        
       

    }
}
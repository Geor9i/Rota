import { tableArr } from "../script.js";
import { Util } from "../utils/util.js";

export class RotaReader {
    constructor(tableArr) {
        this.managerSchedule = {};
        this.tmSchedule = {};
        this.schedule = {};
        this.util = new Util();
        this.extractTableData(tableArr);
        this.hourlyPay = {
            sr: 11.15,
            tm: 10.65,
        };
        this.tax = 0.2;
    }

    extractTableData(tableArr) {
        let [managerSchedule, tmSchedule] = [tableArr[10], tableArr[12]];
        managerSchedule = Array.from(managerSchedule.querySelectorAll('tr')).slice(3);
        tmSchedule = Array.from(tmSchedule.querySelectorAll('tr')).slice(3);
        this.managerSchedule = this.tableToScheduleObj((managerSchedule));
        this.tmSchedule = this.tableToScheduleObj((tmSchedule));
        this.schedule = this.tableToScheduleObj(([...managerSchedule, ...tmSchedule]));
    }

    tableToScheduleObj(trArr) {
        const shiftPattern = /\d{2}:\d{2}[\s-]{3}\d{2}:\d{2}/;
            let schedule = {};
            trArr.forEach(tr => {
                let tdArr = Array.from(tr.querySelectorAll('td')).slice(0,8).map(td => td.textContent);
                let name = this.util.string.format(tdArr[0])
                let weekdays = this.util.weekdays([]);
                schedule[name] = weekdays.reduce((shifts, day, i) => {
                    let data = tdArr[i + 1];
                    let match;
                    if((match = data.match(shiftPattern)) !== null) {
                        shifts[day] = match[0].split(' - ');
                    } else {
                        shifts[day] = '';
                    }
                    return shifts;
                }, {})
            });
            return schedule;
        }

        employee () {
            return {
                findByName: (name) => {
                    name = this.util.string.format(name)
                    let namesArr = Object.keys(this.schedule).filter(n => n.includes(name));
                    if (namesArr.length === 1) {
                        let fullName = namesArr[0];
                        return this.schedule[fullName]
                    } else if (namesArr.length > 1) {
                        throw new Error ('More than one person in rota! Please enter fullName!')
                    } else {
                        throw new Error (`Cannot find ${name}`);
                    }
                },
                get: (person, options) => {
                    if (typeof person === 'string') {
                        person = this.employee().findByName(person);
                    }
                    if (options && options.position) {
                        return [person, this.employee().getPosition(person)]
                    }
                    return person;
                },
                getPosition: (name) => {
                    let obj = this.employee().get(name);
                    let result;
                    if ((result = this.employee().findByObj(obj, this.managerSchedule))!== null) {
                        return 'sr';
                    } else if ((result = this.employee().findByObj(obj, this.tmSchedule))!== null) {
                        return 'tm';
                    }
                    return null;
                },
                findByObj: (personObj, rota) => {
                    let find = (obj, schedule = this.schedule) => {
                        let scheduleArr = Object.values(schedule);
                        let result = scheduleArr.find((el) => {
                            return JSON.stringify(obj) === JSON.stringify(el)
                        });
                        return result ? result : null;
                    }
                    
                    if (!rota) {
                        return find(personObj);
                    } else {
                        return find(personObj, rota)
                    }
                }}
        }

        shiftLength(person, weekday, options) {
            person = this.employee().get(person);
            weekday = this.util.weekdays(weekday);
            if (!this.employee().findByObj(person) || !person[weekday]) return null;

            let startTime = person[weekday][0];
            let endTime = person[weekday][1];
            //Add 24h to end time if the shift spans more than one day
            let result = this.util.time().shiftLength(startTime, endTime);
            if (options && options.minutes) {
                return result;
            }
            return result = this.util.time().toHours(result); 
        }
        
        weekDayRota(weekday, options) {
            weekday = this.util.weekdays(weekday);
            let result = {};
            let breakMinutes = 0;
            for (let person in this.schedule) {
                if (this.schedule[person][weekday]) {
                    let shift = this.schedule[person][weekday];
                    breakMinutes += this.util.time().breakLength(shift);
                    result[person] = shift;
                }
            }
            if (options) {
                let totalMinutes = [];
                for (let person in result) {
                    let [start, end] = result[person];
                    totalMinutes.push(this.util.time().shiftLength(start, end))
                }
                totalMinutes = totalMinutes.reduce((a, c) => a += c);
                if (options.hours) {
                    return this.util.time().toHours(totalMinutes)
                } else if (options.minutes) {
                    return totalMinutes;
                } else if (options.breaks) {
                    return breakMinutes;
                }
                return null;
            }
            return result
        }

        personHours(person, options) {
            let employee = this.employee().get(person);
            let totalMinutes = [];
            for(let day in employee) {
                if (employee[day] !== '') {
                    let dailyHours = this.util.time().shiftLength(...employee[day])
                    if (options) {
                        let breaks = this.util.time().breakLength(employee[day]);
                        if (options.breaks) {
                            totalMinutes.push(breaks);
                        } else if (options.paid) {
                            totalMinutes.push(dailyHours - breaks);
                        } 
                    } else {
                        totalMinutes.push(dailyHours);
                    }
                }
            }
            totalMinutes = totalMinutes.reduce((acc, curr) => acc += curr, 0);
            if (options && options.minutes) {
                return totalMinutes;
            }
            return this.util.time().toHours(totalMinutes);
        }

        totalHours(options) {
            let weekdays = this.util.weekdays([]);
            let totalMinutes = [];
            let breakMinutes = 0;
            for (let day of weekdays) {
                breakMinutes += this.weekDayRota(day, {breaks:true});
                totalMinutes.push(this.weekDayRota(day, {minutes: true}));
            }
            totalMinutes = totalMinutes.reduce((acc, curr) => acc += curr);

            if (options) {
              if (options.paid) {
                    return options.minutes ? totalMinutes - breakMinutes
                    : this.util.time().toHours(totalMinutes - breakMinutes);
                } else if (options.breaks) {
                    if (options.minutes) {
                        return breakMinutes;
                    }
                    return this.util.time().toHours(breakMinutes);
                } else if (options.minutes) {
                    return totalMinutes;
                } 
            }
            return this.util.time().toHours(totalMinutes);
        }

        labour(options) {
            let specialPay = {
                georgi: 11.65,
                callum: 12.60
            }
            let labour = 0;
            for (let person in this.schedule) {
                let position = this.employee().getPosition(person); 
                let pay = specialPay[person] ? specialPay[person]
                : this.hourlyPay[position];
                labour += this.wage(person, {...options, pay});
            }
            return labour;
        }

        wage(person, options) {
            let [employee, position] = this.employee().get(person, {position: true});
            let pay = options?.pay ?options.pay : this.hourlyPay[position];
            let totalHours = this.personHours(person, {paid:true});
            let weeklyPay = totalHours.h * pay + (totalHours.m / 60) * pay;
            if (options) {
                
                if (options.month){
                    let monthly = (weeklyPay / 7) * 30;
                    return options.net ? monthly - (monthly * this.tax) : monthly;
    
                } else if (options.year) {
                    let yearly = ((weeklyPay / 7) * 30) * 12;
                    return options.net ? yearly - (yearly * this.tax)
                    : yearly;
            }
        }
        return options?.net ? weeklyPay - weeklyPay * this.tax : weeklyPay
        }
}

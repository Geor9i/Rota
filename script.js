let tableArr = Array.from(document.querySelectorAll('table'));

class Rota {
    constructor(tableArr) {
        this.managerSchedule = {};
        this.tmSchedule = {};
        this.schedule = {};
        this.extractTableData(tableArr);
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
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            let schedule = {};
            trArr.forEach(tr => {
                let tdArr = Array.from(tr.querySelectorAll('td')).slice(0,8).map(td => td.textContent);
                let name = tdArr[0].toLowerCase();
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

        shiftLength(person, weekday) {
            [person, weekday] = [person, weekday].map(str => str.toLowerCase());
            if (!this.schedule[person] || !this.schedule[person][weekday]) return null;

            let shiftArr = this.schedule[person][weekday];
            let startTime = shiftArr[0];
            let endTime = shiftArr[1];
            //Add 24h to end time if the shift spans more than one day
            let result = this.time().select(endTime).isBiggerThan(startTime)
            console.log(result);
        }

        time () {
            return {
                difference(startTime, endTime) {
                    return this.toMinutes(endTime) - this.toMinutes(startTime);
                },
                toMinutes(time) {
                    let obj = this.toObj(time);
                    return obj.h * 60 + obj.m;
                },
                select(time) {
                    let that = this;
                    return {
                        isEq(compareTime) {
                            let compare = that.toMinutes(compareTime);
                            return that.toMinutes(time) === compare;
                        },
                        isBiggerThan(compareTime) {
                            let compare = that.toMinutes(compareTime);
                            return that.toMinutes(time) > compare;
                        },
                        isLessThan(compareTime) {
                            let compare = that.toMinutes(compareTime);
                            return that.toMinutes(time) < compare;
                        }
                    };
                },
                toObj(time) {
                    let result = time.split(':').map(Number);
                    return {
                        h: result[0],
                        m: result[1],
                    }
                }
            }
        }

        weekDayShifts(weekday) {
            weekday = weekday.toLowerCase();
            let result = {};
            for (let person in this.schedule) {
                if (this.schedule[person][weekday]) {
                    result[person] = this.schedule[person][weekday];
                }
            }
            return result
        }

        getPersonHours(person) {
            if (!this.schedule[person]) return null;
                
            let workHours = [];
            for(let day in this.schedule[person]) {
                if (this.schedule[person][day] !== '') {
                    workHours.push(this.shiftLength(person, day));
                }
            }
            return workHours;
        }

        wage(person) {
            person = person.toLowerCase();
            let hourlyPay = {
                sr: 11.15,
                tm: 10.65,
            }
            let pay = this.managerSchedule.hasOwnProperty(person)
            ? hourlyPay.sr
            : hourlyPay.tm;

        }
    
}


const rota = new Rota(tableArr);

// console.log(rota.getPersonHours('georgi'));
console.log(rota.shiftLength('kelly', 'monday'));
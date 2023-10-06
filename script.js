let mainTable = Array.from(document.querySelectorAll('table'));
let [managerTable, teamTable] = [mainTable[40], mainTable[42]];

managerTable = Array.from(managerTable.querySelectorAll('tr')).slice(3);
teamTable = Array.from(teamTable.querySelectorAll('tr')).slice(3);

let team = dataToObj([...managerTable, ...teamTable]);

let Kelly = team.Kelly;


console.log(shiftLength(Kelly.mon));


function dataToObj(trArr) {
    const shiftPattern = /\d{2}:\d{2}[\s-]{3}\d{2}:\d{2}/;
    const guide = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        let result = {};
        trArr.forEach(tr => {
            let tdArr = Array.from(tr.querySelectorAll('td')).slice(0,8).map(el => el.textContent);
            result[tdArr[0]] = guide.reduce((obj, day, i) => {
                let data = tdArr[i + 1];
                let match;
                if((match = data.match(shiftPattern)) !== null) {
                    obj[day]= match[0]
                    .split(' - ');
                } else {
                    obj[day] = '';
                }
                return obj;
            }, {})
        });
        return result;
    }


    function shiftLength(shiftTimesArr) {
        let [sh, sm] = shiftTimesArr[0].split(':').map(Number);
        let [eh, em] = shiftTimesArr[1].split(':').map(Number);
        return `${eh - sh}:${em - sm}`;
    }
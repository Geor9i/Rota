// let tableCollection = Array.from(document.querySelectorAll('table'));
// let [managerTable, tmTable] = [tableCollection[10], tableCollection[12]];

// managerTable = getTr(managerTable).slice(3);
// tmTable = getTr(tmTable).slice(3);

// let rota = {};

// function getShiftData(tr) {
//     const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     let tdArr = Array.from(tr.querySelectorAll('td')).slice(0, 8);
//     let name = tdArr[0].textContent.toLowerCase();
//     rota[name] = {};
//     weekdays.forEach((weekday, i) => {
//         rota[name][weekday] = tdArr[i + 1].textContent;
//     })
//     return tdArr;
// }

// function getTr(table) {
//     return Array.from(table.querySelectorAll('tr'));
// }

// getShiftData(managerTable[0]);

// console.log(rota);


const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


let result = weekdays.reduce((acc, curr, i) => {
    acc[curr] = i;
    return acc;
}, {});

console.log(result);
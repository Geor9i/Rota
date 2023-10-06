const rawRota = require('./raw.js');

const rawPerson = /(?<firstname>[A-Za-z]+[^\n])[^\S\r\n](?<surname>[A-Za-z]+)?(?<data>.+?\d{2}:\d{2}[^\n,]+)/g;

let rota = {};

let match;
while((match = rawPerson.exec(rawRota))!== null) {
  rota[match.groups.firstname] = {
    surname: match.groups.surname,
    data: match.groups.data
  }
}

console.log(JSON.stringify(rota));


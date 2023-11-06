export let tableArr = Array.from(document.querySelectorAll('table'));
import { workingHours, staffList, positionHierarchy, events } from "./config/KFCDetails.js";
import { Business } from "./business/business.js";
import { Rota } from "./rotaProcessing/rota.js";

Business
const KFC = new Business('Farnborough KFC');
KFC.positionHierarchy(positionHierarchy);
KFC.workHours = KFC.workDaysAndTimes(workingHours);
KFC.employee().addMany(staffList)
KFC.event(events).add();

const rota = new Rota(KFC);
console.log(rota);
rota.create('24/10/23', 503)



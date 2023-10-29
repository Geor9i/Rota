class Staff {
    constructor(storeDetails) {
        this.list = {};
        this.storeDetails = storeDetails;
    }

   .string.format(...strings) {
        if (strings.length === 1) {
            return strings[0].trim().toLowerCase();
        }
        return strings.map(str => str.trim().toLowerCase())
    }

    employee () {
        return {
            add: (firstName, surname, positions, roleType, availability) => {
                if (!Array.isArray(positions)) {
                    throw new Error('Positions must be an array!')
                }
                if (!Array.isArray(availability)) {
                    throw new Error('availability must be an array!')
                }
                if (roleType !== 'partTime' || roleType !== 'fulltime') {
                    throw new Error('Enter fullTime/partTime roleType!')
                }

                firstName = this.string.format(firstName);
                surname = this.string.format(surname);
                if (this.list.hasOwnProperty(`${firstName} ${surname}`)) {
                    throw new Error('Employee with the same name is employed');
                }
        
                this.list[`${firstName} ${surname}`] = {
                    positions,
                }
            },
            remove: (name) => {
                let employee = this.employee().findByName(name, {asString: true});
                delete this.list[employee];
            },

            findByName: (name, options) => {
                name = this.string.format(name)
                let namesArr = Object.keys(this.list).filter(n => n.includes(name));
                if (namesArr.length === 1) {
                    let fullName = namesArr[0];
                    return options?.asString ? fullName : this.list[fullName];
                } else if (namesArr.length > 1) {
                    throw new Error ('More than one match found! Please enter fullName!')
                } else {
                    throw new Error (`Cannot find ${name}`);
                }
            },
            get: (name) => {
                if (typeof name === 'string') {
                    name = this.employee().findByName(name);
                    return name;
                }
                throw new Error (`Name must be of type String`)
            },
            isInList: (dataObj) => {
                let scheduleArr = Object.values(this.list);
                let result = scheduleArr.find((el) => {
                    return JSON.stringify(dataObj) === JSON.stringify(el)
                });
                return result ? true : false;
            }
        }
    }

}

export const staff = new Staff()
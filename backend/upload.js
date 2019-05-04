const moment = require("moment");

function register(csv) {
    const list = [];
    let counter = 1;
    const lines = csv.split(/\r?\n/);
    for (let i = 1; i < lines.length - 1; i++) {
        const attr = lines[i].split(';');
        if (attr[0] === "") continue;
        const dateOfBirth = moment(attr[5], "DD.MM.YYYY");
        const year = dateOfBirth.year();
        //todo change current year
        const age = 2019 - year;
        const category = `${attr[6].toLowerCase()}${age < 7 ? 7 : age > 16 ? 16 : age}`;
        list.push({
            number: counter,
            firstname: attr[4],
            surname: attr[3],
            year: year,
            schoolClass: attr[0].substr(1),
            category: category,
            state: 1,
            time: 0.0
        });
        counter += 1;
    }
    return list;
}

module.exports = {
    'register': register
};
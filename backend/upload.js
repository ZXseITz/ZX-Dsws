const moment = require("moment");

function register(csv) {
    const list = [];
    const lines = csv.split(/\r?\n/);
    for (let i = 1; i < lines.length - 1; i++) {
        const attr = lines[i].split(';');
        if (attr[0] === "") continue;

        const dateOfBirth = moment(attr[5], "DD.MM.YYYY");
        const year = dateOfBirth.year();
        //todo change current year
        const [category, distance] = running(attr[6], year, 2019);
        list.push({
            firstname: attr[4],
            surname: attr[3],
            year: year,
            schoolClass: attr[0].substr(1),
            category: category,
            distance: distance,
            time: 0,
        })
    }
    return list;
}

function running(sex, year, currentYear) {
    const y = currentYear - year;
    const categoryYear = y < 7 ? 7 : y > 16 ? 16 : y;
    const category = `${sex.toUpperCase()}${categoryYear}`;
    const distance = y < 10 ? 50 : y > 13 ? 80 : 60;
    return [category, distance];
}

module.exports = {
    'register': register
};
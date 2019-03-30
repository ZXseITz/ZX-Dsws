function csvToJson(csv) {
    const list = [];
    const lines = csv.split(/\r?\n/);
    for (let i = 1; i < lines.length - 1; i++) {
        const attr = lines[i].split(';');
        if (attr[0] === "") continue;
        const dt = attr[5].split('.');
        list.push({
            firstname: attr[4],
            surname: attr[3],
            dateOfBirth: `${dt[2]}-${dt[1]}-${dt[0]}`,
            sex: attr[6],
            schoolClass: attr[0].substr(1),
            category: "undef",
            distance: 0,
            time: 0,
        })
    }
    return list;
}

module.exports = {
    'csvToJson': csvToJson
};
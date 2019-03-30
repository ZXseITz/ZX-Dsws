function csvToJson(csv) {
    const list = [];
    csv.split(/\r?\n/).forEach(line => {
        const attr = line.split(';');
        list.push({
            firstname: attr[4],
            surname: attr[3],
            sex: attr[6],
            schoolClass: attr[0].substr(1),
            category: "",
            distance: 0,
            time: 0,
        })
    });
    return list;
}

module.exports = {
    'csvToJson': csvToJson
};
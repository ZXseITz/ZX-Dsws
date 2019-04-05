const MongoClient = require('mongodb').MongoClient;

const config = require('config.json');

connect = url => MongoClient.connect(url).then(client => client.db(config['database']));

module.exports = async () => {
    let dbs = await Promise.all([connect(config['uri']), connect(config['uriAdmin'])]);
    console.log('Connected to databases');
    return {
        db: dbs[0],
        dbAdmin: dbs[1]
    }
};

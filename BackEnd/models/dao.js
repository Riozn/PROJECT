const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'GesEven',
  user: 'postgres',
  password: '021147'
});

class DAO {
  consultar(sql, params = []) {
    return db.any(sql, params);
  }

  getDb() {
    return db;
  }
}

module.exports = DAO;

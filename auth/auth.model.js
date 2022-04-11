const mysql = require("mysql");
const connectionProperties = {
  host: "localhost",
  user: "root",
  password: "masterkey",
  database: "movie-db",
};


class Database {
  constructor(connectionProperties) {
    this.connection = mysql.createConnection(connectionProperties);
  }
  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
  queryClose(sql, params) {
    const ret = this.query(sql, params);
    this.close();
    return ret;
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}

function get(username) {
  const user = users.find((user) => user.username === username);
  return user ? Object.assign({}, user) : null;
}

async function getFromDatabase(username) {
  const database = new Database(connectionProperties);
  const ret = await database.queryClose(
    `SELECT * from users where users.username = ?`,
    [username]
  );
  console.log(ret[0]);
  return ret[0];
}

module.exports = { get, getFromDatabase };

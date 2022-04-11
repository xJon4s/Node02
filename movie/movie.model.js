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

function remove(id) {
  data = data.filter((movie) => movie.id !== id);
}
function get(id) {
  return data.find((movie) => movie.id === id);
}
async function save(movie) {
  console.log(movie);
  if (movie.id === "-1") {
    const database = new Database(connectionProperties);
    return database.queryClose(
      `INSERT INTO movies (title, year, published, owner) VALUES (?, ?, ?, ?)`,
      [movie.title, movie.year, movie.published, movie.owner]
    );
  } else {
    const database = new Database(connectionProperties);
    return database.queryClose(
      `UPDATE movies SET title = ?, year = ?, published = ? WHERE id = ?`,
      [movie.title, movie.year, movie.published, movie.id]
    );
  }
}
function getAllDatabase(user) {
  const database = new Database(connectionProperties);
  return database.queryClose(
    `Select movies.*, username from movies, users where movies.owner = users.id AND (published = TRUE OR username = ?) Order by title`,
    [user?.username]
  );
}

async function getFromDatabase(id) {
  const database = new Database(connectionProperties);
  return database.queryClose(
    `SELECT movies.*, users.username FROM movies,users WHERE movies.id = ? AND movies.owner = users.id`,
    [id]
  );
}

async function getAllDatabaseAsync(user) {
  try {
    const database = new Database(connectionProperties);
    const sql = `Select movies.*, username from movies, users where movies.owner = users.id AND (published = TRUE OR username = ?) Order by title`;
    const result = await database.queryClose(sql, [user?.username]);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function saveToDatabase(movie) {
  if (movie.id === "-1") {
    movie.id = uuid();
    data.push(movie);
  } else {
    data = data.map((item) => (item.id === movie.id ? movie : item));
  }
}

module.exports = {
  getAllDatabase,
  remove,
  get,
  save,
  getAllDatabaseAsync,
  getFromDatabase,
  saveToDatabase,
};

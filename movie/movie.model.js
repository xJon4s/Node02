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
  const database = new Database(connectionProperties);
  return database.queryClose(`DELETE FROM movies WHERE id = ?`, [id]);
}

function get(id) {
  return data.find((movie) => movie.id === id);
}
async function save(movie) {
  const database = new Database(connectionProperties);
  if (movie.id === "-1") {
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

/* async function saveToDatabase(movie) {
  if (movie.id === "-1") {
    movie.id = uuid();
    data.push(movie);
  } else {
    data = data.map((item) => (item.id === movie.id ? movie : item));
  }
} */

async function importMovies(movies, user) {
  const sql1 = `START TRANSACTION;`;
  const sql2 = `INSERT INTO movies (title, year, published, owner) VALUES (?, ?, FALSE, ?);`;
  const sql3 = `COMMIT;`;
  const sql4 = `ROLLBACK;`;
  const sql5 = `SELECT * FROM movies WHERE title = ?`;
  try {
    const database = new Database(connectionProperties);
    await database.query(sql1);

    for (movie of movies) {
      const furz = await database.query(sql5, [movie.title]);
      if (furz[0]) {
        throw `Film mit Titel ${movie.title} bereits vorhanden`;
      }
      await database.query(sql2, [movie.title, movie.year, user.id]);
    }

    await database.queryClose(sql3);
    return Promise.resolve();
  } catch (error) {
    try {
      await database.queryClose(sql4);
    } catch (error) {}
    return Promise.reject(error);
  }
}

module.exports = {
  getAllDatabase,
  remove,
  get,
  save,
  getAllDatabaseAsync,
  getFromDatabase,
  importMovies,
};

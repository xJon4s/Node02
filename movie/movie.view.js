function renderList(movies, user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <h1>Filmliste</h1>
    <table>
      ${
        user
          ? "<tr><th>Sie sind angemeldet als " +
            user.username +
            ". Ihr Name lautet " +
            user.firstname +
            " " +
            user.secondname +
            "</th></tr>"
          : "<tr><th>Melden Sie sich an um ihre Filme hinzuzufügen</th></tr>"
      }
      ${
        user
          ? '<td><a href="/logout">Logout</a><a href="/movie/edit">Neuer Film</a><a href="/import">Importiere Filme</a></td>'
          : '<td><a href="/login">Login</a></td>'
      }
    </table>

    <table>
    <tr><th>Id</th><th>Titel</th><th>Jahr</th><th>Öffentlich</th><th>Besitzer</th></tr>
    ${movies
      .map(
        (movie) =>
          `
          <tr><td>${movie.id}</td>
          <td>${movie.title}</td>
          <td>${movie.year}</td>
          <td>${movie.published === 1 ? "true" : "false"}</td>
          <td>${movie.username}</td>
          ${
            user && user.username === movie.username
              ? `<td><a href="/movie/remove/${movie.id}">Löschen</a></td><td><a href="/movie/edit/${movie.id}">Ändern</a></td></tr>`
              : `<td><a href="/movie/view/${movie.id}"">Ansehen</a></td>`
          }
          `
      )
      .join("")}
    </table>
    </body>
    </html>
    `;
}
function renderMovie(movie, user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <h1>Filmliste</h1>
    <table>
      ${
        user
          ? "<tr><th>Sie sind angemeldet als " +
            user.username +
            ". Ihr Name lautet " +
            user.firstname +
            " " +
            user.secondname +
            "</th></tr>"
          : "<tr><th>Melden Sie sich an um ihre Filme hinzuzufügen</th></tr>"
      }
      ${
        user
          ? '<td><a href="/logout">Logout</a><a href="/movie/edit">Neuer Film</a></td>'
          : '<td><a href="/login">Login</a></td>'
      }
    </table>
    <hr>
    <form action="/movie/save" method="post">
    <input type="hidden" name="id" value="${movie[0].id}">
    <div>
    <label for="title">Titel:</label>
    <input type="text" id="title" name="title"
    value="${movie[0].title}">
    </div>
    <div>

    <label for="year">Jahr:</label>
    <input type="text" id="year" name="year"
    value="${movie[0].year}">
    </div>

    <div>
    <label for="public">Öffentlich:</label>
    <input type="checkbox" id="public" name="public" ${
      movie[0].published ? "checked" : ""
    }>
    </div>
    <hr>
    <input type="submit" value="Speichern">
    <a href="/movie">zurück</a>
    </div>
    </form>
    </body>
    </html>
    `;
}

function renderMovieInfo(movie, user) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  <link rel="stylesheet" href="/style.css">
  </head>
  <body>
  <table>
  ${
    user
      ? "<tr><th>Sie sind angemeldet als " +
        user.username +
        ". Ihr Name lautet " +
        user.firstname +
        " " +
        user.secondname +
        "</th></tr>"
      : "<tr><th>Melden Sie sich an um ihre Filme hinzuzufügen</th></tr>"
  }
  ${
    user
      ? '<td><a href="/logout">Logout</a><a href="/movie/edit">Neuer Film</a></td>'
      : '<td><a href="/login">Login</a></td>'
  }
</table>
  <table>
  <tr>
    <td>Titel:</td><td>${movie[0].title}</td>
  </tr>
  <tr>
    <td>Jahr:</td><td>${movie[0].year}</td>
  </tr>
  <tr>
    <td>Öffentlich:</td><td>${movie[0].published ? true : false}</td>
  </tr>
  <tr>
    <td>Besitzer:</td><td>${movie[0].username}</td>
  </tr>
  </table>
  <a href="/movie">Zurück</a>
  </body>
  
  `;
}

function renderFileImport() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <form action="/import " method="post" enctype="multipart/form-data">
      <label for="importfile">Import-Datei:</label>
      <input type="file" id="importfile" name="importfile">
      <input type="submit" value="Importieren">
    </form>
  </body>
  `;
}

module.exports = { renderList, renderMovie, renderMovieInfo, renderFileImport };

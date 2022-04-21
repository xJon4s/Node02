const movieModel = require("./movie.model");
const movieView = require("./movie.view");
async function listAction(request, response) {
  response.send(
    movieView.renderList(
      await movieModel.getAllDatabase(request.user),
      request.user
    )
  );
}

function removeAction(request, response) {
  movieModel.remove(request.params.id);
  response.redirect(request.baseUrl);
}

async function editAction(request, response) {
  let movie = [
    { id: "-1", title: "", year: "", username: request.user.username },
  ];
  if (request.params.id) {
    movie = await movieModel.getFromDatabase(request.params.id);
    console.log(movie);
  }
  if (request.user.username === movie[0].username)
    response.send(movieView.renderMovie(movie, request.user));
  else
    response.send(
      movieView.renderList(
        await movieModel.getAllDatabase(request.user),
        request.user
      )
    );
}

async function viewAction(request, response) {
  const movie = await movieModel.getFromDatabase(request.params.id);
  response.send(movieView.renderMovieInfo(movie, request.user));
}

async function saveAction(request, response) {
  console.log("user", request.user);
  const movie = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    published: request.body.public === "on" ? true : false,
    username: request.user.username,
    owner: request.user.id,
  };
  console.log("user fertig");
  await movieModel.save(movie);
  response.redirect(request.baseUrl);
}

async function importAction(request, response) {
  response.send(movieView.renderFileImport());
}

async function importIntoDBAction(request, response) {
  try {
    let movies;
    movies = JSON.parse(request.files.importfile.data.toString("ascii"));
    try {
      await movieModel.importMovies(movies, request.user);
      response.send(movieView.renderMeldung("Filme erfolgreich importiert"));
    } catch (error) {
      response.send(movieView.renderMeldung(error));
    }
  } catch (error) {
    response.send(movieView.renderMeldung("Falsches JSON-Format"));
  }
}
module.exports = {
  listAction,
  removeAction,
  editAction,
  saveAction,
  viewAction,
  importAction,
  importIntoDBAction,
};

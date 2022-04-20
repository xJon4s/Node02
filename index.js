const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const fileUpload = require('express-fileupload');
app.use(fileUpload());

const authController = require('./auth/auth.controller');
authController(app);

const movieRouter = require('./movie/movie.router');
app.use('/movie', movieRouter);

app.get('/', (request, response) => response.redirect('/movie'));
app.use(express.static(__dirname));
app.listen(8080, () => console.log('Server listen on port 8080'));
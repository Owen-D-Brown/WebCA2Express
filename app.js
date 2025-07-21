var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Importing our routes.
var indexRouter = require('./routes/pokedexRoute');
var usersRouter = require('./routes/usersRoute');
var pokemonRouter = require('./routes/viewPokemonRoute');

//Creating the express server instance.
var app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Landing page route going to index.ejs
app.get('/', async (req, res) => {
  try {
    const { initPokemonCacheIfNeeded, getHomepagePokemonInfo } = await import('./services/getPokemon.mjs');
    await initPokemonCacheIfNeeded();

    const ids = [];
    for (let i = 1; i <= 30; i++) ids.push(i);
    const homepageMons = await getHomepagePokemonInfo(ids); // or use getHomepageInfo()

    res.render('index', { homepageMons });  // render EJS with mons
  } catch (err) {
    console.error("Failed to load cache:", err);
    res.status(500).send("Server error");
  }
});

//Telling the server to use the routes.
app.use('/pokedex', indexRouter);
app.use('/users', usersRouter);
app.use('/pokemon', pokemonRouter);

//CREATED BY THE IDE.
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

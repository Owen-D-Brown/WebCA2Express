

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indexActual.html'));
});

app.use('/pokedex', indexRouter);
app.use('/users', usersRouter);


/*app.get('/getPokemon', async (req, res) => {
  try {
    // Dynamically import the getPokemon module
    const { sendPokemon } = await import('./services/getPokemon.mjs');

    // Call the sendPokemon function to get the data
    var final = await sendPokemon(1);
    for(i = 2; i<40; i++) {
      var rows = await sendPokemon(i);  // Assuming sendPokemon returns the table rows
      final += rows;
    }
    // Send the table rows to the client
    res.send(final);
  } catch (error) {
    console.error('Error loading getPokemon module or fetching data:', error);
    res.status(500).send('Failed to fetch Pokémon data');
  }
});*/




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

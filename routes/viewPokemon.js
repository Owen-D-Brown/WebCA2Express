var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', async function(req, res, next) {
  try {
    const { getDetailedPokemonInfo } = await import('../services/getPokemon.mjs'); // Await the import


    let pokemon = await getDetailedPokemonInfo([1]);



    res.render('viewPokemon', {pokemon : pokemon})

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error); // Pass the error to Express error handler
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const { getDetailedPokemonInfo } = await import('../services/getPokemon.mjs'); // Await the import

    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
      return res.status(400).send('Invalid Pokémon ID');
    }

    let pokemon= await getDetailedPokemonInfo([id]);

    res.render('viewPokemon', {pokemon : pokemon})

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error); // Pass the error to Express error handler
  }
});







module.exports = router;

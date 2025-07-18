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

router.get('/update/pokemon/:id', async function(req, res, next) {
  console.log("trying to fetch pokemon updates")
  try {
    const { getDetailedPokemonInfo } = await import('../services/getPokemon.mjs');
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await getDetailedPokemonInfo(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

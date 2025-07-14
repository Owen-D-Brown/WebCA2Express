var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', async function(req, res, next) {
  try {
    const { sendSinglePokemon } = await import('../services/getPokemon.mjs'); // Await the import


    let pokemonData = await sendSinglePokemon([1]);
    const pokemon = JSON.stringify(pokemonData[0]);
    console.log(pokemonData);
    pokemonData = pokemonData[0];
    res.render('viewPokemon', {pokemon : pokemon, pokemonData : pokemonData})

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error); // Pass the error to Express error handler
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const { sendSinglePokemon } = await import('../services/getPokemon.mjs'); // Await the import

    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
      return res.status(400).send('Invalid Pokémon ID');
    }

    let pokemonData = await sendSinglePokemon([id]);
    const pokemon = JSON.stringify(pokemonData[0]);
    console.log(pokemonData);
    pokemonData = pokemonData[0];

    res.render('viewPokemon', {pokemon : pokemon, pokemonData : pokemonData})

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error); // Pass the error to Express error handler
  }
});



router.post('/update', async (req, res) => {

  const startIndex = req.body.startIndex;
  const endIndex = req.body.endIndex;
  console.log(`Fetching Pokémon from ID ${startIndex} to ${endIndex}`);

  try {
    const { sendSinglePokemon } = await import('../services/getPokemon.mjs'); // Await the import
    let mons = [];
    let pokeReq = [];
    console.log("start id "+startIndex)
    // Fetch Pokémon data for IDs from startIndex to endIndex (inclusive)
    for (let i = startIndex; i <= endIndex; i++) {
       pokeReq.push(i);
    }
    const pokemonData = await sendSinglePokemon(pokeReq);  // Await each API call

    // Send the array of Pokémon data back to the client
    res.json(pokemonData);

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Pokémon' });
  }
});



module.exports = router;

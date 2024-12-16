var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', async function(req, res, next) {
  try {
    const { sendPokemon } = await import('../services/getPokemon.mjs'); // Await the import

    let mons = [];
    let indexes = []
    // Fetch Pokémon data for IDs 1 through 39
    for (let i = 1; i < 21; i++) {
      indexes.push(i)
    }
    let pokemonData = await sendPokemon(indexes); // Await each call
 // Directly push the Pokémon data object
    nonJsonMons = pokemonData

    pokemonData = JSON.stringify(pokemonData)
    // console.log(mons)
    // Render the EJS template with the Pokémon data
    res.render('index', { pokemon: pokemonData, nonJsonPokemon : nonJsonMons }); // Pass the array directly
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
    const { sendPokemon } = await import('../services/getPokemon.mjs'); // Await the import
    let mons = [];
    let pokeReq = [];
    console.log("start id "+startIndex)
    // Fetch Pokémon data for IDs from startIndex to endIndex (inclusive)
    for (let i = startIndex; i <= endIndex; i++) {
       pokeReq.push(i);
    }
    const pokemonData = await sendPokemon(pokeReq);  // Await each API call

    // Send the array of Pokémon data back to the client
    res.json(pokemonData);

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Pokémon' });
  }
});



module.exports = router;

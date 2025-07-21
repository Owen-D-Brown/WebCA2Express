var express = require('express');
var router = express.Router();
var path = require('path');

/*This is the router for the pokedex view.*/

//Get /pokedex
router.get('/', async function(req, res, next) {
  try {
    
    //Get the exported helper function from our middlewhere DAO.
    const { getMultiplePokemonInfo } = await import('../services/getPokemon.mjs');

    //Create arrays for the pokemon we recieve, and an array for the ids we're looking for. This route loads on first visit, so we get the first 20 pokemon. Update requests go to the below route.
    let mons = [];
    let indexes = []
 
    for (let i = 1; i < 21; i++) {
      indexes.push(i)
    }
    
    //Getting the pokemon data through our middlewhere from there pokeAPI.
    let pokemonData = await getMultiplePokemonInfo(indexes); // Await each call

    //Rendering the ejs page for the client in the response, passing the newly aquired pokemon data to it. 
    res.render('pokedex', { pokemon: pokemonData});
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error);
  }
});

// /Update - called when a user clicks one of the pagination buttons and new pokemon need to be sent to the client.
router.post('/update', async (req, res) => {

  //Getting the data out of the post body.
  const startIndex = req.body.startIndex;
  const endIndex = req.body.endIndex;
  
  console.log(`Fetching Pokémon from ID ${startIndex} to ${endIndex}`);

  //Getting the new mons, and going through the same process of getting the new mons.
  try {
    const { getMultiplePokemonInfo } = await import('../services/getPokemon.mjs'); // Await the import
    let mons = [];
    let pokeReq = [];
    for (let i = startIndex; i <= endIndex; i++) {
       pokeReq.push(i);
    }
    const pokemonData = await getMultiplePokemonInfo(pokeReq);  // Await each API call

    //Rather than having a whole new render, we send the new pokemon's information as json to the client, and update it on their side
    res.json(pokemonData);

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Pokémon' });
  }
});

module.exports = router;

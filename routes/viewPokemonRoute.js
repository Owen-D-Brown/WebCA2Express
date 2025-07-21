var express = require('express');
var router = express.Router();
var path = require('path');

/*This is the route for the main view pokemon view.*/

//Get the default landing page for this route. this is the same as /update/pokemon/1


// /Update route to get the pokemon with a relevant id recieved from the client.
router.get('/update/pokemon/:id', async function(req, res, next) {
  try {
    const { getDetailedPokemonInfo } = await import('../services/getPokemon.mjs');
    const id = parseInt(req.params.id);

    //This was here for the intended search by name function but it never came to fruition.
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await getDetailedPokemonInfo(id);
    
    //Like with the pokedex, we're sending the result back from the server as json not a new render. It will be rendered client-side.
    res.json(result);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//This is the default router for this. the view pokemon page should always be requested with an id. There is no way to view it client side without one.
router.get('/:id', async function(req, res, next) {
  try {
    const { getDetailedPokemonInfo } = await import('../services/getPokemon.mjs'); // Await the import
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      return res.status(400).send('Invalid Pokémon ID');
    }
    let pokemon= await getDetailedPokemonInfo([id]);

    //This is intended for a first load route, so we render the page as opposed to send back json.
    res.render('viewPokemon', {pokemon : pokemon})

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    next(error); // Pass the error to Express error handler
  }
});

module.exports = router;

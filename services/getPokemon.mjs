import {json} from "express";
import fetch from 'node-fetch';

/*This is the main piece of middlewhere and where my REST API calls are made.*/

//Master function to call the API and store the results in a local in-memory cache. Middleware will check if a requested resource is cached, and cherry pick values needed if it is.
//If not, it will call this method.
//This method must take in an ID argument, either the ID of the pokemon requested, or a string of the pokemon's name.
//It is possible to request and recieve multiple mon's jsons in one call.
//The cache will store the pokemon's id, and their object in a KVP. It will also store the mon's name and ID as a KVP for the intended search by name feature that I pushed back. This would have a pointer to the actual ID record, rather than duplication records.
const cache = new Map();

//Add a pokemon to the cache
async function addPokemonToCache(id) {

    //Here we are making the actual API call. The code will not get here until the cache has been checked.
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);//String interpolation for cleaner code.
    if(!response.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${response.status}`);
    }

    const pokemonData = await response.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    if(!speciesResponse.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${speciesResponse.status}`);
    }
    const dexDescriptions = await speciesResponse.json();
    const flavorText = [...new Set(
        dexDescriptions.flavor_text_entries
            .filter(entry => entry.language.name === 'en')
            .map(entry => entry.flavor_text.replace(/\f/g, ' '))//Used GenAI to help with this. I was weird spacing from the api from form feed characters.
    )];//New array / set that splits up the items in the JSON into individual entires, rather than making a set of one large json object

    //Putting it all together and pushing to the cache.
    const fullPokemonData = {
        ...pokemonData,
        descriptions: flavorText
    };
    cache.set(pokemonData.id, fullPokemonData);
    cache.set(pokemonData.name.toLowerCase(), pokemonData.id);
}

//Get a pokemon JSON object from the cache
function getPokemonFromCache(id) {
    let result;
    if (!isNaN(id)) {
        result = cache.get(Number(id));
    } else {
        const idFromName = cache.get(id.toLowerCase());
        result = cache.get(idFromName);
    }
    return result;
}

//Primary helper function that sits between the exported functions and the internal helpers. This attempts to get a pokemon from the cache. If it isn't there, it will add it to the cache, then request it from the cache. 
//There is definitely a way to return the pokemon as needed without rehitting the cache, but I didn't design it that way initially.
async function getPokemon(id) {
    let pokemon = await getPokemonFromCache(id);
    if(!pokemon) {
        await addPokemonToCache(id);
        pokemon = await getPokemonFromCache(id);
        console.log("missed the cache")
    } else {
        console.log("hit the cache")
    }
    return pokemon;
}

//Get simple pokemon JSON object
async function getSimplePokemonInfo(id) {
    let pokemon = await getPokemon(id);
    return {
        image:  pokemon.sprites.other["official-artwork"].front_default,
        name: capitalizeFirstLetter(pokemon.name),
        type: pokemon.types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
        height: pokemon.height,
        weight: pokemon.weight,
        dexNo: pokemon.id,
        stats: pokemon.stats
    }
}

//Capitalize first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//This is a function for getting all the pokemon information for the carousel on the home page. 
async function getHomepageInfo(id) {
    let pokemon = await getPokemon(id);
    return {
        name: capitalizeFirstLetter(pokemon.name),
        sprite: pokemon.sprites.front_default,
        id: pokemon.id
    }
}

//First exported function. This is what gets all the information for the homepage carousel. This is what returns the info to the route to send to the client.
export async function getHomepagePokemonInfo() {
    const ids = [];
    for (let i = 1; i <= 30; i++) {
        ids.push(i);
    }
    let pokemon = await Promise.all(ids.map(id => getHomepageInfo(id)));
    return pokemon;
}

//This is what populates the cache with the inital pokemon needed on the home page. Also exported.
let cacheInitialized = false;
export async function initPokemonCacheIfNeeded() {
    if (cacheInitialized) return;
    const preloadIDs = [];
    for (let i = 1; i <= 30; i++) {
        preloadIDs.push(i);
    }
    await getMultiplePokemonInfo(preloadIDs); // This does all the work
    cacheInitialized = true;
    console.log("Pokémon cache preloaded with first 30 entries.");
}

//Export function for the pokedex page.
export async function getMultiplePokemonInfo(ids) {
    const results = await Promise.all(ids.map(id => getSimplePokemonInfo(id)));
    return results;
}

//Get detailed pokemon JSON object. Used for viewPokemon.
export async function getDetailedPokemonInfo(id) {
    let pokemon = await getPokemon(id);
    return {
        image: pokemon.sprites.other["official-artwork"].front_default,
        shiny: pokemon.sprites.other["official-artwork"].front_shiny,
        name: capitalizeFirstLetter(pokemon.name),
        type: pokemon.types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
        height: pokemon.height,
        weight: pokemon.weight,
        dexNo: pokemon.id,
        descriptions: pokemon.descriptions,
        cry: pokemon.cries.latest,
        stats: pokemon.stats,
        moves: pokemon.moves.map(m => capitalizeFirstLetter(m.move.name)),
        abilities: pokemon.abilities.map(a => {
            const name = capitalizeFirstLetter(a.ability.name);
            return a.is_hidden ? `${name} (Hidden)` : name;
        })
    }
}





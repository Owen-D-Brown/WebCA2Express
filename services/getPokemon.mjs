
import {json} from "express";
import fetch from 'node-fetch';


//Master function to call the API and store the results in a local in-memory cache. Middleware will check if a requested resource is cached, and cherry pick values needed if it is.
//If not, it will call this method.
//This method must take in an ID argument, either the ID of the pokemon requested, or a string of the pokemon's name.
//It is possible to request and recieve multiple mon's jsons in one call.
const cache = new Map();

//Add a pokemon to the cache
async function addPokemonToCache(id) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);//String interpolation for cleaner code.
    if(!response.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${response.status}`);
    }

    const pokemonData = await response.json();
    console.log(pokemonData);
    const speciesResponse = await fetch(pokemonData.species.url);
    if(!speciesResponse.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${speciesResponse.status}`);
    }
    const dexDescriptions = await speciesResponse.json();
    const flavorText = [...new Set(
        dexDescriptions.flavor_text_entries
            .filter(entry => entry.language.name === 'en')
            .map(entry => entry.flavor_text.replace(/\f/g, ' '))
    )];//New array / set that splits up the items in the JSON into individual entires, rather than making a set of one large json object

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

export async function getMultiplePokemonInfo(ids) {
    const results = await Promise.all(ids.map(id => getSimplePokemonInfo(id)));
    return results;
}

//Get detailed pokemon JSON object
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


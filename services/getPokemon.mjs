
import {json} from "express";
import fetch from 'node-fetch';


async function getDetailedPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);//String interpolation for cleaner code.
    if(!response.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${res.status}`);
    }
    const pokemonData await response.json();
    const speciesResponse = await fetch(pokemonData.species.url);
    if(!speciesResponse.ok) {
        throw new Error(`Pokemon API fetch request failed with ${id}: ${res.status}`);
    }
    const dexDescriptions = await speciesResponse.json();
    const flavorText = [...new Set(dexDescriptions)];//New array / set that splits up the items in the JSON into individual entires, rather than making a set of one large json object. I didn't know about the ... operator until now.

    /*
    DEV NOTE
    I've been revamping an old invoice generator project of mine and remodeled the architecture using MVC and DAO patterns.
    I've realised that this is the same thing, except instead of parsing a database object to a java one, we're taking an API response, parsing it to JSON,
    then cherry picking the values we need for our own regular JSON object to work with going forward. Similar to creating POJOs from database records.
    */

    let pokemonResponse = {
        image: mon[i].sprites.front_default,
        name: capitalizeFirstLetter(mon[i].name),
        type: mon[i].types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
        height: mon[i].height,
        weight: mon[i].weight,
        dexNo: mon[i].id,
        descriptions: descriptions
    }

}

// Fetch Pokémon data
async function getPokemon(i) {
    try {

        let mon = await p.getPokemonByName(i); // Fetch Pokémon by ID


        // Return formatted Pokémon data
        let pokemonArray = [];

        for(let i = 0; i<mon.length; i++) {

            let url = mon[i].species.url;


            let pokeInstance = {
                image: mon[i].sprites.front_default,
                name: capitalizeFirstLetter(mon[i].name),
                type: mon[i].types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
                height: mon[i].height,
                weight: mon[i].weight,
                stats: mon[i].stats
            };
            console.log("url "+mon[0].species.url)
            pokemonArray.push(pokeInstance);
        }
        return pokemonArray;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        throw new Error('Failed to fetch Pokémon data');
    }
}

async function getSinglePokemon(i) {
    try {

        let mon = await p.getPokemonByName(i); // Fetch Pokémon by ID


        // Return formatted Pokémon data
        let pokemonArray = [];

        for(let i = 0; i<mon.length; i++) {

            let url = mon[i].species.url;
            const speciesResponse = await fetch(url);
            const speciesData = await speciesResponse.json();

            const dexDescriptions = speciesData.flavor_text_entries.filter(e => e.language.name === 'en').map(e=> e.flavor_text.replace(/\f|\n|\r/g, ' ').trim());

            const descriptions = [...new Set(dexDescriptions)];

            let pokeInstance = {
                image: mon[i].sprites.front_default,
                name: capitalizeFirstLetter(mon[i].name),
                type: mon[i].types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
                height: mon[i].height,
                weight: mon[i].weight,
                dexNo: mon[i].id,
                descriptions: descriptions
            };
           // console.log(descriptions[0]);
            pokemonArray.push(pokeInstance);
        }
        return pokemonArray;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        throw new Error('Failed to fetch Pokémon data');
    }
}


// Capitalize first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export the function that will be used in the Express route
export async function sendPokemon(i) {

    try {
        const pokemonData = await getPokemon(i);  // Fetch Pokémon data

        return pokemonData;  // Return the Pokémon data as JSON
    } catch (error) {
        console.error('Error in sendPokemon function:', error);
        throw new Error('Failed to generate Pokémon data');
    }
}

export async function sendSinglePokemon(i) {
    try {
        const pokemonData = await getSinglePokemon(i);
        return pokemonData;
    } catch (error) {
        console.error('Error in sendPokemon function:', error);
        throw new Error('Failed to generate Pokémon data');
    }
}
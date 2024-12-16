import Pokedex from 'pokedex-promise-v2';
import {json} from "express";


const p = new Pokedex();

// Fetch Pokémon data
async function getPokemon(i) {
    try {

        let mon = await p.getPokemonByName(i); // Fetch Pokémon by ID

        // Return formatted Pokémon data
        let pokemonArray = [];

        for(let i = 0; i<mon.length; i++) {



            let pokeInstance = {
                image: mon[i].sprites.front_default,
                name: capitalizeFirstLetter(mon[i].name),
                type: mon[i].types.map(t => capitalizeFirstLetter(t.type.name)).join(' / '), // Join types
                height: mon[i].height,
                weight: mon[i].weight,
                stats: mon[i].stats
            };
            console.log(pokeInstance.stats)
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
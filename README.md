# Pokémon Explorer (Node.js + Express + EJS)

A lightweight web app that browses Pokémon data from the public [PokeAPI](https://pokeapi.co/). Built for learning REST APIs, server-side rendering with EJS, and progressive enhancement on the client without heavy frameworks.

---

## Features
- Browse Pokémon by ID or name (e.g., `/pokemon/25`)
- Details view with stats, abilities, sprites, types, and height/weight
- Prev/Next navigation that updates content without a full page reload
- Sprite carousel implemented
- Server-side caching of PokeAPI responses (in-memory) 
- MVC-style separation: routes → controllers → services

Note: Early versions used the `pokedex-promise-v2` wrapper. Current code demonstrates raw `fetch` to align with assignment goals.

---

## Tech Stack
- Node.js 18+ (works on 20+)
- Express
- EJS templates
- Plain CSS
- Vanilla JavaScript for progressive enhancements
- Native `fetch` (or `node-fetch` for older Node versions)
- nodemon

---

## Routes
- GET `/` – Home and search form with featured Pokémon  
- GET `/pokemon/:id` – Pokémon details (by ID or name)  
---

## Service Layer
`src/services/pokeapi.service.js` centralizes all API calls and caching so other parts of the app do not call PokeAPI directly.

Responsibilities:
- Build URLs (e.g., `${POKEAPI_BASE}/pokemon/${id}`)
- Apply caching with key
- Map API data into view-friendly objects

---

## License
MIT — use and adapt freely.

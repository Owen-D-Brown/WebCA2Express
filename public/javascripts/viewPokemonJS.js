/*
This class contains the code for the view pokemon page. ie. the detailed pokemon view. It includes:
-Playing the pokemon's audio.
-Switching the pokemon's sprite.
-Creating a chartJS bar chart out of the pokemons stats.
-Calling the server when the user navigates backwards or forwards, updating to a new pokemon.  
 */

//Gettubg the actual pokemon cry audio from the DOM, and the button for it.
const audio = document.getElementById("cry");
const audioBtn = document.getElementById("cryBtn");

//Adding the click event listener to the but ton that plays the audio. Could have done this inline in the ejs - I don't think there's too much of a difference.
cryBtn.addEventListener('click', () => {
    cry.currentTime = 0;
    cry.play();
    cryBtn.classList.add('playing');//While the audio is playing, apply a style to the button to show it's in use.
});

//Add an event listener to the cry audio. When the audio file ends, we remove the playing style to revert to the pre-play style.
cry.addEventListener('ended', () => {
    cryBtn.classList.remove('playing');
});

//Set up for the shiny sprite swap. We track the state of the sprite using a boolean.
let shiny = false;

//Getting the regular and shiny sprites from the pokemon json.
let regularSprite = pokemon.image;
let shinySprite = pokemon.shiny;

//Getting the container the sprite populates, and the button from the dom.
const spriteBtn = document.getElementById("spriteBtn");
const spriteImageArea = document.getElementById("pokemon-sprite-area");

//Function to swap the sprites around on button click.
function switchSprite() {
 if(!shiny) {//If not shiny
     shiny = true;
     spriteImageArea.src = shinySprite;//Change image to shiny sprite.
     spriteBtn.classList.add('playing');//Apply playing style to button.
 } else {//If shiny
     shiny = false;
     spriteImageArea.src = regularSprite;//Change sprite to regular one.
     spriteBtn.classList.remove('playing');//Remove playing.
 }
}

//Getting the pokemon's stats from the json.
let stats = pokemon.stats.map(s => s.base_stat);

//Getting the pokemon's labels for the chart, ie. stat name.
const labels = pokemon.stats.map(s => s.stat.name.toUpperCase());

//Gettubg the stats chart canvas from the html/ejs/dom.
const ctx = document.getElementById('statsChart').getContext('2d');

//Creating the stats bar chart using chartJS. Generative AI was used in the assistance of generating and styling this chart.
let statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Base Stat',
            data: stats,
            backgroundColor: 'rgba(0, 255, 255, 0.6)',  // neon cyan
            borderColor: 'rgba(0, 255, 255, 1)',
            borderWidth: 2,
            borderRadius: 8,
            barPercentage: 0.7,
            categoryPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#00ffff',
                borderWidth: 1,
                padding: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 200,
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.15)'
                }
            },
            x: {
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    }
});

//Add an event to the page that triggers when it loads.
document.addEventListener('DOMContentLoaded', () => {

    //Gets the id of the pokemon currently being viewed and stores it in currentID.
    let currentID = window.pokemonSearchID;

    //Getting the previous and next buttons and adding a click to them. On click, update the currentID and call updatePokemon.
    document.getElementById('prevBtn').addEventListener('click', () => {
        if(currentID > 1) {
            updatePokemon(--currentID);
        }
    })
    document.getElementById('nextBtn').addEventListener('click', () => {
        updatePokemon(++currentID);
    })
})

//Function for updating the page when the user navigates to a new pokemon.
async function updatePokemon(currentID) {

    //Put forward a fetch request to the server looking for the /pokemon/currentID route.
    try {
        const response = await fetch(`/pokemon/update/pokemon/${currentID}`);
        if(!response.ok) {
            throw new Error("Pokemon not found.");
        }

        //Getting the new pokemon data as json.
        const data = await response.json();

        //Giving that data to the render pokemon method.
        renderPokemon(data);

    } catch (error) {
        console.error(error);
    }
}

//Method for upating the stats chart on the page when a new pokemon is loaded. Just reinitializing the first chart wasn't working - I needed to manualy destroy and recreate it.
function updateStatsChart(stats) {
    if (statsChart) {
        statsChart.destroy();
    }
    const values = stats.map(s => s.base_stat);
    const ctx = document.getElementById('statsChart').getContext('2d');

    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Base Stat',
                data: values,
                backgroundColor: 'rgba(0, 255, 255, 0.6)',  // neon cyan
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 2,
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#00ffff',
                    borderWidth: 1,
                    padding: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(0, 255, 255, 0.15)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

//Method for updating the page when a new pokemon is sent back from the server on a navigation request.
function renderPokemon(data) {

    //Updating the sprite containers for the new pokemon.
    regularSprite = data.image;
    shinySprite = data.shiny;

    //Reseting the shiny boolean.
    shiny = false;

    //Modifying the various label fields on the page to populate it with the new values.
    document.getElementById('pokemon-sprite-area').src = regularSprite;
    document.getElementById('pokemon-sprite-area').src = data.image;
    document.getElementById('pokemon-sprite-area').alt = data.name;
    document.querySelector('.pokemon-name').innerText = `#${data.dexNo} – ${data.name}`;

    //All of the info-row fields use the same class. so we use the nth-child selector to get them. I first learned about these kinds of selectors from CSS videos.
    document.querySelector('.info-row:nth-child(2) .value').innerText = data.type;
    document.querySelector('.info-row:nth-child(3) .value').innerText = `${data.height} ft`;
    document.querySelector('.info-row:nth-child(4) .value').innerText = `${data.weight} lbs`;

    //Regetting the cry audio file.
    document.getElementById('cry').src = data.cry;

    //Getting the abilities grid.
    const abilitiesGrid = document.querySelector('.abilities-grid');

    //Clearing it.
    abilitiesGrid.innerHTML = '';

    //Getting the abilities from the pokemon response, and creating new ability pill divs for each one. We're not manipulating the data in the array, so we use forEach instead of map.
    data.abilities.forEach(ab => {
        const div = document.createElement('div');
        div.className = 'ability-pill';
        div.innerText = ab;
        abilitiesGrid.appendChild(div);
    });

    //Doing the exact same thing for the pokemon pokedex decsriptions.
    const descScroll = document.querySelector('.description-scroll');
    descScroll.innerHTML = '';
    data.descriptions.forEach(desc => {
        const p = document.createElement('p');
        p.innerHTML = desc;
        descScroll.appendChild(p);
    });

    //Doing the exact same thing for the grid of move buttons.
    const movesGrid = document.querySelector('.moves-grid');
    movesGrid.innerHTML = '';
    data.moves.forEach(move => {
        const div = document.createElement('div');
        div.className = 'move-box';
        div.innerText = move;
        movesGrid.appendChild(div);
    });

    //Calling the update stats chart helper method to destroy the old stats chart and create a new one with the new mon's data.
    updateStatsChart(data.stats);
}

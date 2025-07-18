
const audio = document.getElementById("cry");
const audioBtn = document.getElementById("cryBtn");
cryBtn.addEventListener('click', () => {
    cry.currentTime = 0;
    cry.play();
    cryBtn.classList.add('playing');
});

cry.addEventListener('ended', () => {
    cryBtn.classList.remove('playing');
});


let shiny = false;
let regularSprite = pokemon.image;
let shinySprite = pokemon.shiny;
const spriteBtn = document.getElementById("spriteBtn");
const spriteImageArea = document.getElementById("pokemon-sprite-area");
 function switchSprite() {
     if(!shiny) {
         shiny = true;
         spriteImageArea.src = shinySprite;
         spriteBtn.classList.add('playing');
     } else {
         shiny = false;
         spriteImageArea.src = regularSprite;
         spriteBtn.classList.remove('playing');
     }
 }



let stats = pokemon.stats.map(s => s.base_stat);
const labels = pokemon.stats.map(s => s.stat.name.toUpperCase());

const ctx = document.getElementById('statsChart').getContext('2d');

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

document.addEventListener('DOMContentLoaded', () => {
    let currentID = window.pokemonSearchID;
    console.log(currentID+ " current id");
    document.getElementById('prevBtn').addEventListener('click', () => {
        if(currentID > 1) {
            updatePokemon(--currentID);
        }
    })
    document.getElementById('nextBtn').addEventListener('click', () => {
        updatePokemon(++currentID);
    })
})

async function updatePokemon(currentID) {
    console.log(currentID);
    try {
        const response = await fetch(`/pokemon/update/pokemon/${currentID}`);
        if(!response.ok) {
            throw new Error("Pokemon not found.");

        }

        const data = await response.json();
       // console.log("Fetched Pokémon:", data.stats);
        renderPokemon(data);

    } catch (error) {
        console.error(error);
    }
}


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



function renderPokemon(data) {

    // Update sprite sources
    regularSprite = data.image;
    shinySprite = data.shiny;
    shiny = false; // Reset to regular view on new Pokémon

// Apply regular sprite to image
    document.getElementById('pokemon-sprite-area').src = regularSprite;
    // Basic Info
    document.getElementById('pokemon-sprite-area').src = data.image;
    document.getElementById('pokemon-sprite-area').alt = data.name;
    document.querySelector('.pokemon-name').innerText = `#${data.dexNo} – ${data.name}`;
    document.querySelector('.info-row:nth-child(2) .value').innerText = data.type;
    document.querySelector('.info-row:nth-child(3) .value').innerText = `${data.height} ft`;
    document.querySelector('.info-row:nth-child(4) .value').innerText = `${data.weight} lbs`;

    // Cry audio
    document.getElementById('cry').src = data.cry;

    // Abilities
    const abilitiesGrid = document.querySelector('.abilities-grid');
    abilitiesGrid.innerHTML = '';
    data.abilities.forEach(ab => {
        const div = document.createElement('div');
        div.className = 'ability-pill';
        div.innerText = ab;
        abilitiesGrid.appendChild(div);
    });

    // Descriptions
    const descScroll = document.querySelector('.description-scroll');
    descScroll.innerHTML = '';
    data.descriptions.forEach(desc => {
        const p = document.createElement('p');

        p.innerHTML = desc;
        descScroll.appendChild(p);
    });

    // Moves
    const movesGrid = document.querySelector('.moves-grid');
    movesGrid.innerHTML = '';
    data.moves.forEach(move => {
        const div = document.createElement('div');
        div.className = 'move-box';
        div.innerText = move;
        movesGrid.appendChild(div);
    });

    // Stats (re-render canvas)

    updateStatsChart(data.stats); // You’ll need to define this separately
}

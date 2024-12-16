
let btns = [];
let currentPage = 1;  // Keep track of the current page
console.log(pokemon)//use this to access stats - change getRequest line to include stats.
// Initial setup (1st page)


//


//
function initializePagination() {
    updateBtns(currentPage);  // Update buttons based on the current page
}

// This function will update pagination buttons dynamically based on the current page
function updateBtns(currentPage) {
    btns = [];  // Reset the btns array
    let firstBtn, middleBtn, lastBtn;

    // Logic to set the current, previous, and next pages for buttons
    if (currentPage === 1) {
        firstBtn = 1;
        middleBtn = 2;
        lastBtn = 3;
    } else {
        firstBtn = currentPage - 1;
        middleBtn = currentPage;
        lastBtn = currentPage + 1;
    }


    // Create 5 buttons for pagination
    for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.style.width = "50px";
        button.style.height = "50px";

        button.onclick = function () {
            // Update currentPage when a number button is clicked



            if(i === 0 && currentPage !== 1) {
                currentPage = currentPage-1;
            } else if(i === 0 && currentPage === 1) {
                currentPage = 1;
            } else if(i === 4) {
                currentPage = currentPage +1;
            } else {
                currentPage = parseInt(button.textContent);  // Set currentPage to the clicked page number
            }
            console.log(currentPage)

            // Calculate the starting and ending ID for the selected page
            let startId = (currentPage - 1) * 20;  // Calculate the starting ID for pagination (0-based index)
            let endId = startId + 19;  // Calculate the ending ID for pagination (0-based index)

            if(startId === 0) {
                startId = 1;
                endId = 20;
            }

            updateBtns(currentPage);  // Update the buttons based on the new currentPage
            let data = {
                startIndex: startId,
                endIndex: endId
            };
            fetch('/pokedex/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Specify the content type
                },
                body: JSON.stringify(data)  // Send the data as a JSON string in the body
            })
                .then(response => response.json())  // Parse the JSON response if necessary
                .then(data => {
                    pokemon = data;
                    const pokedexBody = document.getElementById("pokedexBody");
                    pokedexBody.innerHTML = "";

                    // Create a fragment to hold all the new pokedex entries
                    const fragment = document.createDocumentFragment();

                    data.forEach(pokemon => {
                        const pokedexEntryDiv = document.createElement('div');
                        pokedexEntryDiv.className = 'pokedexEntry';

                        // Set the inner HTML using template literals
                        pokedexEntryDiv.innerHTML = `
        <div class="pokedexImage">
            <img class="pokedexImage" src="${pokemon.image}" alt="${pokemon.name}" style="width:220px;height:220px;">
        </div>
        <div class="pokedexDetail">${pokemon.name}</div>
        <div class="pokedexDetail">${pokemon.type}</div>
        <div class="pokedexDetail">${pokemon.height}ft.</div>
        <div class="pokedexDetail">${pokemon.weight}lbs.</div>
    `;

                        // Append the new entry to the fragment
                        fragment.appendChild(pokedexEntryDiv);
                    });

                    pokedexBody.appendChild(fragment);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };


        // Handle button content based on its position
        switch (i) {
            case 0:
                button.style.fontSize = "25px";
                button.innerHTML = `<i class="fa fa-angle-left"></i>`;
                break;
            case 1:
                button.textContent = firstBtn;
                break;
            case 2:
                button.textContent = middleBtn;
                break;
            case 3:
                button.textContent = lastBtn;
                break;
            case 4:
                button.style.fontSize = "25px";
                button.innerHTML = `<i class="fa fa-angle-right"></i>`;
                break;
        }
        btns.push(button);  // Add button to the array
    }

    // Update the container with the new buttons
    const btnContainer = document.getElementById('paginationBtns');
    btnContainer.innerHTML = '';  // Clear existing buttons
    btns.forEach(btn => {
        btnContainer.appendChild(btn);  // Append new buttons
    });
}

// Call the initializePagination function when the page loads
initializePagination();

document.getElementById('pokedexBody').addEventListener('click', function (event) {
    // Find the closest '.pokedexEntry' ancestor of the clicked element
    const entry = event.target.closest('.pokedexEntry');
    let pokemonName = entry.children[1];
    //console.log("gesg "+pokemonName.textContent)
    if (!entry) return; // Exit if not clicking inside a '.pokedexEntry'

    // Extract data from the clicked entry
    const name = entry.querySelector('.pokedexDetail:nth-child(2)'); // Name

    // Prepare side content and clone the entry
    var side = document.getElementById("sideContent");
    const clone = entry.cloneNode(true);
    clone.style.width = "100%";


    // Remove unnecessary children (keep only the first two)
    while (clone.children.length > 2) {
        clone.removeChild(clone.lastChild); // Remove last child until only two remain
    }
    clone.style.border = "2px ridge white";

    clone.id ="sideDex"
    side.innerHTML = clone.outerHTML;

    //
    //add the chart
    let pokeName = pokemonName.textContent.charAt(0).toUpperCase() + pokemonName.outerText.slice(1);
    const targetMon = pokemon.find(mon => mon.name === pokeName);

    let pokemonStats = [targetMon.stats[0].base_stat, targetMon.stats[1].base_stat,targetMon.stats[2].base_stat,targetMon.stats[3].base_stat,targetMon.stats[4].base_stat,targetMon.stats[5].base_stat]
    let radarChart = document.createElement('canvas');
console.log(pokemonStats)
    side.appendChild(radarChart)
    radarChart.id = "radarChart"
    const ctx = document.getElementById('radarChart').getContext('2d')
    const data = {
        labels: [
            'HP',
            'Attack        ',
            'Defence',
            'Speed',
            'Sp. Defense',
            'Sp. Attack',
        ],
        datasets: [{
            label: 'Stats',
            data: pokemonStats,  // Example stats, adjust to your data
            fill: true,
            backgroundColor: '#FFDE59',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: '#FF5C5C',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#FF5C5C',
            pointRadius: 5, // Adjust the point radius for visibility
        }]
    };

    let chart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false  // Turn off the legend (this removes the toggle button)
                }
            },
            layout: {
                padding: 20
            },
            scales: {
                r: {
                    angleLines: {
                        display: true,  // Show the angle lines
                        lineWidth: 1   // Adjust the width of the angle lines
                    },
                    suggestedMin: 0,  // Set a minimum value (you can adjust as needed)
                    suggestedMax: 150,  // Set the maximum value for scaling to ensure proportionality
                    ticks: {
                        beginAtZero: true,  // Start the scale at zero
                        stepSize: 20,  // Control the spacing between ticks
                        max: 100,  // Max value for scaling
                        font: {
                            size: 14 // Adjust the font size of the tick labels
                        },
                        display: false
                    },
                    grid: {
                        circular: true,  // Make the grid circular for better visual balance
                        lineWidth: 1  // Control the grid line width
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3  // Line width for the chart
                },
                point: {
                    radius: 5,  // Radius of the points in the chart
                    hoverRadius: 8  // Radius of the points when hovered
                }
            },
            responsive: true,  // Ensure the chart resizes dynamically
            maintainAspectRatio: 1  // Maintain aspect ratio if necessary
        }
    });

    //
    // Create and append the "Add Pokemon" button
    const button = document.createElement('button');
    button.textContent = "Add Pokemon";  // Button text
    button.onclick = function () {
        alert(`Action on ${name.innerText}`); // Action when button is clicked
    };
    button.id = "addPokemonBtn";

    // Append the button to the side content
    side.appendChild(radarChart)
    side.appendChild(button);
});

/*
This javascript file contains script for the pokedex page. It has three primary responsabilities:
-Deal with the pagination buttons.
-Render out the pokedex card display.
-Render and deal with the side display logic.
 */

//Creating an array to hold the pagination buttons.
let btns = [];

//Initializing the index of the current page.
let currentPage = 1;

//Function to start the process of initializing the pagination.
function initializePagination() {
    updateBtns(currentPage);
}

//Function to update the pagination buttons when the user navigates to a new page.
function updateBtns(currentPage) {

    //Resetting the buttons array.
    btns = [];

    //Declaring the three pagination buttons.
    let firstBtn, middleBtn, lastBtn;

    //Logic to determine what page each button links to.
    if (currentPage === 1) {
        firstBtn = 1;
        middleBtn = 2;
        lastBtn = 3;
    } else {
        firstBtn = currentPage - 1;
        middleBtn = currentPage;
        lastBtn = currentPage + 1;
    }


    //Creating the five button elements.
    for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.style.width = "50px";
        button.style.height = "50px";

        //Onclick event for each button that navigates to its respective page. Accounting for button 1 and 5 being one page up and one page down, not a specific index.
        button.onclick = function () {
            if(i === 0 && currentPage !== 1) {
                currentPage = currentPage-1;
            } else if(i === 0 && currentPage === 1) {
                currentPage = 1;
            } else if(i === 4) {
                currentPage = currentPage +1;
            } else {
                currentPage = parseInt(button.textContent);  // Set currentPage to the clicked page number
            }


            //Getting the range of pokemon that are to populate this page. We get 20 at a time.
            let startId = (currentPage - 1) * 20;
            let endId = startId + 19;
            if(startId === 0) {
                startId = 1;
                endId = 20;
            }

            //After a button has been clicked, we call updateButtons again to repopulate the pagination buttons.
            updateBtns(currentPage);

            //Putting the range of pokemon to get into a json object to post to the web server.
            let data = {
                startIndex: startId,
                endIndex: endId
            };

            /*DEV NOTE: This should be the only old school .then, .then route in the project. Pretty much everything else should be async/await. figured I should have at least one of each. */
            //Sending the range to the server as json, fetching from the /pokedex/update route.
            fetch('/pokedex/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())//After the promise resolves, we parse the response to json.
                .then(data => {//After parsing,
                    pokemon = data;//We reassign the global pokemon variable thats defined in the ejs file to the new pokemon's data.
                    const pokedexBody = document.getElementById("pokedexBody");//We get the overall container for the pokemon cards.
                    pokedexBody.innerHTML = "";//We clear all its html.

                    //We create a new document fragment to hold all the new pokedex cards in while we create them.
                    const fragment = document.createDocumentFragment();

                    //For each individual pokemon sent back from teh server.
                    data.forEach(pokemon => {
                        const pokedexEntryDiv = document.createElement('div');//Create a pokedexEntry div for it.
                        pokedexEntryDiv.className = 'pokedexEntry';

                        //We use a template literal to inject the html formatting of the div directly from the js.
                        pokedexEntryDiv.innerHTML = `
        <div class="pokedexImage">
            <img class="pokedexImage" src="${pokemon.image}" alt="${pokemon.name}" style="width:220px;height:220px;">
        </div>
        <div class="pokedexDetail">${pokemon.name}</div>
        <div class="pokedexDetail">${pokemon.type}</div>
        <div class="pokedexDetail">${pokemon.height}ft.</div>
        <div class="pokedexDetail">${pokemon.weight}lbs.</div>
    `;

                        //We add the new div to the fragement we created.
                        fragment.appendChild(pokedexEntryDiv);
                    });

                    //After the loop, and adding all cards to the fragment, we add the fragment to the main container.
                    pokedexBody.appendChild(fragment);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };


        //Lastly, we have a bit of logic for determining the contents of each pagination button. ie. what it displays. Remember, despite just finishing the onclick loop code, we're still in an outer loop goign
        //Through each of the five pagination buttons. That above loop does not trigger until the button is clicked.
        switch (i) {
            case 0:
                button.style.fontSize = "25px";
                button.innerHTML = `<i class="fa fa-angle-left"></i>`;
                break;
            case 1:
                button.textContent = firstBtn;
                if(currentPage==1)
                    button.style.backgroundColor ="mediumspringgreen";
                break;
            case 2:
                button.textContent = middleBtn;
                if(currentPage != 1)
                    button.style.backgroundColor ="mediumspringgreen";
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

    //Getting, clearing, and adding back the buttons to the button container.
    const btnContainer = document.getElementById('paginationBtns');
    btnContainer.innerHTML = '';  // Clear existing buttons
    btns.forEach(btn => {
        btnContainer.appendChild(btn);  // Append new buttons
    });
}

//Initializing the pagination when the page first loads up.
initializePagination();

/*
DEV NOTE:
This was by far the hardest part of the project to get working. I'm not too sure why I got so hyper focused on this one specific functionality, but I did.
Basically, I wanted the user to be able to click on any of the pokemon on display, and for them to populate a little side panel, like an actual mini pokedex computer,
Where they could see more information about them.
 */

//Adding an event listener to the actual container of the pokemon cards that listens for a click. I was having issues applying it to individual pokemon cards.
document.getElementById('pokedexBody').addEventListener('click', function (event) {

    //Onclick, we find the closest entry to where the user clicked/
    const entry = event.target.closest('.pokedexEntry');

    //We get the pokemon's name from that.
    let pokemonName = entry.children[1];

    //If the user does not click a valid target.
    if (!entry) return;

    //Getting the container for the side display. And creating a clone of the pokemon card selected.
    var side = document.getElementById("sideContent");
    const clone = entry.cloneNode(true);
    clone.style.width = "100%";


    //Rather than recalling the server or rebuilding an object, I cut the information I don't need from the clone. Only keeping the image and name.
    while (clone.children.length > 2) {
        clone.removeChild(clone.lastChild); // Remove last child until only two remain
    }

    //Some styling.
    clone.style.border = "2px ridge black";
    clone.id ="sideDex"

    //Shoving the clone into the side display.
    side.innerHTML = clone.outerHTML;

    //Reformatting the pokemon's name to have the correct formatting for a query, just in case.
    let pokeName = pokemonName.textContent.charAt(0).toUpperCase() + pokemonName.outerText.slice(1);

    //Searching the pokemon we got from the server by name. Not sure why I did this by name and not ID when I coded it the first time around.
    const targetMon = pokemon.find(mon => mon.name === pokeName);

    //Creating an array of the ints of the pokemon's various stats.
    let pokemonStats = [targetMon.stats[0].base_stat, targetMon.stats[1].base_stat,targetMon.stats[2].base_stat,targetMon.stats[3].base_stat,targetMon.stats[4].base_stat,targetMon.stats[5].base_stat]

    //Creating a canvas element to hold a ChartJS chart.
    let radarChart = document.createElement('canvas');

    //Sticking the rader into the side display beneath the pokemon info.
    side.appendChild(radarChart)

    //Giving it its id.
    radarChart.id = "radarChart"

    //Creating the actual star chart. Generative AI was used in the assistance of its creation and styling.
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
            data: pokemonStats,
            fill: true,
            backgroundColor: 'rgba(0,255,255,0.2)',       // Simulated gradient-style glow
            borderColor: 'rgba(0,255,255,1)',             // Neon outline
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0,255,255,0.8)',  // Point fill
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: 'rgba(0,255,255,1)',
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    };
    let chart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: 20
            },
            scales: {
                r: {
                    backgroundColor: 'rgba(0, 255, 255, 0.05)',
                    angleLines: {
                        display: true,
                        lineWidth: 1
                    },
                    suggestedMin: 0,
                    suggestedMax: 150,
                    ticks: {
                        beginAtZero: true,
                        stepSize: 20,
                        max: 100,
                        font: {
                            size: 14
                        },
                        display: false
                    },
                    grid: {
                        circular: true,
                        lineWidth: 1
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                },
                point: {
                    radius: 5,
                    hoverRadius: 8
                }
            },
            elements: {
                line: {
                    borderWidth: 3,
                    borderColor: 'rgba(0,255,255,1)'
                },
                point: {
                    radius: 5,
                    hoverRadius: 8,
                    backgroundColor: 'rgba(0,255,255,0.8)',
                    borderColor: '#ffffff',
                    borderWidth: 2
                }
            },

            responsive: true,
            maintainAspectRatio: 1
        }
    });

    //Creating and appending a button for the side display to allow the user to view more information about that pokemon.
    const button = document.createElement('button');
    button.textContent = "View More Details";  // Button text
    button.className = "detailsBtn";
    button.onclick = function () {
        window.location.href = `/pokemon/${targetMon.dexNo}`;//Navigates the browser over to the right page, sending the new request.
    };

    side.appendChild(radarChart)
    side.appendChild(button);
});

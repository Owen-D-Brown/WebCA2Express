/*
This file contains the javascript for the index page. This includes: primarily the carousel. 
This is the carousel at the bottom of the page showing a preview of the various pokemon you can view information on. 
The code here renders it, and dictates its movements, 
 */

//Get the carousel container, and the left/right buttons.
const carousel = document.getElementById('pokemonCarousel');
const leftBtn = document.getElementById('carouselLeft');
const rightBtn = document.getElementById('carouselRight');

//Get the inner carousel container. this is what contains all the cards. It contains them at once, and we move the inner container through the outer container to simulate the carousel.
const carouselInner = document.getElementById('carouselInner');

//Declaring the width and space between cards for the carousel. I can't for the life of me get the carousel to do a proper single card swipe regardless of what values I'm subbing in here. So I tried/errored it until it was close enough.
const cardWidth = 150;
const cardSpacing = 37;
const cardStep = cardWidth + cardSpacing;

//Starting scroll index, should be close enough to the center of the visible cards. ie. 5-7 cards on screen at once
let scrollIndex = 3;

//Creating all the cards here to save ridiculous HTML repetition.
const allCards = homepageMons.map(mon => {
    const card = document.createElement('div');//Create the div
    card.className = 'pokemonCard';//Give it its class.
    //Set the html of the div. Image at the tope, then the pokemon's name, then a button to view more details.
    card.innerHTML = `
        <img src="${mon.sprite}" alt="${mon.name}">
        <h4>${mon.name}</h4>
        <button class="detailsBtn" onclick="window.location.href='/pokemon/${mon.id}'">View Details</button>
    `;
    return card;
});

//Clears the html, then appends all those created cards into the inner carousel container.
function renderAllCards() {
    carouselInner.innerHTML = '';
    allCards.forEach(card => carouselInner.appendChild(card));
}

//Simple method for translating the inner carousel along the x axis based on the index and card step (width + gap). I think the maths here is wrong which is why my scroll isn't perfect.
function updateCarouselPosition() {
    const offset = (scrollIndex - 3) * cardStep;
    carouselInner.style.transform = `translateX(-${offset}px)`;
}


//Method for triggering the slide. Takes in the direction of the arrow pressed as a string, then updates the scroll index as needed, before calling update carousel position to translate it appropriately.
function slide(direction) {
    if (direction === 'right') {
        scrollIndex = scrollIndex + 1;
        if(scrollIndex >= 28) {
            scrollIndex = 3;
        }
    } else if (direction === 'left') {
        scrollIndex = scrollIndex - 1
        if(scrollIndex <= 2) {
            scrollIndex = 29;
        }
    }
    updateCarouselPosition();
}

//Adding event listeners to the carousel arrow buttons. This one is on right click.
carouselRight.addEventListener('click', () => {
    slide('right');
});

//On left click.
carouselLeft.addEventListener('click', () => {
    slide('left');
});

//creating an interval timer that calls the slide right carousel code every three seconds.
let autoScrollInterval = setInterval(() => {
    slide('right');
}, 3000); // scroll every 4 seconds

//Removing the auto slide when the user is hovering over the carousel.
carouselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
});

//Readding the interval when the user leaves the carousel.
carouselWrapper.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
        slide('right');
    }, 3000);
});

/* DEV NOTE: I also think this timer logic might be messing with the positioning of the scroll. Perhaps with slide triggers being called before the first one is done. Either that, or because I've multiple carousel items
* visible at one, I should have approached it entirely differently. I wanted to use arrays, but couldn't conveniently figure out how to simulate the slide movement while moving elements in and out of arrays instead.*/

//Render all the cards and put them into carousel inner on page load.
renderAllCards();
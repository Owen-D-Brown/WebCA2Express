



const carousel = document.getElementById('pokemonCarousel');
const leftBtn = document.getElementById('carouselLeft');
const rightBtn = document.getElementById('carouselRight');



const cardsToShow = 5;
const cardVisualWidth = 150;





const carouselInner = document.getElementById('carouselInner');
const totalCards = homepageMons.length;
const cardWidth = 150;
const cardSpacing = 37;
const cardStep = cardWidth + cardSpacing;
let scrollIndex = 3;

const allCards = homepageMons.map(mon => {
    const card = document.createElement('div');
    card.className = 'pokemonCard';
    card.innerHTML = `
        <img src="${mon.sprite}" alt="${mon.name}">
        <h4>${mon.name}</h4>
        <button class="detailsBtn">View Details</button>
    `;
    return card;
});


function renderVisibleCards() {
    carouselInner.innerHTML = '';
    allCards.forEach(card => carouselInner.appendChild(card));
}

function updateCarouselPosition() {
    const offset = (scrollIndex - 3) * cardStep;
    carouselInner.style.transform = `translateX(-${offset}px)`;
}



function slide(direction) {
    if (direction === 'right') {
        scrollIndex = scrollIndex + 1;
        if(scrollIndex >= 28) {
            scrollIndex = 2;
        }
    } else if (direction === 'left') {
        scrollIndex = scrollIndex - 1
        if(scrollIndex <= 2) {
            scrollIndex = 28;
        }
    }
    updateCarouselPosition();
}


carouselRight.addEventListener('click', () => {


    slide('right');
    console.log(scrollIndex);
});

carouselLeft.addEventListener('click', () => {

    slide('left');
    console.log(scrollIndex);

});


let autoScrollInterval = setInterval(() => {
    slide('right');
}, 3000); // scroll every 4 seconds

carouselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
});

carouselWrapper.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
        slide('right');
    }, 3000);
});

renderVisibleCards();
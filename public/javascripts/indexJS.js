function updateCarouselTransform() {
    const offset = scrollIndex * cardWidth;
    const cards = carousel.querySelectorAll('.pokemonCard');

    cards.forEach((card, i) => {
        const currentX = parseInt(card.style.transform?.replace('translateX(', '').replace('px)', '')) || 0;
        const newX = currentX - cardWidth; // or +cardWidth for left
        card.style.transform = `translateX(${newX}px)`;
    });
}



const carousel = document.getElementById('pokemonCarousel');
const leftBtn = document.getElementById('carouselLeft');
const rightBtn = document.getElementById('carouselRight');
const totalCards = homepageMons.length;

const cardWidth = 175;
const cardsToShow = 5;
const cardVisualWidth = 150;
const cardSpacing = 10;
const cardStep = cardVisualWidth + cardSpacing;
let scrollIndex = 0;

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
    carousel.style.transform = 'translateX(0)'; // reset position
    carousel.innerHTML = ''; // clear old cards

    allCards.forEach(card => {
        carousel.appendChild(card);
    });
}



function slide(direction) {

    const delta = direction === 'right' ? -cardStep : cardStep;
    const cards = carousel.querySelectorAll('.pokemonCard');

    cards.forEach(card => {
        const currentX = parseInt(card.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
        card.style.transition = 'transform 0.9s ease';
        card.style.transform = `translateX(${currentX + delta}px)`;
    });

    scrollIndex = (scrollIndex + (direction === 'right' ? 1 : -1) + totalCards) % totalCards;
}



carouselRight.addEventListener('click', () => {
    if (scrollIndex >= 30) {
        return;
    }
    slide('right');
});

carouselLeft.addEventListener('click', () => {
    if (scrollIndex <= 3) {
        return;
    }
    slide('left');
});


let autoScrollInterval = setInterval(() => {
    slide('right');
}, 3000); // scroll every 4 seconds

carousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
        slide('right');
    }, 3000);
});

renderVisibleCards();
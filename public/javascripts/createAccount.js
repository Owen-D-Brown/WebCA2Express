const slider = document.getElementById("ageSliderBar");
const ageBox = document.getElementById("ageBox");


slider.addEventListener("input", () => {
    ageBox.textContent = slider.value;
})

ageBox.textContent = slider.value;

const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const trainerCard = document.getElementById("trainerCardPlaceholder")

let colors = ["Red", "Yellow", "Purple", "Blue"]
let index = 3;
//Much improved over my previous carosel code
leftArrow.addEventListener("click", () => {
    if(index > 0) {
        index--;
    }
    else if (index==0) {
        index = 3;
    }
    trainerCard.style.backgroundImage =`url(../resources/trainerCard${colors[index]}.png)`
})
rightArrow.addEventListener("click", () => {
    if(index  < 3) {
        index++;
    }
    else if (index==3) {
        index = 0;
    }
    trainerCard.style.backgroundImage =`url(../resources/trainerCard${colors[index]}.png)`
})
/*
This class contains the javascript for the create account view. It controls the age slider, and the trainer card selector. This functionality is unfinished. As it stands, the server simply prints the sent 
information when the create account form is posted. 
 */

//Getting the age slider, and corrosponding age box and storing them.
const slider = document.getElementById("ageSliderBar");
const ageBox = document.getElementById("ageBox");

//Adding an event to the slider. When it's changed, it's value is represented in the age box.
slider.addEventListener("input", () => {
    ageBox.textContent = slider.value;
})

//Initialization
ageBox.textContent = slider.value;

//Getting the left and right arrows, along with the trainer card container.
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const trainerCard = document.getElementById("trainerCardPlaceholder")

//Declaring an array of the different colors of trainer cards I have.
let colors = ["Red", "Yellow", "Purple", "Blue"]
let index = 3;//Starting index/color.

//Much improved over my previous carosel code. On left click, adjust the index, then sub that index color for the path to the trainer card image.
leftArrow.addEventListener("click", () => {
    if(index > 0) {
        index--;
    }
    else if (index==0) {
        index = 3;
    }
    trainerCard.style.backgroundImage =`url(../resources/trainerCard${colors[index]}.png)`
});

//Does the same thing, but on right click. 
rightArrow.addEventListener("click", () => {
    if(index  < 3) {
        index++;
    }
    else if (index==3) {
        index = 0;
    }
    trainerCard.style.backgroundImage =`url(../resources/trainerCard${colors[index]}.png)`
})
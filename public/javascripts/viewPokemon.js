
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
const regularSprite = pokemon.image;
const shinySprite = pokemon.shiny;
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



const stats = pokemon.stats.map(s => s.base_stat);
const labels = pokemon.stats.map(s => s.stat.name.toUpperCase());

const ctx = document.getElementById('statsChart').getContext('2d');

new Chart(ctx, {
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



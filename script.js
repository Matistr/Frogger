const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const frogSize = 30;
let frogX = canvas.width / 2 - frogSize / 2;
let frogY = canvas.height - frogSize;
let cars = [];
let gameInterval;
let isGameRunning = false;
const carHeight = 30;
let carSpeed = 2;
const lanes = 3;
const laneHeight = (canvas.height / lanes) - 20;
const blockSize = 30; 
let score = 0;

const frogImage = new Image();
frogImage.src = 'images/frog.png';

const carImages = [
    new Image(),
    new Image(),
    new Image()
];
carImages[0].src = 'images/car1.png'; 
carImages[1].src = 'images/car2.png'; 
carImages[2].src = 'images/car3.png'; 

function drawBackground() {
    context.fillStyle = '#4A4A4A'; // Color gris para la calle
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#FFFFFF'; // Color blanco para las líneas
    context.lineWidth = 2;

    for (let i = 1; i < lanes; i++) {
        let y = i * (laneHeight + 20);
        context.beginPath();
        context.setLineDash([20, 15]); // Líneas discontinuas
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
    context.setLineDash([]); // Reinicia el patrón de línea
}

function drawFrog() {
    context.drawImage(frogImage, frogX, frogY, frogSize, frogSize);
}

function createCars() {
    cars = [];
    for (let i = 0; i < lanes; i++) {
        const carBlocks = Math.floor(Math.random() * 3) + 1;
        const carWidth = blockSize * carBlocks;
        cars.push({
            x: Math.random() * canvas.width,
            y: i * (laneHeight + 20) + 10,
            width: carWidth,
            speed: (Math.random() + 0.5) * carSpeed * (i % 2 === 0 ? 1 : -1),
            blocks: carBlocks
        });
    }
}

function drawCars() {
    cars.forEach(car => {
        const carImage = carImages[car.blocks - 1];
        context.drawImage(carImage, car.x, car.y, car.width, carHeight);
    });
}

function moveCars() {
    cars.forEach(car => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.speed < 0 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });
}

function detectCollision() {
    return cars.some(car => {
        return frogX < car.x + car.width &&
            frogX + frogSize > car.x &&
            frogY < car.y + carHeight &&
            frogY + frogSize > car.y;
    });
}

function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground(); // Dibuja el fondo de la calle

    drawFrog();
    drawCars();
    moveCars();

    if (detectCollision()) {
        endGame();
    } else if (frogY < 0) {
        advanceLevel(); 
    }
}

function advanceLevel() {
    score++;
    frogY = canvas.height - frogSize;
    carSpeed += 0.2;
    createCars();
}

function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    alert(`¡Juego terminado! Puntuación final: ${score}. Pulsa "Iniciar Juego" para jugar de nuevo.`);
}

function startGame() {
    if (!isGameRunning) {
        score = 0;
        frogX = canvas.width / 2 - frogSize / 2;
        frogY = canvas.height - frogSize;
        carSpeed = 2; 
        createCars();
        gameInterval = setInterval(updateGame, 1000 / 60);
        isGameRunning = true;
    }
}

function moveFrog(event) {
    if (!isGameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            frogY -= frogSize;
            break;
        case 'ArrowDown':
            frogY += frogSize;
            break;
        case 'ArrowLeft':
            frogX -= frogSize;
            break;
        case 'ArrowRight':
            frogX += frogSize;
            break;
    }

    if (frogX < 0) frogX = 0;
    if (frogX + frogSize > canvas.width) frogX = canvas.width - frogSize;
    if (frogY + frogSize > canvas.height) frogY = canvas.height - frogSize;
}

document.getElementById('startButton').addEventListener('click', startGame);
document.addEventListener('keydown', moveFrog);

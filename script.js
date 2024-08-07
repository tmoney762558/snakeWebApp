/* CONSTANTS */
const CANVAS_BORDER_COLOUR = "black";
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER_COLOUR = "darkgreen";
const scoreText = document.getElementById("score");

// Event listener for user input
document.addEventListener("keydown", changeDirection);

// Array of objects containing the x and y coordinates of the snake parts
let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
];
// Ensures that directions cannot be changed before snake is 
let changingDirection = false;
let score = 0;


// Horizantal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
var gameCanvas = document.getElementById("game-canvas");
// Return a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");
//Creates canvas
clearCanvas();
createFood();
main();

function main() {
    if (didGameEnd()) {
        scoreText.innerHTML = "Game Over!";
        scoreText.style.color = "red";
        return;
    }
    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        // Call main again
        main();
    }, 100)
}

function clearCanvas() {
    // Select the colour to fill the canvas
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    // Select the colour for the border of the canvas
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function advanceSnake() {
    // Create new head for snake
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy,
    };

    // Adds the head to the front of the snake
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score++;
        scoreText.innerHTML = score;
        createFood();
    }
    else {
       snake.pop(); 
    }
    // Removes the tail from the back of the snake
    
}

// Draws the snake on the canvas
function drawSnake() {
    snake.forEach(drawSnakePart);
}

//Draws a part of the snake on the canvas  
//@param { object } snakePart - The coordinates where the part should be drawn
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = SNAKE_COLOUR;

    // Set the border colour of the snake part
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) {
        return;
    }
    else {
        changingDirection = true;
    }

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;


    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    });
}
function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall ||
    hitRightWall ||
    hitTopWall ||
    hitBottomWall
}
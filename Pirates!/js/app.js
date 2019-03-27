/*
* Add Events and functions to move the Ship and Win the game
*
*2 issues: small chance that a pirate ship will not appear. Small chance that an 
*iceberg will appear over the treasure chest making the game unwinnable (also may surround the treasure)
*/


//pirate interval is the value for the interval timer and is used to clear the interval when the game ends
let pirateInterval;
// Creates the Grid -- this should only occur after the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    createGrid();

    /*------Ship Movement User Input------*/
    document.querySelector('body').addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight') {
            moveShipRight();
        }
        if (event.key === 'ArrowLeft') {
            moveShipLeft();
        }
        if (event.key === 'ArrowDown') {
            moveShipDown();
        }
        if (event.key === 'ArrowUp') {
            moveShipUp();
        }
        if(isLoss()) {
            lose();
        }
    });

    /*------------------- Reset Button Event Listener ------------------------*/
    document.getElementById('resetButton').addEventListener('click', () => {
        resetGame();

    });
});

/* ------------------------Ship Movement Functions ---------------------------*/

function moveShipRight() {
    const ship = getShipLocation();
    const right = ship.nextElementSibling;

    moveShip(ship, right);
}

function moveShipLeft() {
    const ship = getShipLocation();
    const left = ship.previousElementSibling;

    moveShip(ship, left);
}

function moveShipDown() {
    const ship = getShipLocation();
    //const index = getIndexOfElement(ship);
    //const down = ship.parentElement.nextElementSibling.childNodes[index];
    const down = getUpperOrLowerElementAtIndex(ship, ship.parentElement.nextElementSibling);

    moveShip(ship, down);
}

function moveShipUp() {
    const ship = getShipLocation();
    //const index = getIndexOfElement(ship);
    //const up = ship.parentElement.previousElementSibling.childNodes[index];
    const up = getUpperOrLowerElementAtIndex(ship, ship.parentElement.previousElementSibling);

    moveShip(ship, up);
}

function getShipLocation() {
    return document.getElementById('frame').querySelector('.boat');
}

function moveShip(shipElement, newElement) {
    if(canMoveTo(shipElement, newElement)) {
        shipElement.classList.remove('boat');
        newElement.classList.add('boat');
    }
}

/*--------------------------- Pirate movement functions -------------------------*/
function movePirateShip() {
    console.log("movingPirateShip");
    let randomNum = Math.floor(Math.random() * 4 ) + 1;
    if (randomNum == 1) {
        movePirateRight();
    }
    if (randomNum == 2) {
        movePirateLeft();
    }
    if (randomNum == 3) {
        movePirateUp();
    }
    if (randomNum == 4) {
        movePirateDown();
    }
}

function movePirate(pirateElement, newElement) {
    if(canMoveTo(pirateElement, newElement)) {
        pirateElement.classList.remove('pirate');
        newElement.classList.add('pirate');
    }
}

//Only works for one pirate at the moment - query selector all will allow for an array of all priates and then each can be moved
function getPirateLocation() {
    return document.getElementById('frame').querySelector('.pirate');
}

function movePirateRight() {
    const pirate = getPirateLocation();
    const right = pirate.nextElementSibling;

    movePirate(pirate, right);
}

function movePirateLeft() {
    const pirate = getPirateLocation();
    const left = pirate.previousElementSibling;

    movePirate(pirate, left);
}

function movePirateUp() {
    const pirate = getPirateLocation();
    const up = getUpperOrLowerElementAtIndex(pirate, pirate.parentElement.previousElementSibling);

    movePirate(pirate, up);
}

function movePirateDown() {
    const pirate = getPirateLocation();
    const down = getUpperOrLowerElementAtIndex(pirate, pirate.parentElement.nextElementSibling);

    movePirate(pirate, down);
}

/*--------------------------- Movement checks and functions ----------------------*/

function canMoveTo(shipElement, newElement) {
    if (newElement == null || newElement.classList.contains('iceburg')) {
        return false;
    }
    if (isWin(newElement) && !shipElement.classList.contains('pirate')) {
        win();
        return false;
    }
    if(isLoss()) {
        lose();
        return false;
    }
    return true;
}

function isWin(nextElement) {
    if(nextElement.classList.contains('treasure')) {
        return true;
    }
    return false
}

function win() {
    const winText = document.querySelector('.announce');
    winText.classList.add('winText');
    winText.innerText = 'You got the treasure!';
    getShipLocation().classList.remove('boat');
    clearInterval(pirateInterval);
}

function isLoss() {
    const shipLocation = getShipLocation();
    if (shipLocation.classList.contains('pirate')) {

        return true;
    }
    return false;
}

function lose() {
    const loseText = document.querySelector('.announce');
    loseText.classList.add('loseText');
    loseText.innerText = 'You sank, better luck next time!';
    getShipLocation().classList.remove('boat');
    clearInterval(pirateInterval);
}

function getUpperOrLowerElementAtIndex(ship, newRow) {
    let elementAtIndex = null;

    if (newRow != null) {
        const index = getIndexOfElement(ship);
        elementAtIndex = newRow.childNodes[index];
    }

    return elementAtIndex;
}

function getIndexOfElement(element) {
    return Array.from(element.parentNode.children).indexOf(element);
}

/*--------------------- Reset the Game ------------------------*/
function resetGame() {
    const frame = document.getElementById('frame');
    // const boat = frame.querySelector('.boat');
    // if(boat) {
    //     boat.classList.remove('boat');
    // }
    // const iceburg = frame.querySelectorAll('.iceburg');
    // iceburg.forEach(element => element.classList.remove('iceburg'));
    // const pirate = frame.querySelector('.pirate');
    // if(pirate) {
    //     pirate.classList.remove('pirate');
    // }
    clearInterval(pirateInterval);
    console.log(frame.children);
    Array.from(frame.childNodes).forEach(e => frame.removeChild(e));
    // frame.firstElementChild.firstElementChild.classList.add('boat');
    // frame.lastElementChild.lastElementChild.classList.add('treasure');
    pirateCount = 0;
    createGrid();
}

function setupGame() {
    const frame = document.getElementById('frame');
    frame.firstElementChild.firstElementChild.classList.add('boat');
    frame.lastElementChild.lastElementChild.classList.add('treasure');
    
    /*---------Random Pirate Movement---------*/
    pirateInterval = setInterval(movePirateShip, 200);

}

/*----------------------- Creates the game grid -------------------*/
function createGrid() {
    const frame = document.getElementById('frame');
    // Add Code to create the game grid
    for (let i = 0; i < 10 ; i++) {
        buildRow(frame); 
    }
    setupGame();
}

/**
 * Builds the grid rows
 * @param {element} frame 
 */
function buildRow(frame) {
    const row = document.createElement('div');
    row.classList.add('row');
    frame.insertAdjacentElement('beforeend', row);
   // Add code to create rows
    for (let i = 0; i < 10 ; i++) {
        buildSquare(row, i); 
    }    
}

/**
 * Builds the grid squares 
 * @param {element} row 
 * @param {int} count 
 */
let pirateCount = 0;
function buildSquare(row, count) {
   // Add code to create the grid Squares
    const container = document.createElement('div');
    container.classList.add('square');

    // Randomly creates iceburgs, but not on the first elemment
    
    if (count > 1) {
        if ((Math.floor(Math.random() * 100) + 1) > 85) {
            // Add the iceburgs here
            container.classList.add('iceburg');
        }
        //change the pirate count less than to add more or less pirates. NOTE: for now only works with 1.
        else if(pirateCount < 1 && (Math.floor(Math.random() * 100) + 1) > 97) {
                // Add the pirates here - will only run if there already hasn'y been an iceburg
                container.classList.add('pirate');
                pirateCount++;


        } 
    }
    row.insertAdjacentElement('beforeend', container);
    
}




let guess = 0;
let guesses = 6;
let guessed = {};
let objective = {};
let selected;
let guess_length = 4;

let red_highlights = true;
let red_highlighted = [];
let difficulty = 1;
let useableColors = {};
let colorsShown;

let shape = 1;

function id(id) { return document.getElementById(id) }

function loadGame() {
    id("gameArea").innerHTML = ""; 
    id("controlArea").innerHTML = "";
    guess = 0;
    selected = -1;
    guessed = {};
    objective = {};
    setColors();
    generateControls();
    generateGameArea();
    resetRows();
    setObjective();
    setShape(shape);
    sizeControls();
}

function generateControls() {
    for (const [key, value] of Object.entries(useableColors)) {
        const color = document.createElement("input");
        color.setAttribute("class", "color");
        color.setAttribute("type", "button");
        color.setAttribute("onclick", 'setColor("'+ key + '")');
        color.setAttribute("id", key);
        color.style.backgroundColor = value.color;

        id("controlArea").appendChild(color);
    }

    const color = document.createElement("input");
    color.setAttribute("class", "color enter");
    color.setAttribute("type", "button");
    color.setAttribute("value", "OK");
    color.setAttribute("color", "green");
    color.setAttribute("onclick", "checkGuess()");
    id("controlArea").appendChild(color);
}

function generateGameArea() {
    let count = 0;

    for (let i = 0; i < guesses; i++) {
        const row = document.createElement("div");
        row.setAttribute("id", "row" + i);
        row.setAttribute("class", "row");

        for (let j = 0; j < guess_length; j++) {
            const circle = document.createElement("input");
            circle.setAttribute("type", "button");
            circle.setAttribute("id", count);  
            circle.setAttribute("class", "circle row" + i);
            circle.style.backgroundColor = "";
            row.appendChild(circle);
            count++;
        }

        id("gameArea").appendChild(row);
    }
}

function setColors() {
    useableColors = {};

    for (const [key, value] of Object.entries(colors)) {
        if (value.difficulty <= difficulty) {
            useableColors[key] = value;
        }
    }
    colorsShown = Object.entries(useableColors).length;
}

function setColor(color) {
    if (selected > -1) {
        id(selected).style.backgroundColor = useableColors[color].color;
        guessed[selected%guess_length] = {
            "color": color,
            "id": selected
        }
    }
}

function resetRows() {
    setActiveRow(guess);
}

function setActiveRow(row) {
    resetBorders(guess);

    removeEventListeners();

    document.querySelectorAll(".row" + row).forEach(circle => {
        resetBorders(row);
        circle.addEventListener("mouseover", function (e) {
            e.target.style.boxShadow = "0px 0px 15px #888888";
            e.target.style.cursor = "pointer";
        });
        circle.addEventListener("mouseout", function (e) {
            e.target.style.boxShadow = "0 0 0px #888888";
        });
        circle.addEventListener("mousedown", function (e) {
            resetBorders(row);
            selected = e.target.id;
            e.target.style.borderColor = "#01dae7";
            e.target.style.cursor = "grab";
        });
        circle.addEventListener("mouseup", function(e) {
            e.target.style.cursor = "pointer";
        });
    });
}

function resetBorders(row) {
    document.querySelectorAll(".circle").forEach(circle => {
        circle.style.borderColor = "#d3d6da";
    });

    document.querySelectorAll(".row" + row).forEach(circle => {
        circle.style.borderColor = "#000000";
    });
}

function checkGuess() { 
    if (Object.keys(guessed).length == guess_length) {
        selected = -1;

        let win = true;

        //For each color guessed
        for (let i = 0; i < guess_length; i++) {

            console.log("GUESS", guessed[i].color);
            //If Color is in correct position 
            if (objective[i] == guessed[i].color) {
                id(guessed[i].id).style.boxShadow = "0 0 15px #00FF00";
                console.log("CORRECT GUESS");
            }
            //If color exists
            else if (Object.values(objective).includes(guessed[i].color)) {
                win = false;
                id(guessed[i].id).style.boxShadow = "0 0 15px #0000FF";
                console.log("INCLUDED GUESS");
            }
            //Otherwise
            else {
                win = false;
                if (red_highlights) id(guessed[i].id).style.boxShadow = "0 0 15px #FF0000";
                red_highlighted.push(guessed[i].id);
                id(guessed[i].color).style.display = "none";
                colorsShown -= 1;
                sizeControls();
                console.log("WRONG GUESS, Hidden", guessed[i].color);
            }
        }

        if (win) {
            alert("YOU WINS!!");
            endGame();
        }
        else {
            guessed = {};
            guess += 1;
            if (guess >= 6) {
                alert("YOU LOSE :(");
                endGame();
            }
            else {
                setActiveRow(guess);
            }
        }
    }
    else {
        alert("Please Complete Your Guess");
    }
    console.log("\n");
}

function setObjective() {
    var size = Object.keys(useableColors).length;
    for (let i = 0; i < guess_length; i++) {
        objective[i] = Object.keys(useableColors)[Math.floor(Math.random() * size)];
    }
}

function removeEventListeners() {
    for (let i = 0; i < guess_length * 6; i++) {
        document.querySelectorAll(".row" + i).forEach(circle => {
            circle.replaceWith(circle.cloneNode(true));
        });
    }
}

function endGame() {
    removeEventListeners();
}

function resetGame() {
    loadGame();
}

function setDifficulty(diff) {
    if (diff == 0) {
        id("difficulty_header").textContent = "Easy ˅";
        difficulty = 0;
    }
    if (diff == 1) {
        id("difficulty_header").textContent = "Medium ˅";
        difficulty = 1;
    }
    if (diff == 2) {
        id("difficulty_header").textContent = "Hard ˅";
        difficulty = 2;
    }
}

function setShape(s) {

    let circle_radius = 0;
    let control_radius = 0;
    shape = s;

    if (shape == 0) {
        circle_radius = document.querySelector(".circle").getBoundingClientRect().width;
        control_radius = document.querySelector(".color").getBoundingClientRect().width;
        id("square_option").style.boxShadow = "0 0 0px #000000";
        id("rounded_option").style.boxShadow = "0 0 0px #000000";
        id("circle_option").style.boxShadow = "0 0 5px #000000";
    }
    else if (shape == 1) {
        circle_radius = document.querySelector(".circle").getBoundingClientRect().width / 4;
        control_radius = document.querySelector(".color").getBoundingClientRect().width / 4;
        id("square_option").style.boxShadow = "0 0 0px #000000";
        id("rounded_option").style.boxShadow = "0 0 5px #000000";
        id("circle_option").style.boxShadow = "0 0 0px #000000";
    }

    else if (shape == 2) {
        id("square_option").style.boxShadow = "0 0 5px #000000";
        id("rounded_option").style.boxShadow = "0 0 0px #000000";
        id("circle_option").style.boxShadow = "0 0 0px #000000";
    } 

    document.querySelectorAll(".circle").forEach(circle => {
        circle.style.borderRadius = circle_radius + "px"; 
    });
    document.querySelectorAll(".color").forEach(control => {
        control.style.borderRadius = control_radius + "px"; 
    });
}


id("redHighlights").addEventListener("change", function(e) {

    red_highlights = this.checked;

    red_highlighted.forEach(e => {
        if (red_highlights) id(e).style.boxShadow = "0 0 15px #FF0000";
        else id(e).style.boxShadow = "0 0 0px #FF0000";
    });
    
});

id("hardMode").addEventListener("change", function(e) {
    console.log("Hard Mode", this.checked);
});

window.addEventListener('resize', function(e) {
    setShape(shape);
    sizeControls();
});

function sizeControls() {
    let area = document.querySelector(".controlArea").getBoundingClientRect();
    let control = document.querySelector(".color").getBoundingClientRect();

    let rows = Math.floor(area.height / control.height) - 1;
    if (rows > 4) rows = 4;
    let cols = Math.floor((colorsShown + 1) / rows);

    console.log("rows", rows);
    console.log("cols", cols);
    console.log("controls", colorsShown + 1);

    id("controlArea").style.width = (control.width * (cols + 1)) + "px";
}

loadGame();
setShape(1);
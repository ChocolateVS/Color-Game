let guess = 0;
let guesses = 6;
let guessed = {};
let objective = {};
let selected = -1;

loadGame();

function id(id) { return document.getElementById(id) }

function loadGame() {
    id("gameArea").innerHTML = ""; 
    id("controlArea").innerHTML = "";
    guess = 0;
    generateControls();
    generateGameArea();
    resetRows();
    setObjective();
}

function generateControls() {
    for (const [key, value] of Object.entries(colors)) {
        const color = document.createElement("input");
        color.setAttribute("class", "color");
        color.setAttribute("type", "button");
        color.setAttribute("onclick", 'setColor("'+ key + '")');
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

        for (let j = 0; j < 4; j++) {
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

function setColor(color) {
    if (selected > -1) {
        id(selected).style.backgroundColor = colors[color].color;
        guessed[selected%4] = {
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
        });
        circle.addEventListener("mouseout", function (e) {
            e.target.style.boxShadow = "0 0 0px #888888";
        });
        circle.addEventListener("mousedown", function (e) {
            resetBorders(row);
            selected = e.target.id;
            e.target.style.borderColor = "#01dae7";
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
    if (Object.keys(guessed).length == 4) {
        selected = -1;

        let correct = true;

        for (let i = 0; i < 4; i++) {
            if (objective[i] == guessed[i].color) {
            id(guessed[i].id).style.boxShadow = "0 0 15px #00FF00";
            }
            else {
                correct = false;
                //id(guessed[i].id).style.boxShadow = "0 0 15px #FF0000";
                for (const [key, value] of Object.entries(objective)) {
                    if (value == guessed[i].color) {
                        id(guessed[i].id).style.boxShadow = "0 0 15px #0000FF";
                    }
                } 
            }
        }

        if (correct) {
            alert("YOU WINS!!");
        }
        else {
            guessed = {};
            guess += 1;
            if (guess >= 6) {
                console.log("YOU LOSE :(");
            }
            else {
                setActiveRow(guess);
            }
        }
    }
    else {
        alert("Please Complete Your Guess");
    }
    
}

function setObjective() {
    var size = Object.keys(colors).length;
    for (let i = 0; i < 4; i++) {
        objective[i] = Object.keys(colors)[Math.floor(Math.random() * size)];
    }
}

document.querySelectorAll(".color").forEach(color => {
    color.addEventListener("mouseover", function (e) {
        e.target.style.boxShadow = "0px 0px 5px #888888";
    });
    color.addEventListener("mouseout", function (e) {
        e.target.style.boxShadow = "0 0 0px #888888";
    });
});

function removeEventListeners() {
    for (let i = 0; i < 4 * 6; i++) {
        document.querySelectorAll(".row" + i).forEach(circle => {
            circle.replaceWith(circle.cloneNode(true));
        });
    }
}

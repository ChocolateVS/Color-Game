let guess = 0;
let guesses = 6;
let guessed = {};
let objective = {};
let selected;
let guess_length = 4;

let hardMode = false;
let red_highlights = true;
let red_highlighted = [];
let difficulty = 1;
let useableColors = {};

let previous_correct;
let previous_absolute;

let shape = 1;

let max_rows = 3;

function id(id) { return document.getElementById(id) }

function loadGame() {
    id("gameArea").innerHTML = ""; 
    id("controlArea").innerHTML = "";
    guess = 0;
    selected = 0;
    guessed = {};
    objective = {};
    previous_correct = [];
    previous_absolute = [false, false, false, false];
    setColors();
    generateControls();
    generateGameArea();
    resetRows();
    setObjective();
    sizeControls();
    setShape(1);
    console.log("OBJECTIVE", objective[0], objective[1], objective[2], objective[3]);
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
}

function setColor(color) {
    if (selected > -1) {
        id(selected).style.backgroundColor = useableColors[color].color;

        guessed[selected % guess_length] = {
            "color": color,
            "id": selected
        }

        if (selected + 1 < guess_length * (guess + 1)) {
            id(selected).style.borderColor = "#000000";
            selected ++;
            id(selected).style.borderColor = "#01dae7";
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

    selected = row * guess_length;
    document.getElementById(selected).style.borderColor = "#01dae7";
}

function resetBorders(row) {
    document.querySelectorAll(".circle").forEach(circle => {
        circle.style.borderColor = "#d3d6da";
    });

    document.querySelectorAll(".row" + row).forEach(circle => {
        circle.style.borderColor = "#000000";
    });
}

function removeAllBorders() {
    document.querySelectorAll(".circle").forEach(circle => {
        circle.style.border = "none";
    });
}

function amountOfColor(arr) {
    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}

function checkGuess() { 
    //If Guess is correct length
    if (Object.keys(guessed).length == guess_length) {

        let win = true;
        let green = [];
        let red = {};
        let used = {};
        let guessed_arr = [];

        let num_green = 0;
        let num_blue = 0;
        let num_red = 0;

        for (let i = 0; i < guess_length; i++) {
            guessed_arr.push(guessed[i].color);
            used[guessed[i].color] = 0;
        }

        let objective_amount = amountOfColor(Object.values(objective));
        let guessed_amount = amountOfColor(guessed_arr);

        console.log("\n");
        console.log("GUESS", guessed);
        console.log("Objective", objective);
        console.log("\n");

        console.log("Checking Green");
        
        //For each guessed color
        //Check if color is in the correct position
        for (let i = 0; i < guess_length; i++) {
            console.log("Checking if guessed color", guessed[i].color, "equals", objective[i], guessed[i].color == objective[i]);
            //Check if element it correct
            if (objective[i] == guessed[i].color) {
                //Add to green array
                green.push(i);
                used[guessed[i].color]++;

                //Set Shadow green
                id(guessed[i].id).style.boxShadow = "0 0 15px #00FF00";
            }
            else {
                win = false;
            }
        }

        console.log("Correct ", green);
        console.log("\n");

        console.log("Checking Blue");
        //Check if color is contained but in the wrong position 
        for (let guess_position = 0; guess_position < guess_length; guess_position++) {

            console.log("Checking if guessed", guessed[guess_position].color, "exists in objective", objective[guess_position].includes(guessed[guess_position].color));

            if (Object.values(objective).includes(guessed[guess_position].color)) {

                console.log("Exists!, Making Sure it's not replacing a green");
                let empty = true;

                //If color is in the same position as a green :/
                green.forEach(green_position => {
                    if (green_position == guess_position) empty = false;
                });

                if (empty) {
                    console.log(empty, "NOT in same position as a green :)");

                    let color = guessed[guess_position].color;

                    /*console.log("Amount of", color, "in objective", objective_amount[color]);
                    console.log("Amount of", color, "in guess", guessed_amount[color]);
                    console.log("Amount of", color, "used", used[color]);*/

                    if (used[color] < guessed_amount[color] && used[color] < objective_amount[color]) {
                        console.log("Blue Set");
                        id(guessed[guess_position].id).style.boxShadow = "0 0 15px #0000FF";
                        used[color]++;
                    }
                    else {
                        //Object is included but wrong, set red but dont remove control
                        red[guess_position] = false;
                        console.log("Position Used");
                    }
                }
                else console.log(empty, "In same position as a green");
            }
            else {
                //Object is not included, set red, remove control
                red[guess_position] = true;
            }
        }

        Object.entries(red).forEach(entry => {
            position = entry[0];

            if (red_highlights) id(guessed[position].id).style.boxShadow = "0 0 15px #FF0000";
            red_highlighted.push(guessed[position].id);   
            
            if (entry[1]) {
                id(guessed[position].color).style.display = "none";
                sizeControls();
            }

        } );      

        if (win) {
            party.confetti(id("gameArea"), {
                count: party.variation.range(80, 80)
            });
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
    removeAllBorders();
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
    hardMode = this.checked;
});

window.addEventListener('resize', function(e) {
    setShape(shape);
    sizeControls();
});

function sizeControls() {
    let control_size = document.querySelector(".circle").getBoundingClientRect().width * 0.8;

    id("controlArea").style.width = (control_size * 5) + "px";

    document.querySelectorAll(".color").forEach(color => {
        color.style.width = control_size + "px";
        color.style.height = control_size + "px";
    })
}

loadGame();
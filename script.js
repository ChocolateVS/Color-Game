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
    console.log("OBJECTIVE", objective[0].color, objective[1].color, objective[2].color, objective[3].color);
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

function checkGuess() { 
    if (Object.keys(guessed).length == guess_length) {
        selected = -1;

        let _objective = calcObject(objective);
        let _guessed = calcObject(guessed);

        /*if (hardMode) {
            console.log("HARD MODE CHECK", previous_correct);
            console.log("GUESSES", temp_guessed);
            for (let i = 0; i < previous_correct.length; i++) {
                if (!temp_guessed.includes(previous_correct[0][i])) {
                    alert("HARD MODE IS ON, Your guess must contain all previously correct colors");
                    return;
                }
            }
        }*/

        console.log("\n", "GUESS", _guessed);
        console.log("Objective", _objective, "\n");

        let guess_colors = Object.keys(_guessed);

        let correct = [];
        let blue = [];
        let red = [];

        let win = true;

        //For each color guessed
        for (let i = 0; i < guess_colors.length; i++) {

            console.log("ELEMENT", i, "Guess", guess_colors[i], "Should be", Object.keys(_objective)[i]);
            
            //For each position of the guessed color in the guess 
            _guessed[guess_colors[i]].forEach(guess_position => {

                try {
                    let check_colors = _objective[guess_colors[i]];

                    //For each position in the objective of the color that we're looking for
                    for (let j = 0; j < check_colors.length; j++) {

                        console.log("Check", guess_colors[i], "at position", guess_position, "in guess and position", check_colors[j], "in objective");

                        //If guess was in objectives at the correct index
                        if (guess_position == check_colors[j]) {
                            console.log(guess_colors[i], "was found at index", check_colors[j], "of objectives added", guess_position, guess_colors[i], 'to correct');
                            id(guessed[check_colors[j]].id).style.boxShadow = "0 0 15px #00FF00";
                            correct.push([guess_position, guess_colors[i]]);
                        }
                        else {
                            console.log(guess_colors[i], "was found at incorrect index", check_colors[j], "of objectives added", guess_position, guess_colors[i], 'to blue');
                            blue.push([guess_position, guess_colors[i]]);
                        }
                    }
                                    
                }
                catch (e) {
                    win = false;
                    console.log("Not Found"); 
                    red.push(guess_position);
                }
            });
        }

        //For each guess that is included in the objective, before turning blue we need to check
        //if the guess color is not one of the correct guesses, and it is not the same color as a correct guess, unless the objective contains multiple of the color guessed
            //increment amount correct of type of guess
        //else if the guess color is one of the correct objectives AND objective contains multiple of the color guessed
            //if so increment amount correct of type of guess

        console.log("\n ARRAYS", "BLUE", blue, "GREEN", correct);

        final_guesses = {};

        for (let i = 0; i < blue.length; i++) {  
            let color = blue[i][1];
            let index = blue[i][0];
            let amount_correct_of_color = countAmount(color, correct, 1);
            let should_be_correct_of_color = _objective[color].length;
                
            //If guess exists but is not in correct position
            //And the amount of things in correct position < number of possible positions is 
            
            console.log("CHECKING COLOR", color, "@ INDEX", index);
            console.log("AMOUNT OF ", color, "IN CORRECT POSITION", amount_correct_of_color, "POSSIBLE AMOUNT OF COLOR CORRECT", should_be_correct_of_color);

            //If amount of items in same position as a correct item > 1 : can't replace correct item
            if (countAmount(index, correct, 0) == 0) {

                //if guessed color is not the same color as a correct guess, unless the objective contains multiple of the color guessed
                if (amount_correct_of_color == 0 || amount_correct_of_color < should_be_correct_of_color) {
                    win = false;
                    id(guessed[index].id).style.boxShadow = "0 0 15px #0000FF"; 
                    console.log("BLUE"); 
                }
                //Else if its not included in the correct, it be red
                else {
                    win = false;
                    red.push(index);
                    console.log("RED");
                }
            }
            else {
                console.log("GREEN");
            }
        }

        red.forEach(e => {
            if (red_highlights) id(guessed[e].id).style.boxShadow = "0 0 15px #FF0000";
            red_highlighted.push(guessed[e].id);

            if (countAmount(guessed[e].color, correct, 1) == 0) {
                id(guessed[e].color).style.display = "none";
            } 
        });

        sizeControls(); 

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

//Returns amount of "something", in an array
//index 0 is position
//index 1 is color

function countAmount(thing, arr, index) {
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        if(arr[i][index] == thing) count ++;
    }

    return count;
}

function calcObject(o) {
    const counts = {};

    for (const value of Object.values(o)) {
        let pos = countInArray(Object.values(o), value.color);
        counts[value.color] = pos;
    }
    return counts;
}

function countInArray(array, what) {
    var pos = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].color === what) {
            pos.push(i);
        }
    }
    return pos;
}

/*function check(used, temp_g, g) {
    //Find first unused occurences of the guess in the objective
    for (let j = 0; j < Object.values(used).length; j++) {
        console.log("CHECKING", used[j].type, temp_guessed[i], used[j].used);
        if (used[j].type == temp_guessed[i] && !used[j].used) {
            
            console.log("BLUE?", g[i], g[j]);
            
            used[j].used = true;

            previous_correct.push(temp_guessed[j], false);
            id(guessed[j].id).style.boxShadow = "0 0 15px #0000FF";
            id(guessed[i].id).style.boxShadow = "0 0 15px #0000FF";
        }
    }
}*/

function setObjective() {
    var size = Object.keys(useableColors).length;
    for (let i = 0; i < guess_length; i++) {
        objective[i] = {
            color: Object.keys(useableColors)[Math.floor(Math.random() * size)],
            position: i
        }
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
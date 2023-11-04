// Select important DOM elements
const body = document.querySelector("body");
const btn_container = document.querySelector(".btn-container");
const how_to_play_btn = document.querySelector(".question-btn");
const how_to_play_container = document.getElementById("how-to-play-container");
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");
const againWin = document.querySelector(".play-again-win");
const againLose = document.querySelector(".play-again-lose");
const correctWordWin = document.querySelector(".correct-word-win");
const correctWordLose = document.querySelector(".correct-word-lose");
const containers1 = document.getElementById("con-1");
const containers7 = document.getElementById("con-7");
const close_btn = document.querySelectorAll(".close");

// Arrays to store user's guesses and the target word
const guess = [];
const target_guess = [];

// Flags and counters
let ready_to_guess = true;
let round = 1;
let current_row = update_current_row();

// Event listener for keyboard input
body.addEventListener("keydown", (event) => {
    if (event.code.slice(0, 3) == "Key" && guess.length < 5) {
        // Add a letter to the guess
        guess.push(event.key);
        display_guessed_word(true); // Animate if true
    } else if (event.code == "Backspace" && guess.length > 0) {
        // Remove the last letter from the guess
        guess.pop();
        display_guessed_word();
    } else if (event.code == "Enter" && guess.length == 5) {
        calculate();
        if (calculate() !== true) {
            new_round();
        }
    }
});

// Event listeners for "Play Again" buttons
againWin.addEventListener("click", () => {
    // Reset the game for a win
    resetGame();
    win.style.display = "none";
});

againLose.addEventListener("click", () => {
    // Reset the game for a loss
    resetGame();
    lose.style.display = "none";
});

function resetGame() {
    target_guess.length = 0;
    get_random_word(target_guess);
    round = 1;
    current_row = update_current_row();
    guess.length = 0;
    correctWordWin.innerHTML = "";
    correctWordLose.innerHTML = "";
    remove_all_animation_classes();
    display_guessed_word();
    body.classList.remove("background");
    clear_colors();
    clear_letters();
}

// Function to clear color classes on letters
function clear_colors() {
    document.querySelectorAll(".letter").forEach((ele) => {
        ele.classList.remove("green", "yellow", "gray");
    });
}

// Function to clear letter content
function clear_letters() {
    document.querySelectorAll("span").forEach((ele) => {
        ele.innerHTML = "";
    });
}

// Function to remove animation classes
function remove_all_animation_classes() {
    document.querySelectorAll(".letter").forEach((ele) => {
        ele.classList.remove("bounce");
    });
}

// Event listener for animation end to remove animation classes
document.querySelectorAll(".letter").forEach((ele) => {
    ele.addEventListener("animationend", remove_all_animation_classes);
});

// Function to fetch a random word
function get_random_word(target_array) {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
        .then((res) => res.json())
        .then((data) => {
            target_array.push(...data[0]);
            let joinedTargetGuess = target_array.join("");
            correctWordWin.innerHTML = joinedTargetGuess.toUpperCase();
            correctWordLose.innerHTML = joinedTargetGuess.toUpperCase();
            console.log(joinedTargetGuess)
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

get_random_word(target_guess);

// Function to start a new game round
function new_round() {
    round++;
    current_row = update_current_row();
    guess.length = 0;
    if (round === 7) {
        lose.style.display = "block";
        body.classList.add("background");
    }
}

// Function to calculate feedback for the user's guess
function calculate() {
    const colors = [];
    let correct = 0;
    let target_letter_occurrences = letter_occurrences();
    let greens = green_instances();

    // First loop to look for correct spots and letters not in the word
    for (let index in guess) {
        if (!target_guess.includes(guess[index])) {
            colors[index] = "gray";
        } else if (target_guess[index] == guess[index]) {
            colors[index] = "green";
            ++correct;
            ++greens[guess[index]];
        } else {
            colors[index] = "";
        }
    }

    // Second loop to deal with incorrect positions / duplicate letters
    for (let index in guess) {
        if (colors[index] != "green" && colors[index] != "gray") {
            if (
                target_letter_occurrences[guess[index]] == greens[guess[index]]
            ) {
                colors[index] = "gray";
            } else {
                colors[index] = "yellow";
            }
        }
    }

    // Apply colors to the letter elements
    for (let index in guess) {
        current_row[index].classList.add(colors[index]);
    }

    // Check for a win condition
    if (colors.every((color) => color === "green")) {
        win.style.display = "block";
        body.classList.add("background");
        return true;
    }
}

// Function to initialize green instances
function green_instances() {
    const instances = {};
    for (let letter of guess) {
        instances[letter] = 0;
    }
    return instances;
}

// Function to count letter occurrences in the target word
function letter_occurrences() {
    return target_guess.reduce((acc, curr) => {
        return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
}

// Function to display the guessed word
function display_guessed_word(animate = false) {
    const guess_copy = [...guess];

    while (guess_copy.length < 5) {
        guess_copy.push("");
    }

    for (let i = 0; i < 5; i++) {
        current_row[i].querySelector("span").innerText = guess_copy[i];
        if (guess.length === i + 1 && animate) {
            current_row[i].classList.add("bounce");
        }
    }

    for (let box in current_row) {
        if (box < guess.length) {
            current_row[box].classList.add("full");
        } else {
            current_row[box].classList.remove("full");
        }
    }
}

// Function to update the current row of letter elements
function update_current_row() {
    return [
        document.querySelector(`#one_${round}`),
        document.querySelector(`#two_${round}`),
        document.querySelector(`#three_${round}`),
        document.querySelector(`#four_${round}`),
        document.querySelector(`#five_${round}`),
    ];
}

// Array of text for typing animation
const text = [
    "W",
    "A",
    "T",
    "E",
    "R",
    "E",
    "A",
    "R",
    "T",
    "H",
    "A",
    "P",
    "P",
    "L",
    "E",
];

const typing_Text = [];

// Initialize the current index for typing
let current_Index = 0;

// Variable for the animation interval
let animation_Interval;

// Loop to populate the typing_Text array with HTML elements
for (let i = 1; i <= text.length; i++) {
    typing_Text.push(document.getElementById(`typing-text-${i}`));
}

// Loop to populate the containers array
const containers = [];
for (let i = 1; i <= text.length; i++) {
    containers.push(document.getElementById(`con-${i}`));
}

// Function to type text in the HTML elements
function typeTextElement(element) {
    if (current_Index >= text.length) {
        current_Index = 0;
        typing_Text.forEach((element) => (element.innerHTML = ""));
    }

    element.innerHTML += text[current_Index];
    current_Index++;
}

// Function to start the typing animation
function start_Typing_Animation() {
    animation_Interval = setInterval(function () {
        typeTextElement(typing_Text[current_Index]);
    }, 260);

    // Set a timeout to stop the animation after a certain duration
    setTimeout(() => {
        clearInterval(animation_Interval);

        // Modify the appearance of specific elements
        containers[0].style.backgroundColor = "green";
        containers[6].style.backgroundColor = "goldenrod";
        containers[0].style.borderColor = "green";
        containers[6].style.borderColor = "goldenrod";

        // Add the "fade" class and remove elements at specific indices
        containers[0].classList.add("fade");
        containers[6].classList.add("fade");
        containers.splice(6, 1);
        containers.splice(0, 1);

        // Reset the appearance of all elements in the array
        typing_Text.forEach((element) => {
            element.style.color = "white";
        });
        containers.forEach((element) => {
            element.classList.add("fade");
            element.style.backgroundColor = "#3c3c3c";
        });
    }, 4000);
}

// Function to stop the typing animation
function stop_Typing_Animation() {
    // Clear the animation interval and the timeout
    clearInterval(animation_Interval);

    // Restore elements at specific indices
    containers.splice(5, 0, containers7);
    containers.splice(0, 0, containers1);

    // Reset the current index and appearance of all elements
    current_Index = 0;
    typing_Text.forEach((element) => {
        element.innerHTML = "";
        element.style.color = "black";
    });
    containers.forEach((element) => {
        element.classList.remove("fade");
        element.style.backgroundColor = "white";
        element.style.borderColor = "black";
    });
}

// Event listener for "How to Play" button
how_to_play_btn.addEventListener("click", () => {
    how_to_play_container.style.display = "block";
    body.classList.add("background");
    start_Typing_Animation();
});

// Event listeners for "Close" buttons
close_btn.forEach((closeElement) => {
    closeElement.addEventListener("click", () => {
        const container = closeElement.closest(".btn-container");
        if (container) {
            container.style.display = "none";
            body.classList.remove("background");
            stop_Typing_Animation();
        }
    });
});

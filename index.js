const body = document.querySelector("body"); // body element of DOM
const btn_container = document.querySelector(".btn-container");
const how_to_play_btn = document.querySelector(".question-btn");
const how_to_play_container = document.getElementById("how-to-play-container");
const leaderboard_btn = document.querySelector(".leaderboard-btn");
const leaderboard_container = document.getElementById("leaderboard-container");
const typingText1 = document.getElementById("typing-text-1");
const typingText7 = document.getElementById("typing-text-7");
const close_btn = document.querySelectorAll(".close");
const guess = []; // current word the user is guessing (all letters are individual array elements)
const target_guess = []; // current word the user is trying to guess (all letters are individual array elements)
console.log(target_guess);
let ready_to_guess = true;

let round = 1; // what row/guess the user is currently on
let current_row = [
    // all boxes in the current row
    document.querySelector(`#one_${round}`),
    document.querySelector(`#two_${round}`),
    document.querySelector(`#three_${round}`),
    document.querySelector(`#four_${round}`),
    document.querySelector(`#five_${round}`),
];

// Create an array of text to be displayed
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

// Create an array to hold HTML elements for typing text
const typing_Text = [];

// Initialize the current index for typing
let current_Index = 0;

// Declare a variable for the animation interval
let animation_Interval;

// Loop to populate the typing_Text array with HTML elements
for (let i = 1; i <= text.length; i++) {
    typing_Text.push(document.getElementById(`typing-text-${i}`));
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
    }, 300);

    // Set a timeout to stop the animation after a certain duration
    timeout = setTimeout(function () {
        clearInterval(animation_Interval);

        // Modify the appearance of specific elements
        typing_Text[0].style.backgroundColor = "green";
        typing_Text[0].style.color = "white";
        typing_Text[6].style.backgroundColor = "goldenrod";
        typing_Text[6].style.color = "white";

        // Add the "fade" class and remove elements at specific indices
        typing_Text[0].classList.add("fade");
        typing_Text[6].classList.add("fade");
        typing_Text.splice(6, 1);
        typing_Text.splice(0, 1);

        // Reset the appearance of all elements in the array
        typing_Text.forEach((element) => {
            element.classList.add("fade");
            element.style.backgroundColor = "#3c3c3c";
            element.style.color = "white";
        });
    }, 4790);
}

// Function to stop the typing animation
function stop_Typing_Animation() {
    // Clear the animation interval and the timeout
    clearInterval(animation_Interval);
    clearTimeout(timeout);

    // Restore elements at specific indices
    typing_Text.splice(5, 0, typingText7);
    typing_Text.splice(0, 0, typingText1);

    // Reset the current index and appearance of all elements
    current_Index = 0;
    typing_Text.forEach((element) => {
        element.classList.remove("fade");
        element.style.backgroundColor = "white";
        element.style.color = "black";
        element.innerHTML = "";
    });
}

// Event listener for "How to Play" button
how_to_play_btn.addEventListener("click", () => {
    how_to_play_container.style.display = "block";
    start_Typing_Animation();
});

// Event listener for "Leaderboard" button
leaderboard_btn.addEventListener("click", () => {
    leaderboard_container.style.display = "block";
});

// Event listeners for "Close" buttons
close_btn.forEach((closeElement) => {
    closeElement.addEventListener("click", () => {
        const container = closeElement.closest(".btn-container");
        if (container) {
            container.style.display = "none";
            stop_Typing_Animation();
        }
    });
});

body.addEventListener("keydown", (event) => {
    if (event.code.slice(0, 3) == "Key" && guess.length < 5) {
        // if keydown is between A and Z keys and word isn't 5 letters
        guess.push(event.key);
        display_guessed_word(true);
    } else if (event.code == "Backspace" && guess.length > 0) {
        guess.pop();
        display_guessed_word();
    } else if (event.code == "Enter" && guess.length == 5) {
        calculate();
        new_round();
    }
});

function remove_all_animation_classes() {
    // function to remove animation class
    document.querySelectorAll(".letter").forEach((ele) => {
        ele.classList.remove("bounce");
    });
}

document.querySelectorAll(".letter").forEach((ele) => {
    // add event listener on all boxes to remove animation class after animation has ended
    ele.addEventListener("animationend", remove_all_animation_classes);
});

function new_round() {
    round++;
    current_row = update_current_row();
    guess.length = 0;
}

function calculate() {
    const colors = [];
    let correct = 0;

    let target_letter_occurrences = letter_occurrences();
    let greens = green_instances();

    // First loop to look for correct spots and letters not in the word
    for (let index in guess) {
        if (!target_guess.includes(guess[index])) {
            // target word does not include letter
            colors[index] = "gray";
        } else if (target_guess[index] == guess[index]) {
            // letter in right spot
            colors[index] = "green";
            ++correct;
            ++greens[guess[index]];
        } else {
            colors[index] = ""; // placeholder for any letter not meeting these critera
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

    current_row[0].classList.add(colors[0]);
    current_row[1].classList.add(colors[1]);
    current_row[2].classList.add(colors[2]);
    current_row[3].classList.add(colors[3]);
    current_row[4].classList.add(colors[4]);
}

function green_instances() {
    // initializes an object to track how many 'green' instances per letter there are
    const instances = {};
    for (let letter of guess) {
        instances[letter] = 0;
    }
    return instances;
}

function letter_occurrences() {
    // creates an object that counts how many instances of each letter there is in the target word
    return target_guess.reduce((acc, curr) => {
        return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
}

function display_guessed_word(animate = false) {
    const guess_copy = [...guess]; // copy of the guess array

    while (guess_copy.length < 5) {
        guess_copy.push(""); // add blanks to fill up 5 elements in the array
    }

    //fill the current row boxes with letters and add animation class if required
    current_row[0].querySelector("span").innerText = guess_copy[0];
    if (guess.length == 1 && animate) {
        document.querySelector(`#one_${round}`).classList.add("bounce");
    }

    current_row[1].querySelector("span").innerText = guess_copy[1];
    if (guess.length == 2 && animate) {
        document.querySelector(`#two_${round}`).classList.add("bounce");
    }

    current_row[2].querySelector("span").innerText = guess_copy[2];
    if (guess.length == 3 && animate) {
        document.querySelector(`#three_${round}`).classList.add("bounce");
    }

    current_row[3].querySelector("span").innerText = guess_copy[3];
    if (guess.length == 4 && animate) {
        document.querySelector(`#four_${round}`).classList.add("bounce");
    }

    current_row[4].querySelector("span").innerText = guess_copy[4];
    if (guess.length == 5 && animate) {
        document.querySelector(`#five_${round}`).classList.add("bounce");
    }

    //add the full class (black outline and font color) for boxes that have a letter in them and remove for empty

    for (let box in current_row) {
        if (box < guess.length) {
            current_row[box].classList.add("full");
        } else {
            current_row[box].classList.remove("full");
        }
    }
}

function update_current_row() {
    return [
        document.querySelector(`#one_${round}`),
        document.querySelector(`#two_${round}`),
        document.querySelector(`#three_${round}`),
        document.querySelector(`#four_${round}`),
        document.querySelector(`#five_${round}`),
    ];
}

function get_random_word(target_arry) {
    // this api is a random word generator which fetches a random word with the length of 5
    fetch("https://random-word-api.herokuapp.com/word?length=5")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            for (const letter of data[0]) {
                target_arry.push(letter);
            }
        });

    //IF YOU WANT TO ADD THE WORD TO A LOCAL STORAGE AND DO SOMETHING WITH IT REPLACE THIS.

    // const stored_random_word = localStorage.getItem("randomWord"); // grabs the item that is set in
    // if (stored_random_word) {
    //     for(const letter of stored_random_word){ // pushes the random word into the "guess" array
    //         target_arry.push(letter);
    //     }
    // } else {
    //
    //     fetch("https://random-word-api.herokuapp.com/word?length=5")
    //         .then((Response) => {
    //             return Response.json(); // converts this to a javascript array
    //         })
    //         .then((data) => {
    //             // sets the item to the local storage within the site, we can keep it there and update it weekly
    //             localStorage.setItem("randomWord", data[0]);
    //         });
    // }
}

get_random_word(target_guess);

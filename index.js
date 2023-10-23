

const body = document.querySelector('body') // body element of DOM

const guess = []
const round = 1 // basically which attempt the user is on (from 1 to 6)

body.addEventListener('keydown', (event) => {
    if(event.code.slice(0,3) == 'Key' && guess.length < 5) { // if keydown is between A and Z keys and word isn't 5 letters
        guess.push(event.key)
        display_guessed_word()
    } else if(event.code == 'Backspace' && guess.length > 0){
        guess.pop()
        display_guessed_word()
    }
})

function display_guessed_word(){
    const guess_copy = [...guess] // copy of the guess array
    
    while(guess_copy.length < 5){
        guess_copy.push('') // add blanks to fill up 5 elements in the array
    }

    //fill the current row boxes with letters
    document.querySelector(`#one_${round}`).innerText = guess_copy[0]
    document.querySelector(`#two_${round}`).innerText = guess_copy[1]
    document.querySelector(`#three_${round}`).innerText = guess_copy[2]
    document.querySelector(`#four_${round}`).innerText = guess_copy[3]
    document.querySelector(`#five_${round}`).innerText = guess_copy[4]
}
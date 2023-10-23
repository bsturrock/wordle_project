

const body = document.querySelector('body') // body element of DOM
const guess = [] // current word the user is guessing (all letters are individual array elements)
let round = 1 // what row/guess the user is currently on
let current_row = [ // all boxes in the current row
    document.querySelector(`#one_${round}`),
    document.querySelector(`#two_${round}`),
    document.querySelector(`#three_${round}`),
    document.querySelector(`#four_${round}`),
    document.querySelector(`#five_${round}`)
]

body.addEventListener('keydown', (event) => {
    if(event.code.slice(0,3) == 'Key' && guess.length < 5) { // if keydown is between A and Z keys and word isn't 5 letters
        guess.push(event.key)
        display_guessed_word(true)
    } else if(event.code == 'Backspace' && guess.length > 0){
        guess.pop()
        display_guessed_word()
    } else if(event.code == 'Enter' && guess.length == 5){
        // some function for calculating the guess
        return
    }
})

document.querySelectorAll('.letter').forEach((ele)=>{ // add event listener on all boxes to remove animation class after animation has ended
    ele.addEventListener('animationend', (event)=>{
        remove_all_animation_classes()
    })
})

function remove_all_animation_classes(){ // function to remove animation class
    document.querySelectorAll('.letter').forEach((ele)=>{ele.classList.remove('bounce')})
}

function display_guessed_word(animate=false){
    const guess_copy = [...guess] // copy of the guess array
    
    while(guess_copy.length < 5){
        guess_copy.push('') // add blanks to fill up 5 elements in the array
    }

    //fill the current row boxes with letters and add animation class if required
    document.querySelector(`#one_${round}`).innerText = guess_copy[0]
    if(guess.length == 1 && animate){document.querySelector(`#one_${round}`).classList.add('bounce')}

    document.querySelector(`#two_${round}`).innerText = guess_copy[1]
    if(guess.length == 2 && animate){document.querySelector(`#two_${round}`).classList.add('bounce')}
    
    document.querySelector(`#three_${round}`).innerText = guess_copy[2]
    if(guess.length == 3 && animate){document.querySelector(`#three_${round}`).classList.add('bounce')}

    document.querySelector(`#four_${round}`).innerText = guess_copy[3]
    if(guess.length == 4 && animate){document.querySelector(`#four_${round}`).classList.add('bounce')}

    document.querySelector(`#five_${round}`).innerText = guess_copy[4]
    if(guess.length == 5 && animate){document.querySelector(`#five_${round}`).classList.add('bounce')}


    //add the full class (black outline and font color) for boxes that have a letter in them and remove for empty

    for(let box in current_row){
        if(box < guess.length){
            boxes[box].classList.add('full')
        } else {
            boxes[box].classList.remove('full')
        }
    }
}

function update_current_row(){
    return [
        document.querySelector(`#one_${round}`),
        document.querySelector(`#two_${round}`),
        document.querySelector(`#three_${round}`),
        document.querySelector(`#four_${round}`),
        document.querySelector(`#five_${round}`)
    ]
}
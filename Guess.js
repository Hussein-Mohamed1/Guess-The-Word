let words;
let currentTry;
let wordToGuess;
let tries;
let numberofLetters
fetch('https://random-word-api.herokuapp.com/word?number=1000').then(repons => repons.json()).then(obj => {
    words = Array.from(obj);

    currentTry = 1;
    wordToGuess = "";
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    if (wordToGuess.length > 8)
        tries = 8;
    else
        tries = 6;
    numberofLetters = wordToGuess.length;
    console.log(wordToGuess);
    generateInput();
}).catch(err => {
    console.log(`Error is ${err}`);
})
// generate input 
function generateInput() {
    let inputs = document.querySelector('.inputs');
    for (let i = 1; i <= tries; i++) {
        let input = document.createElement('div');
        if (i === 1) {
            input.classList.add('activeInput');
        } else {
            input.classList.add('disabled-inputs');
        }
        input.classList.add(`Try${i}`);
        let curTry = document.createElement('span');
        curTry.textContent = `Try ${i}`;
        input.appendChild(curTry);
        for (let j = 1; j <= numberofLetters; j++) {
            let letter = document.createElement('input');
            letter.type = 'text';
            letter.id = `input-${i}-letter-${j}`;
            letter.setAttribute('maxlength', '1');
            input.appendChild(letter);
        }
        inputs.appendChild(input);
    }
    inputs.querySelector('#input-1-letter-1').focus();
    // handel disabled input
    let disabledInputs = document.querySelectorAll('.disabled-inputs input');
    disabledInputs.forEach((i) => i.disabled = true);
    takeInput();
}

// take input function 

function takeInput() {
    //write in inputs
    let activeInputs = document.querySelectorAll(`.Try${currentTry} input`);
    activeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase();
            if (index < numberofLetters - 1) {
                activeInputs[index + 1].focus();
            }
        })

        // handle input and keyboard events
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                if (index < numberofLetters - 1) {
                    activeInputs[index + 1].focus();
                }
            } else if (e.key === 'ArrowLeft') {
                if (index > 0) {
                    activeInputs[index - 1].focus();
                }
            }
        })
    })
}

let overlay = document.querySelector('#gameOverlay');
let message = document.querySelector('#overlayMessage');
let endGame = document.querySelector('#endGameBtn');
let anotherword = document.querySelector('#anotherWordBtn');
let overlaytitle = document.querySelector('#overlayTitle');
// logic of Game    
let check = document.querySelector('.check');
let hint = document.querySelector('.hint');

check.addEventListener('click', handelLogic);
function handelLogic() {
    // todo: function to ckeck if all inputs are filled
    let successGuess = true;
    for (let i = 1; i <= numberofLetters; i++) {
        let curletter = document.querySelector(`#input-${currentTry}-letter-${i}`);
        let rightletter = wordToGuess[i - 1];
        if (curletter.value === rightletter) {
            curletter.classList.add('yes-in-place');
        } else if (wordToGuess.includes(curletter.value) && curletter.value !== '') {
            successGuess = false;
            curletter.classList.add('not-in-place');
        } else {
            successGuess = false;
            curletter.classList.add('no')
        }
    }
    let curinput = document.querySelector(`.Try${currentTry}`);
    let currentInputs = document.querySelectorAll(`.Try${currentTry} input`);
    currentInputs.forEach((input) => {
        input.disabled = true;
    })
    curinput.classList.add('disabled-inputs');
    if (!successGuess && currentTry < tries) {
        currentTry++;
        document.querySelector(`.Try${currentTry}`).classList.remove('disabled-inputs')
        let nextTry = document.querySelectorAll(`.Try${currentTry} input`);
        nextTry.forEach((input) => {
            input.disabled = false;
        })
        nextTry[0].focus();
        takeInput();
    } else if (successGuess) {
        let allinputsdiv = document.querySelectorAll('.inputs > div');
        allinputsdiv.forEach((input) => {
            input.classList.add('disabled-inputs');
        })
        check.disabled = true;
        hint.disabled = true;
        overlaytitle.innerHTML = 'You Won!'
        message.innerHTML = 'Congratulations! You guessed the word correctly.';
        overlay.style.opacity = 1;
        overlay.style.visibility = 'visible';
    }
    else {
        let allinputsdiv = document.querySelectorAll('.inputs > div');
        allinputsdiv.forEach((input) => {
            input.classList.add('disabled-inputs');
        })
        check.disabled = true;
        hint.disabled = true;
        overlaytitle.innerHTML = 'You Lose!'
        message.innerHTML = `Don't give up! The word was ${wordToGuess}. Try again`;
        overlay.style.opacity = 1;
        overlay.style.visibility = 'visible';
    }
}

// handel end game or another word

endGame.addEventListener('click', () => {
    overlay.style.opacity = 0;
    overlay.style.visibility = 'hidden';
});

anotherword.addEventListener('click', () => {
window.location.reload();
});

// handel hints 
let numberofHints = 2;
let spanHint = document.querySelector('.hint span');
spanHint.textContent = numberofHints;

hint.addEventListener('click', () => {

    if (numberofHints > 0) {
        if (currentTry === 1) {
            if (numberofHints === 2) {
                document.querySelector('#input-1-letter-1').classList.add('yes-in-place');
                document.querySelector('#input-1-letter-1').value = wordToGuess[0];
                document.querySelector('#input-1-letter-1').disabled = true;
                document.querySelector('#input-1-letter-2').focus();
            } else {
                document.querySelector('#input-1-letter-2').classList.add('yes-in-place');
                document.querySelector('#input-1-letter-2').value = wordToGuess[1];
                document.querySelector('#input-1-letter-2').disabled = true;
                document.querySelector('#input-1-letter-3').focus();
            }
        } else {
            let hintuse = false;
            let flag;
            let i = 1;
            for (; i <= numberofLetters && !hintuse; i++) {
                for (let j = currentTry; j > 0; j--) {
                    let currenthint = document.querySelector(`#input-${j}-letter-${i}`);
                    flag = true;
                    if (currenthint.classList.contains('yes-in-place')) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    document.querySelector(`#input-${currentTry}-letter-${i}`).classList.add('yes-in-place');
                    document.querySelector(`#input-${currentTry}-letter-${i}`).value = wordToGuess[i - 1];
                    document.querySelector(`#input-${currentTry}-letter-${i}`).disabled = true;
                    if (i !== numberofLetters)
                        document.querySelector(`#input-${currentTry}-letter-${i + 1}`).focus();
                    hintuse = true;
                }
            }
        }
    }
    numberofHints--;
    if (numberofHints !== 0)
        spanHint.textContent = numberofHints;
    else {
        spanHint.textContent = 0;
        hint.disabled = true;
    }
})
// handel back space

function handelbackspace(e) {
    if (e.key === 'Backspace') {
        if(e.target.tagName === 'INPUT') {
            e.target.value = '';
            if (e.target.previousSibling && !e.target.previousSibling.classList.contains('yes-in-place')) {
                e.target.previousSibling.value = '';
                e.target.previousSibling.focus();
            }
        }
    }

}
document.addEventListener('keydown', handelbackspace);



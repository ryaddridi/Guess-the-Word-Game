// Setting Game Name
let gameName = "Guess The Verb";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By D.Ryad `;

// Setting Game Options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Advise", "Bright", "Expect", "Follow", "Insure"];
wordToGuess = words[Math.floor(Math.random() * words.length )].toLowerCase();
let messageArea = document.querySelector(".message");

document.querySelector(".hint span").innerHTML=numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);


function generateInput(){
    const inputsContainer =document.querySelector(".inputs");
    for(let i=1;i<=numbersOfTries;i++){
        const TryDiv=document.createElement('div');
        TryDiv.classList.add(`try-${i}`)
        TryDiv.innerHTML=`<span>Try ${i}</span>`
        if(i!==1){TryDiv.classList.add("disabled-inputs")}
        for(let j=1;j<=numbersOfLetters;j++){
            const input=document.createElement('input');
            input.type="text";
            input.id=`guess-${i}-letter-${j}`
            input.setAttribute("maxlength","1");
            TryDiv.appendChild(input);
        }

        inputsContainer.appendChild(TryDiv);
    }
    inputsContainer.children[0].children[1].focus();
    //disabled all input of disabled divs except first one 
    const inputsInDisabledDiv =document.querySelectorAll(".disabled-inputs input")
    inputsInDisabledDiv.forEach((input) => (input.disabled=true)); 

    const inputs=document.querySelectorAll("input");
    inputs.forEach((input,index)=>{
        input.addEventListener("input",function(){
            this.value= this.value.toUpperCase();
            // if(inputs[index+1].disabled === false){
            //     inputs[index+1].focus()
            // }
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        })
        input.addEventListener("keydown",function(event){
            //key: 'ArrowRight' key: 'ArrowLeft'
            const currentIndex =Array.from(inputs).indexOf(event.target)
            if(event.key === 'ArrowRight'){
                const nextInput=currentIndex+1
                if(nextInput<= inputs.length){inputs[nextInput].focus()}
            }
            if(event.key === 'ArrowLeft'){
                const prevInput=currentIndex-1
                if(prevInput>= 0){inputs[prevInput].focus()}
            }
            /*better code 
            if(event.key === 'ArrowRight' && currentIndex+1 <= inputs.length) inputs[currentIndex+1].focus()
            if(event.key === 'ArrowLeft'&& currentIndex-1>= 0)inputs[currentIndex-1>= 0].focus()
            */
        })
    })

};

console.log(wordToGuess);

const guessButton =document.querySelector(".check");
guessButton.addEventListener("click",handleGuesses);

function handleGuesses(){
    let successGuess = true;
    for(let i=1;i<=numbersOfLetters;i++){
        const inputField=document.getElementById(`guess-${currentTry}-letter-${i}`);
        const letter =inputField.value.toLowerCase();
        const actualLetter=wordToGuess[i-1];
        //GAME LOGIC
        if(letter===actualLetter){
            inputField.classList.add("yes-in-place")
        }else if(wordToGuess.includes(letter) && letter!==''){
            successGuess=false;
            inputField.classList.add("not-in-place");
        }else{
            successGuess=false;
            inputField.classList.add("no")
        }
    }
    if(successGuess){
        messageArea.innerHTML=`You Win The Word Is <span>${wordToGuess}</span>`
        if(numberOfHints===2){
            messageArea.innerHTML+=`<p>Congratz You Didn't Use Hints</p>`
        }
        let allTries=document.querySelectorAll(".inputs > div ")
        // Add Disabled Class On All Try Divs
        allTries.forEach((myDiv)=> myDiv.classList.add("disabled-inputs"));
        guessButton.disabled=true;
        getHintButton.disabled=true;

    }else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs =document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input)=> (input.disabled=true));

        currentTry++;
        const nextTryInputs =document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled= false));

        let el =document.querySelector(`.try-${currentTry}`);
        if(el){
            el.classList.remove("disabled-inputs")
            el.children[1].focus();
        }else{
            guessButton.disabled=true;
            getHintButton.disabled=true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
        }

    }
};

function getHint(){
    if (numberOfHints>0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML=numberOfHints;
    }
    if(numberOfHints===0){
        getHintButton.disabled=true
    }
    const enabledInputs =document.querySelectorAll("input:not([disabled])")
    const emptyEnabledInputs =Array.from(enabledInputs).filter((ele)=> ele.value==='')
    if(emptyEnabledInputs.length>0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length );
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if(indexToFill !== -1){
            randomInput.value=wordToGuess[indexToFill].toUpperCase();
        }
    }
};

document.addEventListener("keydown", handleBackspace);

function handleBackspace(event){
    if(event.key === 'Backspace'){
        const Inputs =document.querySelectorAll("input:not([disabled])")
        const currentIndex =Array.from(Inputs).indexOf(document.activeElement);
        if(currentIndex>0){
            const currentInput= Inputs[currentIndex];
            const prevInput=Inputs[currentIndex - 1];
            currentInput.value='';
            prevInput.value='';
            prevInput.focus();
        }
    }
}
window.onload=function(){
    generateInput();
};
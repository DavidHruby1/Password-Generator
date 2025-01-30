//
// Variables
//
const optionButtons = document.querySelectorAll(".btn2");
const slider = document.querySelector(".slider__input");
const copyToClipboard = document.getElementById("copy");
const regeneratePassword = document.getElementById("regenerate");
const outputText = document.querySelector(".output__text");
const dictionary = {
    "upperCase": "ACBDEFGHIJKLMNOPQRSTUVWXYZ", // 0-25
    "lowerCase": "abcdefghijklmnopqrstuvwxyz", // 0-25
    "numbers": "1234567890", // 0-9
    "symbols": "!#$%&()*+,-./:;<=>?@[]^_{|}~" // 0-27
};
const upperCaseButton = document.getElementById("upper");
const lowerCaseButton = document.getElementById("lower");
const numbersButton = document.getElementById("nums");
const symbolsButton = document.getElementById("symbols");
let lengthElement = document.getElementById("pwLength");
let activeCount = 0;



//
// Functions
//
/**
 * @param { String | Array } input
 * @returns { String }
 */
function randomChoice(input) {
    return input[Math.floor(Math.random() * input.length)];
}

/**
 * @param { Array } password 
 * @returns { Array }
 */
function randomSort(password) {
    passwordLength = password.length;
    sortedPassword = [];

    for (let i = 0; i < passwordLength; i++) {
        let randomElement = randomChoice(password.join(""));
        sortedPassword.push(randomElement);
        password.splice(password.indexOf(randomElement), 1);
    }

    return sortedPassword;
}

/**
 * @param { Number } length 
 * @param { Array } activeButtons
 * @returns { String }
 */
function generatePassword(length, activeButtons) {
    // Ošetření minima a maxima u délky
    if (length < 8) length = 8;
    if (length > 128) length = 128;

    let password = [];
    const remainingLength = length - activeButtons.length;

    // První se vždy vybere aspoň jeden znak z aktivních kategoií
    for (const i of activeButtons) {
        password.push(randomChoice(dictionary[i]));
    }

    // Poté se už vybírá čistě náhodně
    for (let i = 0; i < remainingLength; i++) {
        const pick = randomChoice(activeButtons);
        password.push(randomChoice(dictionary[pick]));
    }

    return randomSort(password).join("");
}

/**
 * @returns { Array }
 */
function getActiveButtons() {
    let activeButtons = [];

    if (upperCaseButton.classList.contains("active")) activeButtons.push("upperCase");
    if (lowerCaseButton.classList.contains("active")) activeButtons.push("lowerCase");
    if (numbersButton.classList.contains("active")) activeButtons.push("numbers");
    if (symbolsButton.classList.contains("active")) activeButtons.push("symbols");

    return activeButtons; 
}



//
// Events
//
copyToClipboard.addEventListener("click", () => {
    if (outputText.textContent.length > 0) {
        navigator.clipboard.writeText(outputText.textContent);
        window.alert("Password succesfully copied.")
    }
})

regeneratePassword.addEventListener("click", () => {
    const activeButtons = getActiveButtons();
    outputText.textContent = generatePassword(slider.value, activeButtons);
});

slider.addEventListener("input", () => {
    lengthElement.textContent = slider.value;
    const activeButtons = getActiveButtons();
    outputText.textContent = generatePassword(slider.value, activeButtons);
});

optionButtons.forEach(optionButton => {
    optionButton.addEventListener("click", function() {   
        if (this.classList.contains("active") && activeCount > 1) {
            this.classList.remove("active");
            activeCount--;
        }
        else if (!this.classList.contains("active")) {
            this.classList.add("active");
            activeCount++;
        }

        const activeButtons = getActiveButtons();
        outputText.textContent = generatePassword(slider.value, activeButtons);
    });
});
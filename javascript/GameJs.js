// Register form elements
const Name = document.getElementById('name');
const email = document.getElementById('mail-id');
const sid = document.getElementById('s-id');
const pw = document.getElementById('pw');

// Storing input from register-form
function store() {
    if (validateRegistration()) {
        const userData = {
            name: Name.value,
            email: email.value,
            sid: sid.value,
            pw: pw.value
        };

        // Retrieve existing users from local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the user already exists
        const userExists = users.some(user => user.name === userData.name || user.email === userData.email);
        if (userExists) {
            alert('User already exists. Please use a different name or email.');
            return;
        }

        // Add new user and save back to local storage
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = 'Login.html';
    }
}

// Validate registration form
function validateRegistration() {
    if (!Name.value || !email.value || !sid.value || !pw.value) {
        alert("All fields are required.");
        return false;
    }
    return true;
}

// Check login credentials
function check() {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userName = document.getElementById('name').value;
    const userPw = document.getElementById('pw').value;

    // Validate against all stored users
    const user = storedUsers.find(user => user.name === userName && user.pw === userPw);

    if (user) {
        alert('You are logged in.');
        window.location.href = 'Game.html';
    } else {
        alert('Error: Invalid credentials');
    }
}

// Game JavaScript (unchanged)
const selectBox = document.querySelector(".select-box");
const playerXButton = selectBox.querySelector(".options .playerX");
const playerOButton = selectBox.querySelector(".options .playerO");
const gameBoard = document.querySelector(".play-board");
const playerStatus = document.querySelector(".players");
const allSquares = document.querySelectorAll("section span");
const resultContainer = document.querySelector(".result-box");
const winnerMessage = resultContainer.querySelector(".won-text");
const restartButton = resultContainer.querySelector("button");

let currentPlayer = "X";
let botActive = true;

window.onload = () => {
    allSquares.forEach(square => {
        square.addEventListener("click", () => playerMove(square));
    });
};

playerXButton.onclick = () => {
    selectBox.classList.add("hide");
    gameBoard.classList.add("show");
};

playerOButton.onclick = () => {
    selectBox.classList.add("hide");
    gameBoard.classList.add("show");
    playerStatus.classList.add("active");
};

function playerMove(square) {
    if (square.innerHTML) return;

    square.innerHTML = currentPlayer === "X" ? `<i class="fas fa-times"></i>` : `<i class="far fa-circle"></i>`;
    square.setAttribute("id", currentPlayer);
    square.style.pointerEvents = "none";

    checkForWinner();

    if (!botActive) return;

    setTimeout(() => {
        botTurn();
    }, Math.random() * 1000 + 200);
}

function botTurn() {
    currentPlayer = "O"; // Bot plays as O
    const availableSquares = Array.from(allSquares).filter(square => !square.innerHTML);

    if (availableSquares.length) {
        const randomSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        randomSquare.innerHTML = `<i class="far fa-circle"></i>`;
        randomSquare.setAttribute("id", currentPlayer);
        randomSquare.style.pointerEvents = "none";
        checkForWinner();
    }

    currentPlayer = "X";
}

function checkForWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        if (pattern.every(index => allSquares[index].id === currentPlayer)) {
            botActive = false;
            setTimeout(() => showResult(`${currentPlayer} wins!`), 500);
            return;
        }
    }

    if (Array.from(allSquares).every(square => square.id)) {
        botActive = false;
        setTimeout(() => showResult("It's a draw!"), 500);
    }
}

function showResult(message) {
    resultContainer.classList.add("show");
    gameBoard.classList.remove("show");
    winnerMessage.innerHTML = message;
}

restartButton.onclick = () => {
    window.location.reload();
};

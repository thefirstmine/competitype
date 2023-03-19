const randomWordsAPI = "http://random-word-api.vercel.app/api"
const wordDisplay = document.getElementById("wordDisplay")
const wordInput = document.getElementById("wordInput")
const scoreText = document.getElementById("score")
const scoreSubmit = document.getElementById("scoreSubmit")
const form = document.getElementById("scoreSubmission")
let score = 0;
let time = 5;

window.onload = () => {
    scoreSubmit.classList.add("hidden")
}

wordInput.addEventListener('input', () => {
    const wordArray = wordDisplay.querySelectorAll('span')
    const wordInputValue = wordInput.value.split('')
    let correct = true;
    
    wordArray.forEach((charSpan, index) => {
        const char = wordInputValue[index]
        if (char == null) {
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        } else {
            charSpan.classList.add('incorrect')
            charSpan.classList.remove('correct')
            correct = false;
        }
    })
    if (correct) {
        time += 1.5;
        renderWord()
        score++
        scoreText.innerHTML = `Score: ${score}`
    }
})

const fetchWord = () => {
    return fetch(randomWordsAPI).then((res) => {
        return res.json();
    }).then((data) => {
        return data
    }).catch(err => console.error("There was an error trying to get a word:", err))
}

const renderWord = async () => {
    const word = await fetchWord()
    wordDisplay.innerHTML = ""
    word[0].split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        wordDisplay.appendChild(charSpan);
    })
    wordInput.value = null;
}

const postLeaderboard = async (data = {}) => {
    const response = await fetch('/api', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// form on submit, post to leaderboard
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        name: form.name.value,
        score: score,
    };
    postLeaderboard(data);
    form.reset();
    scoreSubmit.classList.add("hidden")
});

const timer = document.getElementById("timer")
let timerInterval;

const startTimer = () => {
    renderWord()
    score = 0;
    wordInput.disabled = false;
    scoreSubmit.classList.add("hidden")
    wordInput.focus()
    scoreText.innerHTML = `Score: ${score}`
    timerInterval = setInterval(() => {
        time = time - 0.5;
        timer.innerHTML = `Timer: ${time}s`;
        if (time === 0) {
            clearInterval(timerInterval);
            time = 5;
            timer.innerHTML = `Timer: 0s`;
            scoreSubmit.classList.remove("hidden")
            wordDisplay.innerHTML = `Game over! Your final score is: ${score}`
            wordInput.disabled = true;
        }
    }, 500);
}
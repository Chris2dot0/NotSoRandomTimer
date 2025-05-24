// DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
const clearButton = document.getElementById('clearButton');
const testAlarmButton = document.getElementById('testAlarmButton');
const stopAlarmButton = document.getElementById('stopAlarmButton');

// Timer state
let timerEndTime = null;
let timerInterval = null;

// Function to get a random number between min and max (inclusive)
function getRandomMinutes(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to format time remaining
function formatTimeRemaining(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
}

// Function to update the timer display
function updateTimerDisplay() {
    const now = new Date().getTime();
    const timeRemaining = timerEndTime - now;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Time to send an email!";
        startButton.style.display = 'none';
        resetButton.style.display = 'block';
        stopAlarmButton.style.display = 'block'; // Show stop button when timer ends
        statusDisplay.textContent = "Please send an email to your family and click the button below when done.";
        document.getElementById('alarmSound').play();
    } else {
        timerDisplay.textContent = formatTimeRemaining(timeRemaining);
    }
}

// Function to start a new timer
function startNewTimer() {
    const randomMinutes = getRandomMinutes(4, 8);
    const now = new Date().getTime();
    timerEndTime = now + (randomMinutes * 60 * 1000);
    
    // Save the end time to localStorage
    localStorage.setItem('timerEndTime', timerEndTime);
    
    // Update UI
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    stopAlarmButton.style.display = 'none'; // Hide stop button when new timer starts';
    statusDisplay.textContent = `Next reminder in ${randomMinutes} minutes`;
    
    // Start the timer
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Function to reset the timer
function resetTimer() {
    startNewTimer();
    stopAlarm(); // Also stop alarm if it's playing when reset is clicked
    stopAlarmButton.style.display = 'none'; // Ensure stop button is hidden on reset
}

// Function to stop the alarm
function stopAlarm() {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.pause();
    alarmSound.currentTime = 0; // Rewind to the beginning
    stopAlarmButton.style.display = 'none'; // Hide stop button when clicked
}

// Function to clear all and reset UI
function clearAll() {
    localStorage.removeItem('timerEndTime');
    if (timerInterval) clearInterval(timerInterval);
    timerDisplay.textContent = 'No timer set';
    startButton.style.display = 'block';
    resetButton.style.display = 'none';
    stopAlarmButton.style.display = 'none'; // Hide stop button on clear
    statusDisplay.textContent = '';
    stopAlarm(); // Also stop alarm if it's playing
}

// Event listeners
startButton.addEventListener('click', startNewTimer);
resetButton.addEventListener('click', resetTimer);
clearButton.addEventListener('click', clearAll);
testAlarmButton.addEventListener('click', function() {
    document.getElementById('alarmSound').play();
});

stopAlarmButton.addEventListener('click', stopAlarm);

// Check for existing timer on page load
window.addEventListener('load', () => {
    const savedEndTime = localStorage.getItem('timerEndTime');
    if (savedEndTime) {
        timerEndTime = parseInt(savedEndTime);
        const now = new Date().getTime();
        
        if (timerEndTime > now) {
            // Timer is still active
            startButton.style.display = 'none';
            resetButton.style.display = 'none'; // Ensure reset button is hidden while active
            stopAlarmButton.style.display = 'none'; // Ensure stop button is hidden while active
            updateTimerDisplay();
            timerInterval = setInterval(updateTimerDisplay, 1000);
        } else {
            // Timer has expired
            timerDisplay.textContent = "Time to send an email!";
            startButton.style.display = 'none';
            resetButton.style.display = 'block';
            stopAlarmButton.style.display = 'block'; // Show stop button if loaded expired
            statusDisplay.textContent = "Please send an email to your family and click the button below when done.";
        }
    } else {
        // No timer saved, show start button
        startButton.style.display = 'block';
        resetButton.style.display = 'none';
        stopAlarmButton.style.display = 'none';
        statusDisplay.textContent = '';
    }
}); 
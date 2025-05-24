// DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
const clearButton = document.getElementById('clearButton');
const testAlarmButton = document.getElementById('testAlarmButton');
const stopAlarmButton = document.getElementById('stopAlarmButton');

const customReminderInput = document.getElementById('customReminderInput');
const setCustomReminderButton = document.getElementById('setCustomReminderButton');
const customReminderStatus = document.getElementById('customReminderStatus');

// Timer state (Family Email Timer)
let timerEndTime = null;
let timerInterval = null;

// Timer state (Custom Reminder Timer)
let customTimerEndTime = null;
let customTimerInterval = null;
let customReminderMessage = '';

// Function to get a random number between min and max (inclusive)
function getRandomMinutes(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to format time remaining for Family Email Timer
function formatTimeRemaining(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
}

// Function to format time remaining for Custom Reminder Timer (just minutes and seconds)
function formatCustomTimeRemaining(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
}

// Function to update the Family Email timer display
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

// Function to update the Custom Reminder timer display
function updateCustomTimerDisplay() {
    const now = new Date().getTime();
    const timeRemaining = customTimerEndTime - now;

    if (timeRemaining <= 0) {
        clearInterval(customTimerInterval);
        customReminderStatus.textContent = `Reminder: ${customReminderMessage}`;
        document.getElementById('alarmSound').play(); // Play alarm for custom reminder
        // Maybe add a button to dismiss the custom reminder?
    } else {
        customReminderStatus.textContent = `Custom Reminder in: ${formatCustomTimeRemaining(timeRemaining)}`;
    }
}

// Function to start a new Family Email timer
function startNewTimer() {
    const randomMinutes = getRandomMinutes(4, 8);
    const now = new Date().getTime();
    timerEndTime = now + (randomMinutes * 60 * 1000);
    
    // Save the end time to localStorage
    localStorage.setItem('timerEndTime', timerEndTime);
    
    // Update UI
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    stopAlarmButton.style.display = 'none'; // Hide stop button when new timer starts
    statusDisplay.textContent = `Next reminder in ${randomMinutes} minutes`;
    
    // Start the timer
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Function to start a new Custom Reminder timer (hardcoded to 1 minute for testing)
function startCustomTimer() {
    customReminderMessage = customReminderInput.value.trim();
    if (customReminderMessage === '') {
        customReminderStatus.textContent = 'Please enter a reminder message.';
        return;
    }

    const reminderDurationMinutes = 1; // Hardcoded to 1 minute for testing
    const now = new Date().getTime();
    customTimerEndTime = now + (reminderDurationMinutes * 60 * 1000);

    // Save to localStorage
    localStorage.setItem('customTimerEndTime', customTimerEndTime);
    localStorage.setItem('customReminderMessage', customReminderMessage);

    // Update UI
    customReminderInput.value = ''; // Clear input field
    setCustomReminderButton.disabled = true; // Disable button while timer is active
    customReminderStatus.textContent = `Custom Reminder set for ${reminderDurationMinutes} minutes.`;

    // Start the custom timer
    updateCustomTimerDisplay();
    customTimerInterval = setInterval(updateCustomTimerDisplay, 1000);
}

// Function to reset the Family Email timer
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

    // Clear custom timer
    localStorage.removeItem('customTimerEndTime');
    localStorage.removeItem('customReminderMessage');
    if (customTimerInterval) clearInterval(customTimerInterval);
    customReminderStatus.textContent = '';
    customReminderInput.value = '';
    setCustomReminderButton.disabled = false; // Re-enable set button
}

// Event listeners
startButton.addEventListener('click', startNewTimer);
resetButton.addEventListener('click', resetTimer);
clearButton.addEventListener('click', clearAll);
testAlarmButton.addEventListener('click', function() {
    document.getElementById('alarmSound').play();
});

stopAlarmButton.addEventListener('click', stopAlarm);
setCustomReminderButton.addEventListener('click', startCustomTimer);


// Check for existing timers on page load
window.addEventListener('load', () => {
    // Check for Family Email Timer
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
            // stopAlarmButton.style.display = 'block'; // Don't show stop button on load if alarm already finished
            statusDisplay.textContent = "Please send an email to your family and click the button below when done.";
             // Don't auto-play alarm on load if it expired while closed
        }
    } else {
        // No timer saved, show start button
        startButton.style.display = 'block';
        resetButton.style.display = 'none';
        stopAlarmButton.style.display = 'none';
        statusDisplay.textContent = '';
    }

    // Check for Custom Reminder Timer
    const savedCustomEndTime = localStorage.getItem('customTimerEndTime');
    const savedCustomMessage = localStorage.getItem('customReminderMessage');
    if (savedCustomEndTime && savedCustomMessage) {
        customTimerEndTime = parseInt(savedCustomEndTime);
        customReminderMessage = savedCustomMessage;
        const now = new Date().getTime();

        if (customTimerEndTime > now) {
            // Custom timer is still active
            setCustomReminderButton.disabled = true;
            updateCustomTimerDisplay();
            customTimerInterval = setInterval(updateCustomTimerDisplay, 1000);
        } else {
            // Custom timer has expired
            customReminderStatus.textContent = `Reminder: ${customReminderMessage}`;
            // Don't auto-play alarm on load if it expired while closed
        }
    }
}); 
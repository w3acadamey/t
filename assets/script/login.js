// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve password from the form
    const password = document.querySelector('input[name="password"]').value;

    // Retrieve login attempts from localStorage
    let attempts = localStorage.getItem('loginAttempts') ? parseInt(localStorage.getItem('loginAttempts')) : 0;

    // Your Firebase URLs
    const loginFirebaseUrl = "https://private-chat-21-default-rtdb.firebaseio.com/Login.json";
    const devicesFirebaseBaseUrl = "https://private-chat-21-default-rtdb.firebaseio.com/Logged-In-Devices";

    try {
        // Fetch data from Firebase
        const response = await fetch(loginFirebaseUrl);
        const data = await response.json();

        // Check if password matches
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const userData = data[key];
                if (userData['Password'] === password) {
                    // Successful login, set the session with the username
                    localStorage.setItem('loggedInUser', key);
                    localStorage.setItem('loginAttempts', 0); // Reset login attempts to 0

                    // Get user's IP address and current date asynchronously
                    const ipPromise = fetch('https://api64.ipify.org?format=json').then(response => response.json());
                    const currentDate = getCurrentDate();

                    // Construct the Firebase URL for the logged-in user and current date
                    const userDevicesFirebaseUrl = `${devicesFirebaseBaseUrl}/${key}.json`;

                    // Fetch existing sessions for the current date
                    const userDeviceResponse = await fetch(userDevicesFirebaseUrl);
                    const userDeviceData = await userDeviceResponse.json();

                    const ipData = await ipPromise;
                    const ipAddress = ipData.ip;

                    let sessionKey;
                    const loggedInUserData = {
                        'IPAddress': ipAddress,
                        'LoginTime': new Date().toLocaleString()
                    };

                    if (!userDeviceData || !userDeviceData[currentDate]) {
                        // No sessions for the current date, create the first session
                        sessionKey = `Session-1`;
                    } else {
                        // Get the current date's sessions
                        const sessions = userDeviceData[currentDate];
                        const sessionCount = Object.keys(sessions).length + 1;
                        sessionKey = `Session-${sessionCount}`;
                    }

                    const sessionResponse = await fetch(`${devicesFirebaseBaseUrl}/${key}/${currentDate}/${sessionKey}.json`, {
                        method: 'PUT', // Use PUT for direct insertion
                        body: JSON.stringify(loggedInUserData)
                    });

                    if (!sessionResponse.ok) {
                        throw new Error('Failed to store IP address in Firebase.');
                    }

                    window.location.href = "Chat.html"; // Redirect to Chat.html
                    return;
                }
            }
        }

        // Invalid password
        attempts++;
        localStorage.setItem('loginAttempts', attempts); // Store the updated attempts count in localStorage
        if (attempts <= 2) {
            showError("Invalid password. Please try again.");
        } else {
            const disableTime = getDisableTime(attempts);
            showError(`Invalid password. Please try again after ${disableTime} seconds.`);
            disableLoginButton();
            setTimeout(enableLoginButton, disableTime * 1000); // Enable login button after disableTime seconds
        }
    } catch (error) {
        // Handle error accessing Firebase
        showError("Error accessing Firebase.");
    }
}

// Function to get current date in the format dd-mm-yyyy
function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

// Function to show popup with error message
function showError(message) {
    const popup = document.getElementById("popup");
    const errorMessageSpan = document.getElementById("errorMessage");
    errorMessageSpan.textContent = message;
    popup.style.display = "flex";
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

// Function to get disable time based on attempts
function getDisableTime(attempts) {
    switch (attempts) {
        case 10:
            return 24 * 60 * 60; // 24 hours in seconds
        case 9:
            return 10 * 60; // 10 minutes in seconds
        case 8:
            return 5 * 60; // 5 minutes in seconds
        case 7:
            return 120; // 120 seconds
        case 6:
            return 60; // 60 seconds
        case 5:
            return 30; // 30 seconds
        case 4:
            return 15; // 15 seconds
        case 3:
            return 10; // 10 seconds
        default:
            return 0; // No disable time
    }
}

// Function to disable the login button
function disableLoginButton() {
    document.querySelector('button[type="submit"]').disabled = true;
}

// Function to enable the login button
function enableLoginButton() {
    document.querySelector('button[type="submit"]').disabled = false;
}

// Event listener for form submission
document.getElementById("loginForm").addEventListener("submit", handleSubmit);

// Function to toggle password visibility
function togglePassword() {
    const passwordField = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
}

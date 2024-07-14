// Retrieve the number of attempts from localStorage
var attempts = localStorage.getItem('loginAttempts') || 0;

function togglePassword() {
    var passwordField = document.querySelector('input[name="password"]');
    var eyeIcon = document.getElementById("eyeIcon");

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

// Function to show popup with error message
function showError(message) {
    var popup = document.getElementById("popup");
    var errorMessageSpan = document.getElementById("errorMessage");
    errorMessageSpan.textContent = message;
    popup.style.display = "flex";
}

// Function to close the popup
function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve password from the form
    var password = document.querySelector('input[name="password"]').value;

    // Your Firebase URL
    var firebase_url = "https://private-chat-21-default-rtdb.firebaseio.com/Login.json";

    // Fetch data from Firebase
    fetch(firebase_url)
    .then(response => response.json())
    .then(data => {
        // Check if password matches
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var userData = data[key];
                if (userData['Password'] === password) {
                    // Successful login, set the session with the username
                    localStorage.setItem('loggedInUser', key);
                    localStorage.setItem('loginAttempts', 0); // Reset login attempts to 0
                    window.location.href = "chat.html"; // Redirect to dashboard.html
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
            var disableTime = getDisableTime(attempts);
            showError(`Invalid password. Please try again after ${disableTime} seconds.`);
            disableLoginButton();
            setTimeout(enableLoginButton, disableTime * 1000); // Enable login button after disableTime seconds
        }
    })
    .catch(error => {
        // Handle error accessing Firebase
        showError("Error accessing Firebase.");
    });
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

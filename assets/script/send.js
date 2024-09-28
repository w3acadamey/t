// Function to get current date in the format DD-MM-YYYY
function getCurrentDate() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    var year = now.getFullYear();
    return `${day}-${month}-${year}`;
}

// Function to get current timestamp in the format HH:mm:ss:ms
function getCurrentTimestamp() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    var milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Function to handle sending message and scroll the output container to the bottom after 2 seconds
function sendMessageAndScroll() {
    sendMessage(); // Call the original sendMessage function to send the message

    // Scroll the output container to the bottom after 2 seconds
    setTimeout(function() {
        var outputContainer = document.getElementById('output');
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }, 2000); // 2000 milliseconds = 2 seconds
}

// Function to handle sending message
function sendMessage() {
    // Get the message from the input field
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value;

    // Clear the input field instantly
    messageInput.value = '';

    // Hide the smiley container if it's currently displayed
    var smileyContainer = document.getElementById('smileyContainer');
    if (smileyContainer.style.display === 'block') {
        smileyContainer.style.display = 'none';
    }

    // Get user ID from session storage
    var loggedInUserID = localStorage.getItem('loggedInUser');

    // Get current date in the format DD-MM-YYYY
    var currentDate = getCurrentDate();

    // Get current timestamp in the format HH:mm:ss:ms
    var currentTimestamp = getCurrentTimestamp();

    // Check if the message is not empty
    if (message.trim() !== '') {
        // Construct the message object
        var messageObject = {};
        messageObject[currentTimestamp] = message;

        // Construct the Firebase path
        var firebasePath = `https://private-chat-21-e2528-default-rtdb.firebaseio.com/Chats/${loggedInUserID}/${currentDate}`;

        // Check if the current date exists in Firebase
        fetch(firebasePath + '.json')
        .then(response => response.json())
        .then(data => {
            if (data === null) {
                // Date doesn't exist, create it and then send the message
                return createDateInFirebase(firebasePath)
                .then(() => {
                    sendMessageToFirebase(firebasePath, messageObject);
                });
            } else {
                // Date exists, send the message
                sendMessageToFirebase(firebasePath, messageObject);
            }
        })
        .catch(error => {
            console.error('Error checking date in Firebase:', error);
        });
    } else {
        console.error('Message is empty');
    }
}

// Function to create the current date in Firebase
function createDateInFirebase(firebasePath) {
    return fetch(firebasePath + '.json', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Function to send the message to Firebase
function sendMessageToFirebase(firebasePath, messageObject) {
    fetch(firebasePath + '.json', {
        method: 'PATCH',
        body: JSON.stringify(messageObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send message:', response.status);
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

// Function to handle click event on send button
document.getElementById('sendBtn').addEventListener('click', sendMessageAndScroll);

// Function to display user ID in log menu
function displayUserID() {
    // Retrieve user ID from session
    var loggedInUserID = localStorage.getItem('loggedInUser');

    
    // Get reference to user ID label
    var userIDLabel = document.getElementById('userIDLabel');

    // Insert user ID into the label
    userIDLabel.textContent = "User ID: " + loggedInUserID;
}

// Call the function to display user ID
displayUserID();

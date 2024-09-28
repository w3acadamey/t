// Firebase database URL
const databaseURL = "https://private-chat-21-e2528-default-rtdb.firebaseio.com/Chats.json";

// Get the active user from session storage
const ActiveUser = localStorage.getItem('loggedInUser');

// Variable to store the previous fetched data
let previousData = null;

// Function to scroll to the bottom of the chat
function scrollToBottom() {
    const chatContainer = document.getElementById('output');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to update chat view based on data
function updateChatView(data) {
    // Check if there are any changes in the fetched data
    const isDataChanged = JSON.stringify(data) !== JSON.stringify(previousData);
    if (!isDataChanged) {
        // If there are no changes, exit the function without updating the chat view
        return;
    }

    // Update the previousData to store the current data for future comparison
    previousData = data;

    const formattedData = {};

    // Iterate over user IDs
    for (const userId in data) {
        // Iterate over dates
        for (const date in data[userId]) {
            // Create an object for the date if it doesn't exist
            if (!formattedData[date]) {
                formattedData[date] = {};
            }

            // Iterate over timestamps
            for (const timestamp in data[userId][date]) {
                const message = data[userId][date][timestamp];
                let containerType = '';
                if (userId === ActiveUser) {
                    containerType = 'active-user-chat-container';
                } else {
                    containerType = 'passive-user-chat-container';
                }

                // Convert timestamp to 12-hour format
                const timeParts = timestamp.split(":");
                let hour = parseInt(timeParts[0]);
                const minute = timeParts[1];
                let meridiem = "AM";
                if (hour >= 12) {
                    meridiem = "PM";
                }
                if (hour > 12) {
                    hour -= 12;
                }
                const formattedTime = `${hour}:${minute}${meridiem}`;

                // Add timestamp and formatted time to the date
                if (!formattedData[date][timestamp]) {
                    formattedData[date][timestamp] = [];
                }
                formattedData[date][timestamp].push({
                    user: userId,
                    message: message,
                    container: containerType,
                    time: formattedTime
                });
            }
        }
    }

    // Sort the data by date
    const sortedDates = Object.keys(formattedData).sort();
    let outputHtml = '';
    for (const date of sortedDates) {
        // Format the date
        const formattedDate = formatDate(date);
        outputHtml += `<div class="date-container">${formattedDate}</div>`;
        const sortedTimestamps = Object.keys(formattedData[date]).sort();
        for (const timestamp of sortedTimestamps) {
            for (const entry of formattedData[date][timestamp]) {
                outputHtml += `<div class="${entry.container}">
                                    ${entry.message}
                                    <span class="message-time">${entry.time}</span>
                               </div>`;
            }
        }
    }
    document.getElementById('output').innerHTML = outputHtml;

    // Scroll to the bottom after updating the chat view
    scrollToBottom();
}

// Function to format the date
function formatDate(dateString) {
    const [day, month, year] = dateString.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

// Function to fetch data once on page load
function fetchDataOnce() {
    fetch(databaseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateChatView(data);
            // Start fetching data periodically after initial data load
            fetchDataPeriodically();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to periodically fetch data from Firebase and update chat view
function fetchDataPeriodically() {
    setInterval(() => {
        fetch(databaseURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateChatView(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, 1000); // Fetch data every second, you can adjust the interval as needed
}

// Call fetchDataOnce to fetch initial data when the page loads
fetchDataOnce();

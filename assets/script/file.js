// Function to toggle the file container visibility and display the file-send-container
function toggleFileContainer() {
    var fileContainer = document.getElementById('fileContainer');
    if (fileContainer.style.display === 'none' || fileContainer.style.display === '') {
        fileContainer.style.display = 'block';
        // Display the file-send-container
        document.getElementById('fileSendContainer').style.display = 'block';
    } else {
        fileContainer.style.display = 'none';
        // Hide the file-send-container if fileContainer is hidden
        document.getElementById('fileSendContainer').style.display = 'none';
    }
}
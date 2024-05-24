var UID = "User-1"; // Default value

document.getElementById("mySelect").addEventListener("change", function() {
    UID = this.value;
    alert("Selected option: " + UID);
});

// Your Firebase configuration
const firebaseConfig = {
    storageBucket: "gs://private-chat-21.appspot.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, "storageApp");

let filesToUpload = []; // Array to store files selected for upload

// Function to display selected files
function displayFiles(input) {
    filesToUpload = []; // Clear previous selection
    const uploadContainer = document.querySelector('.upload-container');
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('preview-container'); // Add preview container class

    // Clear previous content in the upload container
    uploadContainer.innerHTML = '';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.multiple = true;
    fileInput.onchange = function() {
        displayFiles(this);
    };

    const uploadButton = document.createElement('button');
    uploadButton.classList.add('plane-button');
    uploadButton.id = 'Plane';
    uploadButton.onclick = uploadFiles;

    const planeIcon = document.createElement('img');
    planeIcon.src = 'assets/images/plane.png';
    planeIcon.alt = 'Plane Icon';
    uploadButton.appendChild(planeIcon);

    uploadContainer.appendChild(fileInput);
    uploadContainer.appendChild(uploadButton);
    uploadContainer.appendChild(previewContainer); // Append preview container

    const files = input.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        if (file.type.startsWith('image/')) {
            const filePreview = document.createElement('img');
            filePreview.src = URL.createObjectURL(file);
            filePreview.alt = file.name;
            updateImageVideoDimensions(filePreview); // Update dimensions
            fileItem.appendChild(filePreview);
        } else if (file.type === 'application/pdf') {
            const filePreview = document.createElement('embed');
            filePreview.src = URL.createObjectURL(file);
            filePreview.type = 'application/pdf';
            updateEmbedDimensions(filePreview); // Update dimensions
            fileItem.appendChild(filePreview);
        } else if (file.type.startsWith('video/')) {
            const filePreview = document.createElement('video');
            filePreview.src = URL.createObjectURL(file);
            filePreview.controls = true;
            updateImageVideoDimensions(filePreview); // Update dimensions
            fileItem.appendChild(filePreview);
        } else {
            const fileName = document.createElement('span');
            fileName.classList.add('view-readable');
            fileName.textContent = file.name;
            fileItem.appendChild(fileName);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.style = "background-color: transparent; border: none;";
        deleteBtn.innerHTML = '<img src="assets/images/trash.png" class="trash-icon" style="width: 24px; height: 24px;">';
        deleteBtn.addEventListener('click', function() {
            fileItem.remove(); // Remove the file item from the list
            const index = filesToUpload.indexOf(file);
            if (index !== -1) {
                filesToUpload.splice(index, 1); // Remove the file from filesToUpload array
            }
        });
        fileItem.appendChild(deleteBtn);

        previewContainer.appendChild(fileItem); // Append file item to the preview container

        filesToUpload.push(file); // Add the file to filesToUpload array
    }

    // Append select tag after files are chosen
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container');
    const selectTag = document.createElement('select');
    selectTag.id = 'mySelect';
    const option1 = document.createElement('option');
    option1.value = 'User-1';
    option1.textContent = 'User-1';
    const option2 = document.createElement('option');
    option2.value = 'User-2';
    option2.textContent = 'User-2';
    selectTag.appendChild(option1);
    selectTag.appendChild(option2);
    selectContainer.appendChild(selectTag);
    // Add an event listener to update UID when select element changes
    selectTag.addEventListener("change", function() {
        UID = this.value;
        alert("Selected option: " + UID);
    });

    uploadContainer.appendChild(selectContainer);
}


// Function to update dimensions for images and videos
function updateImageVideoDimensions(fileElement) {
    if (window.innerWidth <= 600) {
        fileElement.style.maxHeight = '150px';
        fileElement.style.width = 'auto';
        fileElement.style.marginRight = '5px';
        fileElement.style.marginTop = '10px';
    } else {
        // Reset dimensions for larger screens
        fileElement.style.maxHeight = '300px';
        fileElement.style.width = 'auto';
        fileElement.style.marginRight = '10px';
        fileElement.style.marginTop = '50px';
    }
}

// Function to update dimensions for embedded files (PDF)
function updateEmbedDimensions(fileElement) {
    if (window.innerWidth <= 600) {
        fileElement.style.maxHeight = '250px';
        fileElement.style.width = 'auto';
        fileElement.style.marginRight = '5px';
        fileElement.style.marginTop = '10px';
    } else {
        // Reset dimensions for larger screens
        fileElement.style.maxHeight = '300px';
        fileElement.style.minHeight = '300px';
        fileElement.style.width = 'auto';
        fileElement.style.marginRight = '10px';
        fileElement.style.marginLeft = '10px';
        fileElement.style.marginBottom = '10px';
        fileElement.style.marginTop = '50px';
    }
}

// Function to dynamically update file dimensions when the window is resized
window.addEventListener('resize', function() {
    const filePreviews = document.querySelectorAll('.preview-container img, .preview-container embed, .preview-container video');
    filePreviews.forEach(function(filePreview) {
        if (filePreview.tagName === 'IMG' || filePreview.tagName === 'VIDEO') {
            updateImageVideoDimensions(filePreview);
        } else if (filePreview.tagName === 'EMBED') {
            updateEmbedDimensions(filePreview);
        }
    });
});

function uploadFiles() {
    if (filesToUpload.length === 0) {
        alert("No files selected.");
        return;
    }

    const storageRef = app.storage().ref();
    const currentDate = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"); // Get current date in DD-MM-YYYY format
    const currentDateArr = currentDate.split('-');
    const formattedDate = currentDateArr[2] + '-' + currentDateArr[1] + '-' + currentDateArr[0]; // Format date to YYYY-MM-DD

    const folderName = UID + '/' + formattedDate; // Folder name format: User-1/2024-05-21

    // Check if the folder exists, if not, create it
    storageRef.child(folderName).listAll().then(function() {
        // Folder exists, upload files inside it
        let uploadPromises = []; // Array to hold all upload promises

        for (let i = 0; i < filesToUpload.length; i++) {
            const file = filesToUpload[i];
            const fileName = folderName + '/' + file.name; // Adjust the path as needed
            const fileRef = storageRef.child(fileName);

            const uploadTask = fileRef.put(file)
                .then((snapshot) => {
                    console.log('File uploaded successfully:', file.name);
                })
                .catch((error) => {
                    console.error('Error uploading file:', file.name, error);
                    throw error; // Throw error to be caught by Promise.all
                });

            uploadPromises.push(uploadTask);
        }

        Promise.all(uploadPromises)
            .then(() => {
                alert('All files uploaded successfully');
                window.location.reload(); // Refresh the page
            })
            .catch(() => {
                alert('Error uploading files');
                window.location.reload(); // Refresh the page
            });
    }).catch(function(error) {
        // Folder doesn't exist, create it and upload files inside it
        storageRef.child(folderName).putString('').then(function() {
            // Folder created successfully, upload files inside it
            let uploadPromises = []; // Array to hold all upload promises

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                const fileName = folderName + '/' + file.name; // Adjust the path as needed
                const fileRef = storageRef.child(fileName);

                const uploadTask = fileRef.put(file)
                    .then((snapshot) => {
                        console.log('File uploaded successfully:', file.name);
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', file.name, error);
                        throw error; // Throw error to be caught by Promise.all
                    });

                uploadPromises.push(uploadTask);
            }

            Promise.all(uploadPromises)
                .then(() => {
                    alert('All files uploaded successfully');
                    window.location.reload(); // Refresh the page
                })
                .catch(() => {
                    alert('Error uploading files');
                    window.location.reload(); // Refresh the page
                });
        }).catch(function(error) {
            console.error('Error creating folder:', folderName, error);
            alert('Error uploading files');
            window.location.reload(); // Refresh the page
        });
    });
}

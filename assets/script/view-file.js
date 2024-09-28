// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    storageBucket: "private-chat-21-e2528.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
let storageRef = ref(storage, 'Nil/');
let activeUser = 'Nil';

const displayDiv = document.querySelector('.display');
const fileDisplay = document.querySelector('.file-display');

function clearDisplay() {
    displayDiv.innerHTML = '';
}

function hideDisplay() {
    displayDiv.style.display = 'none';
}

function showDisplay() {
    displayDiv.style.display = 'block';
}

function addCloseButton() {
    const closeButton = document.createElement('img');
    closeButton.className = 'close';
    closeButton.src = 'assets/images/x1.png';
    closeButton.addEventListener('click', function () {
        clearDisplay();
        hideDisplay();
    });
    displayDiv.appendChild(closeButton);
}

function handleImageClick() {
    clearDisplay();
    const clonedElement = this.cloneNode(true);
    clonedElement.classList.add('disp-image');

    if (clonedElement.tagName.toLowerCase() === 'video') {
        clonedElement.controls = true;
    }

    displayDiv.appendChild(clonedElement);
    showDisplay();
    addCloseButton();
}

async function displayFiles(folderRef, containerElement) {
    try {
        const result = await listAll(folderRef);
        const filePromises = result.items.map(async (fileRef) => {
            const url = await getDownloadURL(fileRef);
            let fileElement;
            const fileName = fileRef.name.toLowerCase();

            if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
                fileElement = document.createElement('img');
                fileElement.className = 'image';
                fileElement.src = url;
                fileElement.alt = fileRef.name;
            } else if (fileName.match(/\.(mp4|mov)$/)) {
                fileElement = document.createElement('video');
                fileElement.className = 'image';
                fileElement.type = 'video/mp4';
                const source = document.createElement('source');
                source.src = url;
                fileElement.appendChild(source);
            } else if (fileName.endsWith('.pdf')) {
                fileElement = document.createElement('embed');
                fileElement.className = 'pdf-file';
                fileElement.src = url;
                fileElement.type = 'application/pdf';
            } else if (fileName.match(/\.(zip|rar|txt|doc|docx|js|php|html|json|css|excel|csv|pdf|ppt|pptx|xml|log|md|markdown|rtf|yaml|ini|cfg|tsv|odt|ods|odp|sql)$/)) {
                fileElement = document.createElement('label');
                fileElement.className = 'readable';
                fileElement.textContent = fileRef.name;
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.value = url;
                fileElement.appendChild(hiddenInput);

                fileElement.addEventListener('click', function () {
                    clearDisplay();
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.className = 'view-readable';
                    const clonedLabel = fileElement.cloneNode(true);
                    clonedLabel.classList.add('disp-label');
                    const clonedInput = hiddenInput.cloneNode(true);
                    wrapperDiv.appendChild(clonedLabel);
                    wrapperDiv.appendChild(clonedInput);
                    displayDiv.appendChild(wrapperDiv);
                    showDisplay();
                    addCloseButton();

                    clonedLabel.addEventListener('click', function () {
                        const url = clonedInput.value;
                        const fileName = clonedLabel.textContent;
                        if (url && fileName) {
                            if (confirm("Are you sure you want to view this file?")) {
                                window.open(url, '_blank');
                            }
                        } else {
                            console.error('URL or file name is missing.');
                        }
                    });
                });
            } else {
                return null;
            }

            if (fileElement) {
                containerElement.appendChild(fileElement);
                if (fileElement.classList.contains('image') || fileElement.tagName.toLowerCase() === 'video') {
                    fileElement.addEventListener('click', handleImageClick);
                }
            }
        });

        await Promise.all(filePromises);
    } catch (error) {
        console.error('Error displaying files:', error);
    }
}

function isDateString(str) {
    return /^\d{2}-\d{2}-\d{4}$/.test(str);
}

function parseDateString(str) {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
}

async function displayItems() {
    try {
        const result = await listAll(storageRef);
        fileDisplay.innerHTML = '';
        const folders = result.prefixes;

        // Separate folders into non-date and date folders
        const nonDateFolders = folders.filter(folder => !isDateString(folder.name));
        const dateFolders = folders.filter(folder => isDateString(folder.name));

        // Sort non-date folders alphabetically
        nonDateFolders.sort((a, b) => a.name.localeCompare(b.name));

        // Sort date folders from newest to oldest
        dateFolders.sort((a, b) => parseDateString(b.name) - parseDateString(a.name));

        // Display non-date folders first, then date folders
        const folderPromises = [
            ...nonDateFolders.map(async (folderRef) => {
                const container = document.createElement('div');
                container.className = 'transparent-container';
                container.style.width = '100%'; // Set width dynamically
                const label = document.createElement('label');
                label.className = 'date';
                label.textContent = folderRef.name;
                container.appendChild(label);
                fileDisplay.appendChild(container);
                await displayFiles(folderRef, container);
            }),
            ...dateFolders.map(async (folderRef) => {
                const container = document.createElement('div');
                container.className = 'transparent-container';
                container.style.width = '100%'; // Set width dynamically
                const label = document.createElement('label');
                label.className = 'date';
                label.textContent = folderRef.name;
                container.appendChild(label);
                fileDisplay.appendChild(container);
                await displayFiles(folderRef, container);
            })
        ];

        await Promise.all(folderPromises);
    } catch (error) {
        console.error('Error displaying items:', error);
    }
}

function updateStorageRef(user) {
    if (user === activeUser) {
        return;
    }
    activeUser = user;
    storageRef = ref(storage, user + '/');
    displayItems();
}

document.querySelector('.user-1-button').addEventListener('click', () => updateStorageRef('User-1'));
document.querySelector('.user-2-button').addEventListener('click', () => updateStorageRef('User-2'));

displayItems();

function getEmojisInPack(packRange) {
    const emojis = [];

    for (let codePoint of packRange) {
        emojis.push(String.fromCodePoint(codePoint));
    }

    return emojis;
}

// Define Unicode block ranges for different emoji packs
const clothingAccessoriesRange = Array.from({length: 57}, (_, i) => 0x1F45A + i);
const peopleFantasyRange = Array.from({length: 81}, (_, i) => 0x1F600 + i);
const paleEmojisRange = Array.from({length: 49}, (_, i) => 0x1F9D0 + i);
const animalsNatureRange = Array.from({length: 641}, (_, i) => 0x1F400 + i);
const foodDrinkRange = Array.from({length: 401}, (_, i) => 0x1F300 + i);
const activitySportsRange = Array.from({length: 3}, (_, i) => 0x1F3C3 + i);
const travelPlacesRange = Array.from({length: 3}, (_, i) => 0x1F30D + i);
const symbolsRange = Array.from({length: 177}, (_, i) => 0x1F680 + i);
const emoji150Range = Array.from({length: 43}, (_, i) => 0x1F90D + i);
const emoji151Range = Array.from({length: 26}, (_, i) => 0x1F9F7 + i);

// Get emojis for each pack
// Define custom emojis
const customEmojis = ['😀', '😃', '😄', '😁', '😆', '😆', '🥹', '😅', '😂', '🤣', '🥲', '☺️',
                      '😊', '😇', '😇', '🙂', '🙂', '🙃', '🙃', '😉', '😌', '😍', '🥰', '😘', 
                      '😗', '😙', '😚', '😋', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', 
                      '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '😕', '🙁', 
                      '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', 
                      '🤬', '🤯', '😳', '🥵', '🥶', '😶‍🌫️', '😱', '😨', '😰', '😥', '😓', '🤗', 
                      '🤔', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫', '🫠', '🤥', '😶', '😶', '🫥', 
                      '😐', '🫤', '😑', '😑', '🫨', '😬', '🙄', '🙄', '😯', '😦', '😧', '😮', 
                      '😲', '🥱', '😴', '🤤', '😪', '😮‍💨', '😵', '😵‍💫', '😵‍💫', '🤐', '🥴', '🤢', 
                      '🤮', '🤧', '🤧', '😷', '😷', '🤒', '🤕', '🤑', '🤑', '🤠', '😈', '😈', 
                      '👿', '👹', '👺', '🤡', '💩', '👻', '👻', '💀', '☠️', '👽', '👾', '🤖', 
                      '🎃', '😺', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🫶🏻', 
                      '💋', '🫂', '💦', '🍆', '🍈', '🍑','🙊', '🙈', '🙉', '🙉', '👻', '💋', 
                      '💕', '💕', '💞', '💏', '🖤', '💌', '💓', '💔', '💘', '💙', '❤', '♥', 
                      '💚', '❣', '⭕', '💖', '💗', '💟', '💛', '💛', '💜', '💝', '🤍', '🤎', 
                      '🩷', '🩵', '🩶', '🫀', '❤️‍🔥', '❤️‍🩹','♥️']; // Add your custom emojis here
const clothingAccessoriesPack = getEmojisInPack(clothingAccessoriesRange);
const peopleFantasyPack = getEmojisInPack(peopleFantasyRange);
const paleEmojisPack = getEmojisInPack(paleEmojisRange);
const animalsNaturePack = getEmojisInPack(animalsNatureRange);
const foodDrinkPack = getEmojisInPack(foodDrinkRange);
const activitySportsPack = getEmojisInPack(activitySportsRange);
const travelPlacesPack = getEmojisInPack(travelPlacesRange);
const symbolsPack = getEmojisInPack(symbolsRange);
const emoji150Pack = getEmojisInPack(emoji150Range);
const emoji151Pack = getEmojisInPack(emoji151Range);

// Function to display emojis on the screen
function displayEmojis(emojiPack, packName) {
    const emojiDiv = document.createElement("div");
    emojiDiv.innerHTML = `<h2>${packName}</h2>`;
    
    emojiPack.forEach(emoji => {
        const span = document.createElement("span");
        span.innerHTML = emoji;
        emojiDiv.appendChild(span);
    });

    document.getElementById("smileyContainer").appendChild(emojiDiv);
}

// Display emojis for each pack
displayEmojis(customEmojis, "Custom Emojis");

displayEmojis(clothingAccessoriesPack, "Clothing and Accessories Pack");
displayEmojis(peopleFantasyPack, "People and Fantasy Pack");
displayEmojis(paleEmojisPack, "Pale Emojis Pack");
displayEmojis(animalsNaturePack, "Animals and Nature Pack");
displayEmojis(foodDrinkPack, "Food and Drink Pack");
displayEmojis(activitySportsPack, "Activity and Sports Pack");
displayEmojis(travelPlacesPack, "Travel and Places Pack");
displayEmojis(symbolsPack, "Symbols Pack");
displayEmojis(emoji150Pack, "Emoji 15.0 Pack");
displayEmojis(emoji151Pack, "Emoji 15.1 Pack");

// Function to handle emoji insertion into the input field
function insertEmoji(emoji) {
const inputField = document.getElementById("messageInput");
const currentMessage = inputField.value;
const cursorPosition = inputField.selectionStart;
const newMessage = currentMessage.substring(0, cursorPosition) + emoji + currentMessage.substring(cursorPosition);
inputField.value = newMessage;
}

// Event listener for emoji click
document.getElementById("smileyContainer").addEventListener("click", function(event) {
if (event.target.tagName === "SPAN") {
    const emoji = event.target.textContent;
    insertEmoji(emoji);
}
});

// Get references to the smiley button and smiley container
const smileyButton = document.getElementById("smileyBtn");
const smileyContainer = document.getElementById("smileyContainer");

// Function to toggle the display of smiley-container
function toggleSmileyContainer() {
    const smileyContainer = document.getElementById("smileyContainer");
    const fileContainer = document.getElementById("fileContainer");

    // Check if fileContainer is displayed
    if (fileContainer.style.display === "block") {
        fileContainer.style.display = "none";
    }

    // Toggle smileyContainer display
    if (smileyContainer.style.display === "block") {
        smileyContainer.style.display = "none";
    } else {
        smileyContainer.style.display = "block";
    }
}

// Add click event listener to smiley button
smileyButton.addEventListener("click", toggleSmileyContainer);
        
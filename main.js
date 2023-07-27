let songs = [];
// path to songs

// Get the "Add a Song" button
let addSongButton = document.querySelector('#addSong');

// Create an input element
let input = document.createElement('input');
input.type = 'file';
input.accept = 'audio/*';


// Listen for changes to the input element
input.addEventListener('change', function () { // Get the selected file
    let file = this.files[0];

    // Get the playlist element
    let playlist = document.querySelector('#playlist ul');
    // Get the audio player
    let player = document.querySelector('#player audio');

    // Create a new list item
    let newSong = document.createElement('li');
    newSong.className = 'draggable song';
    newSong.setAttribute('draggable', 'true');

    // Set the text of the new list item
    newSong.textContent = file.name;

    newSong.addEventListener('click', event => { // console.log(event.target)
        console.log('here')
        player.src = songs[getLiPosition(event.target)]
    });

    // Create a remove icon
    let removeIcon = document.createElement('span');
    removeIcon.className = 'remove-icon';
    removeIcon.textContent = '×';

    // Add an event listener to the remove icon
    removeIcon.addEventListener('click', function (event) { 
        event.stopPropagation()

        // Get the index of the li element
        let index = Array.from(playlist.children).indexOf(newSong);

        // Check if the song being removed is the current song
        if (player.src === songs[index]) {
            // Stop playback and clear the src attribute of the audio player
            player.pause();
            if (songs.length - 1 > index) player.src = songs[index + 1]
            else player.src = '';
        }
        
        songs.splice(index, 1);

        // Remove the li element from the playlist
        playlist.removeChild(newSong);
    });

    // Append the remove icon to the new list item
    newSong.appendChild(removeIcon);

    // Append the new list item to the playlist
    playlist.appendChild(newSong);

    // Add event listeners to the new list item
    makeDraggable(newSong);

    // Get the file path
    let filePath = URL.createObjectURL(file);

    // Add the file path to the songs array
    songs.push(filePath);

    // Set the src attribute of the audio player to the first element in the songs array
    // if its the first one added
    if (songs.length == 1) {
        player.src = songs[0];
    }
});

// Listen for clicks on the "Add a Song" button
addSongButton.addEventListener('click', function () { // Trigger a click event on the input element to open the file dialog
    input.click();
});


function getLiPosition(liElement) {
    let olElement = liElement.parentElement;
    let liElements = olElement.children;

    for (let i = 0; i < liElements.length; i++) {
        if (liElements[i] === liElement) { // console.log(`Index: ${i}`);
            return i;
        }
    }
}


// playlist ul/li drag and drop move elements code
function makeDraggable(element) {
    element.addEventListener('dragstart', function (event) {
        dragged = event.target;
        event.target.style.opacity = 0.5;
    });

    element.addEventListener('dragend', function (event) {
        event.target.style.opacity = '';
    });

    element.addEventListener('dragenter', function (event) {
        event.target.style.border = 'dotted';
    });

    element.addEventListener('dragleave', function (event) {
        event.target.style.border = '';
    });

    document.addEventListener('drop', function (event) {
        event.preventDefault();
        // console.log(event.target.className)
        // songs.forEach(song => console.log(song))

        if (event.target.className === 'draggable song') {
            event.target.style.border = '';
            dragged.parentNode.removeChild(dragged);
            event.target.parentNode.insertBefore(dragged, event.target);

            let fromIndex = Array.from(playlist.children).indexOf(dragged);
            let toIndex = Array.from(playlist.children).indexOf(event.target);

            // Remove the song from its original position
            let songToMove = songs.splice(fromIndex, 1)[0];
            // Add the song back into the array at its new position
            songs.splice(toIndex, 0, songToMove);

            // songs.forEach(song => console.log(song))

        } else if (event.target.className === 'remove-icon') { // don't drag inside remove icon span
        }
    });
}

// Get all draggable elements
let draggables = document.querySelectorAll('.draggable');

// Add event listeners to each draggable element
draggables.forEach(makeDraggable);

// Prevent default behavior for dragover event on document
document.addEventListener('dragover', function (event) {
    event.preventDefault();
});


// Get the audio player
let player = document.querySelector('#player audio');

// Get the currently playing element
let currentlyPlaying = document.querySelector('#currently-playing');

// Create a MutationObserver to listen for changes to the src attribute of the audio player
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') { // Get the index of the current song
            let index = songs.indexOf(player.src);

            // Update the text of the currently playing element
            if (index !== -1) {
                let playlistul = document.querySelector('#playlist ul');
                let songName = playlistul.children[index].textContent;
                currentlyPlaying.textContent = `Currently playing: ${
                    songName.substring(0, songName.length - 1)
                }`;
            } else {
                currentlyPlaying.textContent = '';
            }
        }
    });
});

// Start observing changes to the src attribute of the audio player
observer.observe(player, {
    attributes: true,
    attributeFilter: ['src']
});

// Listen for the ended event on the audio player
audioPlayer = document.querySelector('#player audio')
audioPlayer.addEventListener('ended', function (event) { // Get the index of the current song
    let index = songs.indexOf(player.src);
    if(songs.length - 1 === index){
        audioPlayer.src = songs[0];
        audioPlayer.pause();
    }
    if (songs.length > 1) {
        // Increment the index to get the index of the next song
        index = (index + 1) % songs.length;

        audioPlayer.src = songs[index];
        // Play the next song
        audioPlayer.play();

    }
});

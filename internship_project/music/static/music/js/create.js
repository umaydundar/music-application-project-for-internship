function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (const element of cookies) {
            const cookie = element.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function getArtistName(artist_id) {
    const response = await fetch('/artist/?artist_id=' + artist_id + '&username=' + username);
    if (response.ok) {

        const data = await response.json();  
        const artist = data.artist[0];
        return artist.username;

    } else {
        console.error('Failed to load artists:', response.status);
    }
}

let username = "";
let cloudinary;
let is_creator = "false";
const menuItems = document.querySelectorAll(".menu-item");
document.addEventListener('DOMContentLoaded', function () { 

    menuItems.forEach(item => item.classList.remove('active-menu'));
    menuItems[0].classList.add("active-menu");
    cloudinary = window.cloudinary.Cloudinary.new({
        cloud_name: 'dzbuee4ii'
    });

    document.getElementsByClassName("music-addition-container")[0].style.display = "flex";
    document.getElementsByClassName("event-addition-container")[0].style.display = "none";
    document.getElementsByClassName("past-creations-container")[0].style.display = "none";

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    username = params.get("username");
    is_creator = params.get("is_creator");

    if (username) {
        
        let links = [
            'home-link',
            'home-link-nav',
            'music-search-link',
            'select-link',
            'profile-link',
            'collections-link',
            'events-link',
            'live-link',
            'create-link'
        ];

        links.forEach(linkId => {
            const linkElement = document.getElementById(linkId);
            if (linkElement) {
                linkElement.href += `?username=${username}`;
                linkElement.href += `&is_creator=${is_creator}`;
            }
        });        
    }

    if(is_creator == "true"){
        document.getElementsByClassName("nav-create-item")[0].style.display = "flex";
    }
    else
    {
        document.getElementsByClassName("nav-create-item")[0].style.display = "none";
    }
});


menuItems.forEach(menuItem => {
    menuItem.addEventListener("click", function (event) {

        menuItems.forEach(item => item.classList.remove('active-menu'));

        const value = event.currentTarget.getAttribute("data-value");
        
        if (value === "music") {
            menuItems[0].classList.add("active-menu");
            document.getElementsByClassName("music-addition-container")[0].style.display = "flex";
            document.getElementsByClassName("event-addition-container")[0].style.display = "none";
            document.getElementsByClassName("past-creations-container")[0].style.display = "none";
        } else if (value === "event") {
            menuItems[1].classList.add("active-menu");
            document.getElementsByClassName("music-addition-container")[0].style.display = "none";
            document.getElementsByClassName("event-addition-container")[0].style.display = "flex";
            document.getElementsByClassName("past-creations-container")[0].style.display = "none";
        } else { 
            menuItems[2].classList.add("active-menu");
            document.getElementsByClassName("music-addition-container")[0].style.display = "none";
            document.getElementsByClassName("event-addition-container")[0].style.display = "none";
            document.getElementsByClassName("past-creations-container")[0].style.display = "flex";
            displayCreations();
        }
    });
});


let selectedMusics = [];
let selectedAlbums = [];
let selectedEvents = [];
let selectedLiveEvents = [];


window.addEventListener("click", function(event) {
    let modals = document.querySelectorAll(".modal");
    modals.forEach(function(modal) {
        if (event.target == modal) {
            modal.style.display = "none";
            while (selectedMusics.length > 0) {
                selectedMusics.pop();
            }
            while (selectedAlbums.length > 0) {
                selectedAlbums.pop();
            }
            while (selectedEvents.length > 0) {
                selectedEvents.pop();
            }
            while (selectedLiveEvents.length > 0) {
                selectedLiveEvents.pop();
            }
        }
    });
});


async function MusicSelected(musicId, musicDiv) {
    const index = selectedMusics.indexOf(musicId);
    if (index === -1) {
        selectedMusics.push(musicId);
        musicDiv.classList.add('selected');
    } else {
        selectedMusics.splice(index, 1);
        musicDiv.classList.remove('selected');
    }
}


async function AlbumSelected(albumId, albumDiv) {
    const index = selectedAlbums.indexOf(albumId);
    if (index === -1) {
        selectedAlbums.push(albumId);
        albumDiv.classList.add('selected');
    } else {
        selectedAlbums.splice(index, 1);
        albumDiv.classList.remove('selected');
    }
}


async function EventSelected(eventId, eventDiv) {
    const index = selectedEvents.indexOf(eventId);
    if (index === -1) {
        selectedEvents.push(eventId);
        eventDiv.classList.add('selected');
    } else {
        selectedEvents.splice(index, 1);
        eventDiv.classList.remove('selected');
    }
}


async function LiveEventSelected(liveEventId, liveEventDiv) {
    const index = selectedLiveEvents.indexOf(liveEventId);
    if (index === -1) {
        selectedLiveEvents.push(liveEventId);
        liveEventDiv.classList.add('selected');
    } else {
        selectedLiveEvents.splice(index, 1);
        liveEventDiv.classList.remove('selected');
    }
}


async function addSingle() {
    const csrftoken = getCookie('csrftoken');
    let music_name = document.getElementById("music-name").value;
    let mood = document.getElementsByClassName("mood-select-music")[0].value;
    let genre = document.getElementsByClassName("genre-select-music")[0].value;
    let audio = document.getElementById("music-file-upload").files[0];
    let image = document.getElementById("music-image-upload").files[0];
    let lyrics = document.getElementById("music-lrc-upload").files[0];

    const audioElement = new Audio(URL.createObjectURL(audio));
    
    audioElement.onloadedmetadata = async function() {
        let duration = audioElement.duration;

        try {
            const imageData = new FormData();
            imageData.append("file", image);
            imageData.append("upload_preset", "xpmwd1yk");

            const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
                method: 'POST',
                body: imageData,
            });
            const imageUploadResult = await imageUploadResponse.json();

            if (!imageUploadResponse.ok) {
                throw new Error(imageUploadResult.error.message);
            }

            const img_url = imageUploadResult.secure_url;

            const audioData = new FormData();
            audioData.append("file", audio);
            audioData.append("upload_preset", "xpmwd1yk");

            const audioUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/raw/upload', { 
                method: 'POST',
                body: audioData,
            });

            const audioUploadResult = await audioUploadResponse.json();
            if (!audioUploadResponse.ok) {
                throw new Error(audioUploadResult.error.message);
            }

            const audio_url = audioUploadResult.secure_url;

            const formData = new FormData();
            formData.append("music_name", music_name);
            formData.append("music_artist", username);
            formData.append("mood", mood);
            formData.append("genre", genre);
            formData.append("image", img_url);  
            formData.append("audio", audio_url);  
            formData.append("lyrics", lyrics);  
            formData.append("duration", duration);

            const response = await fetch("/create_single/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData  
            });

            if (response.ok) {
                alert("New music is created");
            } else {
                const error = await response.json();
                alert(`Error creating music: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the music.');
        }
    };
}

async function removeSingle(){
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    const musics = {
        musics: selectedMusics,
    };

    const response = await fetch("/delete_single/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(musics)
    });

    if (response.ok) {
        while (selectedMusics.length > 0) {
            selectedMusics.pop();
        }
        alert("selected musics are deleted")
        displayCreatedSingles();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addAlbum(){
    const csrftoken = getCookie('csrftoken');
    let albumName = document.getElementById("album-name").value;
    let albumImage = document.getElementById("album-cover-image").files[0];
    let albumGenre = document.getElementsByClassName("genre-select-album")[0].value;

    console.log(albumGenre);

    const imageData = new FormData();
    imageData.append("file", albumImage);
    imageData.append("upload_preset", "xpmwd1yk");

    const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
        method: 'POST',
        body: imageData,
    });
    const imageUploadResult = await imageUploadResponse.json();

    if (!imageUploadResponse.ok) {
        throw new Error(imageUploadResult.error.message);
    }

    const img_url = imageUploadResult.secure_url;


    const album = {
        album_name: albumName,
        album_artist: username,
        album_image: img_url,
        album_genre: albumGenre,
    };

    const response = await fetch("/create_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(album)
    });

    if (response.ok) {
        alert("new album is created.")
        const data = await response.json();
        let albumId = data.album;

        console.log(albumId);
        selectedAlbums.push(albumId);
        openModal(".manage-album-songs-modal");
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeAlbum(){
    const csrftoken = getCookie('csrftoken');

    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    const albums = {
        albums: selectedAlbums,
    };

    const response = await fetch("/delete_album/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(albums)
    });

    if (response.ok) {
        while (selectedAlbums.length > 0) {
            selectedAlbums.pop();
        }
        alert("selected albums are deleted")
        displayCreatedAlbums();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addSongToAlbum(continueAdding){
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    if (selectedAlbums.length > 1) {
        alert("Please select just a single album to edit.");
        return;
    }

    const data = {
        album_id: selectedAlbums[0],
        musics: selectedMusics,
    };

    const response = await fetch("/add_song_to_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        while (selectedMusics.length > 0) {
            selectedMusics.pop();
        }
        if(continueAdding)
        {
            while (selectedAlbums.length > 0) {
                selectedAlbums.pop();
            }
        }
        alert("music is added to the album")
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeSongFromAlbum(){
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    const data = {
        album_id: selectedAlbums[0],
        musics: selectedMusics
    };

    const response = await fetch("/remove_song_from_album/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        while (selectedAlbums.length > 0) {
            selectedAlbums.pop();
        }
        while (selectedMusics.length > 0) {
            selectedMusics.pop();
        }
        alert("selected musics are removed from the album")
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addEvent() {
    const csrftoken = getCookie('csrftoken');
    const event_name = document.getElementById("event-name").value;
    const event_date = document.getElementById("event-date").value;
    const event_location = document.getElementById("event-location").value;
    const event_info = document.getElementById("event-info").value;
    const event_image = document.getElementById("event-image").files[0]; 

    try {
        const data = new FormData();
        data.append("file", event_image);
        data.append("upload_preset", "xpmwd1yk");

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
            method: 'POST',
            body: data,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(uploadResult.error.message);
        }

        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        const event = {
            event_name: event_name,
            artist: username,
            location: event_location,
            date: event_date,
            info: event_info,
            image: optimizeUrl,
        };

        const response = await fetch("/create_event/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(event)
        });

        if (response.ok) {
            alert("Event is created successfully!");
        } else {
            const error = await response.json();
            alert(`Error creating event: ${error.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the image.');
    }
}


async function removeEvent(){
    const csrftoken = getCookie('csrftoken');

    if (selectedEvents.length === 0) {
        alert("Please select at least one event");
        return;
    }

    const events = {
        events: selectedEvents,
    };

    const response = await fetch("/delete_event/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(events)
    });

    if (response.ok) {
        while (selectedEvents.length > 0) {
            selectedEvents.pop();
        }
        alert("selected events are deleted")
        displayCreatedEvents();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addLiveEvent() {
    const csrftoken = getCookie('csrftoken');
    let event_name = document.getElementById("live-event-name").value;
    let event_info = document.getElementById("live-event-info").value;
    let event_link = document.getElementById("live-event-link").value;
    let event_date = document.getElementById("live-event-date").value;
    let event_image = document.getElementById("live-event-image").files[0];

    try {
        const data = new FormData();
        data.append("file", event_image);
        data.append("upload_preset", "xpmwd1yk");

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
            method: 'POST',
            body: data,
        });

        const uploadResult = await uploadResponse.json();
        console.log(uploadResult);  

        if (!uploadResponse.ok) {
            throw new Error(uploadResult.error.message);
        }

        const optimizeUrl = uploadResult.secure_url;

        console.log("Username:", username); 

        const event = {
            event_name: event_name,
            artist: username,
            link: event_link,
            date: event_date,
            info: event_info,
            image: optimizeUrl,
        };

        const response = await fetch("/create_live_event/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(event),
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);  

        if (response.ok) {
            alert("Live event is created successfully!");
        } else {
            alert(`Error creating live event: ${responseData.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the live event.');
    }
}

async function removeLiveEvent(){
    const csrftoken = getCookie('csrftoken');

    if (selectedLiveEvents.length === 0) {
        alert("Please select at least one event");
        return;
    }

    const events = {
        events: selectedLiveEvents,
    };

    const response = await fetch("/delete_live_event/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(events)
    });

    if (response.ok) {
        while (selectedLiveEvents.length > 0) {
            selectedLiveEvents.pop();
        }
        alert("selected live events are deleted")
        displayCreatedLiveEvents();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function displayCreations(){
    displayCreatedSingles();
    displayCreatedAlbums();
    displayCreatedEvents();
    displayCreatedLiveEvents();
}

async function displayCreatedSingles(){
    const response = await fetch('/created_singles/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("singles-list")[0];
        musicsContainer.innerHTML = ''; 

        for (const music of musics.slice(0, 7)) {
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicClicked(music.id);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            infoDiv.appendChild(musicName);

            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(infoDiv);

            musicsContainer.appendChild(musicDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_created_singles' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        musicsContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayCreatedAlbums(){
    const response = await fetch('/created_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("albums-list")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 7)) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumClicked(album.id);

            const albumImg = document.createElement('img');
            albumImg.src = album.image;
            albumImg.className = 'album-img';
            imgDiv.appendChild(albumImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'album-info-div';

            const albumName = document.createElement('h4');
            albumName.textContent = album.name;

            infoDiv.appendChild(albumName);

            albumDiv.appendChild(imgDiv);
            albumDiv.appendChild(infoDiv);

            albumContainer.appendChild(albumDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_created_albums' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        albumContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayCreatedEvents(){
    const response = await fetch('/created_events/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const events = data.events;

        const eventsContainer = document.getElementsByClassName("events-list")[0];
        eventsContainer.innerHTML = ''; 

        for (const event of events.slice(0, 7)) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'event-img-div';
            const EventImg = document.createElement('img');
            EventImg.src = event.image;
            EventImg.className = 'event-img';
            imgDiv.appendChild(EventImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'event-info-div';

            const eventName = document.createElement('h4');
            eventName.textContent = event.name;

            infoDiv.appendChild(eventName);

            eventDiv.appendChild(imgDiv);
            eventDiv.appendChild(infoDiv);

            eventsContainer.appendChild(eventDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_created_events' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        eventsContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayCreatedLiveEvents(){
    const response = await fetch('/created_live_events/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const events = data.live;

        const liveEventsContainer = document.getElementsByClassName("live-events-list")[0];
        liveEventsContainer.innerHTML = ''; 

        for (const event of events.slice(0, 7)) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-div';


            const imgDiv = document.createElement("div");
            imgDiv.className = "img-div";
            const img = document.createElement("img");
            img.src = event.image;
            img.className = "event-img";
            imgDiv.appendChild(img);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'event-info-div';

            const eventName = document.createElement('h4');
            eventName.textContent = event.name;

            infoDiv.appendChild(eventName);

            eventDiv.appendChild(imgDiv);
            eventDiv.appendChild(infoDiv);

            liveEventsContainer.appendChild(eventDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_created_live_events' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        liveEventsContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

function openModal(modalClass) {
    document.querySelector(modalClass).style.display = "block";
}

function closeModal(modalClass) {
    document.querySelector(modalClass).style.display = "none";
}


document.getElementsByClassName("create-single-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    addSingle();
})

document.getElementsByClassName("btn-add-multi-musics")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-album-songs-modal");
    openModal(".add-music-modal");
})

document.getElementsByClassName("btn-add-music-to-album")[0].addEventListener("click", async function(event) {
    event.preventDefault();
    await createMusic();
    closeModal(".add-music-modal");
})

document.getElementsByClassName("btn-add-music-and-continue")[0].addEventListener("click", async function(event) {
    event.preventDefault();
    await createMusic();
    closeModal(".add-music-modal");
    setTimeout(function() {
        openModal(".add-music-modal")
    }, 2000);
   // openModal(".add-music-modal");
})

document.getElementsByClassName("create-album-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    addAlbum();
})

document.getElementsByClassName("create-event-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    addEvent();
})

document.getElementsByClassName("create-live-event-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    addLiveEvent();
})

document.getElementsByClassName("delete-single-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".delete-single-modal");
    showAllSingles();
})

document.getElementsByClassName("delete-album-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".delete-album-modal");
    showAllAlbums(false);
})

document.getElementsByClassName("delete-event-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".delete-event-modal");
    showAllEvents(false);
})

document.getElementsByClassName("delete-live-event-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".delete-live-event-modal");
    showAllEvents(true);
})

document.getElementsByClassName("btn-remove-single")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-single-modal");
    removeSingle();
})

document.getElementsByClassName("btn-remove-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-album-modal");
    removeAlbum();
})

document.getElementsByClassName("btn-remove-event")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-event-modal");
    removeEvent();
})

document.getElementsByClassName("btn-remove-live-event")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-live-event-modal");
    removeLiveEvent();
})

document.getElementsByClassName("edit-album-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".edit-album-modal");
    showAllAlbums(true);
})

document.getElementsByClassName("choose-album-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    if(selectedAlbums.length > 1)
    {
        alert("please select just one album");
        return;
    }
    else
    {
        closeModal(".edit-album-modal");
        openModal(".add-remove-modal");
    }
})

document.getElementsByClassName("edit-add-music-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-remove-modal");
    openModal(".add-song-to-album-modal");
})

document.getElementsByClassName("edit-remove-music-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-remove-modal");
    openModal(".remove-song-from-album-modal");
    showAllAlbumSongs(selectedAlbums[0]);
})

document.getElementsByClassName("edit-add-musics-album")[0].addEventListener("click", async function(event) {
    event.preventDefault();
    await createMusicEdit();
    closeModal(".add-song-to-album-modal");
})

document.getElementsByClassName("edit-remove-musics-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".remove-song-from-album-modal");
    removeSongFromAlbum();
})

async function showAllSingles(){
    const response = await fetch('/created_singles/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("created-singles-modal-content")[0];
        musicsContainer.innerHTML = '';

        for (const music of musics.slice(0, 6)){
            const musicDiv = document.createElement('div');
            musicDiv.className = 'display-random-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicSelected(music.id, imgDiv);
            imgDiv.appendChild(musicImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(infoDiv);

            musicsContainer.appendChild(musicDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function showAllAlbums(edit){
    const response = await fetch('/created_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        let albumContainer;
        if(edit)
        {
            albumContainer = document.getElementsByClassName("created-albums-edit-modal-content")[0];
            albumContainer.innerHTML = ''; 
        }
        else
        {
            albumContainer = document.getElementsByClassName("created-albums-modal-content")[0];
            albumContainer.innerHTML = ''; 
        }

        for (const album of albums) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumSelected(album.id, imgDiv);

            const albumImg = document.createElement('img');
            albumImg.src = album.image;
            albumImg.className = 'album-img';
            imgDiv.appendChild(albumImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'album-info-div';

            const albumName = document.createElement('h4');
            albumName.textContent = album.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(album.artist_id);

            infoDiv.appendChild(albumName);
            infoDiv.appendChild(artistName);

            albumDiv.appendChild(imgDiv);
            albumDiv.appendChild(infoDiv);

            albumContainer.appendChild(albumDiv);
        }
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function showAllEvents(isLiveEvent){
    let response;
    let eventsContainer;
    if(!isLiveEvent)
    {
        response = await fetch('/created_events/?username=' + username);
        eventsContainer = document.getElementsByClassName("created-events-modal-content")[0];
        eventsContainer.innerHTML = "";
    }
    else
    {
        response = await fetch('/created_live_events/?username=' + username);
        eventsContainer = document.getElementsByClassName("created-live-events-modal-content")[0];
        eventsContainer.innerHTML = "";
    }
    if (response.ok) {
        const data = await response.json();
        let events;
        if(isLiveEvent){
            events = data.live;
        }
        else
        {
            events = data.events;
        }

        for (const event of events) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-div';

            const imgDiv = document.createElement("div");
            imgDiv.className = "img-div";
            const img = document.createElement("img");
            img.src = event.image;
            img.className = "event-img";
            imgDiv.appendChild(img);
            if(isLiveEvent){
                imgDiv.onclick = () => LiveEventSelected(event.id, imgDiv);
            }
            else
            {
                imgDiv.onclick = () => EventSelected(event.id, imgDiv);
            }

            const infoDiv = document.createElement('div');
            infoDiv.className = 'event-info-div';

            const eventName = document.createElement('h4');
            eventName.textContent = event.name;

            infoDiv.appendChild(eventName);

            eventDiv.appendChild(imgDiv);
            eventDiv.appendChild(infoDiv);

            eventsContainer.appendChild(eventDiv);
        }
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + "&username="+ username + `&is_creator=${is_creator}`;
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id + "&username="+ username + `&is_creator=${is_creator}`;
}

async function showAllAlbumSongs(album_id){
    const response = await fetch('/album_musics/?username=' + username+ '&album_id='+ album_id);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("edit-album-musics-remove")[0];
        musicsContainer.innerHTML = '';

        for (const music of musics.slice(0, 6)){
            const musicDiv = document.createElement('div');
            musicDiv.className = 'display-random-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicSelected(music.id, imgDiv);
            imgDiv.appendChild(musicImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(infoDiv);

            musicsContainer.appendChild(musicDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function createMusic(){
    const csrftoken = getCookie('csrftoken');
    let music_name = document.getElementById("music-name-album").value;
    let mood = document.getElementsByClassName("mood-select-music-album")[0].value;
    let genre = document.getElementsByClassName("genre-select-music-album")[0].value;
    let audio = document.getElementById("music-file-upload-album").files[0];
    let image = document.getElementById("music-image-upload-album").files[0];
    let lyrics = document.getElementById("music-lrc-upload-album").files[0];

    const audioElement = new Audio(URL.createObjectURL(audio));
    
    audioElement.onloadedmetadata = async function() {
        let duration = audioElement.duration;

        try {
            const imageData = new FormData();
            imageData.append("file", image);
            imageData.append("upload_preset", "xpmwd1yk");

            const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
                method: 'POST',
                body: imageData,
            });
            const imageUploadResult = await imageUploadResponse.json();

            if (!imageUploadResponse.ok) {
                throw new Error(imageUploadResult.error.message);
            }

            const img_url = imageUploadResult.secure_url;

            const audioData = new FormData();
            audioData.append("file", audio);
            audioData.append("upload_preset", "xpmwd1yk");

            const audioUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/raw/upload', { 
                method: 'POST',
                body: audioData,
            });

            const audioUploadResult = await audioUploadResponse.json();
            if (!audioUploadResponse.ok) {
                throw new Error(audioUploadResult.error.message);
            }

            const audio_url = audioUploadResult.secure_url;

            const formData = new FormData();
            formData.append("music_name", music_name);
            formData.append("music_artist", username);
            formData.append("album", selectedAlbums[0]);
            formData.append("mood", mood);
            formData.append("genre", genre);
            formData.append("image", img_url);  
            formData.append("audio", audio_url);  
            formData.append("lyrics", lyrics);  
            formData.append("duration", duration);

            const response = await fetch("/create_album_music/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData  
            });

            if (response.ok) {
                alert("New music is created");
                const data = response.json();
                let musicId = data.music;
                console.log(musicId);
                selectedMusics.push(musicId);
                addSongToAlbum();
            } else {
                const error = await response.json();
                alert(`Error creating music: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the music.');
        }
    };
}

async function createMusicEdit(){
    const csrftoken = getCookie('csrftoken');
    let music_name = document.getElementById("music-name-album-edit").value;
    let mood = document.getElementsByClassName("mood-select-music-album-edit")[0].value;
    let genre = document.getElementsByClassName("genre-select-music-album-edit")[0].value;
    let audio = document.getElementById("music-file-upload-album-edit").files[0];
    let image = document.getElementById("music-image-upload-album-edit").files[0];
    let lyrics = document.getElementById("music-lrc-upload-album-edit").files[0];

    const audioElement = new Audio(URL.createObjectURL(audio));
    
    audioElement.onloadedmetadata = async function() {
        let duration = audioElement.duration;

        try {
            const imageData = new FormData();
            imageData.append("file", image);
            imageData.append("upload_preset", "xpmwd1yk");

            const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
                method: 'POST',
                body: imageData,
            });
            const imageUploadResult = await imageUploadResponse.json();

            if (!imageUploadResponse.ok) {
                throw new Error(imageUploadResult.error.message);
            }

            const img_url = imageUploadResult.secure_url;

            const audioData = new FormData();
            audioData.append("file", audio);
            audioData.append("upload_preset", "xpmwd1yk");

            const audioUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/raw/upload', { 
                method: 'POST',
                body: audioData,
            });

            const audioUploadResult = await audioUploadResponse.json();
            if (!audioUploadResponse.ok) {
                throw new Error(audioUploadResult.error.message);
            }

            const audio_url = audioUploadResult.secure_url;

            const formData = new FormData();
            formData.append("music_name", music_name);
            formData.append("music_artist", username);
            formData.append("album", selectedAlbums[0]);
            formData.append("mood", mood);
            formData.append("genre", genre);
            formData.append("image", img_url);  
            formData.append("audio", audio_url);  
            formData.append("lyrics", lyrics);  
            formData.append("duration", duration);

            const response = await fetch("/create_album_music/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formData  
            });

            if (response.ok) {
                alert("New music is created");
                const data = response.json();
                let musicId = data.music;
                console.log(musicId);
                selectedMusics.push(musicId);
                addSongToAlbum();
            } else {
                const error = await response.json();
                alert(`Error creating music: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the music.');
        }
    };
}
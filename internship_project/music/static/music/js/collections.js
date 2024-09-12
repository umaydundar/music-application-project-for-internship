let username = "";

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

let cloudinary;
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    username = params.get("username");
    is_creator = params.get("is_creator");

    cloudinary = window.cloudinary.Cloudinary.new({
        cloud_name: 'dzbuee4ii'
    });
    
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

    if (username) {
        
        links.forEach(linkId => {
            const linkElement = document.getElementById(linkId);
            if (linkElement) {
                linkElement.href += `?username=${username}`;
                linkElement.href += `&is_creator=${is_creator}`
            }
        });        

    }

    displayCollections();
    displaySavedAlbums();
    displayPlaylists();
    
    if(is_creator == "true"){
        document.getElementsByClassName("nav-create-item")[0].style.display = "flex";
    }
    else
    {
        document.getElementsByClassName("nav-create-item")[0].style.display = "none";
    }
});

let selectedMusics = [];
let selectedAlbums = [];
let selectedCollections = [];
let selectedPlaylists = [];


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
            while (selectedCollections.length > 0) {
                selectedCollections.pop();
            }
            while (selectedPlaylists.length > 0) {
                selectedPlaylists.pop();
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

async function CollectionSelected(collectionId, collectionDiv) {
    const index = selectedCollections.indexOf(collectionId);
    if (index === -1) {
        selectedCollections.push(collectionId);
        collectionDiv.classList.add('selected');
    } else {
        selectedCollections.splice(index, 1);
        collectionDiv.classList.remove('selected');
    }
}

async function PlaylistSelected(playlistId, playlistDiv) {
    const index = selectedPlaylists.indexOf(playlistId);
    if (index === -1) {
        selectedPlaylists.push(playlistId);
        playlistDiv.classList.add('selected');
    } else {
        selectedPlaylists.splice(index, 1);
        playlistDiv.classList.remove('selected');
    }
}

async function displayCollections(){
    const response = await fetch('/all_collections/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const collections = data.collections;

        const collectionContainer = document.getElementsByClassName("collections-list")[0];
        collectionContainer.innerHTML = ''; 

        for (const collection of collections.slice(0, 7)) {
            const collectionDiv = document.createElement('div');
            collectionDiv.className = 'collection-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'collection';
            imgDiv.onclick = () => CollectionClicked(collection.id);

            const collectionImg = document.createElement('img');
            collectionImg.src = collection.image;
            collectionImg.className = 'collection-img';
            imgDiv.appendChild(collectionImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'collection-info-div';

            const collectionName = document.createElement('h4');
            collectionName.textContent = collection.name;

            infoDiv.appendChild(collectionName);

            collectionDiv.appendChild(imgDiv);
            collectionDiv.appendChild(infoDiv);

            collectionContainer.appendChild(collectionDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_collections' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        collectionContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displaySavedAlbums(){
    const response = await fetch('/all_saved_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("saved-albums-list")[0];
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

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(album.artist_id);

            infoDiv.appendChild(albumName);
            infoDiv.appendChild(artistName);

            albumDiv.appendChild(imgDiv);
            albumDiv.appendChild(infoDiv);

            albumContainer.appendChild(albumDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_saved_albums' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        albumContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayPlaylists(){
    const response = await fetch('/all_playlists/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const playlists = data.playlists;

        const playlistContainer = document.getElementsByClassName("playlists-div")[0];
        playlistContainer.innerHTML = ''; 

        for (const playlist of playlists.slice(0, 7)) {
            const playlistDiv = document.createElement('div');
            playlistDiv.className = 'playlist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'playlist';
            imgDiv.onclick = () => PlaylistClicked(playlist.id);

            const playlistImg = document.createElement('img');
            playlistImg.src = playlist.image;
            playlistImg.className = 'playlist-img';
            imgDiv.appendChild(playlistImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'playlist-info-div';

            const playlistName = document.createElement('h4');
            playlistName.textContent = playlist.name;

            infoDiv.appendChild(playlistName);

            playlistDiv.appendChild(imgDiv);
            playlistDiv.appendChild(infoDiv);

            playlistContainer.appendChild(playlistDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_playlists' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        playlistContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function createCollection() {
    const csrftoken = getCookie('csrftoken');
    let name = document.getElementById("collection-name").value;
    let collection_image = document.getElementById("collection-image").files[0];

    try {
        const data = new FormData();
        data.append("file", collection_image);
        data.append("upload_preset", "xpmwd1yk");

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
            method: 'POST',
            body: data,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(uploadResult.error.message);
        }

        const img_url = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        const collection = {
            username: username,
            collection_name: name,
            image: img_url,
        };

        const response = await fetch("/create_collection/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(collection)
        });  
    
        if (response.ok) {
            const data = await response.json();
            let collectionId = data.collection;
            console.log(collectionId);
            while (selectedMusics.length > 0) {
                selectedMusics.pop();
            }
            alert("collection created");
            displayCollections();
            selectedCollections.push(collectionId);
            console.log(selectedCollections);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the image.');
    }
}

async function addSongToCollection() {
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    console.log(selectedCollections);
    if (selectedCollections.length === 0) {
        alert("Please select at least one collection to remove.");
        return;
    }

    const musics = {
        username: username,
        collections: selectedCollections,
        musics: selectedMusics,
    };

    const response = await fetch("/add_song_to_collection/", {
        method: 'POST',
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
        while (selectedCollections.length > 0) {
            selectedCollections.pop();
        }
        alert("selected musics are added")
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeSongFromCollection() {
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music to remove.");
        return;
    }

    if (selectedCollections.length === 0) {
        alert("Please select at least one collection to remove.");
        return;
    }

    const musics = {
        username: username,
        collections: selectedCollections,
        musics: selectedMusics,
    };

    const response = await fetch("/remove_song_from_collection/", {
        method: 'POST',
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
        while (selectedCollections.length > 0) {
            selectedCollections.pop();
        }
        alert("selected musics are removed from collection");
        displayCollections();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function deleteCollection() {
    const csrftoken = getCookie('csrftoken');
    
    if (selectedCollections.length === 0) {
        alert("Please select at least one collection to delete");
        return;
    }

    console.log(selectedCollections);

    const collections = {
        username: username,
        collections: selectedCollections,
    };

    const response = await fetch("/delete_collection/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(collections)
    });

    if (response.ok) {
        while (selectedCollections.length > 0) {
            selectedCollections.pop();
        }
        alert("selected collections are deleted");
        displayCollections();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addSavedAlbum() {
    const csrftoken = getCookie('csrftoken');
    
    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    const albums = {
        username: username,
        albums: selectedAlbums
    };

    const response = await fetch("/add_saved_album/", {
        method: 'POST',
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
        alert("selected albums are added to saved albums")
        displaySavedAlbums();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeSavedAlbum() {
    const csrftoken = getCookie('csrftoken');
    
    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    const albums = {
        username: username,
        albums: selectedAlbums,
    };

    const response = await fetch("/remove_saved_album/", {
        method: 'POST',
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
        alert("selected albums are removed from saved albums")
        displaySavedAlbums();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function searchAlbum(searchString) {
    let found = false;
    const response = await fetch('/search_album/?search_string='+ searchString + "&username="+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        if(albums.length > 0) {
            found = true;
            document.getElementsByClassName("album-search-content")[0].style.display = "none";
            document.getElementsByClassName("search-results-album")[0].style.display = "flex";
            document.getElementsByClassName("not-found-content")[0].style.display = "none";
        }

        console.log(found);

        const albumContainer = document.getElementsByClassName("search-results-album")[0];
        albumContainer.innerHTML = ''; 

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
        console.error('Failed to load artists:', response.status);
    }

    if(!found){
        document.getElementsByClassName("album-search-content")[0].style.display = "none";
        document.getElementsByClassName("search-results-album")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function searchSong(searchString, isCollection) {
    let found = false;
    const response = await fetch('/search_music/?search_string=' + searchString + "&username="+ username);
    if (response.ok) {
        
        const data = await response.json();
        const musics = data.musics;

        if(musics.length > 0) {
            found = true;
        }

        console.log(found);
        let musicsContainer;
        if(isCollection){
            musicsContainer = document.getElementsByClassName("search-results-music-collection")[0];
            musicsContainer.innerHTML = ''; 
        }
        else
        {
            musicsContainer = document.getElementsByClassName("search-results-music-playlist")[0];
            musicsContainer.innerHTML = ''; 
        }

        for (const music of musics) {
            let musicsDiv = document.createElement('div');
            musicsDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicSelected(music.id, imgDiv);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            musicsDiv.appendChild(imgDiv);
            musicsDiv.appendChild(infoDiv);

            musicsContainer.appendChild(musicsDiv);
        }
    
    } else {
        console.error('Failed to load artists:', response.status);
    }

    if(!found){
        document.getElementsByClassName("music-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}


async function createPlaylist(){
    const csrftoken = getCookie('csrftoken');
    let name = document.getElementById("playlist-name").value;
    let collection_image = document.getElementById("playlist-image").files[0];

    try {
        const data = new FormData();
        data.append("file", collection_image);
        data.append("upload_preset", "xpmwd1yk");

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
            method: 'POST',
            body: data,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(uploadResult.error.message);
        }

        const img_url = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        const playlist = {
            username: username,
            playlist_name: name,
            image: img_url,
        };

        const response = await fetch("/create_playlist/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(playlist)
        });  
    
        if (response.ok) {
            const data = await response.json();
            let playlistId = data.playlist;
            while (selectedMusics.length > 0) {
                selectedMusics.pop();
            }
            alert("playlist created");
            displayPlaylists();
            selectedPlaylists.push(playlistId);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the image.');
    }
}

async function deletePlaylist(){
    const csrftoken = getCookie('csrftoken');

    if (selectedPlaylists.length === 0) {
        alert("Please select at least one playlist.");
        return;
    }

    const playlists = {
        username: username,
        playlists: selectedPlaylists,
    };

    const response = await fetch("/delete_playlist/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(playlists)
    });

    if (response.ok) {
        while (selectedPlaylists.length > 0) {
            selectedPlaylists.pop();
        }
        alert("selected playlists are deleted")
        displayPlaylists();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function addSongToPlaylist(){

    const csrftoken = getCookie('csrftoken');
    
    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    if (selectedPlaylists.length === 0) {
        alert("Please select at least one playlist.");
        return;
    }

    const data = {
        username: username,
        playlists: selectedPlaylists,
        musics: selectedMusics,
    };

    const response = await fetch("/add_song_to_playlist/", {
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
        while (selectedPlaylists.length > 0) {
            selectedPlaylists.pop();
        }
        alert("selected songs are added")
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeSongFromPlaylist(){
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music to delete.");
        return;
    }

    if(selectedPlaylists.length === 0) {
        alert("Please select at least one playlist");
        return;
    }

    const musics = {
        username: username,
        playlists: selectedPlaylists,
        musics: selectedMusics,
    };

    const response = await fetch("/remove_song_from_playlist/", {
        method: 'POST',
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
        while (selectedCollections.length > 0) {
            selectedCollections.pop();
        }
        alert("selected musics are deleted")
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function CollectionClicked(collection_id){
    window.location.href = "/display/?action=get_collection_by_param&collection_id="+ collection_id + "&username="+ username;
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + "&username="+ username;
}

async function PlaylistClicked(playlist_id){
    window.location.href = "/display/?action=get_playlist_by_param&playlist_id=" + playlist_id + "&username="+ username;
}


function openModal(modalClass) {
    document.querySelector(modalClass).style.display = "block";
}

function closeModal(modalClass) {
    document.querySelector(modalClass).style.display = "none";
}


document.getElementsByClassName("manage-collections-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".manage-collections-modal");
})


document.getElementsByClassName("btn-add-collections")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-collections-modal");
    openModal(".add-new-collection-modal");
})


document.getElementsByClassName("btn-remove-collections")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-collections-modal");
    openModal(".delete-collections-modal");
    showAllCollections("collections-for-deletion");
})


document.getElementsByClassName("btn-edit-collections")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-collections-modal");
    openModal(".edit-collections-modal");
    showAllCollections("collections-for-edit")
})

document.getElementsByClassName("create-collection-btn")[0].addEventListener("click", async function(event) {
    event.preventDefault();
    closeModal(".add-new-collection-modal");
    await createCollection();
    openModal(".add-music-collection-modal");
})


document.getElementsByClassName("btn-search-music-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-music-collection-modal");
    openModal(".search-musics-modal-collection");
    document.getElementsByClassName("search-content")[0].style.display = "flex";
    document.getElementsByClassName("search-results-music-collection")[0].style.display = "none";
    document.getElementsByClassName("not-found-content")[0].style.display = "none";
})


document.getElementsByClassName("btn-suggest-music-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-music-collection-modal");
    openModal(".look-music-suggestions-modal-collection");
    showMusicSuggestionsCollection();
})


document.getElementsByClassName("btn-search-all-musics-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    let searchString = document.getElementsByClassName("search-string-music-collection")[0].value;
    document.getElementsByClassName("search-content")[0].style.display = "none";
    document.getElementsByClassName("search-results-music-collection")[0].style.display = "flex";
    document.getElementsByClassName("not-found-content")[0].style.display = "none";
    searchSong(searchString, true);
})

document.getElementsByClassName("search-add-music-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".search-musics-modal-collection");
    addSongToCollection();
})


document.getElementsByClassName("suggest-add-music-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".look-music-suggestions-modal-collection");
    addSongToCollection();
})


document.getElementsByClassName("remove-collections")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-collections-modal");
    deleteCollection();
})


document.getElementsByClassName("btn-edit-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    if(selectedCollections.length > 1)
    {
        alert("please only select 1 collection to edit");
        return;
    }
    else
    {
        closeModal(".edit-collections-modal");
        openModal(".edit-collection-modal");
    }
})


document.getElementsByClassName("btn-edit-collection-add-music")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".edit-collection-modal");
    openModal(".add-music-collection-modal");
})


document.getElementsByClassName("btn-edit-collection-remove-music")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".edit-collection-modal");
    openModal(".delete-musics-modal-collection");
    showCollectionMusicsToRemove(selectedCollections[0]);
})


document.getElementsByClassName("btn-remove-musics-from-collection")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-musics-modal-collection");
    removeSongFromCollection();
})


document.getElementsByClassName("manage-saved-albums-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".manage-albums-modal");
})


document.getElementsByClassName("btn-add-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-albums-modal");
    openModal(".add-albums-modal");
})


document.getElementsByClassName("btn-remove-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-albums-modal");
    openModal(".delete-albums-modal");
    showAllSavedAlbums("albums-for-remove-saved");
})


document.getElementsByClassName("btn-search-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-albums-modal");
    openModal(".search-albums-modal");
    document.getElementsByClassName("album-search-content")[0].style.display = "flex";
    document.getElementsByClassName("search-results-album")[0].style.display = "none";
    document.getElementsByClassName("not-found-content")[1].style.display = "none";
})

document.getElementsByClassName("btn-suggest-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-albums-modal");
    openModal(".look-album-suggestions-modal");
    showAlbumSuggestions();
})


document.getElementsByClassName("btn-search-all-albums")[0].addEventListener("click", function(event) {
    event.preventDefault();
    let searchString = document.getElementsByClassName("search-string-album-for-save")[0].value;
    document.getElementsByClassName("album-search-content")[0].style.display = "none";
    document.getElementsByClassName("search-results-album")[0].style.display = "flex";
    document.getElementsByClassName("not-found-content")[1].style.display = "none";
    searchAlbum(searchString);
})


document.getElementsByClassName("btn-search-add-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".search-albums-modal");
    addSavedAlbum();
})

document.getElementsByClassName("btn-suggest-add-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".look-album-suggestions-modal");
    addSavedAlbum();
})

document.getElementsByClassName("btn-remove-selected-album")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-albums-modal");
    removeSavedAlbum();
})

document.getElementsByClassName("manage-playlists-btn")[0].addEventListener("click", function(event) {
    event.preventDefault();
    openModal(".manage-playlists-modal");
})


document.getElementsByClassName("btn-add-playlists")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-playlists-modal");
    openModal(".add-new-playlist-modal");
})


document.getElementsByClassName("btn-remove-playlists")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-playlists-modal");
    openModal(".delete-playlists-modal");
    showAllPlaylists("playlists-for-remove");
})


document.getElementsByClassName("btn-edit-playlists")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".manage-playlists-modal");
    openModal(".edit-playlists-modal");
    showAllPlaylists("playlists-for-edit");
})

document.getElementsByClassName("btn-create-playlist")[0].addEventListener("click", async function(event) {
    event.preventDefault();
    closeModal(".add-new-playlist-modal");
    await createPlaylist();
    openModal(".add-music-playlist-modal");
})


document.getElementsByClassName("btn-search-music-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-music-playlist-modal");
    document.getElementsByClassName("music-search-content-playlist")[0].style.display = "flex";
    document.getElementsByClassName("search-results-music-playlist")[0].style.display = "none";
    document.getElementsByClassName("not-found-content")[2].style.display = "none";
    openModal(".search-musics-modal-playlist");
})


document.getElementsByClassName("btn-suggest-music-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".add-music-playlist-modal");
    openModal(".look-music-suggestions-modal-playlist");
    showMusicSuggestionsPlaylist();
})


document.getElementsByClassName("btn-search-all-musics-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    let searchString = document.getElementsByClassName("search-string-music-playlist")[0].value;
    document.getElementsByClassName("music-search-content-playlist")[0].style.display = "none";
    document.getElementsByClassName("search-results-music-playlist")[0].style.display = "flex";
    document.getElementsByClassName("not-found-content")[2].style.display = "none";
    searchSong(searchString, false);
})


document.getElementsByClassName("btn-search-add-music-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".search-musics-modal-playlist");
    addSongToPlaylist();
})


document.getElementsByClassName("btn-suggest-add-music-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".look-music-suggestions-modal-playlist");
    addSongToPlaylist();
})

document.getElementsByClassName("remove-playlists")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-playlists-modal");
    deletePlaylist();
})

document.getElementsByClassName("btn-edit-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    if(selectedPlaylists.length > 1)
    {
        alert("please select only 1 playlist to edit");
        return;
    }
    else
    {
        closeModal(".edit-playlists-modal");
        openModal(".edit-playlist-modal");
    }
})

document.getElementsByClassName("btn-add-music-to-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".edit-playlist-modal");
    openModal(".add-music-playlist-modal");
})

document.getElementsByClassName("btn-remove-music-from-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".edit-playlist-modal");
    openModal(".delete-musics-modal-playlist");
    showPlaylistMusicsToRemove(selectedPlaylists[0]);
})


document.getElementsByClassName("btn-remove-musics-playlist")[0].addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(".delete-musics-modal-playlist");
    removeSongFromPlaylist();
})

async function showAlbumSuggestions() {
    const response = await fetch('/album_suggestions/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        console.log(albums);

        const albumContainer = document.getElementsByClassName("album-suggestions")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 6)) {
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

async function showMusicSuggestionsCollection() {
    const response = await fetch('/music_suggestions_collection/?username=' + username);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-suggestions-collection")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics.slice(0, 6)) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicSelected(music.id, imgDiv);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            recommendedDiv.appendChild(imgDiv);
            recommendedDiv.appendChild(infoDiv);

            recommendedContainer.appendChild(recommendedDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function showMusicSuggestionsPlaylist() {
    console.log("music suggestions entered")
    const response = await fetch('/music_suggestions_playlist/?username=' + username);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-suggestions-playlist")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics.slice(0, 6)) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicSelected(music.id, imgDiv);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            recommendedDiv.appendChild(imgDiv);
            recommendedDiv.appendChild(infoDiv);

            recommendedContainer.appendChild(recommendedDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function showAllCollections(className){
    const response = await fetch('/all_collections/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const collections = data.collections;

        const collectionContainer = document.getElementsByClassName(className)[0];
        collectionContainer.innerHTML = ''; 

        for (const collection of collections) {
            console.log(collection);
            console.log(collection.id);
            const collectionDiv = document.createElement('div');
            collectionDiv.className = 'collection-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'collection';
            imgDiv.onclick = () => CollectionSelected(collection.id, imgDiv);

            const collectionImg = document.createElement('img');
            collectionImg.src = collection.image;
            collectionImg.className = 'collection-img';
            imgDiv.appendChild(collectionImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'collection-info-div';

            const collectionName = document.createElement('h4');
            collectionName.textContent = collection.name;

            infoDiv.appendChild(collectionName);

            collectionDiv.appendChild(imgDiv);
            collectionDiv.appendChild(infoDiv);

            collectionContainer.appendChild(collectionDiv);
        }
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function showAllPlaylists(className){
    const response = await fetch('/all_playlists/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const playlists = data.playlists;

        const playlistContainer = document.getElementsByClassName(className)[0];
        playlistContainer.innerHTML = ''; 

        for (const playlist of playlists) {
            const playlistDiv = document.createElement('div');
            playlistDiv.className = 'playlist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'playlist';
            imgDiv.onclick = () => PlaylistSelected(playlist.id, imgDiv);

            const playlistImg = document.createElement('img');
            playlistImg.src = playlist.image;
            playlistImg.className = 'playlist-img';
            imgDiv.appendChild(playlistImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'playlist-info-div';

            const playlistName = document.createElement('h4');
            playlistName.textContent = playlist.name;

            infoDiv.appendChild(playlistName);

            playlistDiv.appendChild(imgDiv);
            playlistDiv.appendChild(infoDiv);

            playlistContainer.appendChild(playlistDiv);
        }
    } else {
        console.error('Failed to load playlists:', response.status);
    }
}

async function showAllSavedAlbums(className){
    const response = await fetch('/all_saved_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName(className)[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 7)) {
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

async function showCollectionMusicsToRemove(collection_id){
    const response = await fetch('/collection_musics/?username=' + username + '&collection_id=' + collection_id);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("collection-musics-to-remove")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicSelected(music.id, imgDiv);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            recommendedDiv.appendChild(imgDiv);
            recommendedDiv.appendChild(infoDiv);

            recommendedContainer.appendChild(recommendedDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function showPlaylistMusicsToRemove(playlist_id){
    const response = await fetch('/playlist_musics/?username=' + username + '&playlist_id=' + playlist_id);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("playlist-musics-to-remove")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';
            imgDiv.onclick = () => MusicSelected(music.id, imgDiv);

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            imgDiv.appendChild(musicImg);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

            const musicName = document.createElement('h4');
            musicName.textContent = music.name;

            const artistName = document.createElement('p');
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            recommendedDiv.appendChild(imgDiv);
            recommendedDiv.appendChild(infoDiv);

            recommendedContainer.appendChild(recommendedDiv);
        }
    } else {
        console.error('Failed to load musics:', response.status);
    }
}
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

let selectedCollections = [];
let selectedPlaylists = [];
var modal = document.getElementsByClassName("modal");

window.onclick = function(event) {
    for(let i = 0; i < modal.length; i++)
    {
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
            while (selectedCollections.length > 0) {
                selectedCollections.pop();
            }
            while (selectedPlaylists.length > 0) {
                selectedPlaylists.pop();
            }
          }
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

let username = "";
let song_id = "";
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    song_id = params.get("music_id");
    is_creator = params.get("is_creator");

    username = params.get("username");

    if (username) {
        const links = [
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
        
        if(is_creator == "true"){
            document.getElementsByClassName("nav-create-item")[0].style.display = "flex";
        }
        else
        {
            document.getElementsByClassName("nav-create-item")[0].style.display = "none";
        }
    }
    
    displaySong(song_id);
    displayLyrics(song_id);
    displayLike(song_id);
    displaySave(song_id);
});


document.getElementsByClassName("fav-song-div")[0].addEventListener("click", function (event) {
    event.preventDefault();
    if(document.getElementsByClassName("liked")[0].style.display == "flex")
    {
        document.getElementsByClassName("liked")[0].style.display = "none";
        document.getElementsByClassName("not-liked")[0].style.display = "flex";
        removeLikedMusic(song_id);
    }
    else
    {
        document.getElementsByClassName("not-liked")[0].style.display = "none";
        document.getElementsByClassName("liked")[0].style.display = "flex";
        addLikedMusic(song_id);
    }
})

async function displayLike(song_id){
    const response = await fetch('/is_fav_song/?music_id=' + song_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const music = data.music;
        if(music != null && music.length > 0)
        {
            document.getElementsByClassName("liked")[0].style.display = "flex";
            document.getElementsByClassName("not-liked")[0].style.display = "none";
        }
        else
        {
            document.getElementsByClassName("liked")[0].style.display = "none";
            document.getElementsByClassName("not-liked")[0].style.display = "flex";
        }
    }
    else
    {
        console.error('Failed to load music:', response.status);
    }
}

async function removeLikedMusic(song_id){
    const csrftoken = getCookie('csrftoken');

    const music = {
        username: username,
        musics: [song_id],
    };

    fetch("/remove_fav_song/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("selected music is removed from favorite musics")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addLikedMusic(song_id){
    const csrftoken = getCookie('csrftoken');

    const music = {
        username: username,
        musics: [song_id],
    };

    fetch("/add_fav_song/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("selected music is added to favorite musics")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

document.getElementsByClassName("save-song-div")[0].addEventListener("click", function (event) {
    event.preventDefault();
    displaySave(song_id);
    if(document.getElementsByClassName("saved")[0].style.display == "flex")
    {
        document.getElementsByClassName("saved")[0].style.display = "none";
        document.getElementsByClassName("not-saved")[0].style.display = "flex";
        openModal(".manage-music-modal");
    }
    else
    {
        document.getElementsByClassName("not-saved")[0].style.display = "none";
        document.getElementsByClassName("saved")[0].style.display = "flex";
        openModal(".save-music-modal");
    }
})


document.getElementsByClassName("decision-add-music")[0].addEventListener("click", function(){
    closeModal(".manage-music-modal");
    openModal(".save-music-modal");
})


document.getElementsByClassName("decision-remove-music")[0].addEventListener("click", function(){
    closeModal(".manage-music-modal");
    openModal(".remove-music-modal");
})

async function displaySave(song_id){
    const response = await fetch('/is_saved_music/?music_id=' + song_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;
        if(musics != null && musics.length > 0)
        {
            document.getElementsByClassName("saved")[0].style.display = "flex";
            document.getElementsByClassName("not-saved")[0].style.display = "none";
        }
        else
        {
            document.getElementsByClassName("saved")[0].style.display = "none";
            document.getElementsByClassName("not-saved")[0].style.display = "flex";
        }
    }
    else
    {
        console.error('Failed to load album:', response.status);
    }
}

async function removeSongFromCollection(song_id){
    const csrftoken = getCookie('csrftoken');

    if(selectedCollections.length == 0 ){
        alert("Please select at least one collection");
        return;
    }

    const music = {
        username: username,
        musics: [song_id],
        collections: selectedCollections,
    };

    fetch("/remove_song_from_collection/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("music is removed from selected collections")
            displaySave(song_id);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addSongToCollection(song_id){
    const csrftoken = getCookie('csrftoken');

    if(selectedCollections.length == 0 ){
        alert("Please select at least one collection");
        return;
    }

    const music = {
        username: username,
        musics: [song_id],
        collections: selectedCollections,
    };

    fetch("/add_song_to_collection/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("music is added to selected collections")
            displaySave(song_id);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function removeSongFromPlaylist(song_id)
{
    const csrftoken = getCookie('csrftoken');

    if(selectedPlaylists.length == 0 ){
        alert("Please select at least one playlist");
        return;
    }

    const music = {
        username: username,
        musics: [song_id],
        playlists: selectedPlaylists,
    };

    fetch("/remove_song_from_playlist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("music is remove from selected playlists")
            displaySave(song_id);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addSongToPlaylist(song_id)
{
    const csrftoken = getCookie('csrftoken');

    if(selectedPlaylists.length == 0 ){
        alert("Please select at least one playlist");
        return;
    }

    const music = {
        username: username,
        musics: [song_id],
        playlists: selectedPlaylists,
    };

    fetch("/add_song_to_playlist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(music)
    })
    .then(response => {
        if(response.ok){
            alert("music is added to selected playlists")
            displaySave(song_id);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
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


async function getAlbumName(album_id) {
    const response = await fetch('/album/?album_id=' + album_id + '&username=' + username);
    if (response.ok) {

        const data = await response.json();  
        const album = data.album[0];
        return album.name;

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displaySong(song_id) {
    console.log(username);
    const response = await fetch('/song/?music_id=' + song_id + '&username='+ username);
    if (response.ok) {
        const data = await response.json();
        const music = data.music[0];

        const coverImageContainer = document.getElementsByClassName("cover-image")[0];
        const musicInfoContainer = document.getElementsByClassName("music-info")[0];

        coverImageContainer.innerHTML = '';
        musicInfoContainer.innerHTML = '';

        let albumName = "";
        let artistName = await getArtistName(music.artist_id);
        if(!music.is_single){
            albumName = await getAlbumName(music.album_id);
        }
        const coverDiv = document.createElement('div');
        const coverImg = document.createElement('img');
        coverImg.src = music.image;
        coverImg.className = 'song-cover-img';
        coverDiv.appendChild(coverImg);
    
        coverImageContainer.appendChild(coverDiv);

        const infoDiv = document.createElement('div');
        const nameP = document.createElement('h3');
        nameP.textContent = `Name: ${music.name}`;
        const artistP = document.createElement('h3');
        artistP.textContent = `Artist: ${artistName}`;
        const albumP = document.createElement('h3');
        if(!music.is_single){
            albumP.textContent = `Album: ${albumName}`;
        }
        else
        {
            albumP.textContent = `Single song`;
        }
     
        
        infoDiv.appendChild(nameP);
        infoDiv.appendChild(artistP);
        infoDiv.appendChild(albumP);

        const audioPlayer = document.getElementById("audio-player");
        audioPlayer.src = new URL(music.audio);
    
        musicInfoContainer.appendChild(infoDiv);
    
    } else {
        console.error('Failed to load song:', response.status);
    }
}

async function displayLyrics(song_id) {
    let lyric =  document.getElementsByClassName("lyrics-div")[0];
    let player =  document.getElementById("audio-player");

    try {
        const response = await fetch(`/lyrics/?music_id=${song_id}`);
        if (!response.ok) {
            throw new Error(`No lyrics is available for this song`);
        }

        const data = await response.json();
        const music = data.music;

        if (!music || !music.lyrics) {
            throw new Error('No lyrics file found for this song.');
        }

        const lyricsFileUrl = music.lyrics;

        const lyricsResponse = await fetch(lyricsFileUrl);
        if (!lyricsResponse.ok) {
            throw new Error(`Failed to fetch lyrics file: ${lyricsResponse.status}`);
        }

        const lyricsContent = await lyricsResponse.text();
        console.log(lyricsContent);
        const parsedLyrics = parseLyric(lyricsContent);

        if (parsedLyrics.length === 0) {
            throw new Error('Lyrics parsing returned an empty array.');
        }
        else
        {
            for(let i = 0; i < parsedLyrics.length; i++)
            {
                lyric.innerHTML += `<p class= "lyrics-p" data-time=` + parsedLyrics[i].time + `>`+  parsedLyrics[i].text; + `</p>`;
            }
        }

        const lyrics = document.querySelectorAll('.lyrics-p');
        player.ontimeupdate = () => {
            const currentTime = player.currentTime;

            lyrics.forEach((line, index) => {
                const lineTime = parseFloat(line.getAttribute('data-time'));
                line.classList.remove('current', 'past', 'future');
                
                if (lineTime < currentTime) {
                line.classList.add('past');
                } else if (lineTime >= currentTime && lineTime-currentTime < 6.0) {
                line.classList.add('current');
            
                } else {
                line.classList.add('future');
                }
            });
        };

    } catch (error) {
        console.error(error.message);
        lyric.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function parseLyric(lrc) {
    const regex = /^\[(\d{2}:\d{2}\.\d{2})\](.*)$/gm;
    const lines = lrc;
    const output = [];
    let match;

    while ((match = regex.exec(lines)) !== null) {
        const time = match[1];
        const text = match[2].trim();
        const [minutes, seconds] = time.split(':');
        const [secondsInt, milliseconds] = seconds.split('.');
        const timeInSeconds = parseInt(minutes) * 60 + parseInt(secondsInt) + parseInt(milliseconds) / 100;
        output.push({
            time: timeInSeconds,
            text: text
        });
    }

    return output;
}

function syncLyric(lyrics, currentTime) {
    let index = -1;

    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            index = i;
        } else {
            break;
        }
    }

    return index;
}




function openModal(modalClass) {
    document.querySelector(modalClass).style.display = "block";
}

function closeModal(modalClass) {
    document.querySelector(modalClass).style.display = "none";
}

document.getElementsByClassName("btn-add-to-collection")[0].addEventListener("click", function(){
    closeModal(".save-music-modal");
    console.log("collection display entered");
    openModal(".save-to-collection-modal");
    displayCollections(false, song_id);
})

document.getElementsByClassName("btn-add-to-playlist")[0].addEventListener("click", function(){
    closeModal(".save-music-modal");
    openModal(".save-to-playlist-modal");
    displayPlaylists(false, song_id);
})

document.getElementsByClassName("btn-add-music-to-collection")[0].addEventListener("click", function(){
    addSongToCollection(song_id)
    closeModal(".save-to-collection-modal");
})

document.getElementsByClassName("btn-add-music-to-playlist")[0].addEventListener("click", function(){
    addSongToPlaylist(song_id)
    closeModal(".save-to-playlist-modal");
})

document.getElementsByClassName("btn-remove-from-collection")[0].addEventListener("click", function(){
    closeModal(".remove-music-modal");
    openModal(".remove-from-collection-modal");
    displayCollections(true, song_id);
})

document.getElementsByClassName("btn-remove-from-playlist")[0].addEventListener("click", function(){
    closeModal(".remove-music-modal");
    openModal(".remove-from-playlist-modal");
    displayPlaylists(true, song_id);
})

document.getElementsByClassName("btn-remove-music-from-collection")[0].addEventListener("click", function(){
    removeSongFromCollection(song_id)
    closeModal(".remove-from-collection-modal");
})

document.getElementsByClassName("btn-remove-music-from-playlist")[0].addEventListener("click", function(){
    removeSongFromPlaylist(song_id)
    closeModal(".remove-from-playlist-modal");
})

async function displayCollections(contains_music, song_id){
    console.log("display collection entered");
    if(contains_music)
    {
        const response = await fetch('/collection_contains_music/?music_id=' + song_id + '&username=' + username);
        if (response.ok) {
            const data = await response.json();
            const collections = data.collections;
            createCollections(contains_music, collections);
        } else {
            console.error('Failed to load collections:', response.status);
        }
    
    }
    else
    {
        const response = await fetch('/collection_not_contains_music/?music_id=' + song_id + '&username=' + username);
        if (response.ok) {
            const data = await response.json();
            const collections = data.collections;
            createCollections(contains_music, collections);
        } else {
            console.error('Failed to load collections:', response.status);
        }
    
    }
}

async function createCollections(contains_music, collections){
    console.log("create collections entered");
    console.log(collections);
    let collectionContainer;
    if(contains_music)
    {
        collectionContainer = document.getElementsByClassName("saved-collections-list")[0];
        collectionContainer.innerHTML = ''; 
    }
    else
    {
        collectionContainer = document.getElementsByClassName("collections-list")[0];
        collectionContainer.innerHTML = ''; 
    }
  

    for (const collection of collections) {
        console.log(collection);

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

        const infoDiv = document.createElement("div");
        infoDiv.className = "collection-info-div";

        const collectionName = document.createElement('h4');
        collectionName.textContent = collection.name;

        infoDiv.appendChild(collectionName);

        collectionDiv.appendChild(imgDiv);
        collectionDiv.appendChild(infoDiv);

        collectionContainer.appendChild(collectionDiv);
        console.log(collectionContainer);
    }
}   

async function displayPlaylists(contains_music, song_id) {
    if(contains_music)
    {
        const response = await fetch('/playlist_contains_music/?music_id=' + song_id + '&username=' + username);
        if (response.ok) {
            const data = await response.json();
            const playlists = data.playlists;
            createPlaylists(contains_music, playlists);      
        } else {
            console.error('Failed to load albums:', response.status);
        }
    }
    else
    {
        const response = await fetch('/playlist_not_contains_music/?music_id=' + song_id + '&username=' + username);
        if (response.ok) {
            const data = await response.json();
            const playlists = data.playlists;
            createPlaylists(contains_music, playlists);       
        } else {
            console.error('Failed to load albums:', response.status);
        }
    }
}

async function createPlaylists(contains_music, playlists){
    let playlistContainer;
    if(contains_music)
    {
        playlistContainer = document.getElementsByClassName("saved-playlists-list")[0];
        playlistContainer.innerHTML = ''; 
    }
    else
    {
        playlistContainer = document.getElementsByClassName("playlists-list")[0];
        playlistContainer.innerHTML = ''; 
    }
  
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
}


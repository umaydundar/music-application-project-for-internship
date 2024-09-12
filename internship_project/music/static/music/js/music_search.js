let username = "";
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    username = params.get("username");
    is_creator = params.get("is_creator");

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
    displaySearchSuggestions(username);
});


async function displayGenre(genre_id) {
    window.location.href = `/music_genre/?action=get_genre_by_param&genre_id=${genre_id}` + '&username=' + username + `&is_creator=${is_creator}`;
}

document.getElementById("music-search-button").addEventListener("click", function () {
    displaySearchResults();
});

document.getElementById("search-selection").addEventListener("change", function () {
    displaySearchSuggestions(username);
});

async function displaySearchSuggestions(username){
    let filterValue = document.getElementById('search-selection').value.toLowerCase();
    
    if(filterValue === "artist"){
        document.getElementsByClassName("genre-search-content")[0].style.display = "none";
        document.getElementsByClassName("artist-search-content")[0].style.display = "block";
        document.getElementsByClassName("album-search-content")[0].style.display = "none";
        document.getElementsByClassName("music-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
        displaySuggestionsArtist(username);
    }
    else if(filterValue === "album"){
        document.getElementsByClassName("genre-search-content")[0].style.display = "none";
        document.getElementsByClassName("artist-search-content")[0].style.display = "none";
        document.getElementsByClassName("album-search-content")[0].style.display = "flex";
        document.getElementsByClassName("music-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
        displaySuggestionsAlbum(username);
    }
    else if(filterValue === "music"){
        document.getElementsByClassName("genre-search-content")[0].style.display = "none";
        document.getElementsByClassName("artist-search-content")[0].style.display = "none";
        document.getElementsByClassName("album-search-content")[0].style.display = "none";
        document.getElementsByClassName("music-search-content")[0].style.display = "flex";
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
        displaySuggestionsMusic(username);
    }
    else{
        document.getElementsByClassName("genre-search-content")[0].style.display = "flex";
        document.getElementsByClassName("artist-search-content")[0].style.display = "none";
        document.getElementsByClassName("album-search-content")[0].style.display = "none";
        document.getElementsByClassName("music-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
        displaySuggestionsGenre();
    }

}

async function displaySuggestionsGenre(){

    const colors = [
        "var(--primary-color)",
        "var(--secondary-color)",
        "var(--ternary-color)",
        "var(--completed-color)",
        "var(--accent-color)",
        "var(--soft-green)",
        "var(--soft-pink)",
        "var(--soft-lavender)",
        "var(--soft-peach)",
    ];

    
    const response = await fetch('/genre_suggestions/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const genres = data.genres;

        const genreContainer = document.getElementsByClassName("genre-containers")[0];
        genreContainer.innerHTML = "";
    
        genres.forEach((genre) => {

            genreContainer.innerHTML += ` 
            <div class = "genre-container" id =${genre.id} onclick="displayGenre(${genre.id})">
                <p>${genre.name}</p>
            </div>`

        });

        const genreContainers = document.querySelectorAll('.genre-container');
        genreContainers.forEach((container, index) => {
            container.style.backgroundColor = colors[index % colors.length];
        });

    } else {
        console.error('Failed to load artists:', response.status);
    }
} 

async function displaySearchResults() {
    let searchString = document.getElementsByClassName("search-bar")[0].value;
    let filterValue = document.getElementById('search-selection').value.toLowerCase();
    if(filterValue === "artist"){
        displaySearchResultsArtist(searchString);
    }
    else if(filterValue === "album"){
        displaySearchResultsAlbum(searchString);
    }
    else if(filterValue === "music"){
        displaySearchResultsMusic(searchString);
    }
    else{
        displaySearchResultsGenre(searchString);
    }
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


async function displaySuggestionsArtist(username) {
    document.getElementsByClassName("artist-search-suggestions")[0].style.display = "grid";
    document.getElementsByClassName("artist-search-gallery")[0].style.display = "none";

    const response = await fetch('/artist_suggestions/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        console.log(artists);

        const artistContainer = document.getElementsByClassName("artist-search-suggestions")[0];
        artistContainer.innerHTML = ''; 

        artists.slice(0,20).forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'artist';
            imgDiv.onclick = () => ArtistClicked(artist.id);

            const artistImg = document.createElement('img');
            artistImg.className = 'artist-img';
            artistImg.src = artist.image;
            imgDiv.appendChild(artistImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const nameDiv = document.createElement('div');
            const artistName = document.createElement('h4');
            artistName.textContent = artist.username;
            nameDiv.appendChild(artistName);

            artistDiv.appendChild(imgDiv);
            artistDiv.appendChild(nameDiv);

            artistContainer.appendChild(artistDiv);
        });
    } else {
        console.error('Failed to load artists:', response.status);
    }
}

async function displaySuggestionsAlbum(username) {
    document.getElementsByClassName("album-search-suggestions")[0].style.display = "grid";
    document.getElementsByClassName("album-search-gallery")[0].style.display = "none";

    const response = await fetch('/album_suggestions/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("album-search-suggestions")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0,20)) {
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

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displaySuggestionsMusic(username) {
    document.getElementsByClassName("music-search-suggestions")[0].style.display = "grid";
    document.getElementsByClassName("music-search-gallery")[0].style.display = "none";

    const response = await fetch('/music_suggestions/?username=' + username);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-search-suggestions")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics.slice(0,20)) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

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

async function displaySearchResultsArtist(searchString) {
    document.getElementsByClassName("artist-search-suggestions")[0].style.display = "none";
    document.getElementsByClassName("artist-search-gallery")[0].style.display = "grid";
    let found = false;
    const response = await fetch('/search_artist/?search_string='+ searchString + "&username="+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        if(artists.length > 0) {
            found = true;
        }

        console.log(found);
        console.log(artists);

        const artistContainer = document.getElementsByClassName("artist-search-gallery")[0];
        artistContainer.innerHTML = ''; 

        artists.forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'artist';
            imgDiv.onclick = () => ArtistClicked(artist.id);

            const artistImg = document.createElement('img');
            artistImg.className = 'artist-img';
            artistImg.src = artist.image;
            imgDiv.appendChild(artistImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const nameDiv = document.createElement('div');
            const artistName = document.createElement('h4');
            artistName.textContent = artist.username;
            nameDiv.appendChild(artistName);

            artistDiv.appendChild(imgDiv);
            artistDiv.appendChild(nameDiv);

            artistContainer.appendChild(artistDiv);
        });
    
    } else {
        console.error('Failed to load artists:', response.status);
    }

    if(!found){
        document.getElementsByClassName("artist-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function displaySearchResultsAlbum(searchString) {
    document.getElementsByClassName("album-search-suggestions")[0].style.display = "none";
    document.getElementsByClassName("album-search-gallery")[0].style.display = "grid";
    let found = false;
    const response = await fetch('/search_album/?search_string='+ searchString + "&username="+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        if(albums.length > 0) {
            found = true;
        }

        console.log(found);

        const albumContainer = document.getElementsByClassName("album-search-gallery")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums) {
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
    
    } else {
        console.error('Failed to load albums:', response.status);
    }

    if(!found){
        document.getElementsByClassName("album-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function displaySearchResultsMusic(searchString) {
    document.getElementsByClassName("music-search-suggestions")[0].style.display = "none";
    document.getElementsByClassName("music-search-gallery")[0].style.display = "grid";

    let found = false;
    const response = await fetch('/search_music/?search_string=' + searchString + "&username="+ username);
    if (response.ok) {
        
        const data = await response.json();
        const musics = data.musics;

        if(musics.length > 0) {
            found = true;
        }

        console.log(found);

        const recommendedContainer = document.getElementsByClassName("music-search-gallery")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'music-div';

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

    if(!found){
        document.getElementsByClassName("music-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function displaySearchResultsGenre(searchString) {
    let found = false;
    let searchOptions = document.querySelectorAll('.genre-container');
    searchOptions.forEach(option => {
        const genreName = option.querySelector('p').textContent.toLowerCase();

        if (genreName.includes(searchString) || genreName.includes(searchString.toLowerCase())) 
        {
            option.style.display = 'flex';
            found = true;
        } else {
            option.style.display = 'none';
        }
    });

    if(!found){
        document.getElementsByClassName("genre-search-content")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function ArtistClicked(artist_id){
    window.location.href = "/artist_profile/?action=get_artist_by_param&artist_id="+ artist_id + "&username="+ username + `&is_creator=${is_creator}`;
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + "&username="+ username + `&is_creator=${is_creator}`;
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id + "&username="+ username + `&is_creator=${is_creator}`;
}


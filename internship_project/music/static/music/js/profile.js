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

let username = "";
let info = "";
let image = "";
let is_creator = "false";
let cloudinary;
document.addEventListener('DOMContentLoaded', function () { 

    cloudinary = window.cloudinary.Cloudinary.new({
        cloud_name: 'dzbuee4ii'
    });

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

    displayBasicProfileInfo(username);
    displayFavoriteArtists(username);
    displayFavoriteAlbums(username);
    displayFavoriteSongs(username);
    displayTopArtists(username);
    displayRecentlyPlayed(username);
});

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


async function displayBasicProfileInfo(username) {
    const response = await fetch('/user_profile/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const user = data.user[0];
        const defaultUserImage = 'https://i.imghippo.com/files/mvSMn1724926449.jpg';

        let userImageContainer = document.getElementsByClassName("profile-image-container")[0];
        userImageContainer.innerHTML = "";
        let userInfoContainer = document.getElementsByClassName("profile-info")[0];
        userInfoContainer.innerHTML = "";

        info = user.info;
        image = user.image;

        let userImageDiv = document.createElement("div");
        userImageDiv.className = "user-profile-image";

        let userImg = document.createElement("img");
        userImg.src = user.image || defaultUserImage;
        userImg.className = "user-profile-img";

        userImageDiv.appendChild(userImg);
        userImageContainer.appendChild(userImageDiv);

        let usernameDiv = document.createElement("div");
        usernameDiv.className = "username";

        let usernameP = document.createElement("p");
        usernameP.textContent = `Username: ${user.username}`;

        usernameDiv.appendChild(usernameP);

        let userInfoP = document.createElement("p");
        if(user.info)
        {
            userInfoP.textContent = `User Info: ${user.info}`;
        }
        else
        {
            userInfoP.textContent = `User Info: Write a little bit about yourself`;
        }

        userInfoContainer.appendChild(usernameDiv);
        userInfoContainer.appendChild(userInfoP);

    } else {
        console.error('Failed to load profile info:', response.status);
    }
}


async function displayFavoriteArtists(username) {
    const response = await fetch('/fav_artists/?&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        let artistContainer = document.getElementsByClassName("artists-div")[0];
        artistContainer.innerHTML = "";

        artists.slice(0, 7).forEach((artist) => {
            
            const artistDiv = document.createElement('div');
            artistDiv.className = 'top-artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'top-artist';
            imgDiv.onclick = () => ArtistClicked(artist.id);

            const artistImg = document.createElement('img');
            artistImg.src = artist.image;
            artistImg.alt = 'Artist Image';
            artistImg.className = 'top-artists-img';
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

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_fav_artists' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        artistContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load favorite artists:', response.status);
    }
}

async function displayFavoriteAlbums(username) {
    const response = await fetch('/fav_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("favourite-albums-div")[0]; 
        albumContainer.innerHTML = "";

        for (const album of albums.slice(0, 7)) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumClicked(album.id);

            const albumImg = document.createElement('img');
            albumImg.src = album.image;
            albumImg.alt = 'Album Image';
            albumImg.className = 'album-img';
            imgDiv.appendChild(albumImg);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

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
        showAllLink.href = '/display/?action=get_all_fav_albums' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        albumContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load favorite albums:', response.status);
    }
}

async function displayFavoriteSongs(username) {
    const response = await fetch('/fav_musics/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let musicsContainer = document.getElementsByClassName("favourite-songs-div")[0];
        musicsContainer.innerHTML = "";

        for (const music of musics.slice(0, 7)) {
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-played-before-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music-played';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.alt = 'Music Image';
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicClicked(music.id);
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

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_fav_songs' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        musicsContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load favorite songs :', response.status);
    }
}

async function displayTopArtists(username) {
    const response = await fetch('/top_artists/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        let artistContainer = document.getElementsByClassName("top-artists-div")[0];
        artistContainer.innerHTML = "";

        artists.slice(0, 7).forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'top-artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'top-artist';
            imgDiv.onclick = () => ArtistClicked(artist.id);

            const artistImg = document.createElement('img');
            artistImg.src = artist.image;
            artistImg.alt = 'Artist Image';
            artistImg.className = 'top-artists-img';
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

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_top_artists' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        artistContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load top artists:', response.status);
    }
}

async function displayRecentlyPlayed(username) {
    const response = await fetch('/recently_played/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let recentlyPlayedContainer = document.getElementsByClassName("recently-played-div")[0];
        recentlyPlayedContainer.innerHTML = "";
        for (const music of musics.slice(0, 7)) {
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-played-before-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music-played';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.alt = 'Music Image';
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicClicked(music.id);
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

            recentlyPlayedContainer.appendChild(musicDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_recently_played' + '&username=' + username + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        recentlyPlayedContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load recently played music:', response.status);
    }
}

function openModal(modalClass) {
    document.querySelector(modalClass).style.display = "block";
}

function closeModal(modalClass) {
    document.querySelector(modalClass).style.display = "none";
}

// Manage Artists Modal
document.getElementById("manage-artists-btn").addEventListener("click", function(){
    openModal(".manage-artists-modal");
});

document.getElementsByClassName("btn-add-artist")[0].addEventListener("click", function(){
    closeModal(".manage-artists-modal");
    openModal(".add-artists-modal");
});

document.getElementsByClassName("btn-remove-artist")[0].addEventListener("click", function(){
    closeModal(".manage-artists-modal");
    openModal(".delete-artists-modal");
    suggestArtistsDelete();
});

document.getElementsByClassName("btn-search-artist")[0].addEventListener("click", function(){
    closeModal(".add-artists-modal");
    openModal(".search-artists-modal");
    document.getElementById("artist-not-found").style.display = "none";
    document.getElementById("artist-search").style.display = "flex";
    document.getElementsByClassName("search-results-artist")[0].style.display = "none";
})

document.getElementsByClassName("btn-suggest-artist")[0].addEventListener("click", function(){
    closeModal(".add-artists-modal");
    openModal(".look-artist-suggestions-modal");
    suggestArtist();
})

document.getElementsByClassName("btn-search-add-artist")[0].addEventListener("click", function(){
    closeModal(".search-artists-modal");
});

document.getElementsByClassName("btn-suggest-add-artist")[0].addEventListener("click", function(){
    closeModal(".look-artist-suggestions-modal");
})

document.getElementsByClassName("btn-remove-selected-artist")[0].addEventListener("click", function(){
    removeFavArtist();
    closeModal(".delete-artists-modal");
})

document.getElementsByClassName("btn-search-all-artists")[0].addEventListener("click", function(){
    searchString = document.getElementById("search-artist").value;
    document.getElementById("artist-search").style.display = "none";
    document.getElementById("artist-not-found").style.display = "none";
    displayArtistSearchResults(searchString);
    document.getElementsByClassName("search-results-artist")[0].style.display = "flex";
})

// Manage Albums Modal
document.getElementById("manage-albums-btn").addEventListener("click", function(){
    openModal(".manage-albums-modal");
});

document.getElementsByClassName("btn-add-album")[0].addEventListener("click", function(){
    closeModal(".manage-albums-modal");
    openModal(".add-albums-modal");
});

document.getElementsByClassName("btn-remove-album")[0].addEventListener("click", function(){
    closeModal(".manage-albums-modal");
    openModal(".delete-albums-modal");
    suggestAlbumsDelete();
});

document.getElementsByClassName("btn-search-album")[0].addEventListener("click", function(){
    closeModal(".add-albums-modal");
    openModal(".search-albums-modal");
    document.getElementById("album-not-found").style.display = "none";
    document.getElementById("album-search").style.display = "flex";
    document.getElementsByClassName("search-results-album")[0].style.display = "none";
})

document.getElementsByClassName("btn-suggest-album")[0].addEventListener("click", function(){
    closeModal(".add-albums-modal");
    openModal(".look-album-suggestions-modal");
    suggestAlbum();
})

document.getElementsByClassName("btn-search-add-album")[0].addEventListener("click", function(){
    closeModal(".search-albums-modal");
});

document.getElementsByClassName("btn-suggest-add-album")[0].addEventListener("click", function(){
    closeModal(".look-album-suggestions-modal");
})

document.getElementsByClassName("btn-remove-selected-album")[0].addEventListener("click", function(){
    removeFavAlbum();
    closeModal(".delete-albums-modal");
})

document.getElementsByClassName("btn-search-all-albums")[0].addEventListener("click", function(){
    searchString = document.getElementById("search-album").value;
    document.getElementById("album-search").style.display = "none";
    document.getElementById("album-not-found").style.display = "none";
    displayAlbumSearchResults(searchString);
    document.getElementsByClassName("search-results-album")[0].style.display = "flex";
})

// Manage Musics Modal
document.getElementById("manage-musics-btn").addEventListener("click", function(){
    openModal(".manage-musics-modal");
});

document.getElementsByClassName("btn-add-music")[0].addEventListener("click", function(){
    closeModal(".manage-musics-modal");
    openModal(".add-musics-modal");
});

document.getElementsByClassName("btn-remove-music")[0].addEventListener("click", function(){
    closeModal(".manage-musics-modal");
    openModal(".delete-musics-modal");
    suggestMusicsDelete();
});

document.getElementsByClassName("btn-search-music")[0].addEventListener("click", function(){
    closeModal(".add-musics-modal");
    openModal(".search-musics-modal");
    document.getElementById("music-not-found").style.display = "none";
    document.getElementById("music-search").style.display = "flex";
    document.getElementsByClassName("search-results-music")[0].style.display = "none";
})

document.getElementsByClassName("btn-suggest-music")[0].addEventListener("click", function(){
    closeModal(".add-musics-modal");
    openModal(".look-music-suggestions-modal");
    suggestMusic();
})

document.getElementsByClassName("btn-search-add-music")[0].addEventListener("click", function(){
    closeModal(".search-musics-modal");
});

document.getElementsByClassName("btn-suggest-add-music")[0].addEventListener("click", function(){
    closeModal(".look-music-suggestions-modal");
})

document.getElementsByClassName("btn-remove-selected-music")[0].addEventListener("click", function(){
    removeFavMusic();
    closeModal(".delete-musics-modal");
})

document.getElementsByClassName("btn-search-all-musics")[0].addEventListener("click", function(){
    searchString = document.getElementById("search-music").value;
    document.getElementById("music-search").style.display = "none";
    document.getElementById("music-not-found").style.display = "none";
    displayMusicSearchResults(searchString);
    document.getElementsByClassName("search-results-music")[0].style.display = "flex";
})

let selectedAlbums = [];
let selectedArtists = [];
let selectedMusics = [];

window.addEventListener("click", function(event) {
    let modals = document.querySelectorAll(".modal");
    modals.forEach(function(modal) {
        if (event.target == modal) {
            modal.style.display = "none";
            while (selectedArtists.length > 0) {
                selectedArtists.pop();
            }
            while (selectedAlbums.length > 0) {
                selectedAlbums.pop();
            }
            while (selectedMusics.length > 0) {
                selectedMusics.pop();
            }
        }
    });
});

async function ArtistSelected(artistId, artistDiv) {
    const index = selectedArtists.indexOf(artistId);
    if (index === -1) {
        selectedArtists.push(artistId);
        artistDiv.classList.add('selected');
    } else {
        selectedArtists.splice(index, 1);
        artistDiv.classList.remove('selected');
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

async function suggestArtist(){
    const response = await fetch('/artist_suggestions/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        const artistContainer = document.getElementsByClassName("artist-suggestions")[0];
        artistContainer.innerHTML = ''; 

        artists.slice(0, 6).forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'artist';
            imgDiv.onclick = () => ArtistSelected(artist.id, artistDiv);

            const artistImg = document.createElement('img');
            artistImg.className = 'artist-img';
            artistImg.src = artist.image;
            imgDiv.appendChild(artistImg);

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

async function suggestAlbum(){
    const response = await fetch('/album_suggestions/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("album-suggestions")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 6)) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumSelected(album.id, albumDiv);

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

async function suggestMusic(){
    const response = await fetch('/music_suggestions/?username=' + username);
    if (response.ok) {

        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-suggestions")[0];
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

async function displayArtistSearchResults(searchString){
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

        const artistContainer = document.getElementsByClassName("search-results-artist")[0];
        artistContainer.innerHTML = ''; 

        artists.slice(0, 6).forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'artist';
            imgDiv.onclick = () => ArtistSelected(artist.id, artistDiv);

            const artistImg = document.createElement('img');
            artistImg.className = 'artist-img';
            artistImg.src = artist.image;
            imgDiv.appendChild(artistImg);

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
        document.getElementsByClassName("search-results-artist")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function displayAlbumSearchResults(searchString){
    let found = false;
    const response = await fetch('/search_album/?search_string='+ searchString + "&username="+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        if(albums.length > 0) {
            found = true;
        }

        console.log(found);

        const albumContainer = document.getElementsByClassName("search-results-album")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 6)) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumSelected(album.id, albumDiv);

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
        document.getElementsByClassName("search-results-album")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[1].style.display = "flex";
    }
}

async function displayMusicSearchResults(searchString){
    let found = false;
    const response = await fetch('/search_music/?search_string=' + searchString + "&username="+ username);
    if (response.ok) {
        
        const data = await response.json();
        const musics = data.musics;

        if(musics.length > 0) {
            found = true;
        }

        console.log(found);

        const recommendedContainer = document.getElementsByClassName("search-results-music")[0];
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
        console.error('Failed to load artists:', response.status);
    }

    if(!found){
        document.getElementsByClassName("search-results-music")[0].style.display = "none";
        document.getElementsByClassName("not-found-content")[2].style.display = "flex";
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

document.getElementsByClassName("btn-suggest-add-artist")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavArtist();
    closeModal(".look-artist-suggestions-modal");
});

document.getElementsByClassName("btn-search-add-artist")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavArtist();
    closeModal(".search-artists-modal");
});

async function addFavArtist(){
    const csrftoken = getCookie('csrftoken');

    if (selectedArtists.length === 0) {
        alert("Please select at least one artist.");
        return;
    }

    const data = {
        username: username,
        artists: selectedArtists,
    };

    const response = await fetch("/add_fav_artist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        while (selectedArtists.length > 0) {
            selectedArtists.pop();
        }
        alert("selected artists are added to the favorites");
        displayFavoriteArtists(username);
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

document.getElementsByClassName("btn-suggest-add-album")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavAlbum();
    closeModal(".look-album-suggestions-modal");
});

document.getElementsByClassName("btn-search-add-album")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavAlbum();
    closeModal(".search-albums-modal");
});

async function addFavAlbum(){

    const csrftoken = getCookie('csrftoken');

    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    const data = {
        username: username,
        albums: selectedAlbums,
    };

    const response = await fetch("/add_fav_album/", {
        method: 'POST',
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
        alert("selected albums are added to favorites")
        displayFavoriteAlbums(username);
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

document.getElementsByClassName("btn-suggest-add-music")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavMusic(true);
    closeModal(".look-music-suggestions-modal");
});

document.getElementsByClassName("btn-search-add-music")[0].addEventListener('click', async function(event) {
    event.preventDefault();
    addFavMusic(false);
    closeModal(".search-musics-modal");
});

async function addFavMusic(){

    const csrftoken = getCookie('csrftoken');
    
    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    const data = {
        username: username,
        musics: selectedMusics,
    };

    const response = await fetch("/add_fav_song/", {
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
        alert("selected musics are added to the favorites")   
        displayFavoriteSongs(username);         
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeFavArtist(){
    const csrftoken = getCookie('csrftoken');

    if (selectedArtists.length === 0) {
        alert("Please select at least one artist.");
        return;
    }

    const data = {
        username: username,
        artists: selectedArtists,
    };

    const response = await fetch("/remove_fav_artist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        while (selectedArtists.length > 0) {
            selectedArtists.pop();
        }
        alert("selected artists are removed")
        displayFavoriteArtists(username);
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeFavAlbum(){
    const csrftoken = getCookie('csrftoken');

    if (selectedAlbums.length === 0) {
        alert("Please select at least one album.");
        return;
    }

    const data = {
        username: username,
        albums: selectedAlbums,
    };

    const response = await fetch("/remove_fav_album/", {
        method: 'POST',
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
        alert("selected albums are removed")
        displayFavoriteAlbums(username);
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function removeFavMusic(){
    const csrftoken = getCookie('csrftoken');

    if (selectedMusics.length === 0) {
        alert("Please select at least one music.");
        return;
    }

    const data = {
        username: username,
        musics: selectedMusics,
    };

    const response = await fetch("/remove_fav_song/", {
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
        alert("selected musics are removed")
        displayFavoriteSongs(username);
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function suggestArtistsDelete(){
    const response = await fetch('/fav_artists/?&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        let artistContainer = document.getElementsByClassName("artists-to-remove")[0];
        artistContainer.innerHTML = "";

        artists.forEach((artist) => {
            
            const artistDiv = document.createElement('div');
            artistDiv.className = 'top-artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'top-artist';
            imgDiv.onclick = () => ArtistSelected(artist.id, artistDiv);

            const artistImg = document.createElement('img');
            artistImg.src = artist.image;
            artistImg.alt = 'Artist Image';
            artistImg.className = 'top-artists-img';
            imgDiv.appendChild(artistImg);


            const nameDiv = document.createElement('div');
            const artistName = document.createElement('h4');
            artistName.textContent = artist.username;
            nameDiv.appendChild(artistName);

            artistDiv.appendChild(imgDiv);
            artistDiv.appendChild(nameDiv);

            artistContainer.appendChild(artistDiv);

        });

    } else {
        console.error('Failed to load favorite artists:', response.status);
    }
}

async function suggestAlbumsDelete(){
    const response = await fetch('/fav_albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("albums-to-remove")[0]; 
        albumContainer.innerHTML = "";
        for (const album of albums) {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'album';
            imgDiv.onclick = () => AlbumSelected(album.id, albumDiv);

            const albumImg = document.createElement('img');
            albumImg.src = album.image;
            albumImg.alt = 'Album Image';
            albumImg.className = 'album-img';
            imgDiv.appendChild(albumImg);

    
            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-info-div';

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
        console.error('Failed to load favorite albums:', response.status);
    }
}

async function suggestMusicsDelete() {
    const response = await fetch('/fav_musics/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let musicsContainer = document.getElementsByClassName("musics-to-remove")[0];
        musicsContainer.innerHTML = "";
        for (const music of musics) {
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-played-before-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music-played';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.alt = 'Music Image';
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicSelected(music.id, musicImg);
            imgDiv.appendChild(musicImg);

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
        console.error('Failed to load favorite songs :', response.status);
    }
}

document.getElementsByClassName("edit-profile-btn")[0].addEventListener('click', function(event) {
    event.preventDefault();
    openModal(".edit-profile-modal");
});

document.getElementsByClassName("apply-changes-btn")[0].addEventListener('click', function(event) {
    event.preventDefault();
    closeModal(".edit-profile-modal");
    editProfile();
});

async function editProfile() {
    const csrftoken = getCookie('csrftoken');
    let userInfoNotChanged = document.getElementsByClassName("checkbox-not-changed")[0].checked;
    let userImageNotChanged = document.getElementsByClassName("checkbox-not-changed")[1].checked;

    let newUserInfo;
    let userImage = document.getElementById("new-profile-image").files[0];

    let newUserImage;

    if(userInfoNotChanged)
    {
        newUserInfo = info;
    }
    else
    {
        newUserInfo = document.getElementById("new-user-info").value;
    }


    let img_url;
    if(!userImageNotChanged)
    {
        const imageData = new FormData();
        imageData.append("file", userImage);
        imageData.append("upload_preset", "xpmwd1yk");

        const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/dzbuee4ii/image/upload', {
            method: 'POST',
            body: imageData,
        });
        const imageUploadResult = await imageUploadResponse.json();

        if (!imageUploadResponse.ok) {
            throw new Error(imageUploadResult.error.message);
        }

        img_url = imageUploadResult.secure_url;
        newUserImage =img_url;
    }
    else
    {
        newUserImage = image;
    }

    try {
        const data = {
            username: username,
            new_image: newUserImage,
            new_info: newUserInfo,
        };
    
        const response = await fetch("/edit_profile/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("profile edited");
            displayBasicProfileInfo(username);
        } else {
            const error = await response.json();
            alert(`Error editing profile: ${error.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the new profile image.');
    }
}

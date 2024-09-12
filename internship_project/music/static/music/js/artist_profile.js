function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let username = "";
let artistNameGlobal = "";
let artist_id = "";
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    artist_id = params.get("artist_id");
    is_creator = params.get("is_creator");

    username = params.get("username");

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
                linkElement.href += `&is_creator=${is_creator}`;
            }
        });        

    }
    
    displayArtist(artist_id);
    displayAllAlbums(artist_id);
    displayAllSongs(artist_id);
    displayLike(artist_id);
    
    if(is_creator == "true"){
        document.getElementsByClassName("nav-create-item")[0].style.display = "flex";
    }
    else
    {
        document.getElementsByClassName("nav-create-item")[0].style.display = "none";
    }
});

document.getElementsByClassName("fav-artist-div")[0].addEventListener("click", function (event) {
    event.preventDefault();
    if(document.getElementsByClassName("liked")[0].style.display == "flex")
    {
        document.getElementsByClassName("liked")[0].style.display = "none";
        document.getElementsByClassName("not-liked")[0].style.display = "flex";
        removeLikedArtist(artist_id);
    }
    else
    {
        document.getElementsByClassName("not-liked")[0].style.display = "none";
        document.getElementsByClassName("liked")[0].style.display = "flex";
        addLikedArtist(artist_id);
    }
})

async function displayLike(artist_id){
    const response = await fetch('/is_fav_artist/?artist_id=' + artist_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const artist = data.artist;
        if(artist != null && artist.length > 0)
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
        console.error('Failed to load artist:', response.status);
    }
}

async function removeLikedArtist(artist_id){
    const csrftoken = getCookie('csrftoken');

    const data = {
        username: username,
        artists: [artist_id],
    };

    fetch("/remove_fav_artist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected artist is removed from liked artists")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addLikedArtist(artist_id){
    const csrftoken = getCookie('csrftoken');

    const data = {
        username: username,
        artists: [artist_id],
    };

    fetch("/add_fav_artist/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected artist is added to liked artists")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    })

}

async function displayArtist(artist_id){
    const response = await fetch('/artist/?artist_id=' + artist_id + '&username=' + username);
    if (response.ok) {

        const data = await response.json();  
        const artist = data.artist[0];

        artistNameGlobal = artist.username;
        const artistImageContainer = document.getElementsByClassName("artist-image")[0];
        const artistInfoContainer = document.getElementsByClassName("artist-info")[0];

        const artistImgDiv = document.createElement('div');
        artistImgDiv.classList.add("artist-img-div");
        const artistImg = document.createElement('img');
        artistImg.classList.add("artist-img");
        artistImg.src = artist.image;
        artistImgDiv.appendChild(artistImg);
        
        const artistNameDiv = document.createElement('div');
        artistNameDiv.classList.add("artist-name");
        const artistNameP = document.createElement('h2');
        artistNameP.textContent = artist.username;
        artistNameDiv.appendChild(artistNameP);

        const artistInfoDiv = document.createElement('div');
        artistInfoDiv.classList.add("artist-info-div");
        const artistInfoP = document.createElement('h3');
        artistInfoP.textContent = artist.info;
        artistInfoDiv.appendChild(artistInfoP);

        artistImageContainer.appendChild(artistImgDiv);
        artistInfoContainer.appendChild(artistNameDiv);
        artistInfoContainer.appendChild(artistInfoDiv);

    } else {
        console.error('Failed to load artists:', response.status);
    }
}


async function displayAllAlbums(artist_id) {
    const response = await fetch('/artist_albums/?artist_id=' + artist_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        console.log(albums);

        const albumsContainer = document.getElementsByClassName("albums-div")[0];

        for (const album of albums.slice(0, 7)){
           const albumDiv = document.createElement('div');
            albumDiv.className = 'artist-album-div';

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
            artistName.textContent = artistNameGlobal;

            infoDiv.appendChild(albumName);
            infoDiv.appendChild(artistName);

            albumDiv.appendChild(imgDiv);
            albumDiv.appendChild(infoDiv);

            albumsContainer.appendChild(albumDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_artist_albums' + '&artist_id= '+ artist_id + '&username=' + username  + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        albumsContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayAllSongs(artist_id) {
    const response = await fetch('/artist_musics/?artist_id=' + artist_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        console.log("", musics);

        const musicsContainer = document.getElementsByClassName("songs-div")[0];

        for (const music of musics.slice(0, 7)) {
            const musicDiv = document.createElement('div');
            musicDiv.className = 'artist-song-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music';

            const musicImg = document.createElement('img');
            musicImg.src = music.image;
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
            artistName.textContent = artistNameGlobal;

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(infoDiv);

            musicsContainer.appendChild(musicDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_artist_songs' + '&artist_id= '+ artist_id + '&username=' + username +  `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        musicsContainer.appendChild(showAllLink);

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + '&username=' + username + `&is_creator=${is_creator}`;
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id + '&username=' + username + `&is_creator=${is_creator}`;
}

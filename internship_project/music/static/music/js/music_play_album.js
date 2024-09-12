let songCount = 0;
let initialSongId = 0;
let username = "";
let album_id = "";


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

let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    album_id = params.get("album_id");

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

    displayAlbum(album_id);
    displaySongList(album_id);
    displayLike(album_id);
    displaySave(album_id);
});


document.getElementsByClassName("fav-album-div")[0].addEventListener("click", function (event) {
    event.preventDefault();
    if(document.getElementsByClassName("liked")[0].style.display == "flex")
    {
        document.getElementsByClassName("liked")[0].style.display = "none";
        document.getElementsByClassName("not-liked")[0].style.display = "flex";
        removeLikedAlbum(album_id);
    }
    else
    {
        document.getElementsByClassName("not-liked")[0].style.display = "none";
        document.getElementsByClassName("liked")[0].style.display = "flex";
        addLikedAlbum(album_id);
    }
})

async function displayLike(album_id){
    const response = await fetch('/is_fav_album/?album_id=' + album_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const album = data.album;
        if(album != null && album.length > 0)
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
        console.error('Failed to load album:', response.status);
    }
}

async function removeLikedAlbum(album_id){
    const csrftoken = getCookie('csrftoken');

    const data = {
        username: username,
        albums: [album_id],
    };

    fetch("/remove_fav_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected album is removed from liked albums")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addLikedAlbum(album_id){
    const csrftoken = getCookie('csrftoken');
    const data = {
        username: username,
        albums: [album_id],
    };

    fetch("/add_fav_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected album is added to liked albums")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

document.getElementsByClassName("save-album-div")[0].addEventListener("click", function (event) {
    event.preventDefault();
    if(document.getElementsByClassName("saved")[0].style.display == "flex")
    {
        document.getElementsByClassName("saved")[0].style.display = "none";
        document.getElementsByClassName("not-saved")[0].style.display = "flex";
        removeSavedAlbum(album_id);
    }
    else
    {
        document.getElementsByClassName("not-saved")[0].style.display = "none";
        document.getElementsByClassName("saved")[0].style.display = "flex";
        addSavedAlbum(album_id);
    }
})

async function displaySave(album_id){
    const response = await fetch('/is_saved_album/?album_id=' + album_id + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const album = data.album;
        if(album != null && album.length > 0)
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

async function removeSavedAlbum(album_id){
    const csrftoken = getCookie('csrftoken');

    const data = {
        username: username,
        albums: [album_id],
    };

    fetch("/remove_saved_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected album is removed from saved albums")
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

async function addSavedAlbum(album_id){
    const csrftoken = getCookie('csrftoken');

    const data = {
        username: username,
        albums: [album_id],
    };

    fetch("/add_saved_album/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok){
            alert("selected album is added to saved albums")
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

async function displayAlbum(album_id) {
    const response = await fetch(`/album/?album_id=${album_id}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.album;

        console.log(albums);

        const albumImageContainer = document.getElementsByClassName("cover-image")[0];
        const albumInfoContainer = document.getElementsByClassName("album-info")[0];

        albumImageContainer.innerHTML = '';
        albumInfoContainer.innerHTML = '';

        for (const album of albums) {
            const albumImgDiv = document.createElement('div');
            albumImgDiv.className = 'album-img-div';
            albumImgDiv.id = 'music';

            const albumImg = document.createElement('img');
            albumImg.src = album.image;
            albumImg.className = 'album-img';
            albumImgDiv.appendChild(albumImg);

            albumImageContainer.appendChild(albumImgDiv);

            const albumInfoDiv = document.createElement('div');
            albumInfoDiv.className = 'album-info-div';

            const albumNameH1 = document.createElement('h1');
            albumNameH1.textContent = album.name;

            const albumArtistH2 = document.createElement('h2');
            albumArtistH2.textContent = await getArtistName(album.artist_id);

            const albumYearH3 = document.createElement('h3');
            albumYearH3.textContent = album.year;

            albumInfoDiv.appendChild(albumNameH1);
            albumInfoDiv.appendChild(albumArtistH2);
            albumInfoDiv.appendChild(albumYearH3);

            albumInfoContainer.appendChild(albumInfoDiv);
        }
    } else {
        console.error('Failed to load album:', response.status);
    }
}

async function displaySongList(album_id) {
    const response = await fetch(`/album_musics/?album_id=${album_id}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const songListContainer = document.getElementsByClassName("songs-list-div")[0];

        songListContainer.innerHTML = '';

        let musicCount = 0;
        let first = true;
        musics.forEach((music) => {
            if(first) {
                first = false;
                initialSongId = music.id;
            }

            const songListItemDiv = document.createElement('div');
            songListItemDiv.className = 'song-list-item';
            songListItemDiv.id = 'music';

            const listStartDiv = document.createElement("div");

            const songNumberDiv = document.createElement('div');
            const songNumberH3 = document.createElement('h3');
            songNumberH3.textContent = ++musicCount;
            songNumberDiv.appendChild(songNumberH3);

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            const musicImg = document.createElement('img');
            musicImg.src = music.image;
            musicImg.className = 'music-img';
            musicImg.onclick = () => MusicClicked(music.id);
            imgDiv.appendChild(musicImg);

            listStartDiv.appendChild(songNumberDiv);

            const playDiv = document.createElement('div');
            playDiv.className = 'play';
            const playImg = document.createElement('img');
            playImg.src = 'http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png';
            playDiv.appendChild(playImg);
            imgDiv.appendChild(playDiv);

            listStartDiv.appendChild(imgDiv);

            const songNameDiv = document.createElement('div');
            const songNameH4 = document.createElement('h4');
            songNameH4.textContent = music.name;
            songNameDiv.appendChild(songNameH4);

            const playTimeDiv = document.createElement('div');
            const playTimeH4 = document.createElement('h4');
            playTimeH4.textContent = music.play_time;
            playTimeDiv.appendChild(playTimeH4);
            
            songListItemDiv.appendChild(listStartDiv);
            songListItemDiv.appendChild(songNameDiv);
            songListItemDiv.appendChild(playTimeDiv);

            songListContainer.appendChild(songListItemDiv);
        });

        songCount = musicCount;
    } else {
        console.error('Failed to load song list:', response.status);
    }
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id +'&username=' + username + `&is_creator=${is_creator}`;
}


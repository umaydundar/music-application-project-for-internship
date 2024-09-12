let username = "";
let is_creator = "";

document.addEventListener('DOMContentLoaded', async function () {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    username = params.get("username");

    let links = [
        'home-link',
        'home-link-nav',
        'music-search-link',
        'select-link',
        'profile-link',
        'edit-profile',
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
            }
        });
    }

    await displayUserProfile(username); 

    links.forEach(linkId => {
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
            linkElement.href += `&is_creator=${is_creator}`;
        }
    });

    if (is_creator === "true") {
        console.log("entered true");
        document.getElementsByClassName("nav-create-item")[0].style.display = "flex";
    } else {
        console.log("entered false");
        document.getElementsByClassName("nav-create-item")[0].style.display = "none";
    }

    displayTopArtists();
    displayMusicRecommendations();
    displayMusicsPlayedBefore();
    displayAlbums();
    displayRandomMusics();
});

async function displayUserProfile(username) {
    const response = await fetch('/user_profile/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const user = data.user[0];

        is_creator ="" + user.is_creator;
        console.log(user.is_creator);
    
        const userContainer = document.getElementsByClassName("general-profile-info-div")[0];
        userContainer.innerHTML = ''; 

        const defaultUserImage = 'https://i.imghippo.com/files/mvSMn1724926449.jpg';

        const userImageDiv = document.createElement("div");
        userImageDiv.className = "user-profile-image";

        const userImg = document.createElement("img");
        userImg.src = user.image || defaultUserImage;
        userImg.className = "user-profile-img";

        userImageDiv.appendChild(userImg);

        const usernameDiv = document.createElement("div");
        usernameDiv.className = "username";

        const usernameP = document.createElement("p");
        usernameP.textContent = `Username: ${user.username}`;

        usernameDiv.appendChild(usernameP);
        userContainer.appendChild(userImageDiv);
        userContainer.appendChild(usernameDiv);

    } else {
        console.error('Failed to load profile info:', response.status);
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

async function displayTopArtists() {
    const response = await fetch('/top_artists/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        const artistContainer = document.getElementsByClassName("top-artists")[0];
        artistContainer.innerHTML = ''; 

        artists.slice(0, 6).forEach((artist) => {
            const artistDiv = document.createElement('div');
            artistDiv.className = 'top-artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'top-artist';
            imgDiv.onclick = () => ArtistClicked(artist.id);

            const artistImg = document.createElement('img');
            artistImg.src = artist.image;
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
        console.error('Failed to load artists:', response.status);
    }
}

async function displayMusicRecommendations() {
    const response = await fetch('/recommendations/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-recommendations-for-you")[0];
        recommendedContainer.innerHTML = ''; 

        for (const music of musics.slice(0, 6)) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'recommended-music-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'recommended-music';
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

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_recommended' + '&username=' + username +  `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        recommendedContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayMusicsPlayedBefore() {
    const response = await fetch('/recently_played/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const recentlyPlayed = data.musics;

        console.log(recentlyPlayed);

        const recentlyPlayedContainer = document.getElementsByClassName("musics-played-before")[0];
        recentlyPlayedContainer.innerHTML = ''; 

        for (const music of recentlyPlayed.slice(0, 6)){
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-played-before-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'img-div';
            imgDiv.id = 'music-played';

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
            artistName.textContent = await getArtistName(music.artist_id);

            infoDiv.appendChild(musicName);
            infoDiv.appendChild(artistName);

            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(infoDiv);

            recentlyPlayedContainer.appendChild(musicDiv);
        }

        const showAllLink = document.createElement('a');
        showAllLink.className = 'show-all';
        showAllLink.href = '/display/?action=get_all_recently_played' + '&username=' + username +  `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        recentlyPlayedContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayAlbums() {
    const response = await fetch('/albums/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("albums-for-you")[0];
        albumContainer.innerHTML = ''; 

        for (const album of albums.slice(0, 6)) {
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
        showAllLink.href = '/display/?action=get_all_albums' + '&username=' + username  + `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        albumContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayRandomMusics() {
    const response = await fetch('/musics/?username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("random-musics-for-you")[0];
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
        showAllLink.href = '/display/?action=get_all_random_musics' + '&username=' + username +  `&is_creator=${is_creator}`;
        showAllLink.textContent = 'Show All';
        musicsContainer.appendChild(showAllLink);
    } else {
        console.error('Failed to load musics:', response.status);
    }
}


async function ArtistClicked(artist_id){
    window.location.href = "/artist_profile/?action=get_artist_by_param&artist_id="+ artist_id + "&username="+ username +  `&is_creator=${is_creator}`;
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + "&username="+ username +  `&is_creator=${is_creator}`;;
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id + "&username="+ username +  `&is_creator=${is_creator}`;
}


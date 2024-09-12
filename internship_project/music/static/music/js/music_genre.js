let username = "";
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    username = params.get("username");
    is_creator = params.get("is_creator");
    const genre_id = params.get("genre_id");

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
    
    displayGenre(genre_id);
    displayGenreArtists(genre_id);
    displayGenreAlbums(genre_id);
    displayGenreMusics(genre_id);
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

async function displayGenre(genre_id) {

    const response = await fetch("/genre/?genre_id="+ genre_id + '&username=' + username);

    if (response.ok) {
        const genreInfoContainer = document.getElementsByClassName("genre-info-container")[0];

        const genreData = await response.json();
        const genres = genreData.genres;

        genreInfoContainer.innerHTML = '';

        const genreDiv = document.createElement('div');
        genreDiv.className = 'genre';

        const genreImageDiv = document.createElement('div');
        genreImageDiv.className = 'genre-image-div';

        const genreImg = document.createElement('img');
        genreImg.src = genres[0].image;
        genreImg.className = 'genre-img';
        genreImageDiv.appendChild(genreImg);

        const genreNameDiv = document.createElement('div');
        genreNameDiv.className = 'genre-name';

        const genreName = document.createElement('h2');
        genreName.textContent = genres[0].name;
        genreNameDiv.appendChild(genreName);

        genreDiv.appendChild(genreImageDiv);
        genreDiv.appendChild(genreNameDiv);

        genreInfoContainer.appendChild(genreDiv);
    } else {
        console.error('Failed to load genre data:', response.status);
    }
}

async function displayGenreArtists(genre_id){

    const artistResponse = await fetch("/genre_artists/?genre_id=" + genre_id + '&username=' + username);

    if (artistResponse.ok) {
        const genreArtistsContainer = document.getElementsByClassName("top-artists-for-the-genre")[0];
        const genreArtists = await artistResponse.json();
        const artists = genreArtists.artists;

        genreArtistsContainer.innerHTML = '';

        for (const artist of artists.slice(0, 7)){
            const artistDiv = document.createElement('div');
            artistDiv.className = 'top-artist-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'artist-img-div';
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

            genreArtistsContainer.appendChild(artistDiv);
    }

    const showAllArtistsLink = document.createElement('a');
    showAllArtistsLink.className = 'show-all';
    showAllArtistsLink.href = '/display/?action=get_genre_artists'+ "&genre_id=" + genre_id  + '&username=' + username + `&is_creator=${is_creator}`;
    showAllArtistsLink.textContent = 'Show All';
    genreArtistsContainer.appendChild(showAllArtistsLink);

    }
    else {
        console.error('Failed to load genre data:', response.status);
    }
}

async function displayGenreAlbums(genre_id){
    const albumResponse = await fetch("/genre_albums/?genre_id=" + genre_id + '&username=' + username);

    if (albumResponse.ok) {
        const genreAlbumsContainer = document.getElementsByClassName("genre-albums-gallery")[0];
        const genreAlbums = await albumResponse.json();
        const albums = genreAlbums.albums;

        genreAlbumsContainer.innerHTML = '';

        for (const album of albums.slice(0, 7)){
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album-div';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'album-img-div';
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

            const nameDiv = document.createElement('div');
            const albumName = document.createElement('h4');
            albumName.textContent = album.name;
            nameDiv.appendChild(albumName);

            const albumArtistName = document.createElement('p');
            albumArtistName.textContent = await getArtistName(album.artist_id);
            nameDiv.appendChild(albumArtistName);

            albumDiv.appendChild(imgDiv);
            albumDiv.appendChild(nameDiv);

            genreAlbumsContainer.appendChild(albumDiv);
        }

        const showAllAlbumsLink = document.createElement('a');
        showAllAlbumsLink.className = 'show-all';
        showAllAlbumsLink.href = '/display/?action=get_genre_albums' + "&genre_id=" + genre_id +'&username=' + username + `&is_creator=${is_creator}`;
        showAllAlbumsLink.textContent = 'Show All';
        genreAlbumsContainer.appendChild(showAllAlbumsLink);
    }
    else {
        console.error('Failed to load genre data:', response.status);
    }
    
}

async function displayGenreMusics(genre_id){
    const musicResponse = await fetch("/genre_musics/?genre_id=" + genre_id + '&username=' + username);

    if (musicResponse.ok) {
        const genreMusicsContainer = document.getElementsByClassName("genre-songs-gallery")[0];
        const genreMusic = await musicResponse.json();
        const musics = genreMusic.musics;
    
        genreMusicsContainer.innerHTML = '';
    
        for (const music of musics.slice(0, 7)){
            const musicDiv = document.createElement('div');
            musicDiv.className = 'music-div';
    
            const imgDiv = document.createElement('div');
            imgDiv.className = 'music-img-div';
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
    
            const nameDiv = document.createElement('div');
            const musicName = document.createElement('h4');
            musicName.textContent = music.name;
            nameDiv.appendChild(musicName);

            const musicArtistName = document.createElement('p');
            musicArtistName.textContent = await getArtistName(music.artist_id);
            nameDiv.appendChild(musicArtistName);
    
            musicDiv.appendChild(imgDiv);
            musicDiv.appendChild(nameDiv);
    
            genreMusicsContainer.appendChild(musicDiv);
        }
    
        const showAllMusicsLink = document.createElement('a');
        showAllMusicsLink.className = 'show-all';
        showAllMusicsLink.href = '/display/?action=get_genre_musics' + "&genre_id=" + genre_id  +'&username=' + username +`&is_creator=${is_creator}`;
        showAllMusicsLink.textContent = 'Show All';
        genreMusicsContainer.appendChild(showAllMusicsLink);
    }
    else {
        console.error('Failed to load genre data:', response.status);
    }
}

async function ArtistClicked(artist_id){
    window.location.href = "/artist_profile/?action=get_artist_by_param&artist_id="+ artist_id + '&username=' + username + `&is_creator=${is_creator}`;
}

async function AlbumClicked(album_id){
    window.location.href = "/music_play_album/?action=get_album_by_param&album_id=" + album_id + '&username=' + username + `&is_creator=${is_creator}`;
}

async function MusicClicked(music_id){
    window.location.href = "/music_play_song/?action=get_music_by_param&music_id=" + music_id + '&username=' + username + `&is_creator=${is_creator}`;
}

let username = "";
let collectionId;
let playlistId;
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () { 

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const action = params.get('action');
    const artist_id = params.get('artist_id')
    const genre_id = params.get("genre_id")

    username = params.get("username");
    is_creator = params.get("is_creator");
    collectionId = params.get("collection_id");
    playlistId = params.get("playlist_id");
    
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
                linkElement.href += `&is_creator=` + is_creator;
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
    
    if (action === "get_all_top_artists") 
    {
        toggleSections("top-artists");
        displayTopArtists();
    } 
    else if (action === "get_all_recommended") 
    {
        toggleSections("music-recommendations");
        displayMusicRecommendations();
    } 
    else if (action === "get_all_recently_played") 
    {
        toggleSections("musics-played-before");
        displayMusicsPlayedBefore();
    } 
    else if(action == "get_artist_albums")
    {
        toggleSections("artist-albums");
        displayArtistAlbums(artist_id);
    }
    else if(action == "get_artist_songs")
    {
        toggleSections("artist-musics");
        displayArtistMusics(artist_id);
    }
    else if (action === "get_all_albums") {
        toggleSections("albums");
        displayAlbums();
    } 
    else if(action === "get_genre_artists") {
        toggleSections("genre-artists");
        displayGenreArtists(genre_id);
    }
    else if(action === "get_genre_albums") {
        toggleSections("genre-albums");
        displayGenreAlbums(genre_id);
    }
    else if(action === "get_genre_musics") {
        toggleSections("genre-musics");
        displayGenreMusics(genre_id);
    }
    else if(action === "get_all_fav_artists"){
        toggleSections("fav-artists");
        displayFavoriteArtists(username);
    }
    else if(action === "get_all_fav_albums") {
        toggleSections("fav-albums");
        displayFavoriteAlbums(username);
    }
    else if(action === "get_all_fav_songs") {
        toggleSections("fav-musics");
        displayFavoriteMusics(username);
    }   

    // display functions will be written starting here 
    else if(action === "get_all_created_singles"){
        toggleSections("created-singles");
        displayCreatedSingles(username);
    }
    else if(action === "get_all_created_albums"){
        toggleSections("created-albums");
        displayCreatedAlbums(username);
    }
    else if(action === "get_all_created_events"){
        toggleSections("created-events");
        displayCreatedEvents(username);
    }
    else if(action === "get_all_created_live_events"){
        toggleSections("created-live-events");
        displayCreatedLiveEvents(username);
    }
    else if(action === "get_all_collections"){
        toggleSections("all-collections");
        displayCollections(username);
    }
    else if(action === "get_all_playlists"){
        toggleSections("all-playlists");
        displayPlaylists(username);
    }
    else if(action === "get_all_saved_albums"){
        toggleSections("all-saved-albums");
        displaySavedAlbums(username);
    }
    else if(action === "get_collection_by_param"){
        toggleSections("collection");
        displayCollection(collectionId);
    }
    else if(action === "get_playlist_by_param"){
        toggleSections("playlist");
        displayPlaylist(playlistId);
    } 
    else { 
        toggleSections("musics");
        displayRandomMusics();
    }
});

function toggleSections(sectionId) {
    const sections = ["top-artists",
                    "music-recommendations",
                    "musics-played-before",
                    "albums",
                    "musics",
                    "artist-albums",
                    "artist-musics",
                    "genre-artists",
                    "genre-albums",
                    "genre-musics",
                    "fav-artists",
                    "fav-albums",
                    "fav-musics",
                    "all-collections",
                    "all-saved-albums",
                    "all-playlists",
                    "collection",
                    "playlist",
                    "created-singles",
                    "created-albums",
                    "created-events",
                    "created-live-events"];
    sections.forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? "flex" : "none";
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

/* changes will be made  here */

async function  displayCreatedSingles(username){
    const response = await fetch('/created_singles/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("created-singles")[0];

        for(const music of musics){
            const musicDiv = createMusicDiv(music);
            musicsContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayCreatedAlbums(username){
    const response = await fetch('/created_albums/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("created-albums")[0];

        for(const album of albums){
            let artistName = await getArtistName(album.id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayCreatedEvents(username){
    const response = await fetch('/created_events/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const events = data.events;

        const eventContainer = document.getElementsByClassName("created-events")[0];

        for(const event of events){
            const eventDiv = await createEventDiv(event, false);
            eventContainer.appendChild(eventDiv);
        }

    } else {
        console.error('Failed to load events:', response.status);
    }
}

async function displayCreatedLiveEvents(username){
    const response = await fetch('/created_live_events/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const events = data.live;

        const eventContainer = document.getElementsByClassName("created-live-events")[0];

        for(const event of events){
            const eventDiv = await createEventDiv(event, true);
            eventContainer.appendChild(eventDiv);
        }

    } else {
        console.error('Failed to load events:', response.status);
    }
}

async function displayCollections(username){
    const response = await fetch('/all_collections/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const collections = data.collections;

        const collectionContainer = document.getElementsByClassName("collections")[0];

        for(const collection of collections){
            const collectionDiv = await createCollectionDiv(collection);
            collectionContainer.appendChild(collectionDiv);
        }

    } else {
        console.error('Failed to load collections:', response.status);
    }
}

async function displayPlaylists(username){
    const response = await fetch('/all_playlists/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const playlists = data.playlists;

        const playlistContainer = document.getElementsByClassName("playlists")[0];

        for(const playlist of playlists){
            let playlistDiv = await createPlaylistDiv(playlist);
            playlistContainer.appendChild(playlistDiv);
        }

    } else {
        console.error('Failed to load playlists:', response.status);
    }
}

async function displaySavedAlbums(username){
    const response = await fetch('/all_saved_albums/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("saved-albums")[0];

        for(const album of albums){
            let artistName = await getArtistName(album.artist_id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}


/* end of the made changes */

async function displayArtistAlbums(artist_id) {
    const response = await fetch('/artist_albums/?artist_id='+ artist_id +'&username='+ username);
    if (response.ok) {
        const data = await response.json();
        let albums = data.albums;

        let albumsContainer = document.getElementsByClassName("artist-albums")[0];

        for (const album of albums) {
            let artistName = await getArtistName(album.artist_id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumsContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayArtistMusics(artist_id) {
    const response = await fetch('/artist_musics/?artist_id='+ artist_id +'&username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let musicsContainer = document.getElementsByClassName("artist-musics")[0];

        for(const music of musics){
            let artistName = await getArtistName(music.artist_id);
            const musicDiv = createMusicDiv(music, artistName);
            musicsContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayGenreArtists(genre_id) {
    const response = await fetch('/genre_artists/?genre_id='+ genre_id +'&username='+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        let artistsContainer = document.getElementsByClassName("genre-artists")[0];

        artists.forEach(artist => {
            const artistDiv = createArtistDiv(artist);
            artistsContainer.appendChild(artistDiv);
        });

    } else {
        console.error('Failed to load artists:', response.status);
    }
}

async function displayGenreAlbums(genre_id) {
    const response = await fetch('/genre_albums/?genre_id='+ genre_id +'&username='+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        let albumsContainer = document.getElementsByClassName("genre-albums")[0];

        for (const album of albums) {
            let artistName = await getArtistName(album.artist_id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumsContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayGenreMusics(genre_id) {
    const response = await fetch('/genre_musics/?genre_id='+ genre_id +'&username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let musicsContainer = document.getElementsByClassName("genre-musics")[0];

        for(const music of musics){
            let artistName = await getArtistName(music.artist_id);
            const musicDiv = createMusicDiv(music, artistName);
            musicsContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayTopArtists() {
    const response = await fetch('/top_artists/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        const artistContainer = document.getElementsByClassName("top-artists")[0];

        artists.forEach(artist => {
            const artistDiv = createArtistDiv(artist);
            artistContainer.appendChild(artistDiv);
        });

    } else {
        console.error('Failed to load artists:', response.status);
    }
}

async function displayFavoriteArtists() {
    const response = await fetch('/fav_artists/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const artists = data.artists;

        console.log(artists);

        const artistContainer = document.getElementsByClassName("fav-artists")[0];

        artists.forEach(artist => {
            const artistDiv = createArtistDiv(artist);
            artistContainer.appendChild(artistDiv);
        });

    } else {
        console.error('Failed to load artists:', response.status);
    }
}

async function displayMusicRecommendations() {
    const response = await fetch('/recommendations/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const recommendedContainer = document.getElementsByClassName("music-recommendations-for-you")[0];

        for(const music of musics){
            let artistName = await getArtistName(music.artist_id);
            const musicDiv = createMusicDiv(music, artistName);
            recommendedContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayMusicsPlayedBefore() {
    const response = await fetch('/recently_played/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const recentlyPlayed = data.musics;

        const recentlyPlayedContainer = document.getElementsByClassName("musics-played-before")[0];

        for(const music of recentlyPlayed){
            let artistName = await getArtistName(music.artist_id);
            const musicDiv = createMusicDiv(music, artistName);
            recentlyPlayedContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayAlbums() {
    const response = await fetch('/albums/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("albums-for-you")[0];

        for(const album of albums){
            let artistName = await getArtistName(album.artist_id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}

async function displayFavoriteAlbums() {
    const response = await fetch('/fav_albums/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const albums = data.albums;

        const albumContainer = document.getElementsByClassName("fav-albums")[0];

        for(const album of albums){
            let artistName = await getArtistName(album.artist_id);
            const albumDiv = createAlbumDiv(album, artistName);
            albumContainer.appendChild(albumDiv);
        }

    } else {
        console.error('Failed to load albums:', response.status);
    }
}


async function displayRandomMusics() {
    const response = await fetch('/musics/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const musicsContainer = document.getElementsByClassName("random-musics-for-you")[0];

        for(const music of musics){
            let artistName = await getArtistName(music.artist_id);
            const musicDiv = createMusicDiv(music, artistName);
            musicsContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

async function displayFavoriteMusics() {
    console.log("entered display fav musics");
    const response = await fetch('/fav_musics/?username='+ username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        let musicsContainer = document.getElementsByClassName("fav-musics")[0];
        musicsContainer.innerHTML = "";

        for(const music of musics){
            let artistName = await getArtistName(music.artist_id);
            let musicDiv = createMusicDiv(music, artistName);
            musicsContainer.appendChild(musicDiv);
        }

    } else {
        console.error('Failed to load musics:', response.status);
    }
}

function createArtistDiv(artist) {
    const artistDiv = document.createElement("div");
    artistDiv.className = "artist-div";

    const imgDiv = document.createElement("div");
    imgDiv.className = "img-div";
    const img = document.createElement("img");
    img.src = artist.image;
    img.alt = "artist";
    img.className = "top-artists-img";
    img.onclick = () => ArtistClicked(artist.id);
    imgDiv.appendChild(img);

    const playDiv = document.createElement("div");
    playDiv.className = "play";
    const playImg = document.createElement("img");
    playImg.src = "http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png";
    playDiv.appendChild(playImg);
    imgDiv.appendChild(playDiv);

    const nameDiv = document.createElement("div");
    const nameP = document.createElement("p");
    nameP.textContent = artist.username;
    nameDiv.appendChild(nameP);

    artistDiv.appendChild(imgDiv);
    artistDiv.appendChild(nameDiv);

    return artistDiv;
}

function createMusicDiv(music, artistName) {
    const musicDiv = document.createElement("div");
    musicDiv.className = "music-div";

    const imgDiv = document.createElement("div");
    imgDiv.className = "img-div";
    const img = document.createElement("img");
    img.src = music.image;
    img.alt = "music";
    img.className = "music-img";
    img.onclick = () => MusicClicked(music.id);
    imgDiv.appendChild(img);

    const playDiv = document.createElement("div");
    playDiv.className = "play";
    const playImg = document.createElement("img");
    playImg.src = "http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png";
    playDiv.appendChild(playImg);
    imgDiv.appendChild(playDiv);

    const nameDiv = document.createElement("div");
    const musicName = document.createElement('h4');
    musicName.textContent = music.name;
    const artistNameP = document.createElement('p');
    artistName.textContent = artistName;
    nameDiv.appendChild(musicName);
    nameDiv.appendChild(artistNameP);

    musicDiv.appendChild(imgDiv);
    musicDiv.appendChild(nameDiv);

    return musicDiv;
}

function createAlbumDiv(album, artistName) {
    const albumDiv = document.createElement("div");
    albumDiv.className = "album-div";

    const imgDiv = document.createElement("div");
    imgDiv.className = "img-div";
    const img = document.createElement("img");
    img.src = album.image;
    img.alt = "album";
    img.className = "album-img";
    img.onclick = () => AlbumClicked(album.id);
    imgDiv.appendChild(img);

    const playDiv = document.createElement("div");
    playDiv.className = "play";
    const playImg = document.createElement("img");
    playImg.src = "http://cdn1.iconfinder.com/data/icons/flavour/button_play_green.png";
    playDiv.appendChild(playImg);
    imgDiv.appendChild(playDiv);

    const nameDiv = document.createElement("div");
    const albumName = document.createElement('h4');
    albumName.textContent = album.name;
    const artistNameP = document.createElement('p');
    artistName.textContent = artistName;
    nameDiv.appendChild(albumName);
    nameDiv.appendChild(artistNameP);

    albumDiv.appendChild(imgDiv);
    albumDiv.appendChild(nameDiv);

    return albumDiv;
}

async function ArtistClicked(artist_id) {
    window.location.href = `/artist_profile/?action=get_artist_by_param&artist_id=${artist_id}` + '&username='+ username +`&is_creator=${is_creator}`;
}

async function AlbumClicked(album_id) {
    window.location.href = `/music_play_album/?action=get_album_by_param&album_id=${album_id}` + '&username='+ username + `&is_creator=${is_creator}`;
}

async function MusicClicked(music_id) {
    window.location.href = `/music_play_song/?action=get_music_by_param&music_id=${music_id}` + '&username='+ username + `&is_creator=${is_creator}`;
}

async function CollectionClicked(collection_id){
    window.location.href = "/display/?action=get_collection_by_param&collection_id="+ collection_id + "&username="+ username;
}

async function PlaylistClicked(playlist_id){
    window.location.href = "/display/?action=get_playlist_by_param&playlist_id=" + playlist_id + "&username="+ username;
}

async function createEventDiv(event, isLiveEvent){
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

    return eventDiv;
}

async function createCollectionDiv(collection){

    const collectionDiv = document.createElement('div');
    collectionDiv.className = 'collection-div';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'img-div';
    imgDiv.id = 'collection';
    imgDiv.onclick = () => CollectionClicked(collection.id);

    const collectionImg = document.createElement('img');
    collectionImg.src = collection.image;
    collectionImg.className = 'collection-img-collections';
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

    return collectionDiv;
}

async function createPlaylistDiv(playlist){

    const playlistDiv = document.createElement('div');
    playlistDiv.className = 'playlist-div';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'img-div';
    imgDiv.id = 'playlist';
    imgDiv.onclick = () => PlaylistClicked(playlist.id);

    const playlistImg = document.createElement('img');
    playlistImg.src = playlist.image;
    playlistImg.className = 'playlist-img-playlists';
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

    return playlistDiv;
}

/* changes will be made here */


async function displayCollection(collectionId){
    await displayCollectionInfo(collectionId);
    await displayCollectionSongs(collectionId);
    return;
}

async function displayPlaylist(playlistId){
    await displayPlaylistInfo(playlistId);
    await displayPlaylistSongs(playlistId);
    return;
}


async function displayCollectionInfo(collectionId){
    const response = await fetch(`/collection_by_id/?collection_id=${collectionId}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const collections = data.collections;

        const collectionImageContainer = document.getElementsByClassName("collection-cover-image")[0];
        const collectionInfoContainer = document.getElementsByClassName("collection-info")[0];

        collectionImageContainer.innerHTML = '';
        collectionInfoContainer.innerHTML = '';

        for (const collection of collections) {
            const collectionImgDiv = document.createElement('div');
            collectionImgDiv.className = 'collection-img-div';

            const collectionImg = document.createElement('img');
            collectionImg.src = collection.image;
            collectionImg.className = 'collection-img';
            collectionImgDiv.appendChild(collectionImg);

            collectionImageContainer.appendChild(collectionImgDiv);

            const collectionInfoDiv = document.createElement('div');
            collectionInfoDiv.className = 'collection-info-div';

            const collectionNameH1 = document.createElement('h1');
            collectionNameH1.textContent = collection.name;

            collectionInfoDiv.appendChild(collectionNameH1);
            collectionInfoContainer.appendChild(collectionInfoDiv);   
        }
    } else {
        console.error('Failed to load collection:', response.status);
    }
}

async function displayCollectionSongs(collectionId){
    const response = await fetch(`/collection_musics/?collection_id=${collectionId}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const songListContainer = document.getElementsByClassName("collection-songs-list-div")[0];

        songListContainer.innerHTML = '';

        let musicCount = 0;
        let first = true;
        musics.forEach((music) => {
            if(first) {
                first = false;
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

async function displayPlaylistInfo(playlistId){
    const response = await fetch(`/playlist_by_id/?playlist_id=${playlistId}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const playlists = data.playlists;

        const playlistImageContainer = document.getElementsByClassName("playlist-cover-image")[0];
        const playlistInfoContainer = document.getElementsByClassName("playlist-info")[0];

        playlistImageContainer.innerHTML = '';
        playlistInfoContainer.innerHTML = '';

        for (const playlist of playlists) {
            const playlistImgDiv = document.createElement('div');
            playlistImgDiv.className = 'playlist-img-div';
            playlistImgDiv.id = 'music';

            const playlistImg = document.createElement('img');
            playlistImg.src = playlist.image;
            playlistImg.className = 'playlist-img';
            playlistImgDiv.appendChild(playlistImg);

            playlistImageContainer.appendChild(playlistImgDiv);

            const playlistInfoDiv = document.createElement('div');
            playlistInfoDiv.className = 'playlist-info-div';

            const playlistNameH1 = document.createElement('h1');
            playlistNameH1.textContent = playlist.name;

            playlistInfoDiv.appendChild(playlistNameH1);

            playlistInfoContainer.appendChild(playlistInfoDiv);
        }
    } else {
        console.error('Failed to load playlists:', response.status);
    }
}

async function displayPlaylistSongs(playlistId){
    const response = await fetch(`/playlist_musics/?playlist_id=${playlistId}` +'&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const songListContainer = document.getElementsByClassName("playlist-songs-list-div")[0];

        songListContainer.innerHTML = '';

        let musicCount = 0;
        let first = true;
        musics.forEach((music) => {
            if(first) {
                first = false;
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

/* end of the changes here */
let username = "";
let is_creator = "false";
document.addEventListener('DOMContentLoaded', function () {

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

    const genreContainers = document.querySelectorAll('.mood');

    genreContainers.forEach((container, index) => {
        container.style.backgroundColor = colors[index % colors.length];
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


let moods = document.getElementsByClassName("mood");
for (let i = 0; i < moods.length; i++) {
    moods[i].onclick = function () {
        document.getElementsByClassName("mood-music-placeholder")[0].style.display = "none";
        selectDisplayMusic(i + 1);
    };
}

async function selectDisplayMusic(mood_id) {
    const response = await fetch(`/mood_music/?mood=${mood_id}` + '&username=' + username);
    if (response.ok) {
        const data = await response.json();
        const musics = data.musics;

        const coverImageContainer = document.getElementsByClassName('cover-image')[0];
        const musicInfoContainer = document.getElementsByClassName('music-info')[0];

        coverImageContainer.innerHTML = '';
        musicInfoContainer.innerHTML = '';

        let size = 0;

        for (const music of musics) {
            size++;
            albumName = await getAlbumName(music.album_id);
            artistName = await getArtistName(music.artist_id);
            const coverImgDiv = document.createElement('div');
            coverImgDiv.className = 'cover-img-div';
            const coverImg = document.createElement('img');
            coverImg.src = music.image;
            coverImg.className = "music-img";
            coverImgDiv.appendChild(coverImg);

            const musicInfoDiv = document.createElement('div');
            musicInfoDiv.className = "music-info-div";
            const nameP = document.createElement('p');
            nameP.textContent = `Name: ${music.name}`;
            const artistP = document.createElement('p');
            artistP.textContent = `Artist: ${artistName}`;
            const albumP = document.createElement('p');
            albumP.textContent = `Album: ${albumName}`;

            musicInfoDiv.append(nameP, artistP, albumP);

            coverImageContainer.appendChild(coverImgDiv);
            musicInfoContainer.appendChild(musicInfoDiv);
        }

        let random = getRandomInt(0, size);

        let musicCovers = Array.from(document.getElementsByClassName('cover-img-div'));
        musicCovers.forEach((musicCover) => {
            musicCover.style.display = "none";
        });

        let musicInfos = Array.from(document.getElementsByClassName('music-info-div'));
        musicInfos.forEach((musicInfo) => {
            musicInfo.style.display = "none";
        });

        document.getElementsByClassName('cover-img-div')[random].style.display = 'flex';
        document.getElementsByClassName('music-info-div')[random].style.display = 'flex';

        const audioPlayer = document.getElementById("audio-player");
        audioPlayer.src = new URL(musics[random].audio);

    } else {
        console.error('Failed to load song:', response.status);
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

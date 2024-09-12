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


async function displayEventsList() {
    const response = await fetch('/all_events/?username=' + username);
    const topResponse = await fetch('/top_events/?username=' + username);
    const favResponse = await fetch('/fav_events/?username=' + username);
    const data = await response.json();
    const dataTop = await topResponse.json();
    const dataFav = await favResponse.json();
    const events = data.events;
    const topEvents = dataTop.events;
    const favEvents = dataFav.events;

    function createEventElement(event, className, artistName) {
        const eventDiv = document.createElement('div');
        eventDiv.className = className;

        const eventImageDiv = document.createElement('div');
        eventImageDiv.className = 'event-image-div';

        const eventImage = document.createElement('img');
        eventImage.src = event.image;
        eventImage.className = 'event-image';

        const eventContentDiv = document.createElement('div');
        eventContentDiv.className = 'event-content';

        const eventName = document.createElement('h1');
        eventName.className = 'text-lg';
        eventName.textContent = event.name;

        const eventInfo = document.createElement('h2');
        eventInfo.className = 'text-md-l';
        eventInfo.textContent = `Description: ${event.info}`;

        const eventArtist = document.createElement('h2');
        eventArtist.className = 'text-md-l';
        eventArtist.textContent = `Artist: ${artistName}`;

        const eventDate = document.createElement('h2');
        eventDate.className = 'text-md-l';
        eventDate.textContent = `Date: ${event.date}`;

        const eventLocation = document.createElement('h2');
        eventLocation.className = 'text-md-l';
        eventLocation.textContent = `Location: ${event.location}`;

        eventContentDiv.append(eventName, eventInfo, eventArtist, eventDate, eventLocation);
        eventImageDiv.appendChild(eventImage);
        eventDiv.append(eventImageDiv, eventContentDiv);

        return eventDiv;
    }

    for (const event of events) {
        let artistName = await getArtistName(event.artist_id);
        const eventElement = createEventElement(event, 'event-all', artistName);
        document.getElementsByClassName('all')[0].appendChild(eventElement);
    }

    for (const event of topEvents) {
        let artistName = await getArtistName(event.artist_id);
        const eventElement = createEventElement(event, 'event-top', artistName);
        document.getElementsByClassName('top')[0].appendChild(eventElement);
    }

    for (const event of favEvents) {
        let artistName = await getArtistName(event.artist_id);
        const eventElement = createEventElement(event, 'event-fav', artistName);
        document.getElementsByClassName('favourite')[0].appendChild(eventElement);
    }
}

function showAllEvents() {
    document.getElementsByClassName('all')[0].style.display = 'block';
    document.getElementsByClassName('top')[0].style.display = 'none';
    document.getElementsByClassName('favourite')[0].style.display = 'none';
    document.getElementsByClassName("not-found-content")[0].style.display = "none";
}

async function searchEvents() {
    let found = false;
    const searchText = document.getElementById('search-event').value.toLowerCase();
    const filterValue = document.getElementById('events-selection').value.toLowerCase();
    let searchOptions;
    if(filterValue == 'favourite')
    {
        searchOptions = document.querySelectorAll('.event-fav');
    }
    else if(filterValue == 'top')
    {
        searchOptions = document.querySelectorAll('.event-top');
    }
    else
    {
        searchOptions = document.querySelectorAll('.event-all');
    }

    searchOptions.forEach(option => {
        const eventName = option.querySelector('h1').textContent.toLowerCase();
        const eventDescription = option.querySelector('h2').textContent.toLowerCase();

        if (eventName.includes(searchText) || eventDescription.includes(searchText)) {
            option.style.display = 'flex';
            found = true;
        } else {
            option.style.display = 'none';
        }
    });

    if(!found)
    {
        document.getElementsByClassName("not-found-content")[0].style.display = "flex";
    }
}

async function filterEvents() {
    const filterValue = document.getElementById('events-selection').value.toLowerCase();

    if (filterValue == 'favourite') {
        document.getElementsByClassName('all')[0].style.display = 'none';
        document.getElementsByClassName('top')[0].style.display = 'none';
        document.getElementsByClassName('favourite')[0].style.display = 'block';
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
    } else if (filterValue == 'top') {
        document.getElementsByClassName('all')[0].style.display = 'none';
        document.getElementsByClassName('top')[0].style.display = 'block';
        document.getElementsByClassName('favourite')[0].style.display = 'none';
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
    } else {
        document.getElementsByClassName('all')[0].style.display = 'block';
        document.getElementsByClassName('top')[0].style.display = 'none';
        document.getElementsByClassName('favourite')[0].style.display = 'none';
        document.getElementsByClassName("not-found-content")[0].style.display = "none";
    }
}

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
        

    const colors = [
        'var(--completed-color)',
        'var(--soft-blue)',
        'var(--soft-green)',
        'var(--soft-pink)',
        'var(--soft-lavender)',
        'var(--soft-peach)',
        'var(--soft-yellow)',
    ];

    displayEventsList().then(() => {
        let searchString = document.getElementById('search-event').value;
        let filterValue = document.getElementById('events-selection').value;
        if (searchString) {
            searchEvents();
        } else if (filterValue) {
            filterEvents();
        } else {
            showAllEvents();
        }

        const eventContainers = document.querySelectorAll('.event-all, .event-fav, .event-top');
        eventContainers.forEach((container, index) => {
            container.style.backgroundColor = colors[index % colors.length];
        });
    });
});

document.getElementById("newTaskSearchButton").addEventListener("click", function () {
    filterEvents();
    searchEvents();
});

document.getElementById("events-selection").addEventListener("change", function () {
    filterEvents();
});
function showForm(formType) {
    document.getElementById('options-container').style.display = 'none';
    document.getElementById('login-form').style.display = formType === 'login' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = formType === 'signup' ? 'block' : 'none';
    document.getElementById('choose-genre-form').style.display = 'none';
    document.getElementById('change-password-form').style.display = formType === 'change-password' ? 'block' : 'none';
    document.getElementById('define-user-form').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            defineUser(username, password);
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            loginFormSubmit(username, password);
        });

        loginForm.getElementsByClassName("btn-change-password")[0].addEventListener('click', function (event) {
            event.preventDefault();
            showForm('change-password');
            changePassword();
        });
    }
});


async function defineUser(username, password) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('choose-genre-form').style.display = 'none';
    document.getElementById('change-password-form').style.display = 'none';
    document.getElementById('define-user-form').style.display = 'block';

    document.getElementsByClassName("btn-listener")[0].addEventListener("click", function(event) {
        event.preventDefault();
        chooseUserGenreSignup(username, password, false);
    });

    document.getElementsByClassName("btn-artist")[0].addEventListener("click", function(event) {
        event.preventDefault();
        chooseUserGenreSignup(username, password, true);
    });
}

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


async function chooseUserGenreSignup(username, password, isCreator) {
    const csrftoken = getCookie('csrftoken');

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('choose-genre-form').style.display = 'block';
    document.getElementById('change-password-form').style.display = 'none';
    document.getElementById('define-user-form').style.display = 'none';

    document.getElementById("btn-genre").addEventListener('click', async function(event) {
        event.preventDefault();
        const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(el => el.value);

        if (genres.length === 0) {
            alert("Please select at least one genre.");
            return;
        }

        const user = {
            username: username,
            password: password,
            is_artist: isCreator,
            genre: genres,
        };

        const response = await fetch("/signup_user/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            window.location.href = "/login/";
        } else {
            const error = await response.json();
            alert(error.error);
        }
    });
}


async function loginFormSubmit(username, password) {
    const url = `/login_user/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
            console.log("Login successful", result);
            window.location.href = '/home/?username=' + encodeURIComponent(username);
        } else {
            console.error('Error:', result.error);
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Login failed: ' + error.message);
    }
}


async function changePassword() {
    const csrftoken = getCookie('csrftoken');
    const changePasswordForm = document.getElementById("change-password-form");
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const newPassword = document.getElementById('new-password').value;

            const user = {
                username: username,
                password: password,
                new_password: newPassword
            };

            fetch("/change_password_user/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (response.ok) {
                    console.log("Password change successful");
                    window.location.href = "/login";
                } else {
                    throw new Error('Failed to change password');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Password change failed: ' + error.message);
            });
        });
    }
}

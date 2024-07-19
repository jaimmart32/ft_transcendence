function logInHandler()
{
    const loginForm = document.getElementById('login-form');

    if (loginForm)
    {
        loginForm.addEventListener('submit', function(event)
	{
            event.preventDefault();

            const formData =
	    {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            if (validateUsername(formData.username) && validatePass(formData.password))
	    {
                fetch('/login/',
		{
                    method: 'POST',
                    headers:
		    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
			    .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        localStorage.setItem('access', data.access);
                        localStorage.setItem('refresh', data.refresh);
                        alert('Log in successful!');
                        // Load the home content without redirecting, need to implement in main.js
                        loadHome();
                    } else {
                        alert('Log in failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('Invalid credentials.');
            }
        });
    } else {
        console.error('login-form not found');
    }
}

function signUpHandler()
{
    const signUpForm = document.getElementById('signup-form');

    if (signUpForm)
    {
        // Define the behavior for when receiving an event
        signUpForm.addEventListener('submit', function(event)
	{
            // Prevent the default behavior
            event.preventDefault();

            // Get the value for the email and password tags and set them into a variable
            const formData =
	    {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            // Validate the credentials
            if (validateUsername(formData.username) && validateEmail(formData.email) && validatePass(formData.password))
	    {
                fetch('/signup/',
		{
                    method: 'POST',
                    headers:
		    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data =>
		{
                    if (data.status == 'success')
		    {
                        alert('Signup successful!');
                        loadLoginForm();
                        // Optionally, redirect to another page or load another form
                        // window.location.href = '/home/';
                        // loadHomeForm();
                    }
		    else
		    {
                        alert('Signup failed: ' + data.message);
                    }
                })
                .catch(error =>
		{
                    console.error('Error:', error);
                });
            }
	    else
	    {
                // Handle validation failure (optional)
                alert('Invalid email or password format.');
            }
        });
    }
    else
    {
        console.error('login-form not found');
    }
}

function loadHome() {
    const app = document.getElementById('app');
    const token = localStorage.getItem('access');
    if (token) {
        fetch('/home/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Access denied');
            }
            return response.json();
        })
        .then(data => {
            app.innerHTML = `
                <h2>Welcome, ${data.username}!</h2>
                <div class="btn-group-vertical">
                    <button class="btn btn-primary" id="profile">Profile</button>
                    <button class="btn btn-primary" id="play-game">Play Game</button>
                    <button class="btn btn-primary" id="friends-section">Friends</button>
                    <button class="btn btn-primary" id="create-tournament">Create Tournament</button>
                </div>
            `;
            
            document.getElementById('profile').addEventListener('click', loadProfile);
            document.getElementById('play-game').addEventListener('click', loadPlayGame);
            document.getElementById('friends-section').addEventListener('click', loadFriendsSection);
            document.getElementById('create-tournament').addEventListener('click', loadCreateTournament);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('You are not authorized to view this page. Please log in.');
            loadLoginForm();
        });
    } else {
        alert('You are not authorized to view this page. Please log in.');
        loadLoginForm();
    }
}

function validateUsername(username)
{
	if (username.length > 0 && username.length <= 8)
		return (true);
	return (false);
}

function validateEmail(email)
{
	if (email.length > 0)
		return (true);
	return (false);
}

function validatePass(password)
{
	if (password.length >= 8 && password.length <= 12)
	{
		return (true);
	}
	return (false);
}

window.loadHome = loadHome;
window.validateUsername = validateUsername;
window.validateEmail = validateEmail;
window.validatePass = validatePass;

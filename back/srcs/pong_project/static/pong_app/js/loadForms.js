// HTML for the Login page
function loadLoginForm()
{
	app.innerHTML = `
	    <h2>Login</h2>
	    <form id="login-form">
		<div class="form-group">
		    <label for="username">Username</label>
		    <input type="username" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
		    <span class="error-message"></span>
		</div>
		<div class="form-group">
		    <label for="password">Password</label>
		    <input type="password" class="form-control" id="password" placeholder="Password">
		    <span class="error-message"></span>
		</div>
		<button type="submit" class="btn btn-primary">Login</button>
	    </form>
	`;
	logInHandler();
}

// HTML for the SignUp page
function loadSignupForm()
{
	app.innerHTML = `
	    <h2>Sign Up</h2>
	    <form id="signup-form">
		<div class="form-group">
		    <label for="username">Username</label>
		    <input type="text" class="form-control" id="username" placeholder="Enter username">
		    <span class="error-message"></span>
		</div>
		<div class="form-group">
		    <label for="email">Email address</label>
		    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
		    <span class="error-message"></span>
		</div>
		<div class="form-group">
		    <label for="password">Password</label>
		    <input type="password" class="form-control" id="password" placeholder="Password">
		    <span class="error-message"></span>
		</div>
		<div class="form-group">
		    <label for="confirm password">Confirm password</label>
		    <input type="password" class="form-control" id="confirm-password" placeholder="Confirm password">
		    <span class="error-message"></span>
		</div>
		<button type="submit" class="btn btn-primary">Sign Up</button>
	    </form>
	`;
	signUpHandler();
}

function loadPlayGame()
{
	app.innerHTML = `
	    <h2>Play Game</h2>
	    <p>Get ready to play a game of Pong!</p>
	    <!-- Add game play content here -->
	    <canvas id="board" width="500" height="500"></canvas>
		<br>
		<button class="btn btn-secondary" id="back-to-home">Back to Home</button>
	`;
	
	const back = document.getElementById('back-to-home');

	if (back)
	{
		back.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/home');
		});
	}

	initializeGame();
}

function loadFriendsSection()
{
	app.innerHTML = `
	    <h2>Friends</h2>
	    <p>Manage your friends here.</p>
	    <!-- Add friends management content here -->
	    <button class="btn btn-secondary" id="back-to-home">Back to Home</button>
	`;
	
	const back = document.getElementById('back-to-home');

	if (back)
	{
		back.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/home');
		});
	}
}

function loadCreateTournament()
{
	app.innerHTML = `
	    <h2>Create Tournament</h2>
	    <p>Create a new tournament.</p>
	    <!-- Add tournament creation form or content here -->
	    <button class="btn btn-secondary" id="back-to-home">Back to Home</button>
	`;

	const back = document.getElementById('back-to-home');

	if (back)
	{
		back.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/home');
		});
	}
}

function loadHome()
{
	console.log('Inside loadHome');
	const app = document.getElementById('app');
	const token = localStorage.getItem('access');
	console.log('Token in localstorage: ', token);

	if (token)
	{
		console.log('Token in localstorage: ', token);
		fetch('/home/',
		{
			method: 'GET',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
        	})
	.then(response =>
	{
		if (!response.ok)
		{
			throw new Error('Access denied');
		}
		return response.json();
	})
	.then(data =>
	{
		app.innerHTML = `
                <h2>Welcome, ${data.username}!</h2>
                <div class="btn-group-vertical">
                    <button class="btn btn-primary" id="profile">Profile</button>
                    <button class="btn btn-primary" id="play-game">Play Game</button>
                    <button class="btn btn-primary" id="friends-section">Friends</button>
                    <button class="btn btn-primary" id="create-tournament">Create Tournament</button>
                </div>
            `;	
	    const profile = document.getElementById('profile');
		const play = document.getElementById('play-game');
		const friends = document.getElementById('friends-section');
		const tournament = document.getElementById('create-tournament');

		if (profile)
		{
			profile.addEventListener('click', function(event)
			{
				event.preventDefault();
				navigateTo('/home/profile');
			});
		}
		if (play)
		{
	    		play.addEventListener('click', function(event)
			{
				event.preventDefault();
				navigateTo('/home/game');
			});
		}
		if (friends)
		{
			friends.addEventListener('click', function(event)
			{
				event.preventDefault();
				navigateTo('/home/friends');
			});
		}
		if (tournament)
		{
	    		tournament.addEventListener('click', function(event)
			{
				event.preventDefault();
				navigateTo('/home/game');
			});
		}
	 })
		 .catch(error =>
		 {
			console.error('Error:', error);
			alert('You are not authorized to view this page. Please log in.');
			navigateTo('/login');
		});
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login');
	}
}

window.loadPlayGame = loadPlayGame;
window.loadFriendsSection = loadFriendsSection;
window.loadCreateTournament = loadCreateTournament;
window.loadLoginForm = loadLoginForm;
window.loadSignupForm = loadSignupForm;
window.loadHome = loadHome;
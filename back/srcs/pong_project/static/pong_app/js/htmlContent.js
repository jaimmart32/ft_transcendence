function homeHTML(data)
{
	return(`
		<h2>Welcome, ${data.username}!</h2>
		<div class="btn-group-vertical">
		    <button class="btn btn-primary" id="profile">Profile</button>
		    <button class="btn btn-primary" id="play-game">Play Game</button>
		    <button class="btn btn-primary" id="friends-section">Friends</button>
		    <button class="btn btn-primary" id="create-tournament">Create Tournament</button>
		</div>
	    `);
}

function profileHTML(data, avatarUrl)
{
	return(`
		<div id="profile-settings" class="container mt-4">
	<div class="card mx-auto" style="max-width: 500px;">
	    <div class="card-body text-center">
		<img src="${avatarUrl}" alt="Profile Picture" class="img-thumbnail mb-3">
		<h3 id="username">${data.username}</h3>
		<ul class="list-group list-group-flush mb-3">
		    <li class="list-group-item">Games Played: <span id="games-played">0</span></li>
		    <li class="list-group-item">Games Won: <span id="games-won">0</span></li>
		    <li class="list-group-item">Games Lost: <span id="games-lost">0</span></li>
		</ul>
		<button id='edit-profile' type="button" class="btn btn-primary">Edit Profile</button>
		<button class="btn btn-secondary" id="back-to-home">Back to Home</button>
	    </div>
	</div>
    </div>

    <!-- Custom JS -->
    <script>
	// Example function to load user data dynamically
	function loadUserData() {
	    const username = 'JohnDoe';
	    const gamesPlayed = 25;
	    const gamesWon = 15;
	    const gamesLost = 10;

	    document.getElementById('username').innerText = username;
	    document.getElementById('games-played').innerText = gamesPlayed;
	    document.getElementById('games-won').innerText = gamesWon;
	    document.getElementById('games-lost').innerText = gamesLost;
	}

	// Call loadUserData on page load
	document.addEventListener('DOMContentLoaded', loadUserData);
    </script>
`);
}

function loadGenericHTML(type)
{
	if (type === 'login')
	{
		return (`
		    <h2>Login</h2>
		    <form id="login-form">
			<div class="form-group">
			    <label for="username">Username</label>
			    <input type="username" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
			    <span id="username-error" class="error-message"></span>
			</div>
			<div class="form-group">
			    <label for="password">Password</label>
			    <input type="password" class="form-control" id="password" placeholder="Password">
			    <span id="password-error" class="error-message"></span>
			</div>
			<span id="email-error" class="error-message"></span>
			<button type="submit" class="btn btn-primary">Login</button>
		    </form>
		`);
	}
	else if (type === 'signup')
	{
		return(`
		    <h2>Sign Up</h2>
		    <form id="signup-form">
			<div class="form-group">
			    <label for="username">Username</label>
			    <input type="text" class="form-control" id="username" placeholder="Enter username">
			    <span id="username-error" class="error-message"></span>
			</div>
			<div class="form-group">
			    <label for="email">Email address</label>
			    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
			    <span id="email-error" class="error-message"></span>
			</div>
			<div class="form-group">
			    <label for="password">Password</label>
			    <input type="password" class="form-control" id="password" placeholder="Password">
			    <span id="password-error" class="error-message"></span>
			</div>
			<div class="form-group">
			    <label for="confirm password">Confirm password</label>
			    <input type="password" class="form-control" id="confirm-password" placeholder="Confirm password">
			    <span id="conf-password-error" class="error-message"></span>
			</div>
			<button type="submit" class="btn btn-primary">Sign Up</button>
		    </form>
		`);
	}
}

window.homeHTML = homeHTML;
window.profileHTML = profileHTML;
window.loadGenericHTML = loadGenericHTML;

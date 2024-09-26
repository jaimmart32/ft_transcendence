
//Font Awesome is a very popular icon library that allows you to include thousands of scalable icons on a web page simply by applying CSS classes.
function homeHTML(data)
{
	return(`
	<div class="jumbotron text-center bg-dark text-white mt-4">
    	<h1 class="display-4">Welcome to WebPong ${data.username}!</h1>
	    <p class="lead">The best way to connect with your friends, personalize your profile and enjoy Pong games.</p>
	    <hr class="my-4">
	    <p>
	        With WebPong, you can:
	        <ul class="list-unstyled">
	            <li><i class="fas fa-user-friends"></i> Add and manage friends</li>
	            <li><i class="fas fa-user-cog"></i> Customize your profile to your liking</li>
	            <li><i class="fas fa-gamepad"></i> Challenge your friends in online Pong games</li>
	            <li><i class="fas fa-trophy"></i> Create Pong Tournaments to test your skills</li>
	        </ul>
	    </p>
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

function profileSettingsHTML(data)
{
	return(`
		<div class="container mt-2">
				<h2>Profile Settings</h2>
				<img src="/static/pong_app/media/user-pic.jpg" alt="Default user profile picture" width="128" height="128">
				<form id="profile-settings">
				<!-- Username Field -->
				<div class="form-group row">
					<label for="username" class="col-sm-2 col-form-label">Username</label>
					<div class="col-sm-10">
					<input type="text" class="form-control" id="username" value=${data.username}>
						<span id="username-error" class="error-message"></span>
					</div>
				</div>
				<!-- Password Field -->
				<div class="form-group row">
					<label for="password" class="col-sm-2 col-form-label">Password</label>
					<div class="col-sm-10">
					<input type="password" class="form-control" id="password" placeholder="*******">
						<span id="password-error" class="error-message"></span>
					</div>
				</div>
				<!-- Preferred Language Field -->
				<div class="form-group row">
					<label for="language" class="col-sm-2 col-form-label">Preferred Language</label>
					<div class="col-sm-10">
					<select class="form-control" id="language">
						<option>English</option>
						<option>Spanish</option>
						<option>French</option>
					</select>
					</div>
				</div>
				<!-- 2FA Activation Field -->
				<div class="form-group row">
					<label for="twofa" class="col-sm-2 col-form-label">Activate 2FA</label>
					<div class="col-sm-10">
					<input type="checkbox" id="twofa">
					</div>
				</div>
				<!-- Avatar Change Field -->
				<div class="form-group row">
					<label for="avatar" class="col-sm-2 col-form-label">Change Avatar</label>
					<div class="col-sm-10">
					<input type="file" class="form-control-file" id="avatar">
					</div>
					<span id="file-error" class="error-message"></span>
				</div>
				<!-- Submit Button -->
				<div class="form-group row">
					<div class="col-sm-10 offset-sm-2">
					<button id="save-changes" type="submit" class="btn btn-success">Save Changes</button>
					</div>
				</div>
				</form>
			</div>
			<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
			<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
			`);
}

function loadGenericHTML(type)
{
	if (type === 'login')
	{
		return (`

		<div class="form-container">
			<h2 class="form-title">Log in</h2>
			<form id="login-form">
				<div class="form-group">
					<label for="username">Username</label>
					<input type="username" class="form-control" id="username" placeholder="Enter username">
			    		<span id="username-error" class="error-message"></span>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" class="form-control" id="password" placeholder="Enter password">
			    		<span id="password-error" class="error-message"></span>
				</div>
				<button class="custom-button" id="submit">Submit</button>
			</form>
		</div>
		`);
	}
	else if (type === 'signup')
	{
		return(`
			<div class="form-container">
				<h2 class="form-title">Sign Up</h2>
				<form id="signup-form">
					<div class="form-group">
						<label for="username">Username</label>
						<input type="username" class="form-control" id="username" placeholder="Enter username">
						<span id="username-error" class="error-message"></span>
					</div>
					<div class="form-group">
						<label for="email">Email</label>
						<input type="email" class="form-control" id="email" placeholder="Enter email">
						<span id="email-error" class="error-message"></span>
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" class="form-control" id="password" placeholder="Enter password">
						<span id="password-error" class="error-message"></span>
					</div>
					<div class="form-group">
						<label for="confirm password">Password</label>
						<input type="password" class="form-control" id="confirm-password" placeholder="Confirm password">
						<span id="conf-password-error" class="error-message"></span>
					</div>
					<button class="custom-button" id="submit">Submit</button>
				</form>
			</div>
		`);
	}
}

function loadTournamentSectionHTML()
{
	return (`<div class="tournament-section">
            	<div class="tournament-container">
            	    <h2>Create a Tournament</h2>
            	    <p>Create your own tournament and invite your friends to compete!</p>
            	    <button class="custom-button">Create Tournament</button>
            	</div>
            	<div class="tournament-container">
            	    <h2>Join a Tournament</h2>
            	    <p>Join an existing tournament and compete against other players!</p>
            	    <button class="custom-button">Join Tournament</button>
            	</div>
        	</div>`);
}

function loadNotFoundHTML()
{
}

function loadNotAuthorizedHTML()
{
	return(`
		<h2>Not Authorized to view this page. Please authenticate.</h2>
	    `);
}
window.homeHTML = homeHTML;
window.profileHTML = profileHTML;
window.profileSettingsHTML = profileSettingsHTML;
window.loadGenericHTML = loadGenericHTML;
window.loadNotAuthorizedHTML = loadNotAuthorizedHTML;

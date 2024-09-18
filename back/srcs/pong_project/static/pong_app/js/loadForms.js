// HTML for the Login page
function loadLoginForm()
{
	const app = document.getElementById('app');
	const token = localStorage.getItem('access');

	if (token)
	{
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
		loadHome()
	 })
		 .catch(() =>
		 {
			app.innerHTML = loadGenericHTML('login');
			logInHandler();
		});
	}
	else
	{
		app.innerHTML = loadGenericHTML('login');
		logInHandler();
	}
}

function loadEmailConfirmation()
{
	app.innerHTML = `
	    <h2>Sign Up</h2>
	    <form id="emailConf-form">
		<div class="form-group">
		    <label for="code">Code</label>
		    <input type="text" class="form-control" id="code" placeholder="Enter code">
		    <span class="error-message"></span>
		</div>
		<button type="submit" class="btn btn-primary">Verify</button>
	    </form>
	`;
	emailConfirmationHandler();
}

// HTML for the SignUp page
function loadSignupForm()
{
	const app = document.getElementById('app');
	const token = localStorage.getItem('access');

	if (token)
	{
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
		loadHome()
	 })
		 .catch(() =>
		 {
			app.innerHTML = loadGenericHTML('signup');
		signUpHandler();
		});
	}
	else
	{
		app.innerHTML = loadGenericHTML('signup');
		signUpHandler();
	}
}

function loadPlayGame(id)
{
	app.innerHTML = `
	    <h2>Play Game</h2>
	    <p>Get ready to play a game of Pong!</p>
	    <!-- Add game play content here -->
	    <canvas id="board" width="900" height="500"></canvas>
		<br>
		<button class="btn btn-secondary" id="back-to-home">Back to Home</button>
	`;
	
	const back = document.getElementById('back-to-home');

	if (back)
	{
		back.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/home/');
		});
	}

	initializeGame(id);
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
			navigateTo('/home/');
		});
	}
}

async function loadHome()
{
	console.log('Inside loadHome');
	const app = document.getElementById('app');
	const token = localStorage.getItem('access');

	if (token)
	{
		try
		{
			const response = await fetch('/home/',
			{
				method: 'GET',
				headers:
				{
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
			
			const data = await response.json();

			if (data.status === 'success')
			{
				app.innerHTML = homeHTML(data);

				const profile = document.getElementById('profile');
				const play = document.getElementById('play-game');
				const friends = document.getElementById('friends-section');
				const tournament = document.getElementById('create-tournament');

				if (profile)
				{
					profile.addEventListener('click', function(event)
					{
						event.preventDefault();
						navigateTo('/home/profile/');
					});
				}
				if (play)
				{
					play.addEventListener('click', function(event)
					{
						event.preventDefault();
						game_id = Math.floor(Math.random() * 10000)
						navigateTo(`/home/game/${game_id}`);
					});
				}
				if (friends)
				{
					friends.addEventListener('click', function(event)
					{
						event.preventDefault();
						navigateTo('/home/friends/');
					});
				}
				if (tournament)
				{
					tournament.addEventListener('click', function(event)
					{
						event.preventDefault();
						game_id = Math.floor(Math.random() * 10000)
						navigateTo(`/home/game/${game_id}`);
					});
				}
			}
			else
			{
				await notAuthorized(data, '/home/', token);
			}
		}
		 catch(error)
		 {
			console.error('Error:', error);
			alert('You are not authorized to view this page. Please log in.');
			navigateTo('/login/');
		}
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

window.loadPlayGame = loadPlayGame;
window.loadCreateTournament = loadCreateTournament;
window.loadLoginForm = loadLoginForm;
window.loadSignupForm = loadSignupForm;
window.loadHome = loadHome;

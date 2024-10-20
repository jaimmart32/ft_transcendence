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
		<div class="options-container">
			<div class="option">
				<i class="fas fa-user-friends fa-4x" style="color: black;"></i>
				Two players, same device.
				<button class="custom-button" id="local-btn" style="width: 100%; height: 100%;">Local game</button>
			</div>
			<div class="option">
				<i class="fas fa-users fa-4x" style="color: black;"></i>
				Play an online match.
				<button class="custom-button" id="online-btn" style="width: 100%; height: 100%">Online game</button>
			</div>
			<div class="option">
				<i class="fas fa-trophy fa-4x" style="color: black;"></i>
				Compete against other players.
				<button class="custom-button" id="tournament-btn" style="width: 100%; height: 100%">Tournament</button>
			</div>
		</div>
	`;
	
	const local = document.getElementById('local-btn');
	const online = document.getElementById('online-btn');
	const tournament = document.getElementById('tournament-btn');

	if (local)
	{
		local.addEventListener('click', function(event)
		{
			event.preventDefault();
			//navigateTo('/home/game/local/');
			initializeLocalGame();
		});
	}
	if (online)
	{
		online.addEventListener('click', function(event)
		{
			console.log('INSIDE ONLINE BUTTON EVENT LISTENER!');
			event.preventDefault();
			//navigateTo('/home/game/online/');
			initializeGame();
		});
	}
	if (tournament)
	{
		tournament.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/home/game/tournament/');
		});
	}
//	initializeGame();
}

function loadGameCanvas()
{
	app.innerHTML = `
	    <h2>Play Game</h2>
	    <p>Get ready to play a game of Pong!</p>
	    <!-- Add game play content here -->
	    <canvas id="board" width="900" height="500"></canvas>
	`;
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
			}
			else
			{
				await checkRefresh(data, '/home/', token);
			}
		}
		 catch(error)
		 {
			notAuthorized(error);
		}
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

async function loadTournamentSection()
{
	const app = document.getElementById('app');
	const token = localStorage.getItem('access');

	if (token)
	{
		try
		{
			const response = await fetch('/get_user_info/',
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
				app.innerHTML = loadTournamentSectionHTML();
//				Add two event listeners for both buttons, join or create buttons.
			}
			else
			{
				await checkRefresh(data, '/home/', token);
			}
		}
		 catch(error)
		 {
			notAuthorized(error);
		}
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

window.loadPlayGame = loadPlayGame;
window.loadGameCanvas = loadGameCanvas
window.loadTournamentSection = loadTournamentSection;
window.loadLoginForm = loadLoginForm;
window.loadSignupForm = loadSignupForm;
window.loadHome = loadHome;

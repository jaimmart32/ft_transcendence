function createTournamentHTML()
{
	return (`

	<i class="fas fa-trophy fa-2x" style="color: black;"></i>
	<div class="form-container">
		<h2 class="form-title">Create a tournament</h2>
		<form id="login-form">
			<div class="form-group">
				<label for="tournamentName">Name</label>
				<input type="username" class="form-control" id="name" placeholder="Enter a name">
					<span id="tournament-error" class="error-message"></span>
			</div>
			<button class="custom-button" id="create-btn">Create</button>
		</form>
	</div>
	`);
}

/*async function createTournament(tournamentName)
{
	const token = localStorage.getItem('access');
    const uid = localStorage.getItem('userid');
	if (token)
	{
        const TournamentInfo = 
        {
            user_id: uid,
            tour_name: tournamentName,
        };
		try
		{
			const response = await fetch('/home/game/tournament/create/',
			{
				method: 'POST',
				headers:
				{
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(TournamentInfo)
			})
			const data = await response.json();
			if (data.status === 'success')
			{
                		alert('Tournament created successfully! Wait until it is full.');
				navigateTo('/home/game/tournament/');
	 		}
			else
			{
                switch (data.message)
                {
					case 'A tournament with this name already exists.':
						alert('This tournament name is already taken. Please choose a different name.');
						break;
					case 'User not found.':
						alert('Your account was not found. Please log in again.');
						navigateTo('/login/');
						break;
					case 'Invalid Tournament name.':
						alert('Please enter a tournament name(between 2 and 15 characters).');
						break;
					default:
						await checkRefresh(data, '/home/game/tournament/create/', token);
				}
			}
		}
		catch(error)
		{
			notAuthorized(error);
		}
	}
	else
	{
		console.error('Error:', error);
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}*/

function loadCreateTournament()
{
	const app = document.getElementById('app');
	app.innerHTML = createTournamentHTML();
	const name = document.getElementById('name');
	const create = document.getElementById('create-btn');

	console.log("inside loadCreateTournament");

	if (create)
	{
		console.log("create exists");
		create.addEventListener('click', async function(event)
		{
			event.preventDefault();
			if (name)
			{
				const tournamentName = name.value;
				console.log("Tournament name: " + tournamentName);
				await createTournament(tournamentName);
			}
			
		});
	}
}

async function loadTournamentsSection()
{
	const token = localStorage.getItem('access');

	if (token)
	{
		try
		{
			const response = await fetch('/home/game/tournament/join',
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
				let tournamentsHTML = `
				<div class="options-container">
					<div class="option">
						<h3><b>Tournaments</b></h3>
						<div class="friends-list" style="width: 100%;">
				`;

				data.tournaments.forEach(tournament => {
					tournamentsHTML += `
							<div class="friend-card">
								<span class="friend-username">${tournament.name}</span>
								<span class="friend-status">${tournament.players}/4</span>
								<div class="friend-actions">
									<button data-username="${tournament.name}" class="custom-button remove-friend" style="background-color: green; align-items: left;">
										<i class="fas fa-plus"></i>
									</button>
								</div>
							</div>`});
				tournamentsHTML +=	`</div>
					</div>
				</div>`;

				app.innerHTML = tournamentsHTML;

				document.querySelectorAll('.remove-friend').forEach(button => {
					button.addEventListener('click', function(event) {
						const username = event.target.getAttribute('data-username');
						console.log("Someone clicked the button");
						
//						removeFriend(username);
					});
				});
			}
			else
			{
				await checkRefresh(data, '/home/game/tournament/join', token);
			}
		}
		catch(error)
		{
			console.log('INSIDE CATCH OF TOURNAMENTS!');
			notAuthorized(error);
		}
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

window.createTournamentHTML = createTournamentHTML;
//window.createTournament = createTournament;
window.loadTournamentsSection = loadTournamentsSection;
window.loadCreateTournament = loadCreateTournament;

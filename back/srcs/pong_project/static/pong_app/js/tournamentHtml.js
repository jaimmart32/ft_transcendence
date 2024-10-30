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
		create.addEventListener('click', function(event)
		{
			event.preventDefault();
			if (name)
			{
				const tournamentName = name.Value;
				createTournament(tournamentName);
			}
			
		});
	}
}

async function loadTournamentsSection()
{
	const token = localStorage.getItem('access');

	if (token)
	{
		console.log("we have a token inside of loadTournamentsSection");
		try
		{
			const response = await fetch('/home/friends/',
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
				let friendsHTML = `
				<div class="options-container">
					<div class="option">
						<h3><b>Friends</b></h3>
						<button class="custom-button" id="add-friend" style="background-color: green; width: 10%;">
							<i class="fas fa-user-plus"></i>
						</button>
						<div class="friends-list" style="width: 100%;">
				`;

				data.friends.forEach(friend => {
					friendsHTML += `
							<div class="friend-card">
								<span class="friend-username">${friend.username}</span>
								<span class="friend-status ${friend.online ? 'online' : 'offline'}">
									${friend.online ? 'Online' : 'Offline'}
								</span>
								<div class="friend-actions">
									<button data-username="${friend.username}" class="custom-button remove-friend" style="background-color: red; align-items: left;">
										<i class="fas fa-user-minus"></i>
									</button>
								</div>
							</div>`});
				friendsHTML +=	`</div>
					</div>
				</div>`;

				app.innerHTML = friendsHTML;

				document.querySelectorAll('.remove-friend').forEach(button => {
					button.addEventListener('click', function(event) {
						const username = event.target.getAttribute('data-username');
						removeFriend(username);
					});
				});

				document.getElementById('add-friend').addEventListener('click', function() {
					const username = prompt("Enter the username of the friend you want to add:");
					if (username) {
						addFriend(username);
					}
				});
			}
			else
			{
				await checkRefresh(data, '/home/friends/', token);
			}
		}
		catch(error)
		{
			console.log('INSIDE CATCH OF FRIENDS!');
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
window.loadTournamentsSection = loadTournamentsSection;
window.loadCreateTournament = loadCreateTournament;

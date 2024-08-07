function loadProfile()
{
	const token = localStorage.getItem('access');
	if (token)
	{
		fetch('/home/profile/',
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
					<div id="profile-settings" class="container mt-4">
				<div class="card mx-auto" style="max-width: 500px;">
				    <div class="card-body text-center">
					<img src="/static/pong_app/media/user-pic.jpg" alt="Profile Picture" class="img-thumbnail mb-3">
					<h3 id="username">${data.username}</h3>
					<ul class="list-group list-group-flush mb-3">
					    <li class="list-group-item">Games Played: <span id="games-played">0</span></li>
					    <li class="list-group-item">Games Won: <span id="games-won">0</span></li>
					    <li class="list-group-item">Games Lost: <span id="games-lost">0</span></li>
					</ul>
					<button id='edit-profile' type="button" class="btn btn-primary">Edit Profile</button>
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
			`;
			const edit = document.getElementById('edit-profile');
			if (edit)
			{
				edit.addEventListener('click', function(event)
				{
					event.preventDefault();	
					navigateTo('/home/profile/edit', data);
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
>>>>>>> 40d64b041888da5c1c1f4b2a6539a158f36e3dda

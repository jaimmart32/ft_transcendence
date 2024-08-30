function loadFriendsSection()
{
	const token = localStorage.getItem('access');

	if (token)
	{
		fetch('/home/friends/',
		{
			method: 'GET',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => {
			let friendsHTML = '<h2>Friends</h2><ul>';
			data.forEach(friend => {
				friendsHTML += `
					<li>${friend.username} - ${friend.online ? 'Online' : 'Offline'}
					<button data-username="${friend.username}" class="remove-friend btn btn-danger">Remove</button>
					</li>
				`;
			});
			friendsHTML += '</ul><button id="add-friend" class="btn btn-primary">Add Friend</button>';
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
		})
		.catch(error => {
			console.error('Error:', error);
			alert('You are not authorized to view this page. Please log in.');
			navigateTo('/login/');
		});
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

function addFriend(username)
{
	const token = localStorage.getItem('access');
	if (token)
	{
		fetch('/home/friends/add/',
		{
			method: 'POST',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({friend_username: username})
		})
		.then(response => response.json())
		.then(data =>
		{
			alert(data.message);
			loadFriendsSection();
		})
		.catch(error => console.error('Error:', error));
	}
}

function removeFriend(username)
{
	const token = localStorage.getItem('access');
	if (token)
	{
		fetch('/home/friends/remove/',
		{
			method: 'POST',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({friend_username: username})
		})
		.then(response => response.json())
		.then(data =>
		{
			alert(data.message);
			loadFriendsSection();
		})
		.catch(error => console.error('Error:', error));
	}
}

window.loadFriendsSection = loadFriendsSection;

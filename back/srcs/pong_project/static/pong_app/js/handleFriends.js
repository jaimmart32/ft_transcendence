async function loadFriendsSection()
{
	const token = localStorage.getItem('access');

	if (token)
	{
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
    				<div class="friends-header-container">
    				    <div class="friends-header">Friends</div>
    				</div>
    				<div class="friends-list">
`;
				data.friends.forEach(friend => {
					friendsHTML += `
						<div class="friend-card d-flex">
							<div class="friend-username">${friend.username}</div>
							<div class="friend-status ${friend.online ? 'online' : 'offline'}">
								${friend.online ? 'Online' : 'Offline'}
							</div>
							<div class="friend-actions">
								<button data-username="${friend.username}" class="remove-friend btn btn-danger">Remove</button>
							</div>
						</div>
					`;
				});
				friendsHTML += '</div><div class="add-friend-container"><button id="add-friend" class="btn btn-primary">Add Friend</button></div>';
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

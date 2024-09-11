function checkRefreshToken(token) {
	return new Promise((resolve, reject) => {
		fetch('/verify-refresh/', {
			method: 'POST',
			headers: {
//				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(
			{
				'token': `${token}`,
				'tokenType': 'Refresh'
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				localStorage.setItem('access', data.newToken); // Save the new access token
				console.log('inside success for refresh check,saved new token!!!')
				resolve(true/*data.new_access_token*/); // Return the new token
			} else {
				reject(false); // Failed to refresh token
			}
		})
		.catch(error => {
			console.error('Error refreshing token:', error);
			reject(false);
		});
	});
}

async function notAuthorized(data, route, token)
{
	if (data.message === 'Access unauthorized')
	{
		const result = await checkRefreshToken(token);
		if (result)
		{
			navigateTo(route);
		}
	}
	else
	{
		app.innerHTML = loadNotAuthorizedHTML();
		setTimeout(() => 
		{
			navigateTo('/login/');
		}, 5000);
	}
}

window.checkRefreshToken = checkRefreshToken;
window.notAuthorized = notAuthorized;

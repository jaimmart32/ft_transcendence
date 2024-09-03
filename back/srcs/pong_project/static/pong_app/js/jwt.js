function checkToken(token)
{
	if (token)
	{
		fetch('/verify-token/',
		{
			method: 'POST',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data =>
		{
			if (data.status === 'success')
			{
				return(true);
			}
			else if (data.status === 'accessExpired')
			{
//				We need to send the refresh token
//				Return a new access token
//				We set a new access token for the localStorage
				return(checkRefreshToken(token));
			}
			else
				return(false);
		})
		.catch(error => console.error('Error:', error));
	}
}

function checkRefreshToken(token)
{
	fetch('/verify-refresh/',
	{
		method: 'POST',
		headers:
		{
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})
	.then(response => response.json())
	.then(data =>
	{
		if (data.status === 'success')
		{
//			This means that access was expired, refresh was NOT
			newToken = data.newToken;
			localStorage.setItem('access', newToken);
			return (true);
		}
		else if (data.status === 'expired')
		{
//			Refresh token is expired
			logoutUser();
		}
//			Token does not correspond to any user
		return (false);
	})
	.catch(error => 
	{
		console.error('Error', error);
		return (false);
	});
	return (false);
}

window.checkToken = checkToken;

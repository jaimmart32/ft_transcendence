async function checkRefreshToken(token)
{
	console.log('inside refreshToken');
	try
	{
		console.log('inside try for refreshToken');

		const response = await fetch('/verify-refresh/',
		{
			method: 'POST',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body:
			{
				'tokenType': 'Refresh'
			}
		});

		const data = await response.json();

		if (data.status === 'success')
		{
			console.log('success');
	//		This means that access was expired, refresh was NOT
			newToken = data.newToken;
			localStorage.setItem('access', newToken);
			alert('NEW ACCESS TOKEN: ', newToken);
			return (true);
		}
		else if (data.status === 'expired')
		{
			console.log('expired');
	//		Refresh token is expired
			alert('REFRESH TOKEN IS EXPIRED, BYE-BYE');
//			logoutUser();
		}
	//	Token does not correspond to any user
		return (false);
	}
	catch (error) 
	{
		console.error('Error', error);
		return (false);
	}
}

/*function checkRefreshToken(token) {
    return new Promise((resolve, reject) => {
        const refreshToken = localStorage.getItem('refresh');
        fetch('/verify-refresh/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('access', data.new_access_token); // Save the new access token
                resolve(data.new_access_token); // Return the new token
            } else {
                reject(false); // Failed to refresh token
            }
        })
        .catch(error => {
            console.error('Error refreshing token:', error);
            reject(false);
        });
    });
}*/

window.checkRefreshToken = checkRefreshToken;

async function getAuthUrl()
{
	try
	{
		const response = await fetch('api/auth-settings/',
		{
			method: 'GET',
			headers:
			{
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		if (data.status === 'success')
		{
//			alert('Settings found');
			const authUrl =  `${data.auth_endpoint}?client_id=${data.client_id}&redirect_uri=${data.redirect_uri}&response_type=${data.scope}`
			return (authUrl);
		}
		else
		{
			alert('Could not retrieve API settings');
			return (null);
		}
	}
	catch(error)
	{
		console.error('Error fetching API settings: ', error);
		return (null);
	}

}

// This function receives the auth url, changes the window to that url (API42),
// the user verifies in the API and receives a code (token). Here we receive
// the token and send it to the backend.
async function handleAuth()
{
	authUrl = await getAuthUrl();

	if (authUrl)
	{
		window.location.href = authUrl;
	}
	else
	{
		alert('No AuthURL was found');
	}
}

async function makeApiPetition(code)
{
	try
	{
		const response = await fetch('api/auth/callback/',
		{
			method: 'POST',
			headers:
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code })
		});

		const data = await response.json();

		if (data.status === 'success')
		{
//			Need to create another html, where the whole process of getting the
//			code, storing the tokens and loading the home is done.
			alert('Authenticated successfully');
			localStorage.setItem('access', data.access);
			localStorage.setItem('refresh', data.access);
			window.location.href('/home/');
//			loadHome();
		}
		else
		{
			console.log(data.status);
			console.log(data.message);
			alert('Authentication failed');
		}
	}
	catch(error)
	{
		console.error('Error fetching API settings: ', error);
	}
}

window.getAuthUrl = getAuthUrl;
window.handleAuth = handleAuth;
window.makeApiPetition = makeApiPetition;

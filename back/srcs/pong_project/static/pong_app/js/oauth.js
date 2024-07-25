function getAuthUrl()
{
	fetch('api/auth-settings/',
	{
		method: 'GET',
		headers:
		{
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(data =>
	{
		if (data.status === 'success')
		{
			alert('Settings found');
//			const authUrl = '{data.auth_endpoint}?client_id={data.client_id}&redirect_uri=${data.redirect_uri}&response_type=${data.scope}'
//			console.log(authUrl);
			return ('${data.auth_endpoint}?client_id=${data.client_id}&redirect_uri=${data.redirect_uri}&response_type=${data.scope}');
		}
		else
		{
			alert('Could not retrieve API settings');
			return (null);
		}
	})
}

// This function receives the auth url, changes the window to that url (API42),
// the user verifies in the API and receives a code (token). Here we receive
// the token and send it to the backend.
async function handleAuth()
{
	authUrl = await getAuthUrl();
	console.log('Inside handle auth')
	if (authUrl)
	{
		console.log(authUrl)
		console.log('inside handle auth, found url');
		window.location.href = authUrl;
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code)
		{
			alert('Code found');
			return (code);
//			makeApiPetition(code);
		}
		else
		{
			alert('No code found');
			return (null);
		}
	}
}

async function makeApiPetition(code)
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
		alert('Authenticated successfully');
		localStorage.setItem('access', data.access);
		localStorage.setItem('refresh', data.access);
		loadHome();
	}
	else
	{
		console.log(data.status);
		console.log(data.message);
		alert('Authentication failed');
	}
}

window.getAuthUrl = getAuthUrl;
window.handleAuth = handleAuth;
window.makeApiPetition = makeApiPetition;

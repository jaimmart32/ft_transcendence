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
			alert('Settings found');
			const authUrl =  `${data.auth_endpoint}?client_id=${data.client_id}&redirect_uri=${data.redirect_uri}&response_type=${data.scope}`
			console.log(authUrl);
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
	const authUrl = await getAuthUrl();

	if (authUrl)
	{
		console.log('Before redirecting to url');
		window.location.href = authUrl;
	}
	else
	{
		alert('No AuthURL was found');
	}
}

async function verifyCode(code)
{
	try
	{
		const response = await fetch('api/auth/verify/',
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
			console.log('Code verified');
			handle42Info(data.userInfo);
		}
		else
		{
			console.log('Error: ', data.message);
			alert('Code verification failed');
		}
	}
	catch(error)
	{
		console.error("Error: ", error);
	}
}

async function handle42Info(userInfo)
{
	try
	{
		const response = await fetch('api/auth/create-user/',
		{
			method: 'POST',
			headers:
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userInfo })
		});
		const data = await response.text();

		try
		{
			const jsonData = JSON.parse(data);
			if (jsonData.status === 'success')
			{
				alert('Success to create user');
				window.location.href = jsonData.redirect_url;
			}
			else
			{
				console.log('Error: ', jsonData.message);
				alert('Failed to create the user');
			}
		}
		catch(e)
		{
			console.error('Error: ', e);
			console.error('Response: ', data);
			alert('Failed to create the user');
		}
	}
	catch(error)
	{
		console.error("Error: ", error);
	}
}

document.addEventListener('DOMContentLoaded', () =>
{
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const access = urlParams.get('access');
	const refresh = urlParams.get('refresh');

	if (access && refresh)
	{
		console.log('Inside event listener, found tokens');
		localStorage.setItem('access', access);
		localStorage.setItem('refresh', refresh);
		loadHome();
	}
	if (code)
	{
		console.log('Inside event listener, found code');
		verifyCode(code);
	}
});

window.getAuthUrl = getAuthUrl;
window.handleAuth = handleAuth;
window.handle42Info = handle42Info;
window.verifyCode = verifyCode;

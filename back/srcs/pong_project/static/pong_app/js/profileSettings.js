async function loadProfileSettings()
{
	const token = localStorage.getItem('access');
	if (token)
	{
		try
		{
			console.log('INSIDE PROFILESETTINGS!!!!')
			const response = await fetch('/get_user_info/',
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
				app.innerHTML = profileSettingsHTML(data);

//		    	I could add one more button to go back without making any changes
				const save = document.getElementById('save-changes');
				if (save)
				{
					save.addEventListener('click', function(event)
				{
					event.preventDefault();
					updateUserInfo();
				});
				}
	 		}
			else
			{
				await checkRefresh(data,'/home/profile/edit/', token);
			}
		}
		catch(error)
		{
			notAuthorized(error);
		}
	}
	else
	{
		console.error('Error:', error);
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

function updateUserInfo()
{
    const token = localStorage.getItem('access');

    if (token)
	{
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const twofa = document.getElementById('twofa').checked ? 'on' : 'off';
        const userPic = document.getElementById('avatar').files[0];


        const userDict =
		{
            username: username,
            password: password,
            twofa: twofa,
        };

        if (userPic)
		{
            // Crear un lector para convertir la imagen a base64
            const reader = new FileReader();
            reader.readAsDataURL(userPic);

            reader.onloadend = function () {
                userDict.avatar = reader.result;// Convertido a base64

                sendUserData(userDict, token);
            };
        }
		else
		{
            sendUserData(userDict, token);
        }
    }
	else
	{
        alert('You are not authorized to view this page. Please log in.');
        navigateTo('/login/');
    }
}

async function sendUserData(userDict, token)
{
	try
	{
    	const response = await fetch('/home/profile/edit/',
		{
    	    method: 'PUT',
    	    headers:
			{
    	        'Authorization': `Bearer ${token}`,
    	        'Content-Type': 'application/json',
    	    },
    	    body: JSON.stringify(userDict)
    	})
    	const data = await response.json();
		if (data.status === 'success')
		{
    	    alert('Info updated correctly!');
    	    navigateTo('/home/profile/', userDict);
    	}
		else
		{
    	    if (data.message)
			{
    	        if (data.message.includes('file'))
				{
    	            showMessage('file-error', data.message);
    	    	}
    	    	console.error(data.message);
				await checkRefresh(data, '/home/profile/edit/', token);
    	    }
    	}
	}
    catch(error)
	{
        console.log('Inside the error');
        notAuthorized(error);
    }
}

window.loadProfileSettings = loadProfileSettings;

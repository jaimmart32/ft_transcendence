function updateLogoutButtonVisibility()
{
    const logoutItem = document.getElementById('logout-item');
    const token = localStorage.getItem('access');

    if (token)
    {
        // Fetch user info to check if the user is online
        fetch('/get_user_info/',
	{
            method: 'GET',
            headers:
	    {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data =>
	{
            if (data.status === 'success' && data.is_online)
	    {
                // If the user is online, show the Logout button
                logoutItem.classList.remove('d-none');
            }
	    else
	    {
                // Hide the Logout button if the user is not online
                logoutItem.classList.add('d-none');
            }
        })
        .catch(error =>
	{
            console.error('Error:', error);
            // Hide the Logout button in case of error
            logoutItem.classList.add('d-none');
        });
    }
    else
    {
        // Hide the Logout button if no token is found
        logoutItem.classList.add('d-none');
    }
}

function logoutUser()
{
    const token = localStorage.getItem('access');
    if (token)
    {
        fetch('/logout/',
	{
            method: 'POST',
            headers:
	    {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
	    credentials: 'include',
        })
        .then(response =>
	{
            if (response.ok)
	    {
                localStorage.removeItem('access');
                navigateTo('/login/');
            }
	    else
	    {
	    	if (localStorage.getItem('access'))
		{
                	localStorage.removeItem('access');
                	navigateTo('/login/');
		}
	    }
        })
        .catch(error =>
	{
            console.error('Error during logout:', error);
        });
    }
}

window.updateLogoutButtonVisibility = updateLogoutButtonVisibility
window.logoutUser = logoutUser

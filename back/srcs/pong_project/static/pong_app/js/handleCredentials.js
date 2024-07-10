function logInHandler()
{
    // Get the login-form that we created in the main.js
    const loginForm = document.getElementById('login-form');

    if (loginForm)
    {
        // Define the behavior for when receiving an event
        loginForm.addEventListener('submit', function(event)
	{
            // Prevent the default behavior
            event.preventDefault();

            // Get the value for the email and password tags and set them into a variable
            const formData =
	    {
                email: document.getElementById('email').value,
                pass: document.getElementById('password').value
            };

            // Validate the credentials
            if (validateEmail(formData.email) && validatePass(formData.pass))
	    {
                fetch('/signup/',
		{
                    method: 'POST',
                    headers:
		    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data =>
		{
                    if (data.success)
		    {
                        alert('Signup successful!');
                        // Optionally, redirect to another page or load another form
                        // window.location.href = '/home/';
                        // loadHomeForm();
                    } else
		    {
                        alert('Signup failed: ' + data.message);
                    }
                })
                .catch(error =>
		{
                    console.error('Error:', error);
                });
            }
	    else
	    {
                // Handle validation failure (optional)
                alert('Invalid email or password format.');
            }
        });
    }
    else
    {
        console.error('login-form not found');
    }
}

function signUpHandler()
{
    const signUpForm = document.getElementById('signup-form');

    if (signUpForm)
    {
        // Define the behavior for when receiving an event
        signUpForm.addEventListener('submit', function(event)
	{
            // Prevent the default behavior
            event.preventDefault();

            // Get the value for the email and password tags and set them into a variable
            const formData =
	    {
                email: document.getElementById('email').value,
                pass: document.getElementById('password').value
            };

            // Validate the credentials
            if (validateEmail(formData.email) && validatePass(formData.pass))
	    {
	    	const csrftoken = getCookie('csrftoken');
		console.log(csrftoken)
                fetch('/signup/',
		{
                    method: 'POST',
                    headers:
		    {
                        'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data =>
		{
                    if (data.success)
		    {
                        alert('Signup successful!');
                        // Optionally, redirect to another page or load another form
                        // window.location.href = '/home/';
                        // loadHomeForm();
                    }
		    else
		    {
                        alert('Signup failed: ' + data.message);
                    }
                })
                .catch(error =>
		{
                    console.error('Error:', error);
                });
            }
	    else
	    {
                // Handle validation failure (optional)
                alert('Invalid email or password format.');
            }
        });
    }
    else
    {
        console.error('login-form not found');
    }
}

function getCookie(name)
{
	let cookieVal = null;

	if (document.cookie && document.cookie !== '')
	{
		console.log("Document cookie exists: " + document.cookie)
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++)
		{
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '='))
			{
				cookieVal = decodeURIComponent(cookie.substring(name.length + 1));
				console.log("cookie: " + cookieVal)
				break;
			}
		}
	}
	return cookieVal;
}

function validateUsername(username)
{
	if (username.length > 0 && username.length <= 8)
		return (true);
	return (false);
}

function validateEmail(email)
{
	if (email.length > 0)
		return (true);
	return (false);
}

function validatePass(pass)
{
	if (pass.length >= 8 && pass.length <= 12)
	{
		return (true);
	}
	return (false);
}

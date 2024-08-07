function logInHandler()
{
    const loginForm = document.getElementById('login-form');

    if (loginForm)
    {
        loginForm.addEventListener('submit', function(event)
	{
            event.preventDefault();

            const formData =
	    {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

	    if (validateInput(formData, 'login'))
	    {
                fetch('/login/',
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
                    if (data.status === 'success')
		    {
                        localStorage.setItem('access', data.access);
                        localStorage.setItem('refresh', data.refresh);
                        alert('Log in successful!');
			navigateTo('/home');
                    }
		    else
		    {
                        alert('Log in failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
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
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
		confPass: document.getElementById('confirm-password').value
            };

	    if (validateInput(formData, 'signup'))
	    {
                fetch('/signup/',
		{
                    method: 'POST',
                    headers:
		    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data =>
		{
                    if (data.status == 'success')
		    {
                        alert('Signup successful!');
			navigateTo('/login');
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
        });
    }
    else
    {
        console.error('login-form not found');
    }
}

function validateInput(formData, form)
{
	let valid = true;

	if (!validateUsername(formData.username))
	{
		valid = false;
		showMessage('username-error', 'Invalid username');
	}
	else
	{
		hideMessage('username-error');
	}
	if (!validateEmail(formData.email, form))
	{
		valid = false;
		showMessage('email-error', 'Invalid email');
	}
	else
	{
		hideMessage('email-error');
	}
	if (!validatePass(formData.password) && form !== 'edit')
	{
		valid = false;
		showMessage('password-error', 'Invalid password');
	}
	else
	{
		hideMessage('password-error');
	}
	if (form === 'signup' && formData.password !== formData.confPass)
	{
		valid = false;
		showMessage('conf-password-error', 'Invalid password confirmation');
	}
	else
	{
		hideMessage('conf-password-error');
	}
	return (valid);
}

function validateUsername(username)
{
	const pattern =/^(?!ft_)[a-zA-Z0-9._%+-]{1,8}$/;

	return (pattern.test(username));
}

function validateEmail(email, form)
{
	if (form === 'login')
		return (true);

	const pattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;

	return (pattern.test(email));
}

function validatePass(password)
{
	const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}/;

	return (pattern.test(password));
}

function showMessage(id, message)
{
	const elementMsg = document.getElementById(id);
	
	if (elementMsg)
	{
		elementMsg.textContent = message;
		elementMsg.style.display = 'block';
	}
}

function hideMessage(id)
{
	const message = document.getElementById(id);

	if (message)
	{
		message.style.display = 'none';
	}
}

window.showMessage = showMessage;
window.hideMessage = hideMessage;
window.validateUsername = validateUsername;
window.validateEmail = validateEmail;
window.validatePass = validatePass;
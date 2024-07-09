function logInHandler()
{
//	This will get the login-form that we created in the main.js
	const loginForm = document.getElementById('login-form');

	if (loginForm)
	{
//	Define the behavior for when receiving an event
		loginForm.addEventListener('submit', function(event)
		{
//			Prevent the default behavior
			event.preventDefault();
//			Get the value for the email and password tags and
//			set them into a variable
			const email = document.getElementById('email').value;
			const pass = document.getElementById('password').value;
//			Validate the credentials
//			If correct, store them
			if (validateEmail(email) && validatePass(pass))
			{
				alert('Valid credentials');
//				Valid credentials
//				Check if user exists
//				If exists load home
//				loadHomeForm();
			}
//			If not, send an error message
			else
			{
				alert('Non-valid credentials');
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
		loginForm.addEventListener('submit', function(event)
		{
			event.preventDefault();

			const email = document.getElementById('email').value;
//			const username = document.getElementById('username').value;
			const pass = document.getElementById('password').value;
			if (validateEmail(email) && validatePass(pass))
			{
				alert('Valid credentials');
//				Valid credentials
//				Check if user exists
//				If they don't exist
//				Create user and load settings form
//				loadSettingsForm();
//				if they exist, send error or log them in
			}
//			If not, send an error message
			else
			{
				alert('Non-valid credentials');
			}

//			Needs to check in the front-end
		});
	}
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

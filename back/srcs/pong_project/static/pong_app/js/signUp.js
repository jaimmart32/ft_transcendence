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
		    	alert('Signup correct');
			navigateTo('/login/');
                    }
		    else
                        alert('Signup failed: ' + data.message);
                })
                .catch(error =>
		{
                    console.error('Error:', error);
                });
	    }
	    else
	    	console.log('Non-valid credentials');
        });
    }
    else
    {
        console.error('signup-form not found');
    }
}

window.signUpHandler = signUpHandler

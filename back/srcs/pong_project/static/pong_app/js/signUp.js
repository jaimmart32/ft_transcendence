//This function will be called after receiving the response from the backend
//which confirms if the credentials for the new user are correct. 
//It's purpose is to send a petition to the backend which will send the confirmation
//email. After the confirmation email is sent, the HTML will be changed so the
//received code can be entered in the correct field.
function confirmEmail(formData)
{
	fetch('/signup/email/', 
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
		if (data.status === 'success')
		{
			alert('Confirmation email sent');
			createUser(formData)
//			navigateTo('/login');
		}
		else
		{
			alert('Confirmation email could not be sent');
		}
	})
	.catch(error => 
	{
		console.error('Error: ', error);
	});
}

function createUser(formData)
{
	fetch('/signup/create-user/', 
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
			if (data.status === 'success')
			{
				alert('User created successfully!');
				navigateTo('/login');
			}
			else
			{
				alert('Could not create User');
			}
		})
		.catch(error => 
		{
			console.error('Error: ', error);
		});
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
		    	confirmEmail(formData);
//			navigateTo('/login');
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

function emailConfirmationHandler()
{
    const emailConfForm= document.getElementById('emailConf-form');

//    if (signUpForm)
}

window.signUpHandler = signUpHandler

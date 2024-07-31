document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const login42Link = document.getElementById('login42-link');

	if (loginLink)
	{
		loginLink.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/login');
		});
	}

	if (signupLink)
	{
		signupLink.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/signup');
		});
	}

	if (login42Link)
	{
		login42Link.addEventListener('click', async function(event)
		{
			event.preventDefault();
			await handleAuth();
		});
	}

	window.addEventListener('popstate', function(event)
	{
		loadPage(window.location.pathname);
	});

});

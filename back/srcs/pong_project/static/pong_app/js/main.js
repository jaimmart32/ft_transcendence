document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const login42Link = document.getElementById('login42-link');

	

//	This event listener is in charge of receiving any event regarding the 
//	browser buttons (forward/backward/refresh)
	window.addEventListener('popstate', function(event)
	{
		navigateTo(window.location.pathname);
	});

	if (loginLink)
	{
		loginLink.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/login/');
		});
	}

	if (signupLink)
	{
		signupLink.addEventListener('click', function(event)
		{
			event.preventDefault();
			navigateTo('/signup/');
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
	navigateTo(window.location.pathname);
//	monitorUrlChanges();
});

/*function monitorUrlChanges() {
    let currentPath = window.location.pathname;

    console.log('INSIDE MONITOR URL');
    setInterval(() => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            loadPage(currentPath);  // Trigger page load when URL changes
        }
    }, 100);  // Check every 100ms if the URL has changed
}

	window.addEventListener('beforeunload', function(event) {
		const token = this.localStorage.getItem('access')
		this.navigator.sendBeacon('/logout/', JSON.stringify({ easter_egg: 'Como estan los maquinas', token: token}));
	});
//	This event listener is in charge of receiving any event regarding the 
//	browser buttons (forward/backward/refresh)
	window.addEventListener('popstate', function(event)
	{
		navigateTo(window.location.pathname);
//		loadPage(window.location.pathname);
	});

	navigateTo(window.location.pathname);
	//loadPage(window.location.pathname);
});*/

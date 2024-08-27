function loadPage(url, data)
{
	console.log('INSIDE LOAD PAGE');
	if (url === '/home')
		loadHome();
	else if (url === '/login')
		loadLoginForm();
	else if (url === '/signup/')
	{
		console.log('INSIDE SIGNUP BEFORE LOAD');
		loadSignupForm();
	}
	else if (url === '/signup/email/activate/')
	{
		console.log('Activation');
		loadLoginForm();
	}
	else if (url === '/home/profile')
		loadProfile(data);
	else if (url === '/home/profile/edit')
		loadProfileSettings(data);
	else if (url === '/home/game')
		loadPlayGame();
	else if (url === '/home/friends')
		loadFriendsSection();

}

function navigateTo(url, data)
{
	console.log('INSIDE NAVIGATE TO ', url);
	window.history.pushState({}, '', url);
	loadPage(url, data);
}

window.loadPage = loadPage;
window.navigateTo = navigateTo;

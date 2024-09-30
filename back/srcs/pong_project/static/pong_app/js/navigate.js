function loadPage(url, data)
{
	if (url === '/home/')
		loadHome();
	else if (url === '/login/')
		loadLoginForm();
	else if (url === '/signup/')
		loadSignupForm();
	else if (url === '/signup/email/activate/')
		loadLoginForm();
	else if (url === '/home/profile/')
		loadProfile(data);
	else if (url === '/home/profile/edit/')
		loadProfileSettings();
	else if (url === '/home/game/')
		loadPlayGame();
	else if (url === '/home/game/local/')
		loadPlayGame();
	else if (url === '/home/game/online/')
		loadPlayGame();
	else if (url === '/home/game/tournament/')
		loadCreateTournament();
	else if (url === '/home/friends/')
		loadFriendsSection();
}

function navigateTo(url, data)
{
	window.history.pushState({}, '', url);
	loadPage(url, data);
	updateLogoutButtonVisibility();
}

window.loadPage = loadPage;
window.navigateTo = navigateTo;

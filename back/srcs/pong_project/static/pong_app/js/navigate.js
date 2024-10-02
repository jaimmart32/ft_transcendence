function loadPage(url_raw, data)
{
	url_split = url_raw.split('/') // we split the game id
	if (url_split && url_split.length > 1)
		url = '/' + url_split[1] + '/' + url_split[2] + '/'
	else
		url = url_split
	if (url_raw == '/home/')
		loadHome();
	else if (url_raw  == '/login/')
		loadLoginForm();
	else if (url_raw  == '/signup/')
		loadSignupForm();
	else if (url_raw  == '/signup/email/activate/')
		loadLoginForm();
	else if (url_raw  == '/home/profile/')
		loadProfile(data);
	else if (url_raw  == '/home/profile/edit/')
		loadProfileSettings();
	else if (url === '/home/game/')
		loadPlayGame(url_split[3]);
	else if (url === '/home/game/local/')
		loadPlayGame();
	else if (url === '/home/game/online/')
		initializeGame();
	else if (url === '/home/game/tournament/')
		loadTournamentSection();
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

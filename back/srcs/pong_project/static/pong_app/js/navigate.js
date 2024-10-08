function loadPage(url, data)
{
	console.log(url);
	//url_split = url.split('/') // we split the game id
	//if (url_split && url_split.length > 1)
	//	url = '/' + url_split[1] + '/' + url_split[2] + '/'
	//else
	//	url = url_split
	if (url == '/home/')
		loadHome();
	else if (url  == '/login/')
		loadLoginForm();
	else if (url  == '/signup/')
		loadSignupForm();
	else if (url  == '/signup/email/activate/')
		loadLoginForm();
	else if (url  == '/home/profile/')
		loadProfile(data);
	else if (url  == '/home/profile/edit/')
		loadProfileSettings();
	else if (url === '/home/game/')
		loadPlayGame();
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

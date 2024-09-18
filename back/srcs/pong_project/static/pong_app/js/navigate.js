function loadPage(url_raw, data)
{
	url = url_raw.split('?') // we split the game id
	if (url[0] === '/home/')
		loadHome();
	else if (url[0] === '/login/')
		loadLoginForm();
	else if (url[0] === '/signup/')
		loadSignupForm();
	else if (url[0] === '/signup/email/activate/')
		loadLoginForm();
	else if (url[0] === '/home/profile/')
		loadProfile(data);
	else if (url[0] === '/home/profile/edit/')
		loadProfileSettings();
	else if (url[0] === '/home/game/')
		loadPlayGame(url[1]);
	else if (url[0] === '/home/friends/')
		loadFriendsSection();
}

function navigateTo(url, data)
{
	window.history.pushState({}, '', url);
	loadPage(url, data);
//	updateLogoutButtonVisibility();
}

window.loadPage = loadPage;
window.navigateTo = navigateTo;

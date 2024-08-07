function loadPage(url, data)
{
	if (url === '/home')
		loadHome();
	else if (url === '/login')
		loadLoginForm();
	else if (url === '/signup')
		loadSignupForm();
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
	window.history.pushState({}, '', url);
	loadPage(url, data);
}

window.loadPage = loadPage;
window.navigateTo = navigateTo;
window.loadLoginForm = loadLoginForm;

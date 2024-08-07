function loadPage(url)
{
//	if (url === '/' || url === '')
//		loadHome();	
	if (url === '/home')
		loadHome();
	else if (url === '/login')
		loadLoginForm();
	else if (url === '/signup')
		loadSignupForm();
	else if (url === '/home/profile')
		loadProfile();
	else if (url === '/home/game')
		loadPlayGame();
	else if (url === '/home/friends')
		loadFriendsSection();
	else if (url === '/home/profile/edit')
		loadCreateTournament();

}

function navigateTo(url)
{
	window.history.pushState({}, '', url);
	loadPage(url);
}

window.loadPage = loadPage;
window.navigateTo = navigateTo;
window.loadLoginForm = loadLoginForm;

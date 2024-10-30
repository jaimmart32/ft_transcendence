async function createTournament(tournamentName)
{
	const token = localStorage.getItem('access');
    const uid = localStorage.getItem('userid');
	if (token)
	{
        const TournamentInfo = 
        {
            user_id: uid,
            tour_name: tournamentName,
        };
		try
		{
			const response = await fetch('/home/game/tournament/create/',
			{
				method: 'POST',
				headers:
				{
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
                body: JSON.stringify(TournamentInfo)
        	})
			const data = await response.json();
			if (data.status === 'success')
			{
                alert('Tournament created successfully! Wait until it is full.');
				navigateTo('/home/game/tournament/');
	 		}
			else
			{
                switch (data.message)
                {
					case 'A tournament with this name already exists.':
						alert('This tournament name is already taken. Please choose a different name.');
						break;
					case 'User not found.':
						alert('Your account was not found. Please log in again.');
						navigateTo('/login/');
						break;
					case 'Invalid Tournament name.':
						alert('Please enter a tournament name(between 2 and 15 characters).');
						break;
					default:
						await checkRefresh(data, '/home/game/tournament/create/', token);
				}
			}
		}
		catch(error)
		{
			notAuthorized(error);
		}
	}
	else
	{
		console.error('Error:', error);
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login/');
	}
}

window.createTournament = createTournament;

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
				initializeTournamentGame(tournamentName);
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
					case 'User is already in another tournament.':
						alert('You are already in an active tournament.');
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

async function joinTournament(tournamentName)
{
	const token = localStorage.getItem('access');
    	const uid = localStorage.getItem('userid');

	if (token)
	{
		try
		{
			const TournamentInfo = 
			{
			    tournament: tournamentName,
			    user_id: uid,
			};
			const response = await fetch('/home/game/tournament/join/checker',
			{
				method: 'POST',
				headers:
				{
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(TournamentInfo)
			});
			const data = await response.json();

			if (data.status === 'success')
			{
				alert("Joined a tournament successfully. You will join automatically when it's full.");
				initializeTournamentGame(tournamentName);
			}
			else
			{
				switch(data.message)
				{
					case 'No tournament with this name exists.':
						alert('No tournament with that name exists.');
						break;
					case 'Tournament is full!':
						alert('This tournament is full.');
						break;
					case 'User can not join another tournament!':
						alert('You can not join more than 1 tournament at a time.');
						break;
					default:
						await checkRefresh(data, '/home/game/tournament/join/checker', token);
				}
			}
		}
		catch(error)
		{
			alert("There was an error when trying to join the tournament. Try again later.");
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
window.joinTournament = joinTournament;

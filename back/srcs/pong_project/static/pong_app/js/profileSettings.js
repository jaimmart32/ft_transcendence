function loadProfileSettings(user_content)
{
        app.innerHTML = `
		<div class="container mt-2">
			    <h2>Profile Settings</h2>
			    <img src="/static/pong_app/media/user-pic.jpg" alt="Default user profile picture" width="128" height="128">
			    <form id="profile-settings">
				<!-- Username Field -->
				<div class="form-group row">
				    <label for="username" class="col-sm-2 col-form-label">Username</label>
				    <div class="col-sm-10">
					<input type="text" class="form-control" id="username" value=${user_content.username}>
		    			<span id="username-error" class="error-message"></span>
				    </div>
				</div>
				<!-- Password Field -->
				<div class="form-group row">
				    <label for="password" class="col-sm-2 col-form-label">Password</label>
				    <div class="col-sm-10">
					<input type="password" class="form-control" id="password" placeholder="*******">
		    			<span id="password-error" class="error-message"></span>
				    </div>
				</div>
				<!-- Preferred Language Field -->
				<div class="form-group row">
				    <label for="language" class="col-sm-2 col-form-label">Preferred Language</label>
				    <div class="col-sm-10">
					<select class="form-control" id="language">
					    <option>English</option>
					    <option>Spanish</option>
					    <option>French</option>
					</select>
				    </div>
				</div>
				<!-- 2FA Activation Field -->
				<div class="form-group row">
				    <label for="twofa" class="col-sm-2 col-form-label">Activate 2FA</label>
				    <div class="col-sm-10">
					<input type="checkbox" id="twofa">
				    </div>
				</div>
				<!-- Avatar Change Field -->
				<div class="form-group row">
				    <label for="avatar" class="col-sm-2 col-form-label">Change Avatar</label>
				    <div class="col-sm-10">
					<input type="file" class="form-control-file" id="avatar">
				    </div>
					<span id="file-error" class="error-message"></span>
				</div>
				<!-- Submit Button -->
				<div class="form-group row">
				    <div class="col-sm-10 offset-sm-2">
					<button id="save-changes" type="submit" class="btn btn-success">Save Changes</button>
				    </div>
				</div>
			    </form>
			</div>
			<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
			<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
		    `;
//		    I could add one more button to go back without making any changes
		    const save = document.getElementById('save-changes');
		    if (save)
		    {
		    	save.addEventListener('click', function(event)
			{
				event.preventDefault();
				updateUserInfo();
			});
		    }
}

function updateUserInfo()
{
//	event.preventDefault();

	const token = localStorage.getItem('access');

	if (token)
	{
		username = document.getElementById('username').value;
		password = document.getElementById('password').value;
		twofa = document.getElementById('twofa').value;
		const form = document.getElementById('profile-settings');
		const formData = new FormData(form);


//			lang: document.getElementById('lang').value,

		const userPic = document.getElementById('avatar').files[0];
		if (userPic)
		{
			formData.append('avatar', userPic);
		}
		const userDict =
		{
			username: username,
			password: password,
			twofa: twofa,
		};
//		Need to check the input, to see if everything is correct
		if (validateInput(userDict, 'edit'))
		{
			console.log(JSON.stringify(userDict));
			fetch('/home/profile/edit/',
			{
				method: 'PUT',
				headers:
				{
					'Authorization': `Bearer ${token}`,
//					'Content-Type': 'application/json'
				},
//				body: JSON.stringify(userDict)
				body: formData
			})
			.then(response => response.json())
			.then(data =>
			{
				if (data.status === 'success')
				{
					alert('Info updated correctly!');
					navigateTo('/home/profile', userDict);
				}
				else
				{
					if (data.message === 'Username in use')
					{
						showMessage('username-error', 'Username already in use');
					}
					else if(data.message === 'File is empty')
						showMessage('file-error', 'File is empty');
					else
						alert('An error ocurred, try later');
				}
			})
			.catch(error =>
			{
				console.log('Inside the error')
				console.error('Error:', error);
				alert('Access denied');
			});
		}
		else
		{
			loadProfileSettings(userDict);
		}
	}
	else
	{
		alert('You are not authorized to view this page. Please log in.');
		navigateTo('/login');
	}
}

window.loadProfileSettings = loadProfileSettings;

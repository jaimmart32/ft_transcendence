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
				    </div>
				</div>
				<!-- Email Field -->
				<div class="form-group row">
				    <label for="email" class="col-sm-2 col-form-label">Email</label>
				    <div class="col-sm-10">
					<input type="email" class="form-control" id="email" value=${user_content.email}>
				    </div>
				</div>
				<!-- Password Field -->
				<div class="form-group row">
				    <label for="password" class="col-sm-2 col-form-label">Password</label>
				    <div class="col-sm-10">
					<input type="password" class="form-control" id="password" placeholder="*******">
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
		    document.getElementById('save-changes').addEventListener('click', updateUserInfo);
}

function updateUserInfo()
{
	event.preventDefault();

	const token = localStorage.getItem('access');

	if (token)
	{
		const userInfo =
		{
			username: document.getElementById('username').value,
			email: document.getElementById('email').value,
			password: document.getElementById('password').value,
			twofa: document.getElementById('twofa').value,
//			lang: document.getElementById('lang').value,
		};

//		Need to check the input, to see if everything is correct
		if (!validateUsername(userInfo.username) || !validateEmail(userInfo.email) 
			|| (!validatePass(userInfo.password) && userInfo.password.length > 0))
		{
			alert('Wrong credentials');
			loadProfileSettings();
			return;
		}

		fetch('/home/profile/edit/',
		{
			method: 'PUT',
			headers:
			{
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userInfo)
		})
		.then(response => response.json())
		.then(data =>
		{
			if (data.status === 'success')
			{
				alert('Info updated correctly!');
				loadProfile();
			}
			else
			{
				console.log('Inside the else for data')
				console.log(data.status)
				console.log(data.message)
				if (data.message === 'Username in use')
					alert('This username is already in use, try another one');
				else if (data.message === 'Email in use')
					alert('This email is already in use, try another one');
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
		alert('You are not authorized to view this page. Please log in.');
		loadLoginForm();
	}
}

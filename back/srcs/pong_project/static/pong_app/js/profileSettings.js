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
    const token = localStorage.getItem('access');

    if (token) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const twofa = document.getElementById('twofa').checked ? 'on' : 'off';
        const userPic = document.getElementById('avatar').files[0];


        const userDict = {
            username: username,
            password: password,
            twofa: twofa,
        };

        if (userPic) {
            // Crear un lector para convertir la imagen a base64
            const reader = new FileReader();
            reader.readAsDataURL(userPic);

            reader.onloadend = function () {
                userDict.avatar = reader.result;// Convertido a base64

                sendUserData(userDict, token);
            };
        } else {
            sendUserData(userDict, token);
        }
    } else {
        alert('You are not authorized to view this page. Please log in.');
        navigateTo('/login/');
    }
}

function sendUserData(userDict, token)
{
    fetch('/home/profile/edit/', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDict)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Info updated correctly!');
            navigateTo('/home/profile/', userDict);
        } else {
            if (data.message) {
                if (data.message.includes('file')) {
                    showMessage('file-error', data.message);
                }
            }
            console.error(data.message);
        }
    })
    .catch(error => {
        console.log('Inside the error');
        console.error('Error:', error);
        alert('Access denied');
    });
}

window.loadProfileSettings = loadProfileSettings;

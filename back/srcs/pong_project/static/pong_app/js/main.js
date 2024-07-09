document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');

    // Load login form on clicking "Login" link
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadLoginForm();
    });

    // Load signup form on clicking "Sign Up" link
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadSignupForm();
    });

//	HTML for the Login page
    function loadLoginForm() {
        app.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="email">Email address</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        `;
	logInHandler();
    }

//	HTML for the SignUp page
    function loadSignupForm() {
        app.innerHTML = `
            <h2>Sign Up</h2>
            <form id="signup-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label for="email">Email address</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
            </form>
        `;
	signUpHandler();
//	loadSettingsForm();
    }

    function loadHomeForm()
    {
    	app.innerHTML = `
	    <h2>Home</h2>
    	`
    }
});


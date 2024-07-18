document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const ftLink = document.getElementById('ft-link');

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

    ftLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadLoginFortyTwo();
    });

// https://auth.42.fr/auth/realms/students-42/protocol/openid-connect/auth?client_id=intra&redirect_uri=https%3A%2F%2Fprofile.intra.42.fr%2Fusers%2Fauth%2Fkeycloak_student%2Fcallback&response_type=code&state=a8705ac808202be0d9cf4986f6e834e63df9a5d738f3d8da

//	HTML for the Login page
    function loadLoginForm() {
        app.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="username" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
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
    }

    function loadLoginFortyTwo() {
        app.innerHTML = `
            <h2>Login</h2>
            <a href='https://auth.42.fr/auth/realms/students-42/protocol/openid-connect/auth?client_id=intra&redirect_uri=https%3A%2F%2Fprofile.intra.42.fr%2Fusers%2Fauth%2Fkeycloak_student%2Fcallback&response_type=code&state=a8705ac808202be0d9cf4986f6e834e63df9a5d738f3d8da'>Login with 42</a>
        `;
	logInHandler();
    }


    function loadPlayGame() {
        app.innerHTML = `
            <h2>Play Game</h2>
            <p>Get ready to play a game of Pong!</p>
            <!-- Add game play content here -->
            <button class="btn btn-secondary" id="back-to-home">Back to Home</button>
        `;
        document.getElementById('back-to-home').addEventListener('click', loadHome);
    }

    function loadFriendsSection() {
        app.innerHTML = `
            <h2>Friends</h2>
            <p>Manage your friends here.</p>
            <!-- Add friends management content here -->
            <button class="btn btn-secondary" id="back-to-home">Back to Home</button>
        `;
        document.getElementById('back-to-home').addEventListener('click', loadHome);
    }

    function loadCreateTournament() {
        app.innerHTML = `
            <h2>Create Tournament</h2>
            <p>Create a new tournament.</p>
            <!-- Add tournament creation form or content here -->
            <button class="btn btn-secondary" id="back-to-home">Back to Home</button>
        `;
        document.getElementById('back-to-home').addEventListener('click', loadHome);
    }

    window.loadProfileSettings = loadProfileSettings;
    window.loadProfile = loadProfile;
    window.loadPlayGame = loadPlayGame;
    window.loadFriendsSection = loadFriendsSection;
    window.loadCreateTournament = loadCreateTournament;
    window.loadLoginForm = loadLoginForm;
    window.loadSignupForm = loadSignupForm;
});


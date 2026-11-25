// Simple demo account handling for LocalVibe.

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const account = {
            name: document.getElementById("signup-name").value.trim(),
            email: document.getElementById("signup-email").value.trim(),
            password: password
        };

        let accounts = JSON.parse(localStorage.getItem("localVibeAccounts")) || [];

        const alreadyExists = accounts.some(function(user) {
            return user.email === account.email;
        });

        if (alreadyExists) {
            alert("This email is already registered.");
            return;
        }

        accounts.push(account);
        localStorage.setItem("localVibeAccounts", JSON.stringify(accounts));

        alert("Account created. Please sign in.");
        window.location.href = "signin.html";
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("userId").value.trim();
        const password = document.getElementById("password").value;
        const accounts = JSON.parse(localStorage.getItem("localVibeAccounts")) || [];

        const user = accounts.find(function(account) {
            return account.email === email && account.password === password;
        });

        if (!user) {
            alert("Incorrect email or password. Please register first.");
            return;
        }

        sessionStorage.setItem("localVibeUser", JSON.stringify({
            name: user.name,
            email: user.email
        }));

        window.location.href = "profile.html";
    });
}

const profileName = document.getElementById("userName");

if (profileName) {
    const user = JSON.parse(sessionStorage.getItem("localVibeUser"));

    if (!user) {
        window.location.href = "signin.html";
    } else {
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userAvatar").textContent = user.name.charAt(0).toUpperCase();
        document.getElementById("fullName").textContent = user.name;
        document.getElementById("email").textContent = user.email;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cartCount").textContent = cart.length;

        document.getElementById("logoutButton").addEventListener("click", function() {
            sessionStorage.removeItem("localVibeUser");
        });
    }
}
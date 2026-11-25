// LocalVibe frontend demo account handling.
// Browser storage is used only for this classroom demo, not real secure accounts.

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;

        if (password !== confirm) {
            alert("Passwords do not match.");
            return;
        }

        const account = {
            name: document.getElementById("signup-name").value.trim(),
            email: document.getElementById("signup-email").value.trim(),
            password: password,
            phone: document.getElementById("signup-phone").value.trim(),
            address: document.getElementById("signup-address").value.trim()
        };

        const accounts = JSON.parse(localStorage.getItem("localVibeAccounts")) || [];
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

        const account = accounts.find(function(item) {
            return item.email === email && item.password === password;
        });

        if (!account) {
            alert("Account not found. Please create an account first.");
            return;
        }

        const loggedInUser = {
            name: account.name,
            email: account.email,
            phone: account.phone,
            address: account.address
        };

        sessionStorage.setItem("localVibeLoggedInUser", JSON.stringify(loggedInUser));
        window.location.href = "profile.html";
    });
}

const profilePage = document.getElementById("sideName");

if (profilePage) {
    const user = JSON.parse(sessionStorage.getItem("localVibeLoggedInUser"));

    if (!user) {
        window.location.href = "signin.html";
    } else {
        document.getElementById("sideName").textContent = user.name;
        document.getElementById("sideEmail").textContent = user.email;
        document.getElementById("avatar").textContent = user.name.charAt(0).toUpperCase();
        document.getElementById("fullName").textContent = user.name;
        document.getElementById("email").textContent = user.email;
        document.getElementById("phone").textContent = user.phone || "Not provided";
        document.getElementById("address").textContent = user.address || "Not provided";

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cartCount").textContent = cart.length;
    }

    document.getElementById("logout").addEventListener("click", function(event) {
        event.preventDefault();
        sessionStorage.removeItem("localVibeLoggedInUser");
        window.location.href = "signin.html";
    });
}
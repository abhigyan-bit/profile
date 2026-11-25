// Customer account, sign-in and profile page.

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("loginForm");

// Create a customer account.
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

        const exists = accounts.some(function(user) {
            return user.email === account.email;
        });

        if (exists) {
            alert("This email is already registered.");
            return;
        }

        accounts.push(account);
        localStorage.setItem("localVibeAccounts", JSON.stringify(accounts));

        alert("Account created. Please sign in.");
        window.location.href = "signin.html";
    });
}

// Customer sign-in.
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

        sessionStorage.setItem("localVibeUser", JSON.stringify(user));
        window.location.href = "profile.html";
    });
}

// Show the details of the signed-in customer.
const profilePage = document.getElementById("sideName");

if (profilePage) {
    const user = JSON.parse(sessionStorage.getItem("localVibeUser"));

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
        const orders = JSON.parse(localStorage.getItem("localVibeOrders")) || [];

        document.getElementById("cartCount").textContent = cart.length;
        document.getElementById("orderCount").textContent = orders.length;

        const recentOrders = document.getElementById("recentOrders");

        if (orders.length > 0) {
            recentOrders.innerHTML = "";

            orders.slice(-3).reverse().forEach(function(order) {
                const orderLine = document.createElement("p");
                orderLine.className = "muted";
                orderLine.textContent = "Order #" + order.id + " - " + (order.status || "Placed");
                recentOrders.appendChild(orderLine);
            });
        }

        document.getElementById("logout").addEventListener("click", function() {
            sessionStorage.removeItem("localVibeUser");
        });
    }
}
 
// Vendor registration.
const vendorSignupForm = document.getElementById("vendorSignupForm");

if (vendorSignupForm) {
    vendorSignupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const vendor = {
            storeName: document.getElementById("storeName").value.trim(),
            name: document.getElementById("vendorName").value.trim(),
            email: document.getElementById("newVendorEmail").value.trim(),
            phone: document.getElementById("vendorPhone").value.trim(),
            location: document.getElementById("vendorLocation").value.trim(),
            password: document.getElementById("newVendorPassword").value
        };

        const vendors = JSON.parse(localStorage.getItem("localVibeVendors")) || [];
        const alreadyRegistered = vendors.some(function(item) {
            return item.email === vendor.email;
        });

        if (alreadyRegistered) {
            alert("A vendor account with this email already exists.");
            return;
        }

        vendors.push(vendor);
        localStorage.setItem("localVibeVendors", JSON.stringify(vendors));

        alert("Vendor account created. Please sign in.");
        window.location.href = "vendor_signin.html";
    });
}

// Vendor sign-in.
const vendorLoginForm = document.getElementById("vendorLoginForm");

if (vendorLoginForm) {
    vendorLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("vendorEmail").value.trim();
        const password = document.getElementById("vendorPassword").value;
        const vendors = JSON.parse(localStorage.getItem("localVibeVendors")) || [];

        const vendor = vendors.find(function(item) {
            return item.email === email && item.password === password;
        });

        if (!vendor) {
            alert("Vendor account not found. Please register first.");
            return;
        }

        sessionStorage.setItem("localVibeVendor", JSON.stringify(vendor));
        window.location.href = "vendorsdashboard.html";
    });
}

const vendorHeading = document.getElementById("vendorWelcome");
if (vendorHeading) {
    const activeVendor = JSON.parse(sessionStorage.getItem("localVibeVendor"));
    if (!activeVendor) {
        window.location.href = "vendor_signin.html";
    } else {
        vendorHeading.textContent = "Welcome, " + activeVendor.storeName + "!";
    }
}

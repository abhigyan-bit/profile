// LocalVibe website JavaScript
// This is a simple frontend demo. Data is saved in the browser.

function getData(key, defaultValue) {
    let savedData = localStorage.getItem(key);

    if (savedData) {
        return JSON.parse(savedData);
    }

    return defaultValue;
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function getCustomer() {
    return getData("lvCustomer", null);
}

function getCart() {
    return getData("lvCart", []);
}

function getOrders() {
    return getData("lvOrders", []);
}

function getProducts() {
    let defaultProducts = [
        {
            id: 1,
            name: "Handmade Ceramic Cup",
            category: "Home",
            description: "A simple handmade cup for everyday use.",
            specs: "Ceramic - 250 ml",
            price: 299,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600"
        },
        {
            id: 2,
            name: "Natural Skincare Set",
            category: "Beauty",
            description: "A gentle daily skincare gift set.",
            specs: "Handmade - Set of 3",
            price: 499,
            image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
        },
        {
            id: 3,
            name: "Cotton Tote Bag",
            category: "Accessories",
            description: "Reusable tote bag made by local makers.",
            specs: "Cotton - Reusable",
            price: 249,
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"
        }
    ];

    return getData("lvProducts", defaultProducts);
}

// Customer registration
let customerRegisterForm = document.getElementById("customerRegister");

if (customerRegisterForm) {
    customerRegisterForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let customerDetails = {
            name: document.getElementById("cName").value,
            email: document.getElementById("cEmail").value,
            phone: document.getElementById("cPhone").value,
            address: document.getElementById("cAddress").value,
            password: document.getElementById("cPassword").value
        };

        saveData("lvCustomer", customerDetails);
        window.location.href = "customer-dashboard.html";
    });
}

// Customer login
let customerLoginForm = document.getElementById("customerLogin");

if (customerLoginForm) {
    customerLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let customer = getCustomer();
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        if (customer && customer.email === email && customer.password === password) {
            window.location.href = "customer-dashboard.html";
        } else {
            alert("Account not found. Please register first.");
        }
    });
}

// Vendor registration
let vendorRegisterForm = document.getElementById("vendorRegister");

if (vendorRegisterForm) {
    vendorRegisterForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let vendorDetails = {
            name: document.getElementById("vName").value,
            store: document.getElementById("vStore").value,
            email: document.getElementById("vEmail").value,
            phone: document.getElementById("vPhone").value,
            address: document.getElementById("vAddress").value,
            password: document.getElementById("vPassword").value
        };

        saveData("lvVendor", vendorDetails);
        window.location.href = "vendor-dashboard.html";
    });
}

// Vendor login
let vendorLoginForm = document.getElementById("vendorLogin");

if (vendorLoginForm) {
    vendorLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let vendor = getData("lvVendor", null);
        let email = document.getElementById("vLoginEmail").value;
        let password = document.getElementById("vLoginPassword").value;

        if (vendor && vendor.email === email && vendor.password === password) {
            window.location.href = "vendor-dashboard.html";
        } else {
            alert("Vendor account not found. Please register first.");
        }
    });
}

// Show products on the shop page
let productList = document.getElementById("productList");

if (productList) {
    let allProducts = getProducts();
    let productHTML = "";

    allProducts.forEach(function(product) {
        productHTML += `
            <article class="panel product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <span class="eyebrow">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="muted">${product.specs || ""}</p>
                    <div class="price">${showPrice(product.price)}</div>
                    <button class="btn full" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </article>
        `;
    });

    productList.innerHTML = productHTML;
}

// Add product to cart
function addToCart(productId) {
    let cartItems = getCart();
    let selectedProduct = getProducts().find(function(product) {
        return product.id === productId;
    });

    let alreadyInCart = cartItems.find(function(item) {
        return item.id === productId;
    });

    if (alreadyInCart) {
        alreadyInCart.qty = alreadyInCart.qty + 1;
    } else if (selectedProduct) {
        selectedProduct.qty = 1;
        cartItems.push(selectedProduct);
    }

    saveData("lvCart", cartItems);
    alert("Product added to cart!");
}

// Display cart items
let cartItemsBox = document.getElementById("cartItems");

if (cartItemsBox) {
    let cartItems = getCart();
    let cartHTML = "";
    let subtotal = 0;

    if (cartItems.length === 0) {
        cartHTML = '<p>Your cart is empty. <a class="text-link" href="shop.html">Explore products</a></p>';
    } else {
        cartItems.forEach(function(item) {
            subtotal = subtotal + item.price * item.qty;

            cartHTML += `
                <div class="cart-row">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <b>${item.name}</b>
                        <p class="muted">${item.specs || ""}</p>
                        <b>${showPrice(item.price)} x ${item.qty}</b>
                    </div>
                    <button class="side-link" onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            `;
        });
    }

    cartItemsBox.innerHTML = cartHTML;

    let delivery = subtotal > 0 ? 40 : 0;

    document.getElementById("subtotal").textContent = showPrice(subtotal);
    document.getElementById("delivery").textContent = showPrice(delivery);
    document.getElementById("total").textContent = showPrice(subtotal + delivery);
}

// Remove item from cart
function removeFromCart(productId) {
    let cartItems = getCart();

    cartItems = cartItems.filter(function(item) {
        return item.id !== productId;
    });

    saveData("lvCart", cartItems);
    window.location.reload();
}

// Place order
let placeOrderButton = document.getElementById("placeOrder");

if (placeOrderButton) {
    placeOrderButton.addEventListener("click", function() {
        let cartItems = getCart();
        let customer = getCustomer();

        if (!customer) {
            alert("Please login as a customer first.");
            window.location.href = "customer-login.html";
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        let totalAmount = 0;

        cartItems.forEach(function(item) {
            totalAmount = totalAmount + item.price * item.qty;
        });

        let newOrder = {
            id: "LV-" + Date.now().toString().slice(-6),
            items: cartItems,
            total: totalAmount + 40,
            status: "Order Placed",
            date: new Date().toLocaleDateString()
        };

        let oldOrders = getOrders();
        oldOrders.unshift(newOrder);

        saveData("lvOrders", oldOrders);
        saveData("lvCart", []);
        saveData("lvLastOrder", newOrder);

        window.location.href = "order-success.html";
    });
}

// Show order number on confirmation page
let successOrderId = document.getElementById("successOrderId");

if (successOrderId) {
    let lastOrder = getData("lvLastOrder", null);

    if (lastOrder) {
        successOrderId.textContent = lastOrder.id;
    }
}

// Show customer profile details
let profileView = document.getElementById("profileView");

if (profileView) {
    let customer = getCustomer();

    if (!customer) {
        window.location.href = "customer-login.html";
    } else {
        document.getElementById("profileInitial").textContent =
            customer.name.charAt(0).toUpperCase();

        document.getElementById("profileSideName").textContent = customer.name;
        document.getElementById("profileSideEmail").textContent = customer.email;
        document.getElementById("profileWelcome").textContent = customer.name;

        profileView.innerHTML = `
            <div><span>Full Name</span><b>${customer.name}</b></div>
            <div><span>Email</span><b>${customer.email}</b></div>
            <div><span>Phone</span><b>${customer.phone}</b></div>
            <div><span>Address</span><b>${customer.address}</b></div>
        `;

        let cartCount = getCart().reduce(function(total, item) {
            return total + item.qty;
        }, 0);

        document.getElementById("cartCount").textContent = cartCount;
        document.getElementById("orderCount").textContent = getOrders().length;

        let allOrders = getOrders();

        if (allOrders.length > 0) {
            document.getElementById("recentOrders").textContent =
                allOrders[0].id + " - " + allOrders[0].status;
        }

        document.getElementById("editName").value = customer.name;
        document.getElementById("editEmail").value = customer.email;
        document.getElementById("editPhone").value = customer.phone;
        document.getElementById("editAddress").value = customer.address;
    }
}

// Open edit profile form
let editProfileButton = document.getElementById("editProfileBtn");

if (editProfileButton) {
    editProfileButton.addEventListener("click", function() {
        document.getElementById("editProfileForm").classList.toggle("hidden");
    });
}

// Save edited profile details
let editProfileForm = document.getElementById("editProfileForm");

if (editProfileForm) {
    editProfileForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let customer = getCustomer();

        customer.name = document.getElementById("editName").value;
        customer.email = document.getElementById("editEmail").value;
        customer.phone = document.getElementById("editPhone").value;
        customer.address = document.getElementById("editAddress").value;

        saveData("lvCustomer", customer);
        alert("Profile updated!");
        window.location.reload();
    });
}

// Customer logout
let logoutButton = document.getElementById("logoutCustomer");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("lvCustomer");
        window.location.href = "index.html";
    });
}

// Show customer orders
let ordersList = document.getElementById("ordersList");

if (ordersList) {
    let allOrders = getOrders();

    if (allOrders.length === 0) {
        ordersList.innerHTML =
            '<p>No orders yet. <a class="text-link" href="shop.html">Start shopping</a></p>';
    } else {
        let orderHTML = "";

        allOrders.forEach(function(order) {
            orderHTML += `
                <div class="cart-row">
                    <div>
                        <b>${order.id}</b>
                        <p class="muted">${order.date} - ${order.status}</p>
                    </div>
                    <b>${showPrice(order.total)}</b>
                    <a class="text-link" href="track-order.html">Track</a>
                </div>
            `;
        });

        ordersList.innerHTML = orderHTML;
    }
}

// Track an order
let trackButton = document.getElementById("trackButton");

if (trackButton) {
    trackButton.addEventListener("click", function() {
        let orderId = document.getElementById("trackId").value.trim();
        let allOrders = getOrders();

        let foundOrder = allOrders.find(function(order) {
            return order.id === orderId;
        });

        let trackingBox = document.getElementById("trackingResult");
        trackingBox.classList.remove("hidden");

        if (foundOrder) {
            trackingBox.innerHTML = `
                <b>Order ${foundOrder.id}</b>
                <ol>
                    <li>✓ Order Placed</li>
                    <li>○ Order Confirmed</li>
                    <li>○ Shipped</li>
                    <li>○ Out for Delivery</li>
                    <li>○ Delivered</li>
                </ol>
                <p class="muted">This is a sample order tracking page.</p>
            `;
        } else {
            trackingBox.textContent = "Order not found. Please check the Order ID.";
        }
    });
}

// Show customer name on dashboard
let customerWelcome = document.getElementById("customerWelcome");

if (customerWelcome) {
    let customer = getCustomer();

    if (customer) {
        customerWelcome.textContent = "Welcome, " + customer.name;
    }
}

// Add a new product from vendor dashboard
let productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let allProducts = getProducts();

        let newProduct = {
            id: Date.now(),
            name: document.getElementById("productName").value,
            category: document.getElementById("productCategory").value,
            description: document.getElementById("productDescription").value,
            specs: document.getElementById("productSpecs").value,
            price: Number(document.getElementById("productPrice").value),
            image: document.getElementById("productImage").value ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        };

        allProducts.unshift(newProduct);
        saveData("lvProducts", allProducts);

        alert("Product added to your store!");
        window.location.reload();
    });
}

// Show vendor details and products
let vendorProductsBox = document.getElementById("vendorProducts");

if (vendorProductsBox) {
    let vendor = getData("lvVendor", null);

    if (vendor) {
        document.getElementById("vendorWelcome").textContent =
            "Welcome, " + vendor.store;
    }

    let allProducts = getProducts();
    let vendorProducts = allProducts.filter(function(product) {
        return product.id > 3;
    });

    document.getElementById("vendorProductCount").textContent =
        vendorProducts.length;

    if (vendorProducts.length > 0) {
        let vendorHTML = "";

        vendorProducts.forEach(function(product) {
            vendorHTML += `
                <p>
                    <b>${product.name}</b> -
                    ${showPrice(product.price)}
                </p>
            `;
        });

        vendorProductsBox.innerHTML = vendorHTML;
    } else {
        vendorProductsBox.innerHTML =
            '<p class="muted">Your added products will appear here.</p>';
    }
}

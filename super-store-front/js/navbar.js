// js/navbar.js
async function updateCartSummary() {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartSummary = document.getElementById("cartSummary");
    if (!user || !cartSummary) return;

    try {
        const response = await fetch(
            `http://192.168.100.2:3308/cart/${user.iduser}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const cart = await response.json();
        cartSummary.innerHTML = "";
        cartSummary.style.padding = "10px";
        cartSummary.style.borderRadius = "8px";
        cartSummary.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        cartSummary.style.backgroundColor = "#fff";

        if (!cart.items || cart.items.length === 0) {
            cartSummary.innerHTML =
                '<li class="dropdown-item" style="color: #1a3c34;">El carrito está vacío</li>';
        } else {
            cart.items.forEach((item) => {
                cartSummary.innerHTML += `
                    <li class="dropdown-item" style="color: #1a3c34;">
                        ${item.productname} <span style="background-color: #1a3c34; color: white; padding: 2px 6px; border-radius: 4px;">[${item.quantity}]</span>
                    </li>
                `;
            });
            cartSummary.innerHTML +=
                '<li><hr class="dropdown-divider" style="margin: 8px 0;"></li>';
            cartSummary.innerHTML += `
                <li>
                    <a class="btn d-block text-center" href="/cart.php" 
                       style="background-color: #1a3c34; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold;">
                        <i class="bi bi-cart-fill"></i> Ver Carrito
                    </a>
                </li>
            `;
        }
    } catch (error) {
        cartSummary.innerHTML =
            '<li class="dropdown-item" style="color: #1a3c34;">Error al cargar carrito</li>';
        console.error("Error al actualizar resumen del carrito:", error);
    }
}

function updateUserSummary() {
    const userSummary = document.getElementById("userSummary");
    if (!userSummary) return;

    userSummary.innerHTML = "";
    userSummary.style.padding = "10px";
    userSummary.style.borderRadius = "8px";
    userSummary.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
    userSummary.style.backgroundColor = "#fff";

    userSummary.innerHTML = `
        <li>
            <a class="btn d-block text-center mb-2" href="/edit_profile.php" 
               style="background-color: #2a5d53; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold;">
                <i class="bi bi-pencil-square"></i> Editar Perfil
            </a>
        </li>
        <li>
            <a class="btn d-block text-center" href="/logout.php" 
               style="background-color: #d9534f; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold;">
                <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
            </a>
        </li>
    `;

    const user = JSON.parse(localStorage.getItem("user"));
    const userDropdownContainer = document.getElementById(
        "userDropdownContainer"
    );
    const cartDropdownContainer = document.getElementById(
        "cartDropdownContainer"
    );
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const dynamicNav = document.getElementById("dynamicNav");

    if (user) {
        document.getElementById("username").textContent = user.username;
        userDropdownContainer.style.display = "block";
        if (user.isAdmin) {
            dynamicNav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/admin.php" style="color: #1a3c34;">Panel de Administración</a>
                </li>
            `;
            cartDropdownContainer.style.display = "none"; // Admin no necesita carrito
        } else {
            cartDropdownContainer.style.display = "block";
            loginLink.style.display = "none";
            registerLink.style.display = "none";
            dynamicNav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/products.php" style="color: #1a3c34;">Productos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/orders.php" style="color: #1a3c34;">Mis Órdenes</a>
                </li>
            `;
            if (typeof updateCartSummary === "function") {
                updateCartSummary(); // Llamada única para usuarios no admin
            }
        }
    } else {
        userDropdownContainer.style.display = "none";
        cartDropdownContainer.style.display = "none";
        loginLink.style.display = "block";
        registerLink.style.display = "block";
        dynamicNav.innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        updateUserSummary(); // Llamamos solo a updateUserSummary, que manejará todo
    }
});

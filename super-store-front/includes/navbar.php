<?php
// No necesitamos session_start()
?>
<nav class="navbar navbar-expand-lg navbar-light" style="background-color: #f5f5dc;">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="/index.php" style="color: #1a3c34;">Super Store</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto" id="dynamicNav">
                <!-- Enlaces dinámicos se llenan con JS -->
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item dropdown" id="cartDropdownContainer" style="display: none;">
                    <a class="nav-link dropdown-toggle" href="#" id="cartDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: #1a3c34;">
                        <i class="bi bi-cart"></i> Carrito
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown" id="cartSummary">
                        <li class="dropdown-item">Cargando...</li>
                    </ul>
                </li>
                <li class="nav-item dropdown" id="userDropdownContainer" style="display: none;">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: #1a3c34;">
                        <i class="bi bi-person"></i> <span id="username"></span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" id="userSummary">
                        <li class="dropdown-item">Cargando...</li>
                    </ul>
                </li>
                <li class="nav-item" id="loginLink" style="display: none;">
                    <a class="nav-link" href="/auth/login.php" style="color: #1a3c34;">Iniciar Sesión</a>
                </li>
                <li class="nav-item" id="registerLink" style="display: none;">
                    <a class="nav-link" href="/auth/register.php" style="color: #1a3c34;">Registrarse</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<script>
    const user = JSON.parse(localStorage.getItem('user'));
    const userDropdownContainer = document.getElementById('userDropdownContainer');
    const cartDropdownContainer = document.getElementById('cartDropdownContainer');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dynamicNav = document.getElementById('dynamicNav');

    if (user) {
        document.getElementById('username').textContent = user.username;
        userDropdownContainer.style.display = 'block';
        if (user.isAdmin) {
            dynamicNav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/admin.php" style="color: #1a3c34;">Panel de Administración</a>
                </li>
            `;
            cartDropdownContainer.style.display = 'none'; // Admin no necesita carrito
        } else {
            cartDropdownContainer.style.display = 'block';
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            dynamicNav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/products.php" style="color: #1a3c34;">Productos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/orders.php" style="color: #1a3c34;">Mis Órdenes</a>
                </li>
            `;
        }
        if (typeof updateCartSummary === 'function' && !user.isAdmin) {
            updateCartSummary();
        }
        if (typeof updateUserSummary === 'function') {
            updateUserSummary();
        }
    } else {
        userDropdownContainer.style.display = 'none';
        cartDropdownContainer.style.display = 'none';
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        dynamicNav.innerHTML = '';
    }
</script>
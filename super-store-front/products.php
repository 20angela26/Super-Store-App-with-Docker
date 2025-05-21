<?php
// No necesitamos session_start() aquí porque usaremos localStorage en el cliente
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos - Super Store</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Productos</h2>
        <div class="row mb-3">
            <div class="col-md-4">
                <input type="text" id="searchInput" class="form-control" placeholder="Buscar por nombre">
            </div>
            <div class="col-md-4">
                <select id="categorySelect" class="form-select">
                    <option value="">Todas las categorías</option>
                </select>
            </div>
            <div class="col-md-4">
                <select id="subcategorySelect" class="form-select">
                    <option value="">Todas las subcategorías</option>
                </select>
            </div>
        </div>
        <div class="row" id="productsContainer"></div>
    </div>

    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Super Store</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body"></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/navbar.js"></script>
    <script src="/js/products.js"></script>
    <script src="/js/cart.js"></script>
    <script>
        // Verificar autenticación en el cliente
        if (!localStorage.getItem('user')) {
            window.location.href = '/auth/login.php';
        }
    </script>
</body>
</html>
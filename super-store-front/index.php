<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Store</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    <div class="container-fluid py-5" style="background: linear-gradient(to bottom, #f5f5f5, #e0e0e0); min-height: 100vh;">
        <div class="container text-center">
            <h1 class="display-3 fw-bold mb-3">Super Store</h1>
            <h3 class="text-muted mb-4" style="font-style: italic;">Tu tienda en línea favorita</h3>
            <p class="lead mb-5" style="max-width: 600px; margin: 0 auto;">
                Explora una amplia variedad de productos de alta calidad, desde moda hasta tecnología. 
                Compra fácil, rápido y seguro con Super Store.
            </p>
            <a href="/products.php" class="btn btn-lg btn-custom">Comenzar a Comprar</a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/navbar.js"></script>
</body>
</html>
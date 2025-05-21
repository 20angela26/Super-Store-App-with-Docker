<?php
// No necesitamos session_start()
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito - Super Store</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Tu Carrito</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="cart-items"></tbody>
        </table>
        <div class="text-end mt-3">
            <div id="cart-summary" class="mb-3">
                <p id="subtotal">Subtotal: $0</p>
                <p id="discount-total" class="text-success">Descuento Total: $0</p>
                <h4 id="total">Total: $0</h4>
            </div>
            <button class="btn" style="background-color: #1a3c34; color: white;" onclick="confirmOrder()">Confirmar Carrito</button>
        </div>
    </div>

    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">Confirmar Orden</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Resumen de tu orden:</h5>
                    <div class="mb-3">
                        <label for="shipmode" class="form-label">Modo de Envío</label>
                        <select id="shipmode" class="form-select">
                            <option value="Standard">Standard Class</option>
                            <option value="First Class">First Class</option>
                            <option value="Second Class">Second Class</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="shipping-address" class="form-label">Dirección de Envío</label>
                        <input type="text" class="form-control" id="shipping-address" placeholder="Ingresa la dirección de envío">
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="modal-cart-summary"></tbody>
                    </table>
                    <div id="modal-order-summary" class="mt-3">
                        <p id="modal-subtotal">Subtotal: $0</p>
                        <p id="modal-discount" class="text-success">Descuento Total: $0</p>
                        <h4 id="modal-total">Total: $0</h4>
                        <p><strong>Modo de Envío:</strong> <span id="modal-shipmode">No seleccionado</span></p>
                        <p><strong>Fecha Estimada de Envío:</strong> <span id="modal-shipdate">No especificada</span></p>
                        <p><strong>Dirección de Envío:</strong> <span id="modal-address">No especificada</span></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn" style="background-color: #1a3c34; color: white;" onclick="processOrder()">
                        <i class="bi bi-check-circle"></i> Procesar Orden
                    </button>
                </div>
            </div>
        </div>
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
    <script src="/js/cart.js"></script>
    <script>
    if (!localStorage.getItem('user')) {
        window.location.href = '/auth/login.php';
    }
    </script>
</body>
</html>
```php
<?php
// Nota: No usamos session_start() porque la autenticación se maneja con localStorage
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Super Store</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        .sort-arrow { cursor: pointer; margin-left: 5px; }
        .filter-input { width: 100%; margin-top: 5px; padding: 2px 5px; font-size: 0.9em; }
        th { vertical-align: middle; }
        .action-btn-group .btn {
            margin: 0 2px; /* Espacio entre botones */
            padding: 5px 10px; /* Tamaño más compacto */
            border: none; /* Sin bordes para un look limpio */
            background-color: rgb(248, 248, 248); /* Gris claro por defecto */
            color: #333; /* Texto oscuro para contraste */
            transition: background-color 0.2s; /* Transición suave */
        }
        .action-btn-group .btn:hover {
            background-color: #1a3c34; /* Verde oscuro al pasar el mouse */
            color: white; /* Texto blanco en hover */
        }
        .action-btn-group .btn-danger {
            background-color: rgb(248, 248, 248); /* Mismo gris claro por defecto */
        }
        .action-btn-group .btn-danger:hover {
            background-color: #dc3545; /* Rojo para eliminar */
            color: white;
        }
        .action-btn-group .btn i {
            font-size: 1.1em; /* Tamaño del ícono */
        }
        .btn-primary, .btn-create {
            background-color: #1a3c34; /* Verde oscuro para botones principales */
            color: white;
            border: none;
        }
        .btn-primary:hover, .btn-create:hover {
            background-color: #14524a; /* Verde más oscuro en hover */
            color: white;
        }
        .table-striped th, .table-striped td {
            padding: 0.75rem; /* Padding consistente con el original */
        }
        .tab-content {
            margin-top: 1rem;
        }
        .text-success {
            color: #28a745 !important; /* Verde para descuentos */
        }
    </style>
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <div class="container mt-5">
        <h2 class="text-center mb-4">Panel de Administración</h2>
        <ul class="nav nav-tabs" id="adminTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab" aria-controls="orders" aria-selected="true">Órdenes</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab" aria-controls="products" aria-selected="false">Productos</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="false">Usuarios</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="sales-analysis-tab" data-bs-toggle="tab" data-bs-target="#sales-analysis" type="button" role="tab" aria-controls="sales-analysis" aria-selected="false">Análisis de Ventas</button>
            </li>
        </ul>

        <div class="tab-content" id="adminTabContent">
            <!-- Vista de Órdenes -->
            <div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">
                <div class="mt-4">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID Orden <span class="sort-arrow" data-column="idorder"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="idorder" placeholder="Filtrar ID">
                                </th>
                                <th>Usuario <span class="sort-arrow" data-column="iduser"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="iduser" placeholder="Filtrar usuario">
                                </th>
                                <th>Fecha <span class="sort-arrow" data-column="orderdate"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="orderdate" placeholder="Filtrar fecha (dd/mm/aaaa)">
                                </th>
                                <th>Total <span class="sort-arrow" data-column="totalprice"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="totalprice" placeholder="Filtrar total">
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="adminOrdersTable"></tbody>
                    </table>
                    <div class="text-end mt-2">
                        <h5>Total de Ganancias: <span id="ordersTotal">$0.00</span></h5>
                    </div>
                </div>
            </div>

            <!-- Vista de Productos -->
            <div class="tab-pane fade" id="products" role="tabpanel" aria-labelledby="products-tab">
                <div class="mt-4">
                    <button class="btn btn-create mb-3" data-bs-toggle="modal" data-bs-target="#createProductModal">Crear Producto</button>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID <span class="sort-arrow" data-column="idproduct"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="idproduct" placeholder="Filtrar ID">
                                </th>
                                <th>Nombre <span class="sort-arrow" data-column="productname"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="productname" placeholder="Filtrar nombre">
                                </th>
                                <th>Categoría <span class="sort-arrow" data-column="category"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="category" placeholder="Filtrar categoría">
                                </th>
                                <th>Stock <span class="sort-arrow" data-column="stock"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="stock" placeholder="Filtrar stock">
                                </th>
                                <th>Precio <span class="sort-arrow" data-column="price"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="price" placeholder="Filtrar precio">
                                </th>
                                <th>Descuento <span class="sort-arrow" data-column="discount"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="discount" placeholder="Filtrar descuento">
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="adminProductsTable"></tbody>
                    </table>
                </div>
            </div>

            <!-- Vista de Usuarios -->
            <div class="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab">
                <div class="mt-4">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID <span class="sort-arrow" data-column="iduser"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="iduser" placeholder="Filtrar ID">
                                </th>
                                <th>Nombre <span class="sort-arrow" data-column="username"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="username" placeholder="Filtrar nombre">
                                </th>
                                <th>Email <span class="sort-arrow" data-column="email"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="email" placeholder="Filtrar email">
                                </th>
                                <th>Dirección <span class="sort-arrow" data-column="address"><i class="bi bi-arrow-down-up"></i></span>
                                    <input type="text" class="filter-input" data-column="address" placeholder="Filtrar dirección">
                                </th>
                            </tr>
                        </thead>
                        <tbody id="adminUsersTable"></tbody>
                    </table>
                </div>
            </div>

            <!-- Vista de Análisis de Ventas -->
           <!-- Vista de Análisis de Ventas -->
<div class="tab-pane fade" id="sales-analysis" role="tabpanel" aria-labelledby="sales-analysis-tab">
    <div class="mt-4">
        <!-- Sub-Tabs para Análisis de Ventas -->
        <ul class="nav nav-tabs" id="salesSubTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="metrics-tab" data-bs-toggle="tab" data-bs-target="#metrics" type="button" role="tab" aria-controls="metrics" aria-selected="true">Métricas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="dashboard-tab" data-bs-toggle="tab" data-bs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
            </li>
        </ul>

        <div class="tab-content" id="salesSubTabContent">
            <!-- Sub-Tab: Métricas (Original Content) -->
            <div class="tab-pane fade show active" id="metrics" role="tabpanel" aria-labelledby="metrics-tab">
                <div class="mt-4">
                    <div class="mb-3">
                        <label for="salesFilter" class="form-label">Filtrar por:</label>
                        <select id="salesFilter" class="form-select w-auto">
                            <option value="all">Todo</option>
                            <option value="year">Año</option>
                            <option value="category">Categoría</option>
                        </select>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>Valor</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody id="salesMetricsTable"></tbody>
                    </table>
                    <div class="mt-4">
                        <canvas id="salesChart" style="max-height: 400px;"></canvas>
                    </div>
                </div>
            </div>

            <!-- Sub-Tab: Dashboard -->
            <div class="tab-pane fade" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                <div class="mt-4">
                    <h3 class="text-center mb-4" style="color: #1a3c34;">Sales Performance Dashboard</h3>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        <!-- Chart 1: Sales by Year -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Sales by Year</h4>
                                    <canvas id="salesByYearChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 2: Sales by Category -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Sales by Category</h4>
                                    <canvas id="salesByCategoryChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 3: Top 5 Products by Units Sold -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Top 5 Products by Units</h4>
                                    <canvas id="topProductsChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 4: Products with Negative Profit -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Products with Negative Profit</h4>
                                    <canvas id="negativeProfitChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 5: Sales by City -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Sales by City</h4>
                                    <canvas id="salesByCityChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 6: Sales by Month -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Sales by Month</h4>
                                    <canvas id="salesByMonthChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Chart 7: Regional Performance -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Regional Performance</h4>
                                    <canvas id="regionalPerformanceChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <!-- Summary Card: Key Metrics -->
                        <div class="col">
                            <div class="card h-100 border" style="border-color: #1a3c34;">
                                <div class="card-body">
                                    <h4 class="card-title text-center" style="color: #1a3c34;">Key Metrics</h4>
                                    <ul class="list-unstyled" style="color: #1a3c34;">
                                        <li><strong>Top Product (Revenue):</strong> <span id="topProductRevenue">Canon imageCLASS 2200 ($61,599.82)</span></li>
                                        <li><strong>Top Customer:</strong> <span id="topCustomer">Sean Miller ($23,661.23)</span></li>
                                        <li><strong>Top City:</strong> <span id="topCity">New York City ($255,248.97)</span></li>
                                        <li><strong>Peak Month:</strong> <span id="peakMonth">November ($348,834.56)</span></li>
                                        <li><strong>Top Category:</strong> <span id="topCategory">Technology ($835,900.07)</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="mt-4 text-center" style="color: #1a3c34; font-size: 0.9em;">
                        Data as of May 20, 2025
                    </footer>
                </div>
            </div>
        </div>
    </div>
</div>

    <!-- Modal para Crear Producto -->
    <div class="modal fade" id="createProductModal" tabindex="-1" aria-labelledby="createProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createProductModalLabel">Crear Producto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="createProductForm">
                        <div class="mb-3">
                            <label for="productName" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="productName" required>
                        </div>
                        <div class="mb-3">
                            <label for="productDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="productDescription" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="productCategory" class="form-label">Categoría</label>
                            <input type="text" class="form-control" id="productCategory" required>
                        </div>
                        <div class="mb-3">
                            <label for="productSubcategory" class="form-label">Subcategoría</label>
                            <input type="text" class="form-control" id="productSubcategory" required>
                        </div>
                        <div class="mb-3">
                            <label for="productPrice" class="form-label">Precio</label>
                            <input type="number" step="0.01" class="form-control" id="productPrice" required>
                        </div>
                        <div class="mb-3">
                            <label for="productStock" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="productStock" required>
                        </div>
                        <div class="mb-3">
                            <label for="productDiscount" class="form-label">Descuento (%)</label>
                            <input type="number" step="0.01" class="form-control" id="productDiscount" value="0">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-create" onclick="createProduct()">Crear</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Detalles de Orden -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="orderDetailsModalLabel">Detalles de la Orden</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Fecha de la Orden:</strong> <span id="orderDate">No especificada</span></p>
                    <p><strong>Modo de Envío:</strong> <span id="orderShipMode">No especificado</span></p>
                    <p><strong>Fecha de Envío:</strong> <span id="orderShipDate">No especificada</span></p>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="orderDetailsTable"></tbody>
                    </table>
                    <div id="order-summary" class="mt-3">
                        <p id="order-subtotal">Subtotal: $0</p>
                        <p id="order-discount" class="text-success">Descuento Total: $0</p>
                        <h4 id="order-total">Total: $0</h4>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="/js/navbar.js"></script>
    <script src="/js/admin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            console.log("Usuario en admin.php:", currentUser);
            if (!currentUser || !currentUser.isAdmin) {
                console.log("Redirigiendo porque no es admin");
                window.location.href = '/auth/login.php';
            }
        });
    </script>
</body>
</html>
```

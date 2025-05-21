let salesData = [];
let dashboardSalesData = [];
let salesChart = null;
let dashboardCharts = []; // Almacenar instancias de gráficos del dashboard
let productsData = [];
let ordersData = [];
let ordersSortDirection = {};
let productsSortDirection = {};

// Función para formatear precios
function formatPrice(value) {
    return Number(value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Función para formatear fechas
function formatDate(isoDate) {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "N/A";
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

// Función para renderizar órdenes
function renderOrders() {
    const tableBody = document.getElementById("adminOrdersTable");
    const ordersTotalElement = document.getElementById("ordersTotal");
    if (!tableBody || !ordersTotalElement) {
        console.error("Elementos adminOrdersTable o ordersTotal no encontrados");
        return;
    }
    tableBody.innerHTML = "";
    if (ordersData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay órdenes.</td></tr>';
        ordersTotalElement.textContent = "$0.00";
        return;
    }

    const filters = {
        idorder: document.querySelector('.filter-input[data-column="idorder"]')?.value.toLowerCase() || "",
        iduser: document.querySelector('.filter-input[data-column="iduser"]')?.value.toLowerCase() || "",
        orderdate: document.querySelector('.filter-input[data-column="orderdate"]')?.value.toLowerCase() || "",
        totalprice: document.querySelector('.filter-input[data-column="totalprice"]')?.value.toLowerCase() || "",
    };

    let filteredOrders = ordersData.filter((order) => {
        const idorder = String(order.idorder || "").toLowerCase();
        const iduser = String(order.iduser || "").toLowerCase();
        const orderdate = formatDate(order.orderdate).toLowerCase();
        const totalprice = formatPrice(order.totalprice).toLowerCase();
        return (
            idorder.includes(filters.idorder) &&
            iduser.includes(filters.iduser) &&
            orderdate.includes(filters.orderdate) &&
            totalprice.includes(filters.totalprice)
        );
    });

    const sortColumn = Object.keys(ordersSortDirection)[0];
    if (sortColumn) {
        filteredOrders.sort((a, b) => {
            let valA = a[sortColumn] || "";
            let valB = b[sortColumn] || "";
            if (sortColumn === "idorder" || sortColumn === "iduser") {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            } else if (sortColumn === "orderdate") {
                valA = valA ? new Date(valA).getTime() : 0;
                valB = valB ? new Date(valB).getTime() : 0;
            } else if (sortColumn === "totalprice") {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            }
            return ordersSortDirection[sortColumn] === "asc" ? valA - valB : valB - valA;
        });
    }

    const totalGanancias = filteredOrders.reduce((sum, order) => sum + Number(order.totalprice || 0), 0);

    filteredOrders.forEach((order) => {
        tableBody.innerHTML += `
            <tr>
                <td>${order.idorder || "N/A"}</td>
                <td>${order.iduser || "N/A"}</td>
                <td>${formatDate(order.orderdate)}</td>
                <td>$${formatPrice(order.totalprice)}</td>
                <td><button class="btn btn-sm" style="background-color: #1a3c34; color: white;" onclick='showOrderDetails(${JSON.stringify(order)})'>Ver Detalles</button></td>
            </tr>
        `;
    });

    ordersTotalElement.textContent = `$${formatPrice(totalGanancias)}`;
}

// Función para mostrar detalles de la orden
async function showOrderDetails(order) {
    console.log("Mostrando detalles de orden:", order);
    const modal = new bootstrap.Modal(document.getElementById("orderDetailsModal"));
    const orderDetailsTable = document.getElementById("orderDetailsTable");
    const orderDate = document.getElementById("orderDate");
    const orderSubtotal = document.getElementById("order-subtotal");
    const orderDiscount = document.getElementById("order-discount");
    const orderTotal = document.getElementById("order-total");
    const orderShipMode = document.getElementById("orderShipMode");
    const orderShipDate = document.getElementById("orderShipDate");

    if (!orderDetailsTable || !orderDate || !orderSubtotal || !orderDiscount || !orderTotal || !orderShipMode || !orderShipDate) {
        console.error("Elementos del modal de detalles no encontrados");
        return;
    }

    orderDetailsTable.innerHTML = "";
    orderDate.textContent = order.orderdate ? formatDate(order.orderdate) : "No especificada";
    orderShipMode.textContent = order.shipmode || "No especificado";
    orderShipDate.textContent = order.shipdate ? formatDate(order.shipdate) : "No especificada";

    let subtotal = 0;
    let totalDiscount = 0;
    let total = 0;

    if (order.items && order.items.length > 0) {
        for (const item of order.items) {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            const discount = Number(item.discount) || 0;
            const originalPrice = price * quantity;
            const itemDiscount = discount > 0 ? originalPrice * (discount / 100) : 0;
            const discountedPrice = originalPrice - itemDiscount;

            subtotal += originalPrice;
            totalDiscount += itemDiscount;
            total += discountedPrice;

            orderDetailsTable.innerHTML += `
                <tr>
                    <td>${item.productname || "Producto desconocido"}</td>
                    <td>
                        ${itemDiscount > 0 ? `<span class="text-muted text-decoration-line-through">$${formatPrice(price)}</span> ` : ""}
                        $${formatPrice(discountedPrice / quantity)}
                        ${itemDiscount > 0 ? `<br><small class="text-success">(${formatPrice(discount)}% OFF)</small>` : ""}
                    </td>
                    <td>${quantity}</td>
                    <td>$${formatPrice(discountedPrice)}</td>
                </tr>
            `;
        }
    } else {
        orderDetailsTable.innerHTML = '<tr><td colspan="4" class="text-center">No hay ítems en esta orden.</td></tr>';
        total = Number(order.totalprice) || 0;
    }

    orderSubtotal.textContent = `Subtotal: $${formatPrice(subtotal)}`;
    orderDiscount.textContent = `Descuento Total: $${formatPrice(totalDiscount)}`;
    orderTotal.textContent = `Total: $${formatPrice(total)}`;

    document.getElementById("orderDetailsModalLabel").textContent = `Detalles de la Orden #${order.idorder}`;
    modal.show();
}

// Función para cargar productos
async function loadProducts() {
    console.log("Cargando productos...");
    try {
        const response = await fetch("http://192.168.100.2:3001/productos");
        productsData = await response.json();
        if (!Array.isArray(productsData)) {
            console.error("Datos de productos no válidos:", productsData);
            productsData = [];
        }
        renderProducts();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        productsData = [];
        renderProducts();
    }
}

// Función para renderizar productos
function renderProducts() {
    console.log("Renderizando productos...");
    const tableBody = document.getElementById("adminProductsTable");
    if (!tableBody) {
        console.error("Elemento adminProductsTable no encontrado");
        return;
    }
    tableBody.innerHTML = "";
    if (productsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos.</td></tr>';
        return;
    }

    const filters = {
        idproduct: document.querySelector('.filter-input[data-column="idproduct"]')?.value.toLowerCase() || "",
        productname: document.querySelector('.filter-input[data-column="productname"]')?.value.toLowerCase() || "",
        category: document.querySelector('.filter-input[data-column="category"]')?.value.toLowerCase() || "",
        stock: document.querySelector('.filter-input[data-column="stock"]')?.value.toLowerCase() || "",
        price: document.querySelector('.filter-input[data-column="price"]')?.value.toLowerCase() || "",
        discount: document.querySelector('.filter-input[data-column="discount"]')?.value.toLowerCase() || "",
    };

    let filteredProducts = productsData.filter((product) => {
        const idproduct = String(product.idproduct || "").toLowerCase();
        const productname = String(product.productname || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const stock = String(product.stock || "").toLowerCase();
        const price = formatPrice(product.price).toLowerCase();
        const discount = String(product.discount || "").toLowerCase();
        return (
            idproduct.includes(filters.idproduct) &&
            productname.includes(filters.productname) &&
            category.includes(filters.category) &&
            stock.includes(filters.stock) &&
            price.includes(filters.price) &&
            discount.includes(filters.discount)
        );
    });

    const sortColumn = Object.keys(productsSortDirection)[0];
    if (sortColumn) {
        filteredProducts.sort((a, b) => {
            let valA = a[sortColumn] || "";
            let valB = b[sortColumn] || "";
            if (sortColumn === "idproduct" || sortColumn === "stock") {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            } else if (sortColumn === "price" || sortColumn === "discount") {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            } else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
                return productsSortDirection[sortColumn] === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return productsSortDirection[sortColumn] === "asc" ? valA - valB : valB - valA;
        });
    }

    filteredProducts.forEach((product) => {
        tableBody.innerHTML += `
            <tr>
                <td>${product.idproduct}</td>
                <td>${product.productname}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>$${formatPrice(product.price)}</td>
                <td>${product.discount}%</td>
                <td>
                    <div class="btn-group action-btn-group" role="group">
                        <button class="btn" data-bs-toggle="tooltip" title="Editar Stock" onclick="updateProduct(${product.idproduct}, 'stock')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn" data-bs-toggle="tooltip" title="Editar Descuento" onclick="updateProduct(${product.idproduct}, 'discount')">
                            <i class="bi bi-percent"></i>
                        </button>
                        <button class="btn btn-danger" data-bs-toggle="tooltip" title="Eliminar" onclick="deleteProduct(${product.idproduct})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Función para crear un producto
async function createProduct() {
    console.log("Creando producto...");
    const productData = {
        productname: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        category: document.getElementById("productCategory").value,
        subcategory: document.getElementById("productSubcategory").value,
        price: Number(document.getElementById("productPrice").value),
        stock: Number(document.getElementById("productStock").value),
        discount: Number(document.getElementById("productDiscount").value),
    };
    try {
        const response = await fetch("http://192.168.100.2:3001/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
        const data = await response.json();
        if (response.ok) {
            alert("Producto creado con éxito");
            loadProducts();
            bootstrap.Modal.getInstance(document.getElementById("createProductModal")).hide();
            document.getElementById("createProductForm").reset();
        } else {
            alert(data.error || "Error al crear producto");
        }
    } catch (error) {
        console.error("Error al crear producto:", error);
        alert("Error de conexión: " + error.message);
    }
}

// Función para actualizar un producto
async function updateProduct(idproduct, field) {
    console.log(`Actualizando ${field} del producto ${idproduct}...`);
    const value = prompt(`Ingrese el nuevo ${field === "stock" ? "stock" : "descuento (%)"} para el producto ${idproduct}:`);
    if (value === null) return;
    const updateData = field === "stock" ? { stock: Number(value) } : { discount: Number(value) };
    const endpoint = field === "stock" ? `stock/${idproduct}` : `discount/${idproduct}`;
    try {
        const response = await fetch(`http://192.168.100.2:3001/productos/${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        const data = await response.json();
        if (response.ok) {
            alert(`${field === "stock" ? "Stock" : "Descuento"} actualizado con éxito`);
            loadProducts();
        } else {
            alert(data.error || "Error al actualizar producto");
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Error de conexión: " + error.message);
    }
}

// Función para eliminar un producto
async function deleteProduct(idproduct) {
    console.log(`Eliminando producto ${idproduct}...`);
    if (!confirm(`¿Seguro que desea eliminar el producto ${idproduct}?`)) return;
    try {
        const response = await fetch(`http://192.168.100.2:3001/productos/${idproduct}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
            alert("Producto eliminado con éxito");
            loadProducts();
        } else {
            alert(data.error || "Error al eliminar producto");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error de conexión: " + error.message);
    }
}

// Función para cargar datos de análisis de ventas
async function loadSalesAnalysisData(filter = 'all') {
    console.log(`Cargando datos de análisis de ventas con filtro: ${filter}`);
    try {
        const response = await fetch('http://192.168.100.2:3020/respuestas.json', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        salesData = await response.json();
        console.log('Datos de análisis recibidos:', salesData);

        // Normalizar datos: convertir a array si es un objeto
        if (!Array.isArray(salesData) && typeof salesData === 'object') {
            salesData = [salesData];
        } else if (!Array.isArray(salesData)) {
            console.error('Datos de análisis no válidos:', salesData);
            salesData = [];
        }

        // Preparar datos para el dashboard
        dashboardSalesData = prepareDashboardData(salesData[0] || {});

        // Renderizar según la subpestaña activa
        const activeSubTab = document.querySelector('#salesSubTabContent .tab-pane.active')?.id;
        if (activeSubTab === 'metrics') {
            renderSalesAnalysis(filter);
        } else if (activeSubTab === 'dashboard') {
            loadDashboardCharts();
        }
    } catch (error) {
        console.error('Error al cargar datos de análisis:', error);
        salesData = [];
        dashboardSalesData = getStaticDashboardData(); // Usar datos estáticos como respaldo
        const activeSubTab = document.querySelector('#salesSubTabContent .tab-pane.active')?.id;
        if (activeSubTab === 'metrics') {
            renderSalesAnalysis(filter);
        } else if (activeSubTab === 'dashboard') {
            loadDashboardCharts();
        }
    }
}

// Función para preparar datos del dashboard desde la API
function prepareDashboardData(apiData) {
    return {
        salesByYear: [
            { year: apiData.ano_menos_ventas?.ano || 2015, sales: apiData.ano_menos_ventas?.ventas_totales || 464426.24 },
            { year: apiData.ano_mas_ventas?.ano || 2017, sales: apiData.ano_mas_ventas?.ventas_totales || 724994.56 }
        ],
        salesByCategory: [
            { category: apiData.categoria_con_mas_ventas?.categoria || "Technology", sales: apiData.categoria_con_mas_ventas?.total_ventas || 835900.07 },
            { category: "Others", sales: (apiData.categoria_con_mas_ventas?.total_ventas || 835900.07) ? 2272449.86 - (apiData.categoria_con_mas_ventas?.total_ventas || 835900.07) : 1436549.79 }
        ],
        topProducts: apiData.top5_productos_cantidad?.map(p => ({
            product: p.producto,
            units: p.unidades || 0,
            sales: p.ventas || 0
        })) || [
            { product: "Staples", units: 133, sales: 430.40 },
            { product: "GBC Covers", units: 67, sales: 780.46 },
            { product: "Storex Binders", units: 57, sales: 195.43 },
            { product: "Global Chair", units: 53, sales: 3621.00 },
            { product: "Situations Chairs", units: 53, sales: 2860.49 }
        ],
        negativeProfit: apiData.productos_menor_ganancia?.map(p => ({
            product: p.producto,
            loss: p.ganancia_total || 0
        })) || [
            { product: "Bretford Table", loss: -383.03 },
            { product: "Holmes Filter", loss: -123.86 },
            { product: "Storex Binders", loss: -3.82 },
            { product: "Global Chair", loss: -1.02 },
            { product: "Riverside Bookcase", loss: -1665.05 }
        ],
        salesByCity: [
            { city: apiData.ciudad_con_mas_ventas?.ciudad || "New York City", sales: apiData.ciudad_con_mas_ventas?.total_ventas || 255248.97 },
            { city: "Others", sales: (apiData.ciudad_con_mas_ventas?.total_ventas || 255248.97) ? 2272449.86 - (apiData.ciudad_con_mas_ventas?.total_ventas || 255248.97) : 2017200.89 }
        ],
        salesByMonth: apiData.mes_con_mas_ventas ? [
            { month: "January", sales: 0 },
            { month: "February", sales: 0 },
            { month: "March", sales: 0 },
            { month: "April", sales: 0 },
            { month: "May", sales: 0 },
            { month: "June", sales: 0 },
            { month: "July", sales: 0 },
            { month: "August", sales: 0 },
            { month: "September", sales: 0 },
            { month: "October", sales: 0 },
            { month: "November", sales: apiData.mes_con_mas_ventas.mes === "November" ? apiData.mes_con_mas_ventas.total_ventas : 0 },
            { month: "December", sales: 0 }
        ] : [
            { month: "January", sales: 0 },
            { month: "February", sales: 0 },
            { month: "March", sales: 0 },
            { month: "April", sales: 0 },
            { month: "May", sales: 0 },
            { month: "June", sales: 0 },
            { month: "July", sales: 0 },
            { month: "August", sales: 0 },
            { month: "September", sales: 0 },
            { month: "October", sales: 0 },
            { month: "November", sales: 348834.56 },
            { month: "December", sales: 0 }
        ],
        regionalPerformance: apiData.region_con_mas_unidades ? [
            { region: apiData.region_con_mas_unidades.region || "West", units: apiData.region_con_mas_unidades.total_unidades || 21978, discount: apiData.region_con_mayor_descuento?.promedio_descuento || 1268.22 },
            { region: "Others", units: 0, discount: 0 }
        ] : [
            { region: "West", units: 21978, discount: 1268.22 },
            { region: "Others", units: 0, discount: 0 }
        ]
    };
}

// Datos estáticos como respaldo
function getStaticDashboardData() {
    return {
        salesByYear: [
            { year: 2015, sales: 464426.24 },
            { year: 2017, sales: 724994.56 }
        ],
        salesByCategory: [
            { category: "Technology", sales: 835900.07 },
            { category: "Others", sales: 1436549.79 }
        ],
        topProducts: [
            { product: "Staples", units: 133, sales: 430.40 },
            { product: "GBC Covers", units: 67, sales: 780.46 },
            { product: "Storex Binders", units: 57, sales: 195.43 },
            { product: "Global Chair", units: 53, sales: 3621.00 },
            { product: "Situations Chairs", units: 53, sales: 2860.49 }
        ],
        negativeProfit: [
            { product: "Bretford Table", loss: -383.03 },
            { product: "Holmes Filter", loss: -123.86 },
            { product: "Storex Binders", loss: -3.82 },
            { product: "Global Chair", loss: -1.02 },
            { product: "Riverside Bookcase", loss: -1665.05 }
        ],
        salesByCity: [
            { city: "New York City", sales: 255248.97 },
            { city: "Others", sales: 2017200.89 }
        ],
        salesByMonth: [
            { month: "January", sales: 0 },
            { month: "February", sales: 0 },
            { month: "March", sales: 0 },
            { month: "April", sales: 0 },
            { month: "May", sales: 0 },
            { month: "June", sales: 0 },
            { month: "July", sales: 0 },
            { month: "August", sales: 0 },
            { month: "September", sales: 0 },
            { month: "October", sales: 0 },
            { month: "November", sales: 348834.56 },
            { month: "December", sales: 0 }
        ],
        regionalPerformance: [
            { region: "West", units: 21978, discount: 1268.22 },
            { region: "Others", units: 0, discount: 0 }
        ]
    };
}

// Función para inicializar los gráficos del dashboard
function loadDashboardCharts() {
    console.log('Inicializando gráficos del dashboard...');

    // Destruir gráficos anteriores para evitar conflictos
    dashboardCharts.forEach(chart => chart.destroy());
    dashboardCharts = [];

    // Chart 1: Sales by Year (Bar)
    const salesByYearChart = new Chart(document.getElementById('salesByYearChart'), {
        type: 'bar',
        data: {
            labels: dashboardSalesData.salesByYear.map(d => d.year),
            datasets: [{
                label: 'Total Sales ($)',
                data: dashboardSalesData.salesByYear.map(d => d.sales),
                backgroundColor: ['#1a3c34', '#14524a'],
                borderColor: ['#1a3c34'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Sales ($)', color: '#1a3c34' } },
                x: { title: { display: true, text: 'Year', color: '#1a3c34' } }
            },
            plugins: { legend: { display: true, labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(salesByYearChart);

    // Chart 2: Sales by Category (Pie)
    const salesByCategoryChart = new Chart(document.getElementById('salesByCategoryChart'), {
        type: 'pie',
        data: {
            labels: dashboardSalesData.salesByCategory.map(d => d.category),
            datasets: [{
                data: dashboardSalesData.salesByCategory.map(d => d.sales),
                backgroundColor: ['#1a3c34', '#14524a'],
                borderColor: ['#1a3c34'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { position: 'right', labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(salesByCategoryChart);

    // Chart 3: Top 5 Products by Units (Bar)
    const topProductsChart = new Chart(document.getElementById('topProductsChart'), {
        type: 'bar',
        data: {
            labels: dashboardSalesData.topProducts.map(d => d.product),
            datasets: [{
                label: 'Units Sold',
                data: dashboardSalesData.topProducts.map(d => d.units),
                backgroundColor: '#1a3c34',
                borderColor: '#1a3c34',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Units Sold', color: '#1a3c34' } },
                x: { title: { display: true, text: 'Product', color: '#1a3c34' } }
            },
            plugins: { legend: { display: true, labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(topProductsChart);

    // Chart 4: Products with Negative Profit (Bar)
    const negativeProfitChart = new Chart(document.getElementById('negativeProfitChart'), {
        type: 'bar',
        data: {
            labels: dashboardSalesData.negativeProfit.map(d => d.product),
            datasets: [{
                label: 'Loss ($)',
                data: dashboardSalesData.negativeProfit.map(d => d.loss),
                backgroundColor: '#1a3c34',
                borderColor: '#1a3c34',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Loss ($)', color: '#1a3c34' } },
                x: { title: { display: true, text: 'Product', color: '#1a3c34' } }
            },
            plugins: { legend: { display: true, labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(negativeProfitChart);

    // Chart 5: Sales by City (Pie)
    const salesByCityChart = new Chart(document.getElementById('salesByCityChart'), {
        type: 'pie',
        data: {
            labels: dashboardSalesData.salesByCity.map(d => d.city),
            datasets: [{
                data: dashboardSalesData.salesByCity.map(d => d.sales),
                backgroundColor: ['#1a3c34', '#14524a'],
                borderColor: ['#1a3c34'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { position: 'right', labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(salesByCityChart);

    // Chart 6: Sales by Month (Line)
    const salesByMonthChart = new Chart(document.getElementById('salesByMonthChart'), {
        type: 'line',
        data: {
            labels: dashboardSalesData.salesByMonth.map(d => d.month),
            datasets: [{
                label: 'Total Sales ($)',
                data: dashboardSalesData.salesByMonth.map(d => d.sales),
                borderColor: '#1a3c34',
                backgroundColor: '#14524a',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Sales ($)', color: '#1a3c34' } },
                x: { title: { display: true, text: 'Month', color: '#1a3c34' } }
            },
            plugins: { legend: { display: true, labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(salesByMonthChart);

    // Chart 7: Regional Performance (Bar)
    const regionalPerformanceChart = new Chart(document.getElementById('regionalPerformanceChart'), {
        type: 'bar',
        data: {
            labels: dashboardSalesData.regionalPerformance.map(d => d.region),
            datasets: [
                {
                    label: 'Units Sold',
                    data: dashboardSalesData.regionalPerformance.map(d => d.units),
                    backgroundColor: '#1a3c34',
                    borderColor: '#1a3c34',
                    borderWidth: 1
                },
                {
                    label: 'Avg Discount ($)',
                    data: dashboardSalesData.regionalPerformance.map(d => d.discount),
                    backgroundColor: '#14524a',
                    borderColor: '#1a3c34',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Value', color: '#1a3c34' } },
                x: { title: { display: true, text: 'Region', color: '#1a3c34' } }
            },
            plugins: { legend: { display: true, labels: { color: '#1a3c34' } } }
        }
    });
    dashboardCharts.push(regionalPerformanceChart);

    console.log('Gráficos del dashboard renderizados');
}

// Función para renderizar análisis de ventas
function renderSalesAnalysis(filter) {
    console.log('Renderizando análisis de ventas...');
    const salesFilter = document.getElementById('salesFilter');
    const salesMetricsTable = document.getElementById('salesMetricsTable');
    const salesChartCanvas = document.getElementById('salesChart');

    if (!salesFilter || !salesMetricsTable || !salesChartCanvas) {
        console.error('Elementos necesarios no encontrados:', {
            salesFilter: !!salesFilter,
            salesMetricsTable: !!salesMetricsTable,
            salesChartCanvas: !!salesChartCanvas,
        });
        return;
    }

    salesMetricsTable.innerHTML = '';
    if (salesChart) {
        salesChart.destroy();
    }

    if (salesData.length === 0) {
        console.warn('No hay datos de ventas disponibles');
        salesMetricsTable.innerHTML = '<tr><td colspan="3" class="text-center">No hay datos disponibles.</td></tr>';
        return;
    }

    const data = salesData[0] || {};

    // Definir métricas para la tabla según el filtro
    let metrics = [];
    if (filter === 'all') {
        metrics = [
            {
                label: 'Producto Más Vendido (Valor)',
                value: data.producto_mas_vendido_valor?.producto || 'N/A',
                details: `Ventas: $${formatPrice(data.producto_mas_vendido_valor?.ventas_totales || 0)}`,
            },
            {
                label: 'Producto Más Vendido (Unidades)',
                value: data.producto_mas_vendido_unidades?.producto || 'N/A',
                details: `Unidades: ${data.producto_mas_vendido_unidades?.unidades_vendidas || 0}`,
            },
            {
                label: 'Producto Más Rentable',
                value: data.producto_mas_rentable?.producto || 'N/A',
                details: `Ganancia: $${formatPrice(data.producto_mas_rentable?.ganancia_total || 0)}`,
            },
            {
                label: 'Ciudad con Más Ventas',
                value: data.ciudad_con_mas_ventas?.ciudad || 'N/A',
                details: `Ventas: $${formatPrice(data.ciudad_con_mas_ventas?.total_ventas || 0)}`,
            },
            {
                label: 'Año con Menos Ventas',
                value: data.ano_menos_ventas?.ano || 'N/A',
                details: `Ventas: $${formatPrice(data.ano_menos_ventas?.ventas_totales || 0)}`,
            },
            {
                label: 'Año con Más Ventas',
                value: data.ano_mas_ventas?.ano || 'N/A',
                details: `Ventas: $${formatPrice(data.ano_mas_ventas?.ventas_totales || 0)}`,
            },
            {
                label: 'Producto con Mayor Descuento',
                value: data.producto_mayor_descuento?.producto || 'N/A',
                details: `Descuento: ${data.producto_mayor_descuento?.descuento_porcentaje || 0}%`,
            },
            {
                label: 'Producto con Menor Descuento',
                value: data.producto_menor_descuento?.producto || 'N/A',
                details: `Descuento: ${data.producto_menor_descuento?.descuento_porcentaje || 0}%`,
            },
            {
                label: 'Cliente que Más Compró',
                value: data.cliente_mas_compro?.cliente || 'N/A',
                details: `Total: $${formatPrice(data.cliente_mas_compro?.total_comprado || 0)}`,
            },
            {
                label: 'Mes con Más Ventas',
                value: data.mes_con_mas_ventas?.mes || 'N/A',
                details: `Ventas: $${formatPrice(data.mes_con_mas_ventas?.total_ventas || 0)}`,
            },
            {
                label: 'Temporada con Más Ventas',
                value: data.temporada_con_mas_ventas?.temporada || 'N/A',
                details: `Ventas: $${formatPrice(data.temporada_con_mas_ventas?.total_ventas || 0)}`,
            },
            {
                label: 'Región con Mayor Descuento',
                value: data.region_con_mayor_descuento?.region || 'N/A',
                details: `Descuento Promedio: $${formatPrice(data.region_con_mayor_descuento?.promedio_descuento || 0)}`,
            },
            {
                label: 'Región con Más Unidades',
                value: data.region_con_mas_unidades?.region || 'N/A',
                details: `Unidades: ${data.region_con_mas_unidades?.total_unidades || 0}`,
            },
            {
                label: 'Categoría con Más Ventas',
                value: data.categoria_con_mas_ventas?.categoria || 'N/A',
                details: `Ventas: $${formatPrice(data.categoria_con_mas_ventas?.total_ventas || 0)}`,
            },
        ];
    } else if (filter === 'year') {
        metrics = [
            {
                label: 'Año con Menos Ventas',
                value: data.ano_menos_ventas?.ano || 'N/A',
                details: `Ventas: $${formatPrice(data.ano_menos_ventas?.ventas_totales || 0)}`,
            },
            {
                label: 'Año con Más Ventas',
                value: data.ano_mas_ventas?.ano || 'N/A',
                details: `Ventas: $${formatPrice(data.ano_mas_ventas?.ventas_totales || 0)}`,
            },
        ];
    } else if (filter === 'category') {
        metrics = [
            {
                label: 'Categoría con Más Ventas',
                value: data.categoria_con_mas_ventas?.categoria || 'N/A',
                details: `Ventas: $${formatPrice(data.categoria_con_mas_ventas?.total_ventas || 0)}`,
            },
            {
                label: 'Top 5 Productos por Cantidad',
                value: data.top5_productos_cantidad?.map(p => p.producto).join(', ') || 'N/A',
                details: `Unidades Totales: ${data.top5_productos_cantidad?.reduce((sum, p) => sum + (p.unidades || 0), 0) || 0}`,
            },
        ];
    }

    // Renderizar tabla
    metrics.forEach(metric => {
        salesMetricsTable.innerHTML += `
            <tr>
                <td>${metric.label}</td>
                <td>${metric.value}</td>
                <td>${metric.details}</td>
            </tr>
        `;
    });

    // Preparar datos para la gráfica
    let chartLabels = [];
    let chartData = [];
    let chartLabel = 'Ventas Totales';

    if (filter === 'all') {
        chartLabels = [
            'Producto Más Vendido',
            'Ciudad con Más Ventas',
            'Cliente Más Compró',
            'Categoría con Más Ventas',
        ];
        chartData = [
            data.producto_mas_vendido_valor?.ventas_totales || 0,
            data.ciudad_con_mas_ventas?.total_ventas || 0,
            data.cliente_mas_compro?.total_comprado || 0,
            data.categoria_con_mas_ventas?.total_ventas || 0,
        ];
    } else if (filter === 'year') {
        chartLabels = [
            `Año ${data.ano_menos_ventas?.ano || 'N/A'}`,
            `Año ${data.ano_mas_ventas?.ano || 'N/A'}`,
        ];
        chartData = [
            data.ano_menos_ventas?.ventas_totales || 0,
            data.ano_mas_ventas?.ventas_totales || 0,
        ];
    } else if (filter === 'category') {
        chartLabels = data.top5_productos_cantidad?.map(p => p.producto) || ['Sin datos'];
        chartData = data.top5_productos_cantidad?.map(p => p.ventas || 0) || [0];
        chartLabel = 'Ventas por Producto';
    }

    // Renderizar gráfica de barras
    salesChart = new Chart(salesChartCanvas, {
        type: 'bar',
        data: {
            labels: chartLabels.length ? chartLabels : ['Sin datos'],
            datasets: [{
                label: chartLabel,
                data: chartData.length ? chartData : [0],
                backgroundColor: '#1a3c34',
                borderColor: '#1a3c34',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Ventas ($)' },
                },
                x: {
                    title: { display: true, text: filter === 'year' ? 'Año' : filter === 'category' ? 'Producto' : 'Métrica' },
                },
            },
        },
    });

    console.log('Tabla y gráfica de ventas actualizadas');
}

// Manejar cambio en el filtro
document.getElementById('salesFilter')?.addEventListener('change', function () {
    const filter = this.value;
    console.log(`Filtro de ventas cambiado a: ${filter}`);
    renderSalesAnalysis(filter);
});

// Cargar datos cuando se muestra la pestaña Análisis de Ventas
document.getElementById('sales-analysis-tab')?.addEventListener('shown.bs.tab', function () {
    console.log('Pestaña Análisis de Ventas activada');
    const filter = document.getElementById('salesFilter')?.value || 'all';
    loadSalesAnalysisData(filter);
});

// Cargar datos cuando se muestra la subpestaña Dashboard
document.getElementById('dashboard-tab')?.addEventListener('shown.bs.tab', function () {
    console.log('Subpestaña Dashboard activada');
    loadDashboardCharts();
});

// Limpiar gráficos al cambiar a la subpestaña Métricas
document.getElementById('metrics-tab')?.addEventListener('shown.bs.tab', function () {
    console.log('Subpestaña Métricas activada');
    const filter = document.getElementById('salesFilter')?.value || 'all';
    renderSalesAnalysis(filter);
    // Destruir gráficos del dashboard para liberar memoria
    dashboardCharts.forEach(chart => chart.destroy());
    dashboardCharts = [];
});

// Cargar datos al iniciar si la pestaña está activa
document.addEventListener('DOMContentLoaded', function () {
    console.log('Documento cargado, verificando pestaña activa...');
    if (document.getElementById('sales-analysis-tab')?.classList.contains('active')) {
        console.log('Pestaña Análisis de Ventas activa al cargar');
        const filter = document.getElementById('salesFilter')?.value || 'all';
        loadSalesAnalysisData(filter);
    }
});

// js/orders.js
function formatPrice(price) {
    return Number(price).toFixed(2);
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
    ).toString().padStart(2, "0")}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}

async function showOrderDetails(order) {
    const orderDetailsTable = document.getElementById("orderDetailsTable");
    const orderDate = document.getElementById("orderDate");
    const orderSubtotal = document.getElementById("order-subtotal");
    const orderDiscount = document.getElementById("order-discount");
    const orderTotal = document.getElementById("order-total");
    const orderShipMode = document.getElementById("orderShipMode");
    const orderShipDate = document.getElementById("orderShipDate");

    console.log("Datos de la orden:", order);

    orderDetailsTable.innerHTML = "";
    orderDate.textContent = order.orderdate
        ? formatDate(order.orderdate)
        : "No especificada";
    orderShipMode.textContent = order.shipmode || "No especificado";
    orderShipDate.textContent = order.shipdate
        ? formatDate(order.shipdate)
        : "No especificada";

    let subtotal = 0;
    let totalDiscount = 0;
    let total = 0;

    if (order.items && order.items.length > 0) {
        for (const item of order.items) {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            const discount = Number(item.discount) || 0;

            const originalPrice = price * quantity;
            const itemDiscount =
                discount > 0 ? originalPrice * (discount / 100) : 0;
            const discountedPrice = originalPrice - itemDiscount;

            subtotal += originalPrice;
            totalDiscount += itemDiscount;
            total += discountedPrice;

            orderDetailsTable.innerHTML += `
                <tr>
                    <td>${item.productname || "Producto desconocido"}</td>
                    <td>
                        ${
                            itemDiscount > 0
                                ? `<span class="text-muted text-decoration-line-through">$${formatPrice(price)}</span> `
                                : ""
                        }
                        $${formatPrice(discountedPrice / quantity)}
                        ${
                            itemDiscount > 0
                                ? `<br><small class="text-success">(${formatPrice(
                                      discount
                                  )}% OFF)</small>`
                                : ""
                        }
                    </td>
                    <td>${quantity}</td>
                    <td>$${formatPrice(discountedPrice)}</td>
                </tr>
            `;
        }
    } else {
        orderDetailsTable.innerHTML =
            '<tr><td colspan="4" class="text-center">No hay ítems en esta orden.</td></tr>';
        total = Number(order.totalprice) || 0;
    }

    orderSubtotal.textContent = `Subtotal: $${formatPrice(subtotal)}`;
    orderDiscount.textContent = `Descuento Total: $${formatPrice(totalDiscount)}`;
    orderTotal.textContent = `Total: $${formatPrice(total)}`;

    document.getElementById("orderDetailsModalLabel").textContent = `Detalles de la Orden #${order.idorder}`;
    new bootstrap.Modal(document.getElementById("orderDetailsModal")).show();
}

async function loadOrders() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/auth/login.php";
        return;
    }

    try {
        const response = await fetch("http://192.168.100.2:3010/orders");
        const result = await response.json();
        console.log("Respuesta de backend:", result);

        const allOrders = Array.isArray(result)
            ? result
            : Array.isArray(result.orders)
                ? result.orders
                : [];

        const userOrders = allOrders.filter(order => order.iduser == user.iduser);

        const tableBody = document.getElementById("ordersTable");
        tableBody.innerHTML = "";

        if (userOrders.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="4" class="text-center">No tienes órdenes aún.</td></tr>';
        } else {
            userOrders.forEach((order) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${order.idorder}</td>
                        <td>${formatDate(order.orderdate)}</td>
                        <td>$${formatPrice(order.totalprice)}</td>
                        <td><button class="btn btn-sm" style="background-color: #1a3c34; color: white;"
                            onclick='showOrderDetails(${JSON.stringify(order)})'>Ver Detalles</button></td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        alert("Error al cargar órdenes: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", loadOrders);

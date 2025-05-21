// js/cart.js
function formatPrice(price) {
    return Number(price).toFixed(2);
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

async function addToCart(idproduct) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Por favor, inicia sesión para agregar productos al carrito.");
        window.location.href = "/auth/login.php";
        return;
    }

    try {
        const response = await fetch("http://192.168.100.2:3308/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                iduser: user.iduser,
                items: [{ idproduct, quantity: 1 }],
            }),
        });
        const data = await response.json();
        if (response.ok) {
            showToast("Producto añadido al carrito");
            loadCart();
            updateCartSummary(); // Actualizar dropdown
        } else {
            alert(data.error || "Error al añadir al carrito");
        }
    } catch (error) {
        alert("Error de conexión al agregar al carrito: " + error.message);
    }
}

async function loadCart() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
        const response = await fetch(
            `http://192.168.100.2:3308/cart/${user.iduser}`
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const cart = await response.json();
        const cartItems = document.getElementById("cart-items");
        const cartSubtotal = document.getElementById("subtotal");
        const cartDiscount = document.getElementById("discount-total");
        const cartTotal = document.getElementById("total");
        cartItems.innerHTML = "";

        if (!cart.items || cart.items.length === 0) {
            cartItems.innerHTML =
                '<tr><td colspan="5" class="text-center">El carrito está vacío.</td></tr>';
            cartSubtotal.textContent = "Subtotal: $0";
            cartDiscount.textContent = "Descuento Total: $0";
            cartTotal.textContent = "Total: $0";
        } else {
            let subtotal = 0;
            let totalDiscount = 0;
            let total = 0;

            cart.items.forEach((item) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const totalPrice = Number(item.totalprice) || 0;

                const originalPrice = price * quantity;
                const itemDiscount = originalPrice - totalPrice;
                const discountPercentage =
                    price > 0 ? (itemDiscount / originalPrice) * 100 : 0;

                subtotal += originalPrice;
                totalDiscount += itemDiscount;
                total += totalPrice;

                cartItems.innerHTML += `
                    <tr>
                        <td>${item.productname || "Producto desconocido"}</td>
                        <td>
                            ${
                                itemDiscount > 0
                                    ? `<span class="text-muted text-decoration-line-through">$${formatPrice(
                                          price
                                      )}</span> `
                                    : ""
                            }
                            $${formatPrice(totalPrice / quantity)}
                            ${
                                itemDiscount > 0
                                    ? `<br><small class="text-success">(${formatPrice(
                                          discountPercentage
                                      )}% OFF)</small>`
                                    : ""
                            }
                        </td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${
                                cart.idcart
                            }, ${item.idproduct}, ${quantity - 1})">-</button>
                            <span class="mx-2">${quantity}</span>
                            <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${
                                cart.idcart
                            }, ${item.idproduct}, ${quantity + 1})">+</button>
                        </td>
                        <td>$${formatPrice(totalPrice)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${
                            cart.idcart
                        }, ${item.idproduct})">Eliminar</button></td>
                    </tr>
                `;
            });

            cartSubtotal.textContent = `Subtotal: $${formatPrice(subtotal)}`;
            cartDiscount.textContent = `Descuento Total: $${formatPrice(
                totalDiscount
            )}`;
            cartTotal.textContent = `Total: $${formatPrice(total)}`;
        }
    } catch (error) {
        console.error("Error al cargar carrito:", error);
        document.getElementById("cart-items").innerHTML =
            '<tr><td colspan="5" class="text-center">Error al cargar el carrito.</td></tr>';
        document.getElementById("subtotal").textContent = "Subtotal: $0";
        document.getElementById("discount-total").textContent =
            "Descuento Total: $0";
        document.getElementById("total").textContent = "Total: $0";
    }
}

async function updateQuantity(idcart, idproduct, quantity) {
    try {
        const response = await fetch(
            `http://192.168.100.2:3308/cart/${idcart}/product/${idproduct}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity }),
            }
        );
        const data = await response.json();
        if (response.ok) {
            loadCart();
            updateCartSummary(); // Actualizar dropdown
        } else {
            alert(data.error || "Error al actualizar cantidad");
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}

async function removeFromCart(idcart, idproduct) {
    try {
        const response = await fetch(
            `http://192.168.100.2:3308/cart/${idcart}/product/${idproduct}`,
            {
                method: "DELETE",
            }
        );
        const data = await response.json();
        if (response.ok) {
            loadCart();
            updateCartSummary(); // Actualizar dropdown
        } else {
            alert(data.error || "Error al eliminar producto");
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}

async function confirmOrder() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartResponse = await fetch(
        `http://192.168.100.2:3308/cart/${user.iduser}`
    );
    const cart = await cartResponse.json();
    if (!cart.items || cart.items.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const modalBody = document.getElementById("modal-cart-summary");
    const modalSubtotal = document.getElementById("modal-subtotal");
    const modalDiscount = document.getElementById("modal-discount");
    const modalTotal = document.getElementById("modal-total");
    const modalShipmode = document.getElementById("modal-shipmode");
    const modalShipdate = document.getElementById("modal-shipdate");
    const modalAddress = document.getElementById("modal-address");
    const shipmodeSelect = document.getElementById("shipmode");
    const shippingAddressInput = document.getElementById("shipping-address");

    if (!modalAddress) {
        console.error("Elemento modal-address no encontrado en el DOM");
        return;
    }

    modalBody.innerHTML = "";
    let subtotal = 0;
    let totalDiscount = 0;
    let total = 0;

    cart.items.forEach((item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const totalPrice = Number(item.totalprice) || 0;

        const originalPrice = price * quantity;
        const itemDiscount = originalPrice - totalPrice;
        const discountPercentage =
            price > 0 ? (itemDiscount / originalPrice) * 100 : 0;

        subtotal += originalPrice;
        totalDiscount += itemDiscount;
        total += totalPrice;

        modalBody.innerHTML += `
            <tr>
                <td>${item.productname || "Producto desconocido"}</td>
                <td>
                    ${
                        itemDiscount > 0
                            ? `<span class="text-muted text-decoration-line-through">$${formatPrice(
                                  price
                              )}</span> `
                            : ""
                    }
                    $${formatPrice(totalPrice / quantity)}
                    ${
                        itemDiscount > 0
                            ? `<br><small class="text-success">(${formatPrice(
                                  discountPercentage
                              )}% OFF)</small>`
                            : ""
                    }
                </td>
                <td>${quantity}</td>
                <td>$${formatPrice(totalPrice)}</td>
            </tr>
        `;
    });

    modalSubtotal.textContent = `Subtotal: $${formatPrice(subtotal)}`;
    modalDiscount.textContent = `Descuento Total: $${formatPrice(
        totalDiscount
    )}`;
    modalTotal.textContent = `Total: $${formatPrice(total)}`;

    const shipmode = shipmodeSelect.value;
    const shipdate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    modalShipmode.textContent = shipmode;
    modalShipdate.textContent = formatDate(shipdate);

    // Consultar la dirección del usuario desde la API
    let userAddress = "No especificada";
    try {
        const userResponse = await fetch(
            `http://192.168.100.2:3009/usuarios/${user.iduser}`
        );
        if (userResponse.ok) {
            const userData = await userResponse.json();
            userAddress = userData.address || "No especificada"; // Usar la dirección de la API si existe
        } else {
            console.error(
                "Error al obtener datos del usuario:",
                userResponse.status
            );
        }
    } catch (error) {
        console.error("Error de conexión al consultar usuario:", error);
    }

    shippingAddressInput.value = userAddress; // Establecer la dirección obtenida
    modalAddress.textContent = shippingAddressInput.value;

    shippingAddressInput.addEventListener("input", () => {
        modalAddress.textContent =
            shippingAddressInput.value || "No especificada";
    });

    shipmodeSelect.addEventListener("change", () => {
        modalShipmode.textContent = shipmodeSelect.value;
    });

    new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

async function processOrder() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const shipmode = document.getElementById("shipmode").value;
    const shippingAddress =
        document.getElementById("shipping-address").value || "No especificada";

    // 🔧 Fecha en formato compatible con MySQL
    const shipdate = new Date(Date.now() + 2 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    try {
        const response = await fetch("http://192.168.100.2:3010/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                iduser: user.iduser,
                shipmode,
                shipdate,
                address: shippingAddress,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Orden procesada con éxito");
            loadCart();
            updateCartSummary(); // Actualizar dropdown
            bootstrap.Modal.getInstance(
                document.getElementById("confirmModal")
            ).hide();
        } else {
            alert(data.error || "Error al procesar la orden");
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}


function showToast(message) {
    const toast = new bootstrap.Toast(document.getElementById("liveToast"));
    document.querySelector(".toast-body").textContent = message;
    toast.show();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updateCartSummary(); // Actualizar dropdown al cargar la página
});


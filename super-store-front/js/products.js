// Carga y filtrado de productos

// Función para formatear precios a 2 decimales
function formatPrice(price) {
    return Number(price).toFixed(2);
}

async function loadCategories() {
    const response = await fetch("http://192.168.100.2:3001/productos");
    const products = await response.json();
    const categories = [...new Set(products.map((p) => p.category))];
    const categorySelect = document.getElementById("categorySelect");
    categories.forEach((cat) => {
        categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

async function loadSubcategories() {
    const response = await fetch("http://192.168.100.2:3001/productos");
    const products = await response.json();
    const subcategories = [...new Set(products.map((p) => p.subcategory))];
    const subcategorySelect = document.getElementById("subcategorySelect");
    subcategories.forEach((sub) => {
        subcategorySelect.innerHTML += `<option value="${sub}">${sub}</option>`;
    });
}

async function loadProducts() {
    try {
        const response = await fetch("http://192.168.100.2:3001/productos");
        const products = await response.json();
        const container = document.getElementById("productsContainer");
        container.innerHTML = "";
        products.forEach((product) => {
            const discountPrice = product.price * (1 - product.discount / 100);
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title" data-category="${
                                product.category
                            }" data-subcategory="${product.subcategory}">${
                product.productname
            }</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text ${
                                product.discount > 0
                                    ? "text-muted text-decoration-line-through"
                                    : ""
                            }">$${formatPrice(product.price)}</p>
                            ${
                                product.discount > 0
                                    ? `<p class="card-text text-success">$${formatPrice(
                                          discountPrice
                                      )} (${product.discount}% OFF)</p>`
                                    : ""
                            }
                            <p class="card-text">Stock: ${product.stock}</p>
                            <button class="btn" style="background-color: #1a3c34; color: white;" 
                                onclick="addToCart(${product.idproduct})" ${
                product.stock === 0 ? "disabled" : ""
            }>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        alert("Error al cargar productos: " + error.message);
    }
}

function filterProducts() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;
    const subcategory = document.getElementById("subcategorySelect").value;
    const products = document.querySelectorAll("#productsContainer .col-md-4");
    products.forEach((product) => {
        const name = product
            .querySelector(".card-title")
            .textContent.toLowerCase();
        const productCategory = product
            .querySelector(".card-title")
            .getAttribute("data-category");
        const productSubcategory = product
            .querySelector(".card-title")
            .getAttribute("data-subcategory");
        const matchesSearch = name.includes(search);
        const matchesCategory = !category || productCategory === category;
        const matchesSubcategory =
            !subcategory || productSubcategory === subcategory;
        product.style.display =
            matchesSearch && matchesCategory && matchesSubcategory
                ? ""
                : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadSubcategories();
    loadProducts();
    document
        .getElementById("searchInput")
        .addEventListener("input", filterProducts);
    document
        .getElementById("categorySelect")
        .addEventListener("change", filterProducts);
    document
        .getElementById("subcategorySelect")
        .addEventListener("change", filterProducts);
});


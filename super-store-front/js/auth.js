// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value.trim(); // Quitamos espacios
            const password = document.getElementById("password").value.trim();
            console.log("Email ingresado:", email); // Depuración
            console.log("Password ingresado:", password); // Depuración

            // Caso especial para admin
            if (email === "admin@admin" && password === "1234") {
                console.log("Detectado login como admin"); // Depuración
                const adminUser = {
                    username: "admin",
                    email: "admin",
                    iduser: 0,
                    isAdmin: true,
                };
                localStorage.setItem("user", JSON.stringify(adminUser));
                console.log(
                    "Usuario guardado en localStorage:",
                    localStorage.getItem("user")
                ); // Depuración
                window.location.href = "/admin.php";
                return;
            }

            // Login normal
            try {
                console.log("Intentando login normal con el backend"); // Depuración
                const response = await fetch(
                    "http://192.168.100.2:3009/usuarios/login",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    window.location.href = "/products.php";
                } else {
                    alert(data.error || "Error al iniciar sesión");
                }
            } catch (error) {
                alert("Error de conexión: " + error.message);
            }
        });
    }

    // Registro (sin cambios)
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const userData = {
                username: document.getElementById("username").value,
                fullname: document.getElementById("fullname").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                address: document.getElementById("address").value,
                country: document.getElementById("country").value,
                city: document.getElementById("city").value,
                postalcode: document.getElementById("postalcode").value,
                region: document.getElementById("region").value,
            };
            try {
                const response = await fetch(
                    "http://192.168.100.2:3009/usuarios",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData),
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    alert("Registro exitoso. Por favor, inicia sesión.");
                    window.location.href = "/auth/login.php";
                } else {
                    alert(data.error || "Error al registrarse");
                }
            } catch (error) {
                alert("Error de conexión: " + error.message);
            }
        });
    }
});

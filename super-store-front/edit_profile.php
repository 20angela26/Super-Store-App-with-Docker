<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Perfil - Super Store</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Editar Perfil</h2>
        <form id="editProfileForm" class="col-md-8 mx-auto">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="editUsername" class="form-label">Nombre de Usuario</label>
                    <input type="text" class="form-control" id="editUsername" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="fullname" class="form-label">Nombre Completo</label>
                    <input type="text" class="form-control" id="fullname" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control" id="password" placeholder="Dejar en blanco para no cambiar">
                        <button type="button" class="btn btn-outline-secondary" id="togglePassword">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="address">
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="country" class="form-label">País</label>
                    <input type="text" class="form-control" id="country">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="city">
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label for="postalcode" class="form-label">Código Postal</label>
                    <input type="text" class="form-control" id="postalcode">
                </div>
                <div class="col-md-8 mb-3">
                    <label for="region" class="form-label">Región/Estado</label>
                    <input type="text" class="form-control" id="region">
                </div>
            </div>
            <button type="submit" class="btn w-100" style="background-color: #1a3c34; color: white;">Guardar Cambios</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/navbar.js"></script>
    <script>
        (function() {
            // Verificar usuario y redirigir si no está logueado
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Usuario en localStorage:', user);
            if (!user) {
                window.location.href = '/auth/login.php';
                return;
            }

            // Cargar datos del usuario
            async function loadUserData() {
                console.log('Cargando datos para iduser:', user.iduser);
                try {
                    const response = await fetch(`http://192.168.100.3:3009/usuarios/${user.iduser}`);
                    const userData = await response.json();
                    console.log('Datos recibidos del backend:', userData);
                    if (response.ok) {
                        document.getElementById('editUsername').value = userData.username || '';
                        document.getElementById('fullname').value = userData.fullname || '';
                        document.getElementById('email').value = userData.email || '';
                        document.getElementById('address').value = userData.address || '';
                        document.getElementById('country').value = userData.country || '';
                        document.getElementById('city').value = userData.city || '';
                        document.getElementById('postalcode').value = userData.postalcode || '';
                        document.getElementById('region').value = userData.region || '';
                    } else {
                        alert('Error al cargar datos: ' + (userData.error || 'Respuesta no OK'));
                    }
                } catch (error) {
                    alert('Error de conexión: ' + error.message);
                    console.error('Error en fetch:', error);
                }
            }

            // Guardar cambios
            document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
                e.preventDefault();

                // Capturar el valor del input
                const usernameInput = document.getElementById('editUsername').value;
                console.log('Valor del input editUsername justo antes de enviar:', usernameInput);

                const updatedUser = {
                    username: usernameInput,
                    fullname: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value || undefined,
                    address: document.getElementById('address').value || undefined,
                    country: document.getElementById('country').value || undefined,
                    city: document.getElementById('city').value || undefined,
                    postalcode: document.getElementById('postalcode').value || undefined,
                    region: document.getElementById('region').value || undefined
                };
                console.log('Datos enviados al backend:', updatedUser);

                try {
                    const response = await fetch(`http://192.168.100.3:3009/usuarios/${user.iduser}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedUser)
                    });
                    const data = await response.json();
                    console.log('Respuesta del backend tras guardar:', data);
                    if (response.ok) {
                        alert('Perfil actualizado con éxito');
                        localStorage.setItem('user', JSON.stringify({ ...user, username: updatedUser.username }));
                        document.querySelector('#username').textContent = updatedUser.username; // Actualiza el span en navbar
                        updateUserSummary();
                    } else {
                        alert(data.error || 'Error al actualizar el perfil');
                    }
                } catch (error) {
                    alert('Error de conexión: ' + error.message);
                    console.error('Error en fetch PUT:', error);
                }
            });

            // Alternar visibilidad de la contraseña
            document.getElementById('togglePassword').addEventListener('click', function () {
                const passwordInput = document.getElementById('password');
                const icon = this.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });

            // Cargar datos al iniciar
            document.addEventListener('DOMContentLoaded', loadUserData);
        })();
    </script>
</body>
</html>
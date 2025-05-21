<?php
// No necesitamos session_start() porque no usamos $_SESSION
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cerrando Sesión - Super Store</title>
</head>
<body>
    <script>
        localStorage.removeItem('user');
        window.location.href = '/index.php';
    </script>
</body>
</html>
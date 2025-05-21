-- Primero creamos todas las bases de datos
CREATE DATABASE IF NOT EXISTS productosbd;
CREATE DATABASE IF NOT EXISTS usuariosbd;
CREATE DATABASE IF NOT EXISTS orderbd;
CREATE DATABASE IF NOT EXISTS carritobd;

-- Tabla de productos (primera porque es referenciada por otras)
USE productosbd;

CREATE TABLE IF NOT EXISTS productos (
    idproduct INT(11) NOT NULL AUTO_INCREMENT,
    productname VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    stock INT(11) NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0.00,
    PRIMARY KEY (idproduct)
);

-- Insertamos productos primero
INSERT INTO productos (idproduct, productname, category, subcategory, description, stock, price, discount) VALUES
(1, 'Bush Somerset Collection Bookcase', 'Furniture', 'Bookcases', 'Bush Somerset Collection Bookcase de categoría Furniture', 81, 130.98, 0.0),
(2, 'Hon Deluxe Fabric Upholstered Stacking Chairs, Rounded Back', 'Furniture', 'Chairs', 'Hon Deluxe Fabric Upholstered Stacking Chairs, Rounded Back de categoría Furniture', 98, 243.98, 0.0),
(3, 'Self-Adhesive Address Labels for Typewriters by Universal', 'Office Supplies', 'Labels', 'Self-Adhesive Address Labels for Typewriters by Universal de categoría Office Supplies', 88, 7.31, 0.0),
(4, 'Bretford CR4500 Series Slim Rectangular Table', 'Furniture', 'Tables', 'Bretford CR4500 Series Slim Rectangular Table de categoría Furniture', 24, 191.52, 0.45),
(5, 'Eldon Fold ''N Roll Cart System', 'Office Supplies', 'Storage', 'Eldon Fold ''N Roll Cart System de categoría Office Supplies', 66, 11.18, 0.2),
(6, 'Eldon Expressions Wood and Plastic Desk Accessories, Cherry Wood', 'Furniture', 'Furnishings', 'Eldon Expressions Wood and Plastic Desk Accessories, Cherry Wood de categoría Furniture', 49, 6.98, 0.0),
(7, 'Newell 322', 'Office Supplies', 'Art', 'Newell 322 de categoría Office Supplies', 52, 1.82, 0.0),
(8, 'Mitel 5320 IP Phone VoIP phone', 'Technology', 'Phones', 'Mitel 5320 IP Phone VoIP phone de categoría Technology', 31, 151.19, 0.2),
(9, 'DXL Angle-View Binders with Locking Rings by Samsill', 'Office Supplies', 'Binders', 'DXL Angle-View Binders with Locking Rings by Samsill de categoría Office Supplies', 83, 6.17, 0.2);

-- Tabla de usuarios (referenciada por orders y cart)
USE usuariosbd;

CREATE TABLE IF NOT EXISTS usuarios (
    iduser INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postalcode VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    PRIMARY KEY (iduser)
);

-- Insertamos usuarios
INSERT INTO usuarios (iduser, username, fullname, password, address, country, city, email, postalcode, region) VALUES
(1, 'admin', 'Administrador Principal', '1234', 'Oficina Central', 'Colombia', 'Bogota', 'admin@admin', '110111', 'Andina'),
(2, 'clairegute', 'Claire Gute', '1234', 'Calle 154', 'United States', 'Henderson', 'cg-12520@correo.com', '42420', 'South'),
(3, 'darrinvanhuff', 'Darrin Van Huff', '1234', 'Calle 2', 'United States', 'Los Angeles', 'dv-13045@correo.com', '90036', 'West'),
(4, 'seano''donnell', 'Sean O''Donnell', '1234', 'Calle 35', 'United States', 'Fort Lauderdale', 'so-20335@correo.com', '33311', 'South'),
(5, 'brosinahoffman', 'Brosina Hoffman', '1234', 'Calle 104', 'United States', 'Los Angeles', 'bh-11710@correo.com', '90032', 'West'),
(6, 'andrewallen', 'Andrew Allen', '1234', 'Calle 73', 'United States', 'Concord', 'aa-10480@correo.com', '28027', 'South'),
(7, 'irenemaddox', 'Irene Maddox', '1234', 'Calle 169', 'United States', 'Seattle', 'im-15070@correo.com', '98103', 'West'),
(8, 'haroldpawlan', 'Harold Pawlan', '1234', 'Calle 188', 'United States', 'Fort Worth', 'hp-14815@correo.com', '76106', 'Central'),
(9, 'petekriz', 'Pete Kriz', '1234', 'Calle 8', 'United States', 'Madison', 'pk-19075@correo.com', '53711', 'Central'),
(10, 'alejandrogrove', 'Alejandro Grove', '1234', 'Calle 39', 'United States', 'West Jordan', 'ag-10270@correo.com', '84084', 'West'),
(11, 'zuschussdonatelli', 'Zuschuss Donatelli', '1234', 'Calle 139', 'United States', 'San Francisco', 'zd-21925@correo.com', '94109', 'West'),
(12, 'kenblack', 'Ken Black', '1234', 'Calle 120', 'United States', 'Fremont', 'kb-16585@correo.com', '68025', 'Central'),
(13, 'sandraflanagan', 'Sandra Flanagan', '1234', 'Calle 157', 'United States', 'Philadelphia', 'sf-20065@correo.com', '19140', 'East');

-- Tabla de órdenes (usa LONGTEXT en lugar de JSON para MySQL 5.7)
USE orderbd;

CREATE TABLE IF NOT EXISTS orders (
    idorder INT(11) NOT NULL AUTO_INCREMENT,
    iduser INT(11) NOT NULL,
    items LONGTEXT NOT NULL COMMENT 'Almacena JSON como texto',
    discount DECIMAL(10,2) DEFAULT 0.00,
    shipmode VARCHAR(50) NOT NULL,
    totalprice DECIMAL(10,2) NOT NULL,
    shipdate DATETIME DEFAULT NULL,
    orderdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idorder)
);

-- Insertamos órdenes (con referencias válidas)
INSERT INTO orders (iduser, items, discount, shipmode, totalprice, shipdate, orderdate) VALUES
(2, '[{\"idproduct\": 1, \"quantity\": 2}, {\"idproduct\": 2, \"quantity\": 3}]', 0.0, 'Second Class', 993.9, '2016-11-11 00:00:00', '2016-11-08 00:00:00'),
(3, '[{\"idproduct\": 3, \"quantity\": 2}]', 0.0, 'Second Class', 14.62, '2016-06-16 00:00:00', '2016-06-12 00:00:00'),
(4, '[{\"idproduct\": 4, \"quantity\": 5}, {\"idproduct\": 5, \"quantity\": 2}]', 0.65, 'Standard Class', 979.95, '2015-10-18 00:00:00', '2015-10-11 00:00:00');

-- Tabla de carrito
USE carritobd;

CREATE TABLE IF NOT EXISTS cart (
    idcart INT(11) NOT NULL AUTO_INCREMENT,
    iduser INT(11) NOT NULL UNIQUE,
    items LONGTEXT NOT NULL COMMENT 'Almacena JSON como texto',
    totalprice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idcart)
);

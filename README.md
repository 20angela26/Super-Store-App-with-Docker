# SUPER STORE APP WEB
Esta aplicación es una plataforma de compras desarrollada con una arquitectura basada en microservicios. Está diseñada para gestionar dos tipos de usuarios:  **clientes** y **administradores**, cada uno con permisos y funcionalidades específicas.

El objetivo principal de la aplicación es permitir que los usuarios realicen compras de forma fácil y organizada. Los usuarios convencionales pueden:
- Ver los productos disponibles en la tienda.

- Agregar productos a su carrito de compras.

- Generar un pedido a partir del contenido del carrito.

- Indicar la dirección a la que desean que se les envíen los productos.

Por otro lado, los administradores cuentan con un perfil más completo que les permite:

-  Visualizar todos los usuarios registrados.

- Consultar todas las órdenes generadas por los clientes. 

- Agregar nuevos productos a la tienda.

- Editar o actualizar la información de los productos existentes.

Acceder a un panel de estadísticas para analizar el desempeño general de la tienda.
# Instalación y Configuración del Proyecto

Para recrear este proyecto correctamente, asegúrese de seguir los pasos de instalación detallados a continuación.



## 1. Requisitos Previos

### 1.1 Instalación de VirtualBox  
Descargue e instale la última versión de **VirtualBox** desde el siguiente enlace:  
👉 [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

La instalación puede realizarse utilizando los valores predeterminados, sin necesidad de configuración adicional.

### 1.2 Instalación de Vagrant  
Descargue e instale la última versión de **Vagrant** desde el siguiente enlace:  
👉 [https://releases.hashicorp.com/vagrant/](https://releases.hashicorp.com/vagrant/)

### 1.3 Instalación del Plugin `vbguest`  
Para asegurar que las *Guest Additions* de VirtualBox se mantengan actualizadas, instale el siguiente plugin ejecutando:

```bash
vagrant plugin install vagrant-vbguest
```

Este plugin mejora el rendimiento e integración entre la máquina anfitriona y las máquinas virtuales.



## 2. Configuración y Creación de las Máquinas Virtuales

Este entorno de desarrollo utiliza dos máquinas virtuales: una para el **cliente** y otra para el **servidor**.

### Pasos de configuración:

1. Cree un directorio y asígnele un nombre, por ejemplo `prueba`:

```bash
mkdir prueba
cd prueba
```

2. Inicialice el proyecto Vagrant dentro del directorio:

```bash
vagrant init
```

Este comando generará un archivo llamado `Vagrantfile`, que deberá modificar con el siguiente contenido.



## 3. Contenido del Archivo `Vagrantfile`

Reemplace el contenido generado por el siguiente:

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  if Vagrant.has_plugin? "vagrant-vbguest"
    config.vbguest.no_install = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote = true
  end

  config.vm.define :clienteUbuntu do |clienteUbuntu|
    clienteUbuntu.vm.box = "bento/ubuntu-22.04"
    clienteUbuntu.vm.network :private_network, ip: "192.168.100.3"
    clienteUbuntu.vm.hostname = "clienteUbuntu"
    clienteUbuntu.vm.box_download_insecure = true
  end

  config.vm.define :servidorUbuntu do |servidorUbuntu|
    servidorUbuntu.vm.box = "bento/ubuntu-22.04"
    servidorUbuntu.vm.network :private_network, ip: "192.168.100.2"
    servidorUbuntu.vm.hostname = "servidorUbuntu"
    servidorUbuntu.vm.box_download_insecure = true
  end
end
```

Este archivo define dos máquinas virtuales:

- `servidorUbuntu`: con IP `192.168.100.2`  
- `clienteUbuntu`: con IP `192.168.100.3`  

Ambas instanciadas a partir del box `bento/ubuntu-22.04`.



## 4. Arranque y Acceso a las Máquinas

Una vez configurado el `Vagrantfile`, ejecute el siguiente comando para iniciar ambas máquinas virtuales:

```bash
vagrant up
```

Para acceder a cualquiera de ellas mediante SSH, utilice:

```bash
vagrant ssh servidorUbuntu
```

o

```bash
vagrant ssh clienteUbuntu
```



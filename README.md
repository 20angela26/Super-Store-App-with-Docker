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



###  Requisitos Previos

###  Instalación de VirtualBox  
Descargue e instale la última versión de **VirtualBox** desde el siguiente enlace:  
👉 [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

La instalación puede realizarse utilizando los valores predeterminados, sin necesidad de configuración adicional.

###  Instalación de Vagrant  
Descargue e instale la última versión de **Vagrant** desde el siguiente enlace:  
👉 [https://releases.hashicorp.com/vagrant/](https://releases.hashicorp.com/vagrant/)

###  Instalación del Plugin `vbguest`  
Para asegurar que las *Guest Additions* de VirtualBox se mantengan actualizadas, instale el siguiente plugin ejecutando:

```bash
vagrant plugin install vagrant-vbguest
```

Este plugin mejora el rendimiento e integración entre la máquina anfitriona y las máquinas virtuales.



## Configuración y Creación de las Máquinas Virtuales

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

para acceder como root utilice el siguiente comado:
```bash
sudo -i
```

## Node.js (Servidor Ubuntu)



###### Requisitos Previos

- Acceso administrativo (sudo) en el servidor
- Conexión a Internet estable
- Ubuntu 18.04/20.04/22.04 LTS

#### Pasos de Instalación

###### Actualizar el sistema e instalar dependencias


    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install curl gnupg2 gnupg ca-certificates -y


## Instalación y Configuración de MySQL

Para instalar MySQL en el sistema, sigue los siguientes pasos:

##### **Instalar el servidor MySQL**

Ejecuta el siguiente comando en la terminal:

```bash
sudo apt-get install mysql-server
```
##### Iniciar el servicio de MySQL
Una vez instalado, inicia el servicio con:

```bash
sudo systemctl start mysql.service
```

##### Corregir un bug de la versión actual
Antes de ejecutar la herramienta de configuración segura, es necesario corregir un bug presente en la versión más reciente. Para ello, accede al entorno de MySQL:

     sudo mysql
Luego, ejecuta el siguiente comando para permitir el cambio de contraseña del usuario root:


    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
Sal del entorno de MySQL con:

    exit

##### Configurar la instalación segura
Ejecuta el siguiente comando para iniciar la configuración segura de MySQL:

    sudo mysql_secure_installation
**Durante la configuración**:
Cambia nuevamente la contraseña del usuario root si se solicita.

## Docker :whale:
Este procedimiento debe realizarse en ambas máquinas: servidorUbuntu y clienteUbuntu.

🔧  **Eliminar versiones anteriores de Docker
Antes de instalar Docker, elimine cualquier versión anterior:**

    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do 
        sudo apt-get remove -y $pkg
    done
🔑  **Agregar la clave GPG oficial de Docker**

    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

**Agregue el repositorio a Apt sources:**


    echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update



🚀  **Instalar Docker Engine**

    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
⚙️  **Docker Compose**
Docker Compose también debe estar disponible en ambas máquinas (servidorPiccoling y clientePiccoling).

✅ **Verificar la instalación de Docker Compose**
    docker compose version
📝 Configurar Vim para trabajar con archivos YAML
Cree el archivo de configuración de Vim si no existe:


**vim ~/.vimrc**
Agregue la siguiente configuración para mejorar la edición de archivos .yaml y .yml:

    " Configuración para trabajar con archivos YAML
    au! BufNewFile,BufReadPost *.{yaml,yml} set filetype=yaml foldmethod=indent
    autocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab

### Instalación y Configuración de Apache Spark en Entorno Distribuido (ServidorUbuntu y ClienteUbuntu) 💫
Este documento describe paso a paso cómo instalar y configurar Apache Spark 3.5.1 sobre Hadoop 3 en dos máquinas Ubuntu. La configuración está diseñada para ejecutar Spark en modo standalone distribuido, con una máquina actuando como Spark Master y otra como Spark Worker.

**Requisitos Previos**

- Dos máquinas Ubuntu con conexión de red entre ellas.

- Acceso root o permisos de sudo.

- Conectividad entre las IPs:

- ServidorUbuntu: 192.168.100.2

- ClienteUbuntu: 192.168.100.3

##### Actualización de Paquetes e Instalación de Java
Apache Spark requiere una máquina virtual de Java para funcionar. En ambas máquinas, ejecuta los siguientes comandos:


    sudo apt update
    sudo apt install -y openjdk-18-jdk
#####  Configuración de Variables de Entorno para Java
Para facilitar el acceso a Java desde cualquier lugar del sistema, creamos un archivo de configuración persistente:



    cat <<EOF | sudo tee /etc/profile.d/jdk18.sh
    export JAVA_HOME=/usr/lib/jvm/java-1.18.0-openjdk-amd64
    export PATH=\$PATH:\$JAVA_HOME/bin
    EOF
Aplica la configuración inmediatamente:



    source /etc/profile.d/jdk18.sh
Puedes verificar que Java esté correctamente instalado con:




    java  -version
#####  Preparar el Entorno para Spark
En ambas máquinas, crea un directorio dedicado para almacenar los archivos de Apache Spark:



    mkdir labSpark
    cd labSpark
 Descargar y Descomprimir Apache Spark
Descargamos la versión deseada de Spark  en este caso, 3.5.5 con soporte para Hadoop :



    wget https://dlcdn.apache.org/spark/spark-3.5.5/spark-3.5.5-bin-hadoop3.tgz
Procede a descomprimir el archivo:



    
    tar -xvzf spark-3.5.1-bin-hadoop3.tgz
######  Configuración del Entorno de Spark
Accede al directorio de configuración de Spark:




    cd spark-3.5.1-bin-hadoop3/conf/
Copia la plantilla de configuración para editarla:



    cp spark-env.sh.template spark-env.sh
Abre el archivo spark-env.sh con tu editor favorito:




    vim spark-env.sh
Agrega las siguientes variables de entorno al final del archivo, según el rol de cada máquina:

En ClienteUbuntu (Máster)



    SPARK_LOCAL_IP=192.168.100.3
    SPARK_MASTER_HOST=192.168.100.3
En ClienteUbuntu (Worker)


    
    SPARK_LOCAL_IP=192.168.100.2
    SPARK_MASTER_HOST=192.168.100.3
Nota: SPARK_MASTER_HOST debe apuntar a la IP del nodo maestro desde ambas máquinas.

✅ Próximos pasos
Una vez completada la configuración en ambas máquinas:

Puedes iniciar el servidor maestro ejecutando en ClienteUbuntu:




    ./sbin/start-master.sh
Luego, inicia el worker en cada máquina (incluyendo el cliente si deseas que también trabaje como worker):



    ./sbin/start-worker.sh spark://192.168.100.3:7077
Accede a la interfaz web de Spark para verificar los nodos conectados:
📍 http://192.168.100.3:8080

# 🐍 Instalación de Python, PIP y Librerías Necesarias
Para interactuar con Apache Spark desde Python, especialmente mediante PySpark, es necesario tener Python 3, PIP y algunas librerías instaladas en el sistema.

Sigue los pasos a continuación en ambas máquinas (ServidorUbuntu y ClienteUbuntu).

### Instalación de Python 3 y PIP
Ejecuta los siguientes comandos para asegurarte de tener Python 3 y el gestor de paquetes pip instalados:



    sudo apt-get update
	
    sudo apt-get install -y python3
	
    sudo apt-get install -y python3-pip
Nota: Asegúrate de usar python3-pip para instalar la versión compatible con Python 3.

### Instalación de Librerías Python
A continuación, instalamos las bibliotecas requeridas para trabajar con Spark y bases de datos desde Python:

- PySpark
Instala el paquete que permite ejecutar código Spark desde Python:

```bash
    sudo pip3 install pyspark
```
- PyMySQL
Este paquete permite interactuar con bases de datos MySQL desde Python:


```bash
    pip3 install pymysql
```
✅ Verificación
Para asegurarte de que las librerías se han instalado correctamente, puedes ejecutar:




```bash
python3 -c "import pyspark; print('PySpark instalado correctamente')"

python3 -c "import pymysql; print('PyMySQL instalado correctamente')"
```

# Inicio de la Aplicación Super-Store App

A continuación, se presenta una guía paso a paso para poner en funcionamiento correctamente la aplicación **Super-Store App**.


Este repositorio contiene una aplicación completa de Super-Store implementada con arquitectura de microservicios y desplegada usando Docker Compose. El sistema consta de múltiples servicios interconectados incluyendo frontend, microservicios backend y una base de datos MySQL, todos orquestados para alta disponibilidad y escalabilidad.

**Arquitectura Del Sistema**
La aplicación sigue un patrón de diseño de microservicios con los siguientes componentes:

**Frontend(super-store-front):** Aplicación PHP/JS que sirve la interfaz de usuario (puerto 8080)

**Microservicios Backend(super-store-back):**

Servicio de Usuarios (puerto 3009)

Servicio de Productos (puerto 3001)

Servicio de Órdenes (puerto 3010)

Servicio de Carrito de Compras (puerto 3308)

**Servicios de Datos:**

**Base de datos MySQL (init.sql)**(puerto 3307)

**Servidor de Análisis** (API Flask en puerto 3020)

------------


#### Requisitos Previos
Antes del despliegue, asegúrese de tener:

- Docker Engine (versión 20.10.0 o superior)

- Docker Compose (versión 3.8 o superior)

- Git

- Servidor Ubuntu 

##### Instrucciones de Despliegue
Clonar el repositorio:


    git clone https://github.com/20angela26/Super-Store-App-with-Docker.git
    cd Super-Store-App-with-Docker
Iniciar la aplicación:


    docker-compose up -d
**Verificar servicios:**


    docker-compose ps



Para verificar el estado de los servicios:


    docker-compose logs [nombre_servicio]
**Escalabilidad**
Ajuste el número de réplicas en el archivo docker-compose.yml y redespiegue:

    docker-compose up -d --scale [nombre_servicio]=[cantidad_deseada]

###  Despliegue con Docker Swarm
Este proyecto está diseñado para ejecutarse también en un entorno de clúster utilizando Docker Swarm, lo cual permite escalar los servicios, distribuir la carga entre varios nodos y lograr alta disponibilidad. A continuación, se describe el proceso para inicializar el clúster, agregar nodos y desplegar los servicios definidos en el archivo docker-compose.yml.

**Inicializar el clúster Swarm**
En el nodo principal (manager), ejecute el siguiente comando para inicializar el clúster:


    docker swarm init
Este comando devolverá una línea con un token que se usará para unir los nodos trabajadores al clúster. Guárdelo o cópielo.

  **Agregar nodos al clúster**
En cada nodo trabajador, ejecute el comando que le indicó el nodo manager. El comando tiene una estructura como esta:

    docker swarm join --token <TOKEN> <IP_DEL_MANAGER>

Esto conectará el nodo al clúster como trabajador (worker). También puede agregar más managers si lo desea para mayor disponibilidad.

**Verificar los nodos en el clúster**
En el nodo manager, ejecute:
    
        docker node ls

Este comando muestra todos los nodos que forman parte del clúster y su estado actual.

##### Desplegar la aplicación con Docker Swarm
Una vez todos los nodos estén conectados, puede desplegar la aplicación ejecutando en el nodo manager:


    docker stack deploy -c docker-compose.yml super-store

Esto iniciará todos los servicios definidos en el archivo docker-compose.yml como parte de una pila (stack) llamada superstore.

**Comprobar los servicios desplegados**
Para verificar que los servicios estén corriendo correctamente, utilice:

    docker service ls



## Análisis personalizado con Apache Spark 
Si estás interesado en realizar un análisis personalizado de esta aplicación, puedes hacerlo siguiendo estos pasos:

1. Ingresar al laboratorio Spark
Accede a tu entorno donde tienes instalado Spark (en este caso, por ejemplo, spark-3.5.5-bin-hadoop3).

Crea un directorio donde estará tu análisis. Puedes llamarlo, por ejemplo, main.py:

    mkdir ~/spark_analysis
    cd ~/spark_analysis
    touch main.py
En ese archivo (main.py) puedes escribir el código necesario para procesar tu dataset con PySpark.

### Configurar el clúster Spark
**Lanzar el master**
Desde la carpeta spark-3.5.5-bin-hadoop3, inicia el nodo master en modo cliente:

    ./sbin/start-master.sh
Esto levantará el servicio Spark Master en el puerto 7077. Puedes comprobarlo accediendo en tu navegador a:


    http://localhost:8080

**Lanzar los workers**
Luego, desde las dos máquinas que actuarán como workers, ejecuta:

    ./sbin/start-worker.sh spark://<IP_DEL_MASTER>:7077
Esto conectará ambos workers al clúster del master.

Asegúrate de reemplazar <IP_DEL_MASTER> por la IP real del nodo master que se mostró en la interfaz web o en consola al iniciar el master.

**Ejecutar tu análisis**
Una vez el clúster esté listo, puedes ejecutar el archivo main.py así:

    ./bin/spark-submit --master spark://<IP_DEL_MASTER>:7077 ~/spark_analysis/main.py
Esto enviará tu análisis al clúster para que lo procese en paralelo.

**Reemplazar el análisis por defecto del servidor**

La aplicación incluye un pequeño servidor Flask en la carpeta server, el cual sirve un archivo JSON que representa un análisis hecho sobre el dataset original.

**Si deseas usar tu propio dataset o cambiar el análisis, puedes seguir estos pasos**:

Escribe tu script main.py con el nuevo análisis.

Asegúrate de que el script guarde el resultado en formato JSON, por ejemplo:

    resultado.write.json("server/datos.json")

Reemplaza el archivo original del servidor (ubicado en server/Respuestas.json) por el tuyo.

Cuando corras nuevamente el contenedor del servicio servidor, este leerá tu nuevo archivo y lo expondrá en el puerto 3020.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

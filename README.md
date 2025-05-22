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



```bash
from pyspark.sql import SparkSession
from pyspark.sql.functions import sum, col, desc, to_date, year, trim, month, when, mean
from pyspark.sql.types import DoubleType
import os
import json

# Rutas
INPUT_PATH = "/root/labSpark/dataset/sampleSuperstore.csv"
OUTPUT_PATH = "/root/resultados.txt"
JSON_OUTPUT_PATH = "/root/server/respuestas.json"

def initialize_spark(app_name):
    return SparkSession.builder \
        .appName(app_name) \
        .config("spark.driver.memory", "4g") \
        .getOrCreate()

def load_and_prepare_data(spark, input_path):
    df = spark.read \
        .option("header", "true") \
        .option("inferSchema", "true") \
        .option("encoding", "ISO-8859-1") \
        .csv(input_path)

    # Conversión y limpieza de columnas
    df = df.withColumn("Sales", trim(col("Sales")).cast("double"))
    df = df.withColumn("Profit", trim(col("Profit")).cast("double"))
    df = df.withColumn("Discount", trim(col("Discount")).cast("double"))
    df = df.withColumn("Quantity", trim(col("Quantity")).cast("int"))

    # Formateo de fecha
    df = df.withColumn("Order Date", to_date(col("Order Date"), "M/d/yyyy"))
    df = df.withColumn("Year", year(col("Order Date")))

    # Cálculo de precio con descuento
    df = df.withColumn("Total Discounted Sales", col("Sales") * (1 - col("Discount")))

    # Cálculo de temporada
    df = df.withColumn("Temporada", when(col("Order Date").between('12-01', '02-28'), 'Invierno')
                                    .when(col("Order Date").between('06-01', '08-31'), 'Verano')
                                    .otherwise('Otoño/Primavera'))

    df.cache()
    return df

def analyze_ventas_1(df, output_file):
    resultados = {}
    with open(output_file, "w", encoding="utf-8") as f:
        # 1. Producto más vendido por valor
        ventas_producto = df.groupBy("Product Name").agg(sum("Sales").alias("TotalVentas"))
        producto_top_ventas = ventas_producto.orderBy(desc("TotalVentas")).first()
        if producto_top_ventas:
            f.write(f"\n🔝 [1] Producto más vendido (valor): {producto_top_ventas['Product Name']}\n")
            f.write(f"💰 Ventas totales: ${producto_top_ventas['TotalVentas']:,.2f}\n")
            resultados["producto_mas_vendido_valor"] = {
                "producto": producto_top_ventas['Product Name'],
                "ventas_totales": round(producto_top_ventas['TotalVentas'], 2)
            }

        # 2. Producto con más unidades vendidas
        cantidad_producto = df.groupBy("Product Name").agg(sum("Quantity").alias("TotalUnidades"))
        producto_top_unidades = cantidad_producto.orderBy(desc("TotalUnidades")).first()
        if producto_top_unidades:
            f.write(f"\n📦 [2] Producto más vendido (unidades): {producto_top_unidades['Product Name']}\n")
            f.write(f"📊 Unidades vendidas: {producto_top_unidades['TotalUnidades']}\n")
            resultados["producto_mas_vendido_unidades"] = {
                "producto": producto_top_unidades['Product Name'],
                "unidades_vendidas": int(producto_top_unidades['TotalUnidades'])
            }

        # 3. Producto más rentable
        ganancia_producto = df.groupBy("Product Name").agg(sum("Profit").alias("TotalGanancia"))
        producto_top_ganancia = ganancia_producto.orderBy(desc("TotalGanancia")).first()
        if producto_top_ganancia:
            f.write(f"\n💰 [3] Producto más rentable: {producto_top_ganancia['Product Name']}\n")
            f.write(f"💵 Ganancia total: ${producto_top_ganancia['TotalGanancia']:,.2f}\n")
            resultados["producto_mas_rentable"] = {
                "producto": producto_top_ganancia['Product Name'],
                "ganancia_total": round(producto_top_ganancia['TotalGanancia'], 2)
            }

        # 4. Ciudad con más ventas
        ventas_ciudad = df.groupBy("City").agg(sum("Sales").alias("TotalVentas"))
        ciudad_top = ventas_ciudad.orderBy(desc("TotalVentas")).first()
        if ciudad_top:
            f.write(f"\n🏙️ [4] Ciudad con más ventas: {ciudad_top['City']}\n")
            f.write(f"💰 Ventas totales: ${ciudad_top['TotalVentas']:,.2f}\n")
            resultados["ciudad_mas_ventas"] = {
                "ciudad": ciudad_top['City'],
                "ventas_totales": round(ciudad_top['TotalVentas'], 2)
            }

        # 5 y 6. Año con menos y más ventas
        ventas_ano = df.groupBy("Year").agg(sum("Sales").alias("TotalVentas"))
        ano_min = ventas_ano.orderBy("TotalVentas").first()
        ano_max = ventas_ano.orderBy(desc("TotalVentas")).first()
        if ano_min:
            f.write(f"\n📉 [5] Año con menos ventas: {ano_min['Year']}\n")
            f.write(f"💰 Ventas totales: ${ano_min['TotalVentas']:,.2f}\n")
            resultados["ano_menos_ventas"] = {
                "ano": int(ano_min['Year']),
                "ventas_totales": round(ano_min['TotalVentas'], 2)
            }
        if ano_max:
            f.write(f"\n📈 [6] Año con más ventas: {ano_max['Year']}\n")
            f.write(f"💰 Ventas totales: ${ano_max['TotalVentas']:,.2f}\n")
            resultados["ano_mas_ventas"] = {
                "ano": int(ano_max['Year']),
                "ventas_totales": round(ano_max['TotalVentas'], 2)
            }

    return resultados

def analyze_ventas_2(df, output_file):
    resultados = {}
    with open(output_file, "a", encoding="utf-8") as f:
        f.write("\n" + "="*60 + "\n")
        f.write("=== ANÁLISIS DE VENTAS ===\n")

        # Filtrar filas con descuento válido
        df_valid_descuento = df.filter(
            (col("Discount").cast(DoubleType()).isNotNull()) &
            (col("Discount") > 0) &
            (col("Sales").cast(DoubleType()).isNotNull())
        )

        # 7. Producto con mayor descuento
        if df_valid_descuento.count() > 0:
            max_descuento = df_valid_descuento.orderBy(desc("Discount")).first()
            f.write(f"\n🎉 [7] Producto con mayor descuento: {max_descuento['Product Name']}\n")
            f.write(f"💰 Precio original: ${float(max_descuento['Sales']):,.2f}\n")
            f.write(f"💸 Descuento aplicado: {float(max_descuento['Discount']) * 100:.0f}%\n")
            f.write(f"🛍️ Precio con descuento: ${float(max_descuento['Total Discounted Sales']):,.2f}\n")
            resultados["producto_mayor_descuento"] = {
                "producto": max_descuento['Product Name'],
                "precio_original": round(float(max_descuento['Sales']), 2),
                "descuento_porcentaje": round(float(max_descuento['Discount']) * 100, 0),
                "precio_con_descuento": round(float(max_descuento['Total Discounted Sales']), 2)
            }
        else:
            f.write("\n🎉 [7] No se encontraron productos con descuento aplicable\n")
            resultados["producto_mayor_descuento"] = {
                "mensaje": "No se encontraron productos con descuento aplicable"
            }

        # 8. Producto con menor descuento
        if df_valid_descuento.count() > 0:
            min_descuento = df_valid_descuento.orderBy("Discount").first()
            f.write(f"\n  [8] Producto con menor descuento: {min_descuento['Product Name']}\n")
            f.write(f"📦 Unidades vendidas: {min_descuento['Quantity']}\n")
            f.write(f"💸 Descuento aplicado: {float(min_descuento['Discount']) * 100:.0f}%\n")
            resultados["producto_menor_descuento"] = {
                "producto": min_descuento['Product Name'],
                "unidades_vendidas": int(min_descuento['Quantity']),
                "descuento_porcentaje": round(float(min_descuento['Discount']) * 100, 0)
            }
        else:
            f.write("\n  [8] No se encontraron productos con descuento mayor a cero\n")
            resultados["producto_menor_descuento"] = {
                "mensaje": "No se encontraron productos con descuento mayor a cero"
            }

        # 9. Top 5 productos por cantidad vendida
        top5_cantidad = df_valid_descuento.groupBy("Product Name") \
            .agg(mean("Discount").alias("DescuentoPromedio"),
                 sum("Quantity").alias("TotalUnidades"),
                 sum("Sales").alias("TotalVentas")) \
            .orderBy(desc("TotalUnidades")) \
            .limit(5)

        f.write("\n🔍 [9] Top 5 productos por cantidad vendida:\n")
        top5_list = []
        for row in top5_cantidad.collect():
            f.write(f"Producto: {row['Product Name']}, Unidades: {row['TotalUnidades']}, "
                    f"Ventas: ${float(row['TotalVentas']):,.2f}, "
                    f"Descuento Promedio: {float(row['DescuentoPromedio']) * 100:.2f}%\n")
            top5_list.append({
                "producto": row['Product Name'],
                "unidades": int(row['TotalUnidades']),
                "ventas": round(float(row['TotalVentas']), 2),
                "descuento_promedio_porcentaje": round(float(row['DescuentoPromedio']) * 100, 2)
            })
        resultados["top5_productos_cantidad"] = top5_list

        # 10. Cliente que más compró
        cliente_top = df_valid_descuento.groupBy("Customer Name", "City") \
            .agg(sum("Sales").alias("TotalCompras")) \
            .orderBy(desc("TotalCompras")) \
            .first()

        if cliente_top:
            f.write(f"\n👤 [10] Cliente que más compró: {cliente_top['Customer Name']}\n")
            f.write(f"🏙️ Ciudad: {cliente_top['City']}\n")
            f.write(f"💰 Total comprado: ${float(cliente_top['TotalCompras']):,.2f}\n")
            resultados["cliente_mas_compro"] = {
                "cliente": cliente_top['Customer Name'],
                "ciudad": cliente_top['City'],
                "total_comprado": round(float(cliente_top['TotalCompras']), 2)
            }
        else:
            f.write("\n👤 [10] No se encontraron datos para el cliente que más compró\n")
            resultados["cliente_mas_compro"] = {
                "mensaje": "No se encontraron datos para el cliente que más compró"
            }

        # 11. Producto más rentable
        producto_rentable = df_valid_descuento.groupBy("Product Name") \
            .agg(sum("Profit").alias("TotalGanancia")) \
            .orderBy(desc("TotalGanancia")) \
            .first()

        if producto_rentable:
            f.write(f"\n💰 [11] Producto más rentable: {producto_rentable['Product Name']}\n")
            f.write(f"💵 Ganancia total: ${float(producto_rentable['TotalGanancia']):,.2f}\n")
            resultados["producto_mas_rentable"] = {
                "producto": producto_rentable['Product Name'],
                "ganancia_total": round(float(producto_rentable['TotalGanancia']), 2)
            }
        else:
            f.write("\n💰 [11] No se encontraron datos para el producto más rentable\n")
            resultados["producto_mas_rentable"] = {
                "mensaje": "No se encontraron datos para el producto más rentable"
            }

    return resultados

def analyze_ventas_3(df, output_file):
    resultados = {}
    with open(output_file, "a", encoding="utf-8") as f:
        f.write("\n" + "="*60 + "\n")
        f.write("=== ANÁLISIS ADICIONAL ===\n")

        # 12. Mes con más ventas
        ventas_por_mes = df.groupBy(month("Order Date").alias("Month")) \
                           .agg(sum("Sales").alias("TotalVentas")) \
                           .orderBy(desc("TotalVentas"))
        mes_top = ventas_por_mes.first()
        if mes_top:
            resultado_mes = f"Mes {mes_top['Month']} con ${mes_top['TotalVentas']:,.2f}"
            f.write(f"\n🗓️ [12] Mes con más ventas: {resultado_mes}\n")
            resultados["mes_con_mas_ventas"] = {
                "mes": int(mes_top['Month']),
                "total_ventas": round(mes_top['TotalVentas'], 2)
            }

        # 13. Temporada con más ventas
        ventas_por_temporada = df.groupBy("Temporada") \
                                 .agg(sum("Sales").alias("TotalVentas")) \
                                 .orderBy(desc("TotalVentas"))
        temporada_top = ventas_por_temporada.first()
        if temporada_top:
            f.write(f"\n🌞 [13] Temporada con más ventas: {temporada_top['Temporada']}\n")
            f.write(f"💰 Ventas totales: ${temporada_top['TotalVentas']:,.2f}\n")
            resultados["temporada_con_mas_ventas"] = {
                "temporada": temporada_top['Temporada'],
                "total_ventas": round(temporada_top['TotalVentas'], 2)
            }

        # 14. Ciudad con más ventas
        ventas_por_ciudad = df.groupBy("City") \
                              .agg(sum("Sales").alias("TotalVentas")) \
                              .orderBy(desc("TotalVentas"))
        ciudad_top = ventas_por_ciudad.first()
        if ciudad_top:
            f.write(f"\n🏙️ [14] Ciudad con más ventas: {ciudad_top['City']}\n")
            f.write(f"💰 Ventas totales: ${ciudad_top['TotalVentas']:,.2f}\n")
            resultados["ciudad_con_mas_ventas"] = {
                "ciudad": ciudad_top['City'],
                "total_ventas": round(ciudad_top['TotalVentas'], 2)
            }

        # 15. Productos con ganancia negativa
        productos_negativos = df.filter(col("Profit") < 0)
        productos_negativos_detalle = productos_negativos.select("Product Name", "Order Date", "Profit")
        productos_negativos_list = []
        for row in productos_negativos_detalle.limit(5).collect():
            f.write(f"\n❌ Producto con ganancia negativa: {row['Product Name']} | Ganancia: ${row['Profit']:,.2f} | Fecha: {row['Order Date']}\n")
            productos_negativos_list.append({
                "producto": row['Product Name'],
                "ganancia": round(row['Profit'], 2),
                "fecha": str(row['Order Date'])
            })
        resultados["productos_con_ganancia_negativa"] = productos_negativos_list

        # 16. Región con mayor descuento promedio
        descuento_por_region = df.groupBy("Region") \
                                 .agg(sum("Discount").alias("PromedioDescuento")) \
                                 .orderBy(desc("PromedioDescuento"))
        region_top_descuento = descuento_por_region.first()
        if region_top_descuento:
            f.write(f"\n💸 [16] Región con mayor descuento promedio: {region_top_descuento['Region']}\n")
            f.write(f"📉 Promedio de descuento: {region_top_descuento['PromedioDescuento']:.2f}\n")
            resultados["region_con_mayor_descuento"] = {
                "region": region_top_descuento['Region'],
                "promedio_descuento": round(region_top_descuento['PromedioDescuento'], 2)
            }

        # 17. Región con más unidades vendidas
        ventas_por_region = df.groupBy("Region") \
                              .agg(sum("Quantity").alias("TotalUnidades")) \
                              .orderBy(desc("TotalUnidades"))
        region_top_unidades = ventas_por_region.first()
        if region_top_unidades:
            f.write(f"\n📦 [17] Región con más unidades vendidas: {region_top_unidades['Region']}\n")
            f.write(f"📊 Unidades vendidas: {region_top_unidades['TotalUnidades']}\n")
            resultados["region_con_mas_unidades"] = {
                "region": region_top_unidades['Region'],
                "total_unidades": int(region_top_unidades['TotalUnidades'])
            }

        # 18. Categoría con más ventas
        ventas_por_categoria = df.groupBy("Category") \
                                 .agg(sum("Sales").alias("TotalVentas")) \
                                 .orderBy(desc("TotalVentas"))
        categoria_top = ventas_por_categoria.first()
        if categoria_top:
            f.write(f"\n📊 [18] Categoría con más ventas: {categoria_top['Category']}\n")
            f.write(f"💰 Ventas totales: ${categoria_top['TotalVentas']:,.2f}\n")
            resultados["categoria_con_mas_ventas"] = {
                "categoria": categoria_top['Category'],
                "total_ventas": round(categoria_top['TotalVentas'], 2)
            }

    return resultados

def main():
    # Crear la carpeta /root/server/ si no existe
    os.makedirs(os.path.dirname(JSON_OUTPUT_PATH), exist_ok=True)

    # Eliminar archivos de salida si existen
    if os.path.exists(OUTPUT_PATH):
        os.remove(OUTPUT_PATH)
    if os.path.exists(JSON_OUTPUT_PATH):
        os.remove(JSON_OUTPUT_PATH)

    spark = initialize_spark("AnalisisVentasCompleto")
    df = load_and_prepare_data(spark, INPUT_PATH)

    try:
        # Ejecutar análisis y combinar resultados
        resultados = {}
        resultados.update(analyze_ventas_1(df, OUTPUT_PATH))
        resultados.update(analyze_ventas_2(df, OUTPUT_PATH))
        resultados.update(analyze_ventas_3(df, OUTPUT_PATH))

        # Guardar resultados en JSON
        with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as json_file:
            json.dump([resultados], json_file, ensure_ascii=False, indent=4)

        print(f"✅ Análisis completado. Resultados guardados en: {OUTPUT_PATH}")
        print(f"✅ Resultados en JSON guardados en: {JSON_OUTPUT_PATH}")

    finally:
        df.unpersist()
        spark.stop()

if __name__ == "__main__":
    main()
                                                                                                                                                                            ```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ~                                                                                                                

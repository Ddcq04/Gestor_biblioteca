--TABLAS
CREATE TABLE socio (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(60) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL
);

CREATE TABLE libro (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(60) NOT NULL,
    genero VARCHAR(70) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE prestamo (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    socio_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE NULL, 
    fecha_vencimiento DATE NOT NULL,
    FOREIGN KEY (socio_id) REFERENCES socio (id),
    FOREIGN KEY (libro_id) REFERENCES libro (id)
);
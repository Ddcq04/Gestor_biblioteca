--TABLAS
CREATE TABLE socio (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(60) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
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
    fecha_prestamo DATETIME NOT NULL,
    fecha_devolucion DATETIME NULL, 
    fecha_vencimiento DATETIME NOT NULL,
    FOREIGN KEY (socio_id) REFERENCES socio (id),
    FOREIGN KEY (libro_id) REFERENCES libro (id)
);

--INSERCION DE DATOS
--SOCIO
INSERT INTO socio (nombre, contrasena, correo) VALUES 
('Juan Pérez', '1234abc', 'juan.perez@email.com'),
('Ana García', 'pass789', 'ana.garcia@email.com'),
('Luis Rodríguez', 'admin2026', 'luis.rod@email.com'),
('Marta López', 'marta123', 'marta.lopez@email.com'),
('Carlos Sánchez', 'charly_99', 'carlos.s@email.com');
--LIBRO
INSERT INTO libro (nombre, genero, stock) VALUES 
('Don Quijote de la Mancha', 'Clásico', 5),
('Cien años de soledad', 'Realismo Mágico', 3),
('Harry Potter y la Piedra Filosofal', 'Fantasía', 10),
('El código Da Vinci', 'Suspenso', 4),
('Breve historia del tiempo', 'Divulgación Científica', 2);
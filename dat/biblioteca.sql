CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

CREATE TABLE socio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE libro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    genero VARCHAR(50),
    stock INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prestamo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socio_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATETIME NOT NULL,
    fecha_vencimiento DATETIME NOT NULL,
    fecha_devolucion DATETIME NULL,
    FOREIGN KEY (socio_id) REFERENCES socio(id),
    FOREIGN KEY (libro_id) REFERENCES libro(id),
    INDEX (fecha_vencimiento),
    INDEX (fecha_devolucion)
);

-- Datos de ejemplo
INSERT INTO socio (nombre, telefono, correo) VALUES
('Juan Pérez', '123456789', 'juan@email.com'),
('María García', '987654321', 'maria@email.com');

INSERT INTO libro (nombre, genero, stock) VALUES
('Cien años de soledad', 'Novela', 3),
('El principito', 'Infantil', 2),
('Don Quijote', 'Novela', 1),
('Harry Potter', 'Fantasía', 4);
('Cien años de soledad', 'Realismo mágico', 5);
('Fundación', 'Ciencia ficción', 3);
('El nombre de la rosa', 'Novela histórica', 4);
('It', 'Terror', 2);
('Sherlock Holmes', 'Misterio', 6);
('Orgullo y prejuicio', 'Romance', 3);
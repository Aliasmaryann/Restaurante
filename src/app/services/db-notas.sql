-- Crear tabla de roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT
);

-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol_id INT REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  precio NUMERIC(10,2),
  stock INT
);
CREATE TABLE finanzas (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  tipo VARCHAR(20) NOT NULL,   -- 'Ingreso' o 'Egreso'
  descripcion VARCHAR(200),
  monto NUMERIC(12,2) NOT NULL,
  categoria VARCHAR(50)        -- Ej: 'Ventas', 'Compras', 'Servicios'
);
CREATE TABLE cocina (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pedido_id INT NOT NULL,          -- referencia al pedido del cliente
  producto VARCHAR(100) NOT NULL,  -- nombre del plato o insumo
  cantidad INT NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, En preparación, Listo
  observaciones VARCHAR(200)
);
CREATE TABLE proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(200),
  categoria VARCHAR(50)   -- Ej: Alimentos, Bebidas, Limpieza
);
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  cantidad_personas INT NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pendiente',  -- Pendiente, Confirmada, Cancelada
  observaciones VARCHAR(200)
);


-- Insertar roles iniciales
INSERT INTO roles (nombre, descripcion) VALUES
  ('admin', 'Administrador general del sistema'),
  ('trabajador', 'Usuarios que toman comandas y manejan inventario'),
  ('cliente', 'Clientes que solo ven el menú');

-- Insertar usuarios iniciales
INSERT INTO usuarios (username, password_hash, rol_id) VALUES
  ('admin', 'admin123', 1),       -- admin
  ('user1', 'trabajador123', 2),  -- trabajador
  ('user2', 'cliente123', 3);     -- cliente

INSERT INTO productos (nombre, categoria, precio, stock)
VALUES
  ('Arroz 1kg', 'Alimentos', 1200, 50),
  ('Aceite 1L', 'Alimentos', 2500, 30),
  ('Detergente 500ml', 'Limpieza', 1800, 20),
  ('Coca-Cola 1.5L', 'Bebidas', 1500, 40),
  ('Pan Integral', 'Panadería', 1000, 25);
  
INSERT INTO finanzas (fecha, tipo, descripcion, monto, categoria)
VALUES
  ('2025-12-01', 'Ingreso', 'Venta menú almuerzo', 45000, 'Ventas'),
  ('2025-12-01', 'Ingreso', 'Venta bebidas', 12000, 'Ventas'),
  ('2025-12-02', 'Egreso', 'Compra de verduras', 15000, 'Compras'),
  ('2025-12-02', 'Egreso', 'Pago servicio de gas', 25000, 'Servicios'),
  ('2025-12-03', 'Ingreso', 'Venta menú cena', 60000, 'Ventas');

INSERT INTO cocina (pedido_id, producto, cantidad, estado, observaciones)
VALUES
  (101, 'Lomo a lo pobre', 2, 'Pendiente', 'Sin huevo en uno'),
  (102, 'Ensalada César', 1, 'En preparación', 'Agregar pollo extra'),
  (103, 'Pizza Margarita', 3, 'Pendiente', 'Mesa 5'),
  (104, 'Sopa de mariscos', 2, 'Listo', 'Servir caliente'),
  (105, 'Hamburguesa doble', 1, 'Pendiente', 'Sin pepinillos');

INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, categoria)
VALUES
  ('Distribuidora Alimentos S.A.', 'Juan Pérez', '987654321', 'ventas@alimentos.cl', 'Av. Central 123, Santiago', 'Alimentos'),
  ('Bebidas Chile Ltda.', 'María González', '912345678', 'contacto@bebidas.cl', 'Calle Norte 456, Santiago', 'Bebidas'),
  ('Limpieza Express', 'Carlos Soto', '998877665', 'info@limpieza.cl', 'Av. Sur 789, Santiago', 'Limpieza');

INSERT INTO reservas (cliente, telefono, fecha, hora, cantidad_personas, estado, observaciones)
VALUES
  ('Ana Torres', '987654321', '2025-12-10', '20:00', 4, 'Confirmada', 'Mesa cerca de la ventana'),
  ('Luis Ramírez', '912345678', '2025-12-11', '21:30', 2, 'Pendiente', 'Aniversario'),
  ('Carolina Díaz', '998877665', '2025-12-12', '19:00', 6, 'Confirmada', 'Mesa grande en el salón principal');



  
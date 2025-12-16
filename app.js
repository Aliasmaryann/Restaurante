const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando 🚀');
});

// Endpoint de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT u.id, u.username, r.nombre AS rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.username = $1 AND u.password_hash = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Productos
// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});
// Obtener todos los proveedores
app.get('/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// Agregar proveedor
app.post('/proveedores', async (req, res) => {
  const { nombre, contacto, telefono, email, direccion, categoria } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, categoria)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, contacto, telefono, email, direccion, categoria]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar proveedor' });
  }
});



app.get('/bodega', async (req, res) => {
   console.log('Entró a /bodega'); // <-- prueba
  try {
    const result = await pool.query(`
      SELECT b.id, b.fecha, p.nombre AS producto, b.categoria, b.cantidad, pr.nombre AS proveedor
      FROM bodega b
      JOIN productos p ON b.producto_id = p.id
      LEFT JOIN proveedores pr ON b.proveedor_id = pr.id
      ORDER BY b.fecha DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener datos de bodega' });
    }
  });
// Endpoint para agregar entrada a bodega
app.post('/bodega', async (req, res) => {
  const { fecha, producto_id, categoria, cantidad, proveedor_id } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO bodega (fecha, producto_id, categoria, cantidad, proveedor_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fecha, producto_id, categoria, cantidad, proveedor_id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al insertar en bodega' });
  }
}); 

// Eliminar registros de bodega
app.delete('/bodega', async (req, res) => {
  const { ids } = req.body; // espera un array de IDs
  try {
    const r = await pool.query(
      `DELETE FROM bodega WHERE id = ANY($1::int[]) RETURNING *`,
      [ids]
    );
    res.json({ deleted: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registros de bodega' });
  }
});

// Totales de bodega
app.get('/bodega/totales', async (req, res) => {
  try {
    // Total de registros en la tabla bodega
    const totalRegistros = await pool.query(`SELECT COUNT(*) FROM bodega`);

    // Suma total de cantidades (en stock)
    const totalStock = await pool.query(`SELECT SUM(cantidad) FROM bodega`);

    // Productos con bajo stock (ejemplo: cantidad < 10)
    const bajoStock = await pool.query(`SELECT COUNT(*) FROM bodega WHERE cantidad < 10`);

    res.json({
      total: parseInt(totalRegistros.rows[0].count),
      en_stock: parseInt(totalStock.rows[0].sum || 0),
      bajo_stock: parseInt(bajoStock.rows[0].count)
    });
  } catch (err) {
    console.error('Error en /bodega/totales:', err);
    res.status(500).json({ error: 'Error al obtener totales' });
  }
});
// Actualizar entrada de bodega
app.put('/bodega/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, producto_id, categoria, cantidad, proveedor_id } = req.body;
  try {
    const r = await pool.query(
      `UPDATE bodega 
       SET fecha=$1, producto_id=$2, categoria=$3, cantidad=$4, proveedor_id=$5
       WHERE id=$6 RETURNING *`,
      [fecha, producto_id, categoria, cantidad, proveedor_id, id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar entrada' });
  }
});

//
//clientes
// Todas las recetas

app.get('/recetas', async (req, res) => {
  try {
    const r = await pool.query(`SELECT id, nombre, categoria, precio, descripcion FROM recetas ORDER BY categoria, nombre`);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

// Recetas por categoría
app.get('/recetas/:categoria', async (req, res) => {
  const { categoria } = req.params;
  try {
    const r = await pool.query(
      `SELECT id, nombre, categoria, precio, descripcion FROM recetas WHERE categoria ILIKE $1 ORDER BY nombre`,
      [categoria]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recetas por categoría' });
  }
});

// Crear pedido
app.post('/pedidos', async (req, res) => {
  const { mesa, items } = req.body; 
  // items = [{ receta_id, cantidad }]
  try {
    // Crear pedido
    const pedido = await pool.query(
      `INSERT INTO pedidos (mesa, estado) VALUES ($1, 'Pendiente') RETURNING id`,
      [mesa]
    );
    const pedidoId = pedido.rows[0].id;

    // Insertar detalle
    for (const item of items) {
      await pool.query(
        `INSERT INTO detalle_pedido (pedido_id, receta_id, cantidad, precio)
         SELECT $1, id, $2, precio FROM recetas WHERE id=$3`,
        [pedidoId, item.cantidad, item.receta_id]
      );
    }

    res.json({ success: true, pedidoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// Movimientos financieros
app.get('/finanzas', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT id, fecha, tipo, descripcion, categoria, monto
      FROM finanzas
      ORDER BY fecha DESC
    `);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener movimientos financieros' });
  }
});

// Totales financieros
app.get('/finanzas/totales', async (req, res) => {
  try {
    const ingresos = await pool.query(`
      SELECT COALESCE(SUM(monto), 0) AS total
      FROM finanzas
      WHERE tipo = 'Ingreso'
    `);

    const egresos = await pool.query(`
      SELECT COALESCE(SUM(monto), 0) AS total
      FROM finanzas
      WHERE tipo = 'Egreso'
    `);

    const balance =
      parseFloat(ingresos.rows[0].total) -
      parseFloat(egresos.rows[0].total);

    res.json({
      ingresos: ingresos.rows[0].total,
      egresos: egresos.rows[0].total,
      balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener totales financieros' });
  }
});
// Ingresos vs Egresos
app.get('/finanzas/resumen', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT tipo, SUM(monto) AS total
      FROM finanzas
      GROUP BY tipo
    `);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resumen financiero' });
  }
});

app.get('/finanzas/categorias', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT categoria, SUM(monto) AS total
      FROM finanzas
      GROUP BY categoria
      ORDER BY total DESC
    `);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías financieras' });
  }
});
// Registrar movimiento financiero
app.post('/finanzas', async (req, res) => {
  const { fecha, tipo, descripcion, monto, categoria } = req.body;

  try {
    const r = await pool.query(`
      INSERT INTO finanzas (fecha, tipo, descripcion, monto, categoria)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [fecha, tipo, descripcion, monto, categoria]);

    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar movimiento' });
  }
});

// Recetas con detalle
app.get('/recetas/:id/detalle', async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query(
      `SELECT rd.id, rd.receta_id, rd.descripcion, rd.ingredientes
       FROM receta_detalle rd
       WHERE rd.receta_id = $1
       ORDER BY rd.id`,
      [id]
    );
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener detalle de receta' });
  }
});

// Métricas de cocina
app.get('/cocina/metrics', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT estado, COUNT(*)::int AS total
      FROM cocina
      GROUP BY estado
    `);

    const m = { pendientes: 0, preparacion: 0, listos: 0 };
    for (const r of stats.rows) {
      if (r.estado === 'Pendiente') m.pendientes = r.total;
      if (r.estado === 'En preparación') m.preparacion = r.total;
      if (r.estado === 'Listo') m.listos = r.total;
    }

    const topRecetas = await pool.query(`
      SELECT r.nombre, SUM(dp.cantidad)::int AS total
      FROM detalle_pedido dp
      JOIN recetas r ON dp.receta_id = r.id
      JOIN pedidos p ON dp.pedido_id = p.id
      WHERE DATE(p.fecha) = CURRENT_DATE
      GROUP BY r.nombre
      ORDER BY total DESC
      LIMIT 3
    `);

    res.json({ ...m, topRecetas: topRecetas.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener métricas de cocina' });
  }
});



// Crear pedido
app.post('/pedidos', async (req, res) => {
  const { mesa, items } = req.body; 
  try {
    // Crear pedido
    const pedido = await pool.query(
      `INSERT INTO pedidos (mesa, estado) VALUES ($1, 'Pendiente') RETURNING id`,
      [mesa]
    );
    const pedidoId = pedido.rows[0].id;

    // Insertar detalle y cocina
    for (const item of items) {
      const receta = await pool.query(`SELECT id, precio FROM recetas WHERE id=$1`, [item.receta_id]);

      await pool.query(
        `INSERT INTO detalle_pedido (pedido_id, receta_id, cantidad, precio)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.receta_id, item.cantidad, receta.rows[0].precio]
      );

      await pool.query(
        `INSERT INTO cocina (pedido_id, receta_id, cantidad, estado)
         VALUES ($1, $2, $3, 'Pendiente')`,
        [pedidoId, item.receta_id, item.cantidad]
      );
    }

    res.json({ success: true, pedidoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});


// Pedidos activos con detalle
// Pedidos activos con detalle y estado desde cocina
// Activos: pedidos con algún ítem no 'Listo'
app.get('/cocina/pedidos', async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT 
        p.id, p.mesa, p.fecha,
        /* estado general: si hay alguno en preparación, mostramos 'En preparación'; si todos pendientes, 'Pendiente' */
        CASE 
          WHEN COUNT(*) FILTER (WHERE c.estado = 'En preparación') > 0 THEN 'En preparación'
          ELSE 'Pendiente'
        END AS estado,
        json_agg(json_build_object('nombre', r.nombre, 'cantidad', c.cantidad, 'estado', c.estado)) AS recetas
      FROM pedidos p
      JOIN cocina c ON p.id = c.pedido_id
      JOIN recetas r ON c.receta_id = r.id
      WHERE p.estado != 'Entregado'
      GROUP BY p.id, p.mesa, p.fecha
      HAVING COUNT(*) FILTER (WHERE c.estado != 'Listo') > 0
      ORDER BY p.fecha DESC
    `);
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos activos' });
  }
});



/// Cambiar estado de pedido en cocina
app.put('/cocina/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    // Actualizar pedido
    const pedido = await pool.query(
      `UPDATE pedidos SET estado=$1 WHERE id=$2 RETURNING *`,
      [estado, id]
    );

    // Actualizar cocina (si existe registro)
    await pool.query(
      `UPDATE cocina SET estado=$1 WHERE pedido_id=$2`,
      [estado, id]
    );

    res.json(pedido.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
});

// Pedidos marcados como 'Listo' en la tabla pedidos
app.get('/cocina/pedidos-listos', async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT p.id, p.mesa, p.fecha, p.estado,
             json_agg(json_build_object('nombre', r.nombre, 'cantidad', dp.cantidad)) AS recetas
      FROM pedidos p
      JOIN detalle_pedido dp ON p.id = dp.pedido_id
      JOIN recetas r ON dp.receta_id = r.id
      WHERE p.estado = 'Listo'
      GROUP BY p.id, p.mesa, p.fecha, p.estado
      ORDER BY p.fecha DESC
    `);
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos listos' });
  }
});




  
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
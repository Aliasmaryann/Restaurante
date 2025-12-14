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
app.get('/productos', async (req, res) => {
  const r = await pool.query(`SELECT id, nombre FROM productos ORDER BY nombre`);
  res.json(r.rows);
});

app.get('/proveedores', async (req, res) => {
  const r = await pool.query(`SELECT id, nombre FROM proveedores ORDER BY nombre`);
  res.json(r.rows);
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
  
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
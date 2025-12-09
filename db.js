const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',              // tu usuario de PostgreSQL
  host: 'localhost',
  database: 'restauranteapp',    // tu base creada
  password: 'aiep2022',   // la que definiste en la instalación
  port: 5432,
});

module.exports = pool;
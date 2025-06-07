import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, session } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

before(async function () {
  this.timeout(10000);

  console.log('[SETUP] Executing erd.sql and erd.cypher...');

  const sqlPath = path.resolve(__dirname, '../database/erd.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('[SETUP] ✅ PostgreSQL schema + data loaded');

  const cypherPath = path.resolve(__dirname, '../database/erd.cypher');
  const cypher = fs.readFileSync(cypherPath, 'utf8');
  const statements = cypher
    .split(/;\s*\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await session.run(stmt);
  }

  console.log('[SETUP] ✅ Neo4j schema + data loaded');
});


after(async function () {
  this.timeout(10000);

  console.log('[SETUP] Executing erd.sql and erd.cypher...');

  const sqlPath = path.resolve(__dirname, '../database/erd.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('[SETUP] ✅ PostgreSQL schema + data loaded');

  const cypherPath = path.resolve(__dirname, '../database/erd.cypher');
  const cypher = fs.readFileSync(cypherPath, 'utf8');
  const statements = cypher
    .split(/;\s*\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await session.run(stmt);
  }

  console.log('[SETUP] ✅ Neo4j schema + data loaded');
});

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'nil_lending.db');
const db = new Database(dbPath);

console.log('Initializing database...');

// Read and execute schema
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('Schema created successfully');

// Read and execute seed data
const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
db.exec(seed);
console.log('Seed data inserted successfully');

db.close();
console.log('Database initialized at:', dbPath);

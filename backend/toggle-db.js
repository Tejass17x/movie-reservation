import fs from 'fs';
import path from 'path';

const target = process.argv[2];

if (target !== 'postgresql' && target !== 'sqlite') {
  console.error('Usage: node toggle-db.js [postgresql|sqlite]');
  process.exit(1);
}

const dir = path.resolve();
const schemaSrc = path.join(dir, 'prisma', `schema.${target}.prisma`);
const schemaDest = path.join(dir, 'prisma', 'schema.prisma');
const envPath = path.join(dir, '.env');

try {
  // Copy schema file
  fs.copyFileSync(schemaSrc, schemaDest);
  console.log(`Copied schema.${target}.prisma to schema.prisma`);

  // Update .env file DATABASE_URL
  let envContent = fs.readFileSync(envPath, 'utf8');
  let newUrl = '';

  if (target === 'sqlite') {
    newUrl = 'DATABASE_URL="file:./dev.db"';
  } else {
    newUrl = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/movie_reservation_admin?schema=public"';
  }

  // Regex replacement of DATABASE_URL line
  envContent = envContent.replace(/DATABASE_URL\s*=\s*["'][^"']*["']/g, newUrl);
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`Updated .env with DATABASE_URL for ${target}`);
  console.log('Database toggle successful.');
} catch (err) {
  console.error('Error toggling database:', err);
  process.exit(1);
}

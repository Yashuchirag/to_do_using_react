// netlify/functions/login.js
const { neon } = require('@neondatabase/serverless');

const json = (s, b, h = {}) => ({
  statusCode: s,
  headers: { 'Content-Type': 'application/json', ...h },
  body: JSON.stringify(b),
});

// (Optional) CORS if frontend is on a different origin
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {}, cors);
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' }, cors);

  let body = {};
  try { body = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid JSON' }, cors); }

  const { email, password } = body; // <-- use name, not email
  if (!email || !password) return json(400, { error: 'Missing name or password' }, cors);

  try {
    if (!process.env.DATABASE_URL) return json(500, { error: 'DATABASE_URL not set' }, cors);

    const sql = neon(process.env.DATABASE_URL);

    // Plain-text check against users_simple
    const rows = await sql/*sql*/`
      SELECT id, name, created_at
      FROM public.users_simple
      WHERE name = ${email} AND password = ${password}
      LIMIT 1
    `;

    const user = rows[0];
    if (!user) return json(401, { error: 'Invalid credentials' }, cors);

    return json(200, { user }, cors);
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal error' }, cors);
  }
};

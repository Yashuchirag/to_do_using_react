// netlify/functions/signup.js
const { neon } = require('@neondatabase/serverless');

const json = (s, b, headers = {}) => ({
  statusCode: s,
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(b),
});

// (Optional) CORS if your frontend is on a different origin
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {}, cors);
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' }, cors);

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' }, cors);
  }

  const { email, password } = body;
  console.log('name', email, 'password', password, body);

  if (!email || !password) return json(400, { error: 'Email and password are required' }, cors);

  try {
    if (!process.env.DATABASE_URL) return json(500, { error: 'DATABASE_URL not set' }, cors);

    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql/*sql*/`
      INSERT INTO public.users_simple (name, password)
      VALUES (${email}, ${password})
      RETURNING id, name, created_at
    `;

    const user = rows[0];
    return json(200, { user }, cors);
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal error' }, cors);
  }
};

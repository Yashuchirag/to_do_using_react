// netlify/functions/signup.js
const { neon } = require('@neondatabase/serverless');
const json = (s,b)=>({ statusCode:s, headers:{'Content-Type':'application/json'}, body:JSON.stringify(b) });

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

    if (!process.env.DATABASE_URL) return json(500, { error: 'DATABASE_URL is not set' });
    const sql = neon(process.env.DATABASE_URL); // construct inside handler so it sees env

    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) return json(400, { error: 'Missing email or password' });

    const rows = await sql/*sql*/`select * from users(${email}, ${password})`;
    const user = rows?.[0];
    if (!user) return json(500, { error: 'Registration failed' });

    delete user.password; delete user.password_hash;
    return json(200, { user });
  } catch (err) {
    console.error(err);
    if (err && err.code === '23505') return json(409, { error: 'Email already registered' });
    return json(500, { error: 'Internal error' });
  }
};

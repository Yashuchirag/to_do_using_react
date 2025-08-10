// netlify/functions/login.js
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL); // set this in Netlify env vars

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing email or password' }) };
    }

    // Call your existing Postgres function
    const rows = await sql/*sql*/`select * from login_user(${email}, ${password})`;
    const user = rows?.[0];

    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'User not found' }) };
    }

    // Optional: strip sensitive fields if your function returns them
    delete user.password;
    delete user.password_hash;

    return { statusCode: 200, body: JSON.stringify({ user }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};

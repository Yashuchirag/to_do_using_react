// netlify/functions/tasks.js
const { neon } = require('@neondatabase/serverless');

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.DATABASE_URL); // set in .env / Netlify env
    const { httpMethod } = event;

    if (httpMethod === 'GET') {
      const rows = await sql/*sql*/`
        select id, name, status
        from tasks
        order by id asc
      `;
      return json(200, { rows });
    }

    if (httpMethod === 'POST') {
      const { name, status } = JSON.parse(event.body || '{}');
      if (!name || !status) return json(400, { error: 'Missing name or status' });

      const inserted = await sql/*sql*/`
        insert into tasks (name, status)
        values (${name}, ${status})
        returning id, name, status
      `;
      return json(200, { row: inserted[0] });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal error' });
  }
};

// netlify/functions/tasks.js
const { neon } = require('@neondatabase/serverless');

const json = (s, b) => ({ statusCode: s, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { httpMethod } = event;

    if (httpMethod === 'GET') {
      const rows = await sql/*sql*/`
        SELECT t.id, t.title, t.content, t.status, u.email
        FROM public.todos t
        JOIN public.users_simple u ON u.id = t.user_id
        ORDER BY t.id ASC
      `;
      return json(200, { rows });
    }

    if (httpMethod === 'POST') {
      const temp = JSON.parse(event.body || '{}');
      const { email, title, content, status } = temp;
      console.log('email', email, 'title', title, 'content', content, 'status', status, temp);
      if (!email || !title || !status) return json(400, { error: 'Missing email, title or status' });

      const inserted = await sql/*sql*/`
        INSERT INTO public.todos (user_id, title, content, status)
        VALUES ((SELECT id FROM public.users_simple WHERE email = ${email}), ${title}, ${content}, ${status})
        RETURNING id, title, content, status
      `;
      if (!inserted[0]) return json(404, { error: 'User email not found' });
      return json(200, { row: inserted[0] });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal error' });
  }
};

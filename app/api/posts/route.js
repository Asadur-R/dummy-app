import { query } from "../../../lib/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM posts 
      ORDER BY created_at DESC
    `);
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, content, image_url } = await request.json();

    const result = await query(
      "INSERT INTO posts (title, content, image_url) VALUES ($1, $2, $3) RETURNING *",
      [title, content, image_url]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

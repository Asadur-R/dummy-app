import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM users ORDER BY created_at DESC");
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, avatar_url } = await request.json();

    const result = await query(
      "INSERT INTO users (name, email, avatar_url) VALUES ($1, $2, $3) RETURNING *",
      [name, email, avatar_url]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

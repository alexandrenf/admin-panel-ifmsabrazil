import bcrypt from 'bcrypt';
import db from '@/db';
import { UsersTable } from '@/schema';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find the user by email using Drizzle ORM
    const user = await db.select().from(UsersTable).where(UsersTable.email.eq(email)).single();

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Compare the password with the hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Successful login
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

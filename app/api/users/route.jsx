import bcrypt from 'bcrypt';
import db from '@/db';
import { UsersTable } from '@/schema';

const saltRounds = 10;

export async function POST(request) {
  try {
    const { name, email, role, password } = await request.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database using Drizzle ORM
    await db.insert(UsersTable).values({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: 'User added successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'No session found' }), { status: 401 });
  }
  return new Response(JSON.stringify(session), { status: 200 });
}
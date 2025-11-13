// app/api/health/route.js
import { CREATOR } from '@/utils/identity';
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', creator: CREATOR, time: new Date().toISOString() }), { status: 200 });
}

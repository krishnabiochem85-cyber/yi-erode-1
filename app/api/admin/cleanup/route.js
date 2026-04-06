// app/api/admin/cleanup/route.js
import { NextResponse } from 'next/server';
import { cleanupAll } from '@/utils/cleanup-data';

export async function GET(request) {
  // Simple auth check – in production replace with proper session validation
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer admin-token')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const summary = await cleanupAll();
    return NextResponse.json({ success: true, summary });
  } catch (e) {
    console.error('Cleanup error:', e);
    return NextResponse.json({ error: 'Cleanup failed', details: e.message }, { status: 500 });
  }
}

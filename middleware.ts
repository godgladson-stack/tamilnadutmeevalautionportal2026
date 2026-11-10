import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  if (mobileRegex.test(userAgent)) {
    return new NextResponse('Mobile access is restricted.', { status: 403 });
  }
  
  return NextResponse.next();
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/menu'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos e API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // arquivos estáticos
  ) {
    return NextResponse.next();
  }

  // Redirecionar root para login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Por agora, permitir acesso a todas as rotas
  // A proteção de autenticação é feita client-side no AuthContext
  // Depois que o backend confirmar o nome do cookie httpOnly, podemos adicionar proteção aqui
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

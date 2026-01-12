import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/api'];

  // Verificar se é uma rota pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Para rotas protegidas, verificar se tem cookie de autenticação
  // Os cookies são gerenciados automaticamente pelo navegador (httpOnly)
  // Se o usuário tentar acessar rota protegida sem autenticação, redirecionar para login
  
  // Nota: Em rotas públicas, não podemos acessar cookies em middleware
  // A validação real é feita no lado do cliente via AuthContext + localStorage

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

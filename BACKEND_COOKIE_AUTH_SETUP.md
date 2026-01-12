# Configuração de Autenticação com Cookies HttpOnly

## Status Atual
O frontend foi atualizado para usar **cookies httpOnly** em vez de localStorage para armazenar tokens de autenticação.

## Solicitação para Backend

Olá! Precisamos confirmar se o backend já está configurado para suportar autenticação via **cookies httpOnly**. 

### ✅ Checklist de Requisitos

Por favor, verifique se o backend atende a todos esses pontos:

**1. Endpoints de Autenticação**
- [ ] `/auth/login/admin` - retorna tokens via cookies
- [ ] `/auth/login/restaurant` - retorna tokens via cookies
- [ ] `/auth/refresh` - retorna novos tokens via cookies
- [ ] `/auth/logout` - limpa os cookies

**2. Headers HTTP de Segurança**
```
Set-Cookie: accessToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

- [ ] HttpOnly: true (token não acessível por JavaScript)
- [ ] Secure: true (só enviado em HTTPS)
- [ ] SameSite=Strict (proteção contra CSRF)
- [ ] Path=/api/v1 ou Path=/ (conforme necessário)

**3. CORS Configuration**
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000 (ou domínio específico)
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

- [ ] `credentials: 'include'` habilitado
- [ ] Origem correta do frontend configurada
- [ ] Não usar wildcard (*) em `Access-Control-Allow-Origin` com credentials

**4. Validação de Tokens**
- [ ] Ler tokens automaticamente dos cookies nas requisições
- [ ] Validar token em cada requisição protegida
- [ ] Retornar 401 se token inválido/expirado
- [ ] Permitir refresh automático de token

**5. Logout**
- [ ] Limpar cookies ao fazer logout
- [ ] Invalidar token no servidor

---

## Exemplo de Resposta Esperada (Frontend)

O frontend agora:
- ✅ Envia `credentials: 'include'` em todas as requisições
- ✅ Não manipula tokens manualmente
- ✅ Confia no navegador para gerenciar cookies
- ✅ Recupera tokens automaticamente do servidor

---

## Se Ainda Não Estiver Implementado

**Favor implementar a estratégia de cookies httpOnly** com as especificações acima. Isso melhora significativamente a segurança da aplicação comparado ao localStorage.

## Referências
- [OWASP: HttpOnly Cookies](https://owasp.org/www-community/HttpOnly)
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [CORS com Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#credentialed_requests)

---

**Data da Solicitação**: 12 de Janeiro de 2026
**Implementação Frontend**: Concluída ✅
**Status Backend**: Aguardando confirmação

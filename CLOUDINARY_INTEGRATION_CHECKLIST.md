# Cloudinary Upload - Checklist de Funcionamento

## ✅ Frontend (Já implementado)

- [x] `lib/cloudinary.ts` - Funções de upload e integração
- [x] `components/ImageUpload.tsx` - Componente base de upload
- [x] `components/Admin/UserAvatarUpload.tsx` - Upload de avatar
- [x] `components/Admin/RestaurantLogoCoverUpload.tsx` - Upload de logo/cover
- [x] `components/Admin/WhiteLabelUpload.tsx` - Create/update white label
- [x] `app/admin/uploads-example/page.tsx` - Página exemplo
- [x] Token salvo em localStorage após login

## ✅ Fluxo End-to-End

```
1. Login
   ├─ [AuthContext] Salva token em localStorage.gastrobi_token
   └─ [AuthContext] Salva user data em localStorage.gastrobi_user_data

2. Acessar página de upload
   ├─ Pega token do localStorage
   └─ Valida se existe

3. Upload de imagem
   ├─ Seleciona arquivo
   ├─ Valida (tipo + tamanho)
   ├─ Mostra preview
   ├─ Envia para: POST /api/v1/uploads/image?folder=avatars
   │   Headers: Authorization: Bearer {token}
   │   Body: FormData com arquivo
   ├─ Recebe: { url, publicId }
   └─ Atualiza no backend

4. Atualizar no cadastro
   ├─ Envia para: PATCH /api/v1/admin/users/:id
   │   Headers: Authorization: Bearer {token}
   │   Body: { fullName, avatar: url }
   └─ Backend atualiza usuario
```

## 📋 O que precisa estar implementado no Backend

### Rota de Upload
```
POST /api/v1/uploads/image?folder=avatars|logos|covers|misc

Headers:
- Authorization: Bearer {token}

Body: FormData
- file: <arquivo de imagem>

Response:
{
  "url": "https://res.cloudinary.com/.../image.webp",
  "publicId": "gastrobi/avatars/abc123"
}
```

### Rotas de Update
```
PATCH /api/v1/admin/users/:id
{
  "fullName": "João Silva",
  "avatar": "https://res.cloudinary.com/.../avatar.webp"
}

PATCH /api/v1/admin/restaurants/:id
{
  "name": "Restaurante",
  "phone": "+5511999999999",
  "email": "contato@rest.com",
  "settings": {
    "logo": "https://...",
    "cover": "https://..."
  }
}

POST /api/v1/admin/white-label
{
  "clientName": "Marca",
  "brandName": "Restaurant",
  "domain": "marca.com",
  "logo": "https://...",
  "favicon": "https://...",
  "primaryColor": "#3b82f6",
  "secondaryColor": "#1e40af"
}

PATCH /api/v1/admin/white-label/:id
{
  "brandName": "Restaurant V2",
  "logo": "https://...",
  "favicon": "https://...",
  "primaryColor": "#3b82f6"
}
```

## 🧪 Testando Locally

### 1. Acessar página de exemplo
```
http://localhost:3000/admin/uploads-example
```

### 2. Fazer login (garanta que token é salvo)
```
Abra DevTools → Application → LocalStorage
Procure por: gastrobi_token
Se não existir, o login não está salvando corretamente
```

### 3. Tentar fazer upload
```
- Clique em um componente de upload
- Selecione uma imagem
- Se receber erro 404, a rota não existe no backend
- Se receber 401, o token é inválido
- Se funcionar, receberá URL e publicId
```

## 🔴 Possíveis Erros

### 1. Token não encontrado
**Solução:** Verificar se `localStorage.getItem('gastrobi_token')` retorna algo após login

### 2. 404 na rota de upload
**Solução:** Verificar se rota existe no backend: `POST /api/v1/uploads/image`

### 3. 401 Unauthorized
**Solução:** Token inválido ou expirado. Fazer login novamente

### 4. CORS Error
**Solução:** Backend precisa permitir requisições da origem do frontend

### 5. Image não envia
**Solução:** FormData precisa ser enviado sem header Content-Type (navegador define automaticamente)

## ✨ Próximas Etapas

1. **Integrar em páginas reais**
   - Settings do usuário
   - Settings do restaurante
   - Admin de white labels

2. **Melhorias**
   - Crop de imagem antes de upload
   - Múltiplos uploads simultâneos
   - Progress bar

3. **Validações adicionais**
   - Dimensões mínimas/máximas
   - Ratio de aspecto
   - Arquivo muito grande

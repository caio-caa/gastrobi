# Implementação de Upload de Imagens - Cloudinary

Esta documentação descreve a implementação completa do sistema de upload de imagens usando Cloudinary, conforme especificado no arquivo `CLOUDINARY_ADMIN_RESTAURANT.md`.

---

## 📋 Arquivos Criados/Modificados

### 1. **Configuração Next.js** - `next.config.ts`
- Configurado suporte para imagens remotas do Cloudinary
- Habilitado otimização de imagens com formatos WebP e AVIF
- Adicionados device sizes e image sizes para responsividade

### 2. **API Service** - `lib/api.ts`
- Atualizado `uploadsApi.uploadImage()` com suporte a parâmetro `folder`
- Folder options: `products`, `categories`, `logos`, `covers`, `misc`
- Retorna `{ url, publicId }` após upload bem-sucedido

### 3. **Hook Customizado** - `lib/hooks/useMenuApi.ts`
Gerencia todas as operações da API:
- `createCategory()` - Criar categoria com imagem
- `updateCategory()` - Atualizar categoria
- `deleteCategory()` - Deletar categoria
- `createProduct()` - Criar produto com imagem
- `updateProduct()` - Atualizar produto
- `deleteProduct()` - Deletar produto
- `updateRestaurantSettings()` - Atualizar logo e cover do restaurante

### 4. **Componentes UI** - `components/ui/`

#### `ImageUpload.tsx`
Componente reutilizável para upload de imagens:
- Upload por clique ou drag-and-drop
- Preview em tempo real
- Validação de tipo e tamanho
- Suporte a folder options (products, categories, logos, covers, misc)
- Estados de loading e erro
- Remover imagem selecionada

**Props:**
```typescript
interface ImageUploadProps {
  label?: string;
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  folder?: 'products' | 'categories' | 'logos' | 'covers' | 'misc';
  maxSizeMB?: number;
  initialImage?: string;
  restaurantId: string;
  disabled?: boolean;
}
```

#### `CategoryModal.tsx`
Modal para criar/editar categorias:
- Campo de nome (obrigatório)
- Campo de descrição
- Upload de imagem (folder: 'categories')
- Ordem de exibição
- Status ativo/inativo

#### `ProductModal.tsx`
Modal para criar/editar produtos:
- Campo de nome (obrigatório)
- Campo de descrição
- Seleção de categoria (obrigatório)
- Preço (obrigatório)
- Upload de imagem (folder: 'products')
- Ordem de exibição
- Status ativo/disponível

#### `ProductCard.tsx`
Card para exibição de produtos:
- Suporta view mode grid e list
- Imagem otimizada com Next.js Image
- Ações: editar, deletar, toggle visibilidade
- Formatação de preços em BRL

#### `RestaurantSettings.tsx`
Componente completo de configurações do restaurante:
- Informações básicas (nome, email, telefone, website, descrição)
- Endereço (logradouro, cidade, estado, CEP)
- Upload de logo (folder: 'logos')
- Upload de cover image (folder: 'covers')
- Preview das imagens após upload
- Salvamento com callback

---

## 🔧 Páginas Atualizadas

### `app/menu/page.tsx`
Interface completa para gerenciar menu:
- **Aba Produtos**: 
  - Busca e filtro por categoria
  - View grid/list
  - Criar novo produto
  - Editar produto com imagem
  - Deletar produto
  - Toggle visibilidade

- **Aba Categorias**:
  - Listar todas as categorias
  - Criar nova categoria
  - Editar categoria com imagem
  - Deletar categoria
  - Mostrar quantidade de produtos

### `app/settings/page.tsx`
Integração do componente RestaurantSettings:
- Nova seção de restaurante com upload de logo e cover
- Método `handleSaveRestaurant()` para salvar via API
- Integração com contexto de autenticação

---

## 🚀 Como Usar

### Upload de Categoria com Imagem
```typescript
import CategoryModal from '@/components/ui/CategoryModal';

<CategoryModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={async (data) => {
    // data contém: name, description, image, order, isActive
    await createCategory(data);
  }}
  restaurantId={restaurantId}
/>
```

### Upload de Produto com Imagem
```typescript
import ProductModal from '@/components/ui/ProductModal';

<ProductModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={async (data) => {
    // data contém: name, categoryId, price, image, description, order, isActive
    await createProduct(data);
  }}
  categories={categories}
  restaurantId={restaurantId}
/>
```

### Upload Customizado de Imagem
```typescript
import ImageUpload from '@/components/ui/ImageUpload';

<ImageUpload
  label="Minha Imagem"
  folder="products"
  onUploadSuccess={(url, publicId) => {
    console.log('URL:', url);
    console.log('Public ID:', publicId);
  }}
  restaurantId={restaurantId}
/>
```

### Configurações do Restaurante
```typescript
import RestaurantSettings from '@/components/ui/RestaurantSettings';

<RestaurantSettings
  restaurantId={restaurantId}
  initialData={restaurantData}
  onSave={async (data) => {
    // data contém: name, phone, email, address, city, state, zipCode, website, description, logo, coverImage
    await updateRestaurantSettings(data);
  }}
/>
```

---

## 📱 Fluxo de Funcionamento

### 1. Upload de Arquivo
```
Usuario seleciona arquivo
    ↓
ImageUpload valida (tipo e tamanho)
    ↓
Exibe preview do arquivo
    ↓
Upload para API (/api/v1/uploads/image?folder=...)
    ↓
Retorna { url, publicId }
    ↓
onUploadSuccess() callback
```

### 2. Criar Produto com Imagem
```
Usuario abre ProductModal
    ↓
Preenche nome, categoria, preço
    ↓
Faz upload da imagem (folder: products)
    ↓
Clica em "Salvar Produto"
    ↓
Envia POST /api/v1/products com { name, categoryId, price, image, ... }
    ↓
Atualiza UI (contexto + dados locais)
```

### 3. Atualizar Logo/Cover do Restaurante
```
Usuario abre RestaurantSettings
    ↓
Faz upload do logo (folder: logos)
    ↓
Faz upload do cover (folder: covers)
    ↓
Preenche outros dados básicos
    ↓
Clica em "Salvar Configurações"
    ↓
Envia PATCH /api/v1/settings/restaurant com { logo, coverImage, ... }
    ↓
Imagens antigas são deletadas automaticamente do Cloudinary
```

---

## 🖼️ Renderização de Imagens

Todas as imagens são otimizadas usando Next.js Image component:

```typescript
<Image
  src={product.image}
  alt={product.name}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, 400px"
/>
```

**Benefícios:**
- Lazy loading
- Otimização automática (WebP, AVIF)
- Responsividade com `sizes`
- Prevenção de Layout Shift (CLS)

---

## 🔐 Segurança

- ✅ Validação de tipo de arquivo (image/*)
- ✅ Validação de tamanho máximo (5MB por padrão)
- ✅ Credenciais de API enviadas via header `x-restaurant-id`
- ✅ Cookies httpOnly para tokens JWT
- ✅ Remoção automática de imagens antigas no Cloudinary

---

## 📁 Estrutura de Pastas Cloudinary

```
gastrobi/
├── products/   → Imagens de produtos
├── categories/ → Imagens de categorias
├── logos/      → Logos do restaurante
├── covers/     → Imagens de capa
└── misc/       → Outros uploads
```

---

## ✨ Próximos Passos (Sugestões)

1. Adicionar compressão de imagens no backend
2. Implementar cache de imagens
3. Adicionar watermark automático
4. Criar galeria de imagens para produtos
5. Implementar crop de imagens no frontend
6. Adicionar histórico de uploads

---

## 🐛 Troubleshooting

### Erro: "Erro ao fazer upload"
- Verificar token JWT (expirado?)
- Verificar se restaurantId está correto
- Verificar se arquivo é uma imagem válida
- Verificar tamanho do arquivo (máximo 5MB)

### Imagem não aparece
- Aguardar processamento do Cloudinary
- Verificar se URL foi salva corretamente
- Verificar se domínio está autorizado em next.config.ts

### Imagem antiga não foi deletada
- Verificar logs da API
- Confirmar que `publicId` foi armazenado
- Testar deleção manual no Cloudinary

---

## 📚 Referências

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [CLOUDINARY_ADMIN_RESTAURANT.md](CLOUDINARY_ADMIN_RESTAURANT.md)

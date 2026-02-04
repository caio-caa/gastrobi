# 🚀 Quick Start - Sistema de Upload de Imagens

Guia rápido para começar a usar o sistema de upload de imagens.

---

## 1. Verificar Pré-requisitos

```bash
# ✅ Next.js 16+ (já configurado)
# ✅ React 19+ (já configurado)
# ✅ TypeScript (já configurado)
# ✅ Tailwind CSS (já configurado)
# ✅ Cloudinary account (configure variáveis de ambiente)
```

---

## 2. Usar ImageUpload Simples

```tsx
'use client';

import ImageUpload from '@/components/ui/ImageUpload';

export default function MyComponent() {
  const restaurantId = user?.currentRestaurant?.id || '';

  return (
    <ImageUpload
      label="Minha Imagem"
      folder="products"
      onUploadSuccess={(url, publicId) => {
        console.log('URL:', url);
        console.log('Public ID:', publicId);
      }}
      restaurantId={restaurantId}
    />
  );
}
```

---

## 3. Usar ProductModal

```tsx
'use client';

import { useState } from 'react';
import ProductModal from '@/components/ui/ProductModal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function ProductList() {
  const [showModal, setShowModal] = useState(false);
  const restaurantId = 'rest-123';
  const categories = [...]; // Suas categorias

  return (
    <>
      <Button onClick={() => setShowModal(true)} icon={Plus}>
        Novo Produto
      </Button>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          // data: { name, categoryId, price, image, description, order, isActive }
          await api.products.create(data, restaurantId);
        }}
        categories={categories}
        restaurantId={restaurantId}
      />
    </>
  );
}
```

---

## 4. Usar CategoryModal

```tsx
'use client';

import { useState } from 'react';
import CategoryModal from '@/components/ui/CategoryModal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const restaurantId = 'rest-123';

  return (
    <>
      <Button onClick={() => setShowModal(true)} icon={Plus}>
        Nova Categoria
      </Button>

      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          // data: { name, image, description, order, isActive }
          await api.categories.create(data, restaurantId);
        }}
        restaurantId={restaurantId}
      />
    </>
  );
}
```

---

## 5. Usar RestaurantSettings

```tsx
'use client';

import RestaurantSettings from '@/components/ui/RestaurantSettings';
import { useMenuApi } from '@/lib/hooks/useMenuApi';

export default function Settings() {
  const restaurantId = user?.currentRestaurant?.id || '';
  const { updateRestaurantSettings } = useMenuApi({ restaurantId });

  const restaurantData = {
    name: 'Meu Restaurante',
    email: 'contato@restaurante.com',
    phone: '(11) 99999-9999',
    address: 'Rua Principal, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    website: 'https://restaurante.com',
    description: 'Descrição',
    logo: '', // URL do Cloudinary ou vazio
    coverImage: '' // URL do Cloudinary ou vazio
  };

  return (
    <RestaurantSettings
      restaurantId={restaurantId}
      initialData={restaurantData}
      onSave={async (data) => {
        await updateRestaurantSettings(data);
      }}
    />
  );
}
```

---

## 6. Usar Hook useMenuApi

```tsx
'use client';

import { useMenuApi } from '@/lib/hooks/useMenuApi';

export default function AdvancedExample() {
  const restaurantId = 'rest-123';
  const {
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    updateRestaurantSettings,
    loading,
    error
  } = useMenuApi({ restaurantId });

  // Criar categoria
  const handleCreateCategory = async () => {
    try {
      const result = await createCategory({
        name: 'Bebidas',
        image: 'https://res.cloudinary.com/.../bebidas.webp'
      });
      console.log('Categoria criada:', result);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  // Criar produto
  const handleCreateProduct = async () => {
    try {
      const result = await createProduct({
        name: 'Cerveja',
        categoryId: 'cat-1',
        price: 15.00,
        image: 'https://res.cloudinary.com/.../cerveja.webp'
      });
      console.log('Produto criado:', result);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={handleCreateCategory}>Criar Categoria</button>
      <button onClick={handleCreateProduct}>Criar Produto</button>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
    </div>
  );
}
```

---

## 7. Renderizar Imagens Otimizadas

```tsx
'use client';

import Image from 'next/image';

export default function OptimizedImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full aspect-square">
      <Image
        src={imageUrl}
        alt="Produto"
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}
```

---

## 🔧 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| `Error: Image is missing required "sizes" prop` | Adicione `sizes` prop no Image |
| `Error: Invalid src` | Verifique se a URL do Cloudinary está correta |
| `Error: File too large` | Arquivo > 5MB, reduza o tamanho |
| `Error: Invalid file type` | Use PNG, JPG, GIF ou WebP |
| Imagem não aparece | Verifique domain em `next.config.ts` |

---

## 📂 Folder Options

```typescript
// Para produtos
folder: 'products'
// URL será: https://res.cloudinary.com/gastrobi/image/upload/gastrobi/products/...

// Para categorias
folder: 'categories'
// URL será: https://res.cloudinary.com/gastrobi/image/upload/gastrobi/categories/...

// Para logo
folder: 'logos'
// URL será: https://res.cloudinary.com/gastrobi/image/upload/gastrobi/logos/...

// Para cover
folder: 'covers'
// URL será: https://res.cloudinary.com/gastrobi/image/upload/gastrobi/covers/...

// Para outros
folder: 'misc'
// URL será: https://res.cloudinary.com/gastrobi/image/upload/gastrobi/misc/...
```

---

## 🎯 Exemplos de Uso Real

### Exemplo 1: Formulário de Produto

```tsx
const [productData, setProductData] = useState({
  name: '',
  categoryId: '',
  price: 0,
  image: '',
  description: ''
});

const handleImageUpload = (url: string, publicId: string) => {
  setProductData(prev => ({ ...prev, image: url }));
};

const handleSubmit = async () => {
  const response = await api.products.create(productData, restaurantId);
  if (!response.error) {
    alert('Produto criado com sucesso!');
  }
};

return (
  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <input
      type="text"
      value={productData.name}
      onChange={(e) => setProductData({...productData, name: e.target.value})}
      placeholder="Nome do produto"
    />
    <input
      type="number"
      value={productData.price}
      onChange={(e) => setProductData({...productData, price: parseFloat(e.target.value)})}
      placeholder="Preço"
    />
    <ImageUpload
      folder="products"
      onUploadSuccess={handleImageUpload}
      restaurantId={restaurantId}
    />
    <button type="submit">Salvar Produto</button>
  </form>
);
```

### Exemplo 2: Lista com Imagens

```tsx
const products = [...];

return (
  <div className="grid grid-cols-3 gap-4">
    {products.map(product => (
      <div key={product.id} className="border rounded-lg">
        {product.image && (
          <div className="relative w-full aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-lg text-blue-600">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    ))}
  </div>
);
```

---

## 📚 Próximos Passos

1. ✅ Importe um componente
2. ✅ Faça upload de uma imagem
3. ✅ Crie um produto/categoria
4. ✅ Veja na interface
5. ✅ Leia a documentação completa (se quiser aprofundar)

---

## 📖 Documentação Completa

Para mais detalhes:
- [IMPLEMENTACAO_UPLOAD_IMAGENS.md](IMPLEMENTACAO_UPLOAD_IMAGENS.md) - Técnico
- [EXEMPLOS_USO_UPLOAD.md](EXEMPLOS_USO_UPLOAD.md) - Exemplos práticos
- [RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md) - Overview completo
- [CLOUDINARY_ADMIN_RESTAURANT.md](CLOUDINARY_ADMIN_RESTAURANT.md) - Especificação original

---

## 💡 Dicas Importantes

```tsx
// ✅ CORRETO - Com todas as props necessárias
<ImageUpload
  label="Imagem"
  folder="products"
  onUploadSuccess={(url, publicId) => console.log(url)}
  restaurantId={restaurantId}
/>

// ❌ ERRADO - Faltam props obrigatórias
<ImageUpload onUploadSuccess={...} />

// ✅ CORRETO - Com Image otimizada
<Image
  src={url}
  alt="alt"
  fill
  sizes="(max-width: 640px) 100vw, 400px"
/>

// ❌ ERRADO - Sem sizes pode causar erro
<Image src={url} alt="alt" fill />
```

---

## 🎉 Pronto!

Você está pronto para usar o sistema de upload de imagens.

Comece agora:

```bash
cd /app/menu
# ou
cd /app/settings
# Abra page.tsx e veja a implementação!
```

---

**Dúvidas?** Consulte a documentação ou os exemplos práticos! 🚀

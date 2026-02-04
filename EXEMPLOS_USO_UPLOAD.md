# Exemplos de Uso - Sistema de Upload de Imagens

Este arquivo contém exemplos práticos de como usar o sistema de upload de imagens implementado.

---

## 1️⃣ Upload Básico de Imagem

### Componente ImageUpload Simples

```tsx
'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ui/ImageUpload';

export default function SimpleUploadExample() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const restaurantId = 'rest-123';

  const handleUploadSuccess = (url: string, publicId: string) => {
    console.log('Imagem enviada com sucesso!');
    console.log('URL:', url);
    console.log('Public ID:', publicId);
    setImageUrl(url);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload de Imagem</h2>
      
      <ImageUpload
        label="Selecione uma imagem"
        folder="products"
        onUploadSuccess={handleUploadSuccess}
        restaurantId={restaurantId}
      />

      {imageUrl && (
        <div className="mt-4">
          <p className="text-green-600">✓ Imagem enviada:</p>
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="mt-2 max-w-xs rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
```

---

## 2️⃣ Criar Produto com Imagem

### Usando ProductModal

```tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductModal from '@/components/ui/ProductModal';
import Button from '@/components/ui/Button';

export default function CreateProductExample() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  const restaurantId = 'rest-123';
  const categories = [
    { id: 'cat-1', name: 'Bebidas' },
    { id: 'cat-2', name: 'Pratos Principais' }
  ];

  const handleSubmit = async (productData: any) => {
    try {
      // O productData contém:
      // {
      //   name: "Coca-Cola 350ml",
      //   categoryId: "cat-1",
      //   price: 8.50,
      //   image: "https://res.cloudinary.com/.../product.webp",
      //   description: "Refrigerante gelado",
      //   order: 1,
      //   isActive: true,
      //   isAvailable: true
      // }

      // Aqui você enviaria para a API
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productData
      };

      setProducts([...products, newProduct]);
      setShowModal(false);
      alert('Produto criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar produto');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Produtos</h2>
        <Button
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Novo Produto
        </Button>
      </div>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Modal de criação */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        categories={categories}
        restaurantId={restaurantId}
      />
    </div>
  );
}
```

---

## 3️⃣ Criar Categoria com Imagem

### Usando CategoryModal

```tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CategoryModal from '@/components/ui/CategoryModal';
import Button from '@/components/ui/Button';

export default function CreateCategoryExample() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const restaurantId = 'rest-123';

  const handleSubmit = async (categoryData: any) => {
    try {
      // categoryData contém:
      // {
      //   name: "Bebidas",
      //   image: "https://res.cloudinary.com/.../category.webp",
      //   description: "Todas as nossas bebidas",
      //   order: 1,
      //   isActive: true
      // }

      const newCategory = {
        id: `cat-${Date.now()}`,
        ...categoryData
      };

      setCategories([...categories, newCategory]);
      setShowModal(false);
      alert('Categoria criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar categoria');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Categorias</h2>
        <Button
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Nova Categoria
        </Button>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            {category.image && (
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de criação */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        restaurantId={restaurantId}
      />
    </div>
  );
}
```

---

## 4️⃣ Configurações do Restaurante com Logo e Cover

### Usando RestaurantSettings

```tsx
'use client';

import { useState } from 'react';
import RestaurantSettings from '@/components/ui/RestaurantSettings';
import { useMenuApi } from '@/lib/hooks/useMenuApi';

export default function RestaurantSettingsExample() {
  const restaurantId = 'rest-123';
  const { updateRestaurantSettings, loading } = useMenuApi({ restaurantId });

  const [restaurantData] = useState({
    name: 'Pizzaria Italia',
    email: 'contato@pizzaria.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    website: 'https://pizzaria.com.br',
    description: 'Melhor pizzaria de São Paulo',
    logo: 'https://res.cloudinary.com/.../logo.webp',
    coverImage: 'https://res.cloudinary.com/.../cover.webp'
  });

  const handleSave = async (data: any) => {
    // data contém todos os campos incluindo logo e coverImage
    // {
    //   name, email, phone, address, city, state, zipCode,
    //   website, description, logo, coverImage
    // }
    
    try {
      await updateRestaurantSettings(data);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações');
    }
  };

  return (
    <RestaurantSettings
      restaurantId={restaurantId}
      initialData={restaurantData}
      onSave={handleSave}
    />
  );
}
```

---

## 5️⃣ Usar Hook useMenuApi Diretamente

### Para Controle Total

```tsx
'use client';

import { useState } from 'react';
import { useMenuApi } from '@/lib/hooks/useMenuApi';
import Button from '@/components/ui/Button';

export default function AdvancedMenuApiExample() {
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

  const [feedback, setFeedback] = useState('');

  // Criar categoria
  const handleCreateCategory = async () => {
    try {
      setFeedback('Criando categoria...');
      const result = await createCategory({
        name: 'Bebidas Alcoólicas',
        image: 'https://res.cloudinary.com/.../bebidas.webp',
        description: 'Nossas melhores bebidas',
        order: 1
      });
      setFeedback('✓ Categoria criada com sucesso!');
    } catch (err) {
      setFeedback('✗ Erro ao criar categoria');
    }
  };

  // Criar produto
  const handleCreateProduct = async () => {
    try {
      setFeedback('Criando produto...');
      const result = await createProduct({
        name: 'Cerveja Artesanal',
        categoryId: 'cat-1',
        price: 15.00,
        image: 'https://res.cloudinary.com/.../cerveja.webp',
        description: 'Cerveja importada premium'
      });
      setFeedback('✓ Produto criado com sucesso!');
    } catch (err) {
      setFeedback('✗ Erro ao criar produto');
    }
  };

  // Atualizar restaurante
  const handleUpdateRestaurant = async () => {
    try {
      setFeedback('Atualizando configurações...');
      await updateRestaurantSettings({
        name: 'Novo Nome',
        logo: 'https://res.cloudinary.com/.../novo-logo.webp',
        coverImage: 'https://res.cloudinary.com/.../novo-cover.webp'
      });
      setFeedback('✓ Configurações atualizadas!');
    } catch (err) {
      setFeedback('✗ Erro ao atualizar');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Exemplos de API</h2>

      <div className="space-y-2">
        <Button onClick={handleCreateCategory} disabled={loading}>
          Criar Categoria
        </Button>
        <Button onClick={handleCreateProduct} disabled={loading}>
          Criar Produto
        </Button>
        <Button onClick={handleUpdateRestaurant} disabled={loading}>
          Atualizar Restaurante
        </Button>
      </div>

      {loading && <p className="text-blue-600">Carregando...</p>}
      {error && <p className="text-red-600">Erro: {error}</p>}
      {feedback && <p className="text-gray-700">{feedback}</p>}
    </div>
  );
}
```

---

## 6️⃣ Renderizar Imagens com Next.js Image

### Otimização de Performance

```tsx
'use client';

import Image from 'next/image';

export default function OptimizedImageExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {/* Imagem de Produto */}
      <div className="relative w-full aspect-square">
        <Image
          src="https://res.cloudinary.com/gastrobi/image/upload/c_scale,w_400/gastrobi/products/coca.webp"
          alt="Coca-Cola"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Logo do Restaurante */}
      <div className="relative w-32 h-32">
        <Image
          src="https://res.cloudinary.com/gastrobi/image/upload/w_200/gastrobi/logos/pizzaria.webp"
          alt="Logo"
          fill
          className="object-contain"
          sizes="200px"
        />
      </div>

      {/* Cover Image */}
      <div className="relative w-full aspect-video">
        <Image
          src="https://res.cloudinary.com/gastrobi/image/upload/c_scale,w_800/gastrobi/covers/banner.webp"
          alt="Cover"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 640px) 100vw, 800px"
          priority
        />
      </div>
    </div>
  );
}
```

---

## 7️⃣ Validações Customizadas

### Adicionar Validações Extra

```tsx
import ImageUpload from '@/components/ui/ImageUpload';

export default function ValidatedImageUpload() {
  const restaurantId = 'rest-123';

  const handleUpload = (url: string, publicId: string) => {
    // Validação customizada
    if (!url || !publicId) {
      alert('Erro: URL ou publicId não foram retornados');
      return;
    }

    // Validar que é um URL do Cloudinary
    if (!url.includes('res.cloudinary.com')) {
      alert('Erro: Imagem não foi salva no Cloudinary');
      return;
    }

    console.log('✓ Imagem válida:', url);
    // Prosseguir com o fluxo
  };

  const handleError = (error: string) => {
    console.error('Erro de upload:', error);
    // Log customizado
    if (error.includes('tamanho')) {
      alert('Arquivo muito grande. Máximo 5MB');
    } else if (error.includes('tipo')) {
      alert('Tipo de arquivo inválido. Use PNG, JPG ou GIF');
    } else {
      alert(`Erro: ${error}`);
    }
  };

  return (
    <ImageUpload
      label="Upload com Validação"
      folder="products"
      onUploadSuccess={handleUpload}
      onUploadError={handleError}
      restaurantId={restaurantId}
      maxSizeMB={3}
    />
  );
}
```

---

## 📝 Checklist de Implementação

- ✅ `next.config.ts` - Cloudinary remotePatterns
- ✅ `lib/api.ts` - uploadsApi.uploadImage com folder
- ✅ `lib/hooks/useMenuApi.ts` - Hook para API
- ✅ `components/ui/ImageUpload.tsx` - Upload component
- ✅ `components/ui/CategoryModal.tsx` - Modal de categoria
- ✅ `components/ui/ProductModal.tsx` - Modal de produto
- ✅ `components/ui/ProductCard.tsx` - Card de produto
- ✅ `components/ui/RestaurantSettings.tsx` - Settings
- ✅ `app/menu/page.tsx` - Integração na página menu
- ✅ `app/settings/page.tsx` - Integração na página settings

---

## 🔍 Debugging

### Ver URLs das Imagens no Console

```tsx
const handleUploadSuccess = (url: string, publicId: string) => {
  console.log('Upload bem-sucedido!');
  console.log('URL:', url);
  console.log('Public ID:', publicId);
  console.log('Folder:', url.split('/').slice(-2, -1)[0]);
};
```

### Testar Imagem Offline

```tsx
import ImageUpload from '@/components/ui/ImageUpload';

// Use initialImage para testar preview
<ImageUpload
  initialImage="https://res.cloudinary.com/gastrobi/image/upload/c_scale,w_400/gastrobi/products/test.webp"
  folder="products"
  onUploadSuccess={handleUpload}
  restaurantId={restaurantId}
/>
```

---

## 🎯 Próximos Passos

1. Implementar edição de imagens no upload
2. Adicionar múltiplos uploads
3. Criar galeria de imagens
4. Implementar crop de imagens
5. Adicionar watermark
6. Cachear imagens no CDN

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export interface UploadError {
  error: string;
}

/**
 * Upload de imagem para Cloudinary via API
 * @param file - Arquivo de imagem
 * @param folder - Pasta no Cloudinary: 'avatars', 'logos', 'covers', 'misc'
 * @param token - JWT token
 * @returns URL da imagem e publicId
 */
export async function uploadImage(
  file: File,
  folder: 'avatars' | 'logos' | 'covers' | 'misc' = 'misc',
  token: string
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_URL}/uploads/image?folder=${folder}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    const data = await response.json();
    return {
      url: data.url,
      publicId: data.publicId,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Atualizar avatar de usuário
 */
export async function updateUserAvatar(
  userId: string,
  avatarUrl: string,
  fullName: string,
  token: string
) {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName,
      avatar: avatarUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar avatar');
  }

  return response.json();
}

/**
 * Atualizar restaurante (logo e cover)
 */
export async function updateRestaurant(
  restaurantId: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    settings?: {
      logo?: string;
      cover?: string;
    };
  },
  token: string
) {
  const response = await fetch(`${API_URL}/admin/restaurants/${restaurantId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar restaurante');
  }

  return response.json();
}

/**
 * Criar white label
 */
export async function createWhiteLabel(
  data: {
    clientName: string;
    brandName: string;
    domain: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/admin/white-label`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar white label');
  }

  return response.json();
}

/**
 * Atualizar white label
 */
export async function updateWhiteLabel(
  whiteLabelId: string,
  data: {
    brandName?: string;
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/admin/white-label/${whiteLabelId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar white label');
  }

  return response.json();
}

/**
 * Validar se arquivo é uma imagem válida
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Obter mensagem de erro de validação
 */
export function getImageValidationError(file: File): string | null {
  const validTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Formato inválido. Use: JPG, PNG, GIF ou WebP';
  }

  if (file.size > maxSize) {
    return 'Arquivo muito grande. Máximo: 5MB';
  }

  return null;
}

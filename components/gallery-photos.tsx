import Photo from '@/components/photo';

interface PhotoData {
  id: string;
  url: string;
  alt?: string;
  variant?: 'original' | 'square';
  order: number;
  createdAt: string;
}

interface GalleryPhotosProps {
  slug: string;
}

async function getPhotos(slug: string): Promise<PhotoData[]> {
  try {
    const { getAdminDb } = await import('@/lib/firebase/admin');
    const db = getAdminDb();
    
    // 從 telegram-categories collection 獲取資料
    const docRef = db.collection('telegram-categories').doc(slug);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Category "${slug}" not found`);
      return [];
    }
    
    const data = doc.data();
    const images = data?.images || [];
    
    // 將 telegram-categories 格式轉換為 PhotoData 格式
    return images.map((img: any, index: number) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      variant: img.variant || 'original',
      order: index, // 使用陣列順序作為 order
      createdAt: img.uploaded_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}

export default async function GalleryPhotos({ slug }: GalleryPhotosProps) {
  const photos = await getPhotos(slug);
  
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      {photos.map((photo) => (
        <Photo
          key={photo.id}
          image={{
            id: photo.id,
            src: photo.url, // 直接使用圖片的 URL
            alt: photo.alt || '',
          }}
          title={photo.alt || undefined}
          variant={photo.variant || 'original'}
        />
      ))}
    </>
  );
}

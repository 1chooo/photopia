'use client';

import { useEffect, useState } from 'react';
import Gallery from '@/components/gallery';
import { GalleryImage } from '@/types/gallery';

interface Photo {
  id: string;
  url: string;
  file_id: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
  category?: string;
  alt?: string;
  uploaded_at: string;
  order: number;
}

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomepagePhotos() {
      try {
        // 從公開 API 獲取首頁照片
        const res = await fetch('/api/homepage/images');
        const { images: photos } = await res.json() as { images: Photo[] };

        if (!photos || photos.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        // 轉換為 Gallery 組件需要的格式
        const galleryImages: GalleryImage[] = photos.map(photo => ({
          id: photo.id,
          src: photo.url,
          alt: photo.alt || photo.file_name,
          width: photo.width,
          height: photo.height,
        }));

        setImages(galleryImages);
      } catch (error) {
        console.error('Failed to fetch homepage photos:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepagePhotos();
  }, []);

  if (loading) {
    return (
      <div className="lg:max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-rurikon-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="lg:max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-rurikon-400">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:max-w-2xl xl:max-w-3xl 2xl:max-w-6xl">
      <Gallery images={images} />
    </div>
  );
}

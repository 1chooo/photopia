'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { GalleryImage, GalleryLayout } from '@/types/gallery';
import { getBlurDataURL } from '@/lib/blur-placeholder';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';

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

interface GalleryProps {
  images?: GalleryImage[];
  layout?: GalleryLayout;
  fetchFromApi?: boolean; // 是否從 API 獲取數據
}

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

function GalleryItem({ image, index }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use actual image dimensions if available, otherwise default to landscape
  const width = image.width || 800;
  const height = image.height || 600;
  
  // Use proxy URL to hide original photo URL
  const proxySrc = `/api/homepage/image/${image.id}`;
  
  return (
    <BlurFade delay={0.25 + index * 0.05} inView>
      <Image
        className={`mb-4 w-full object-contain transition-all duration-700 hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-20'
        }`}
        src={proxySrc}
        alt={image.alt}
        loading="lazy"
        width={width}
        height={height}
        quality={80}
        placeholder="blur"
        blurDataURL={getBlurDataURL(width, height)}
        onLoad={() => setIsLoaded(true)}
      />
    </BlurFade>
  );
}

export default function Gallery({ images: externalImages, fetchFromApi = false }: GalleryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>(externalImages || []);
  const [loading, setLoading] = useState(fetchFromApi);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 如果需要從 API 獲取數據
    if (fetchFromApi) {
      async function fetchHomepagePhotos() {
        try {
          const res = await fetch('/api/homepage/images');
          const { images: photos } = await res.json() as { images: Photo[] };

          if (!photos || photos.length === 0) {
            setImages([]);
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
    }
  }, [fetchFromApi]);

  // Randomly shuffle images only on client side after mount
  const shuffledImages = useMemo(() => {
    if (!isMounted) return images;
    return [...images].sort(() => Math.random() - 0.5);
  }, [images, isMounted]);

  if (loading) {
    return (
      <section id="gallery">
        <div className="container w-full mx-auto px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-rurikon-400">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section id="gallery">
        <div className="container w-full mx-auto px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-rurikon-400">No photos available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery">
      <div className="container w-full mx-auto px-4">
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          {shuffledImages.map((image, idx) => (
            <GalleryItem key={image.id} image={image} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

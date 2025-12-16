'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GalleryImage, GalleryLayout } from '@/types/gallery';

interface GalleryProps {
  images: GalleryImage[];
  layout?: GalleryLayout;
}

interface GalleryItemProps {
  image: GalleryImage;
}

function GalleryItem({ image }: GalleryItemProps) {
  const [aspectRatio, setAspectRatio] = useState<string>('aspect-square');
  const [isLoaded, setIsLoaded] = useState(false);

  // If width and height are provided, calculate aspect ratio
  if (image.width && image.height && !isLoaded) {
    const isPortrait = image.height > image.width;
    const ratio = isPortrait ? 'aspect-[2/3]' : 'aspect-[3/2]';
    if (aspectRatio !== ratio) {
      setAspectRatio(ratio);
      setIsLoaded(true);
    }
  }

  const handleLoadingComplete = (img: HTMLImageElement) => {
    // Determine orientation from the loaded image
    const isPortrait = img.naturalHeight > img.naturalWidth;
    const ratio = isPortrait ? 'aspect-[2/3]' : 'aspect-[3/2]';
    setAspectRatio(ratio);
    setIsLoaded(true);
  };
  
  return (
    <div className="overflow-hidden h-full w-full">
      <div className={`block h-full w-full relative ${aspectRatio} transition-all duration-300`}>
        <Image
          alt={image.alt}
          className="object-cover object-center transition duration-500 transform hover:scale-105"
          src={image.src}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={(e) => handleLoadingComplete(e.currentTarget)}
        />
      </div>
    </div>
  );
}

// Default layout that matches your original design
const defaultLayout: GalleryLayout = {
  columns: [
    [{ size: 'half' }, { size: 'half' }, { size: 'full' }],
    [{ size: 'full' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }],
    // [{ size: 'full' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }],
    // [{ size: 'half' }, { size: 'half' }, { size: 'full' }],
    // [{ size: 'full' }, { size: 'half' }, { size: 'half' }],
    // [{ size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'full' }],
    [{ size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'full' }],
    [{ size: 'full' }, { size: 'half' }, { size: 'half' }],
  ],
};

export default function Gallery({ images, layout = defaultLayout }: GalleryProps) {
  let imageIndex = 0;

  // Calculate how many times we need to repeat the layout pattern
  const totalImagesInPattern = layout.columns.reduce(
    (sum, column) => sum + column.length,
    0
  );
  const timesToRepeat = Math.ceil(images.length / totalImagesInPattern);

  // Create extended columns by repeating the pattern
  const extendedColumns = Array.from({ length: timesToRepeat }, (_, repeatIndex) =>
    layout.columns.map((column, columnIndex) => ({
      column,
      key: `${repeatIndex}-${columnIndex}`,
    }))
  ).flat();

  return (
    <section>
      <div className="container w-full">
        <div className="flex flex-wrap w-full">
          {extendedColumns.map(({ column, key }) => {
            const columnImages: { image: GalleryImage; size: 'full' | 'half' }[] = [];
            
            column.forEach((item) => {
              if (imageIndex < images.length) {
                columnImages.push({
                  image: images[imageIndex],
                  size: item.size,
                });
                imageIndex++;
              }
            });

            // Skip rendering empty columns
            if (columnImages.length === 0) {
              return null;
            }

            return (
              <div
                key={key}
                className="flex w-full md:w-1/2 flex-wrap"
              >
                {columnImages.map((item, itemIndex) => {
                  const widthClass =
                    item.size === 'full' ? 'w-full' : 'w-full md:w-1/2';
                  
                  return (
                    <div key={itemIndex} className={`${widthClass} p-1`}>
                      <GalleryItem image={item.image} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

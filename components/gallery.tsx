import Image from 'next/image';
import { GalleryImage, GalleryLayout } from '@/types/gallery';

interface GalleryProps {
  images: GalleryImage[];
  layout?: GalleryLayout;
}

interface GalleryItemProps {
  image: GalleryImage;
}

function GalleryItem({ image }: GalleryItemProps) {
  return (
    <div className="overflow-hidden h-full w-full">
      <div className="block h-full w-full relative aspect-square">
        <Image
          alt={image.alt}
          className="object-cover object-center transition duration-500 transform scale-100 hover:scale-110"
          src={image.src}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
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
    [{ size: 'full' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }],
    [{ size: 'half' }, { size: 'half' }, { size: 'full' }],
    [{ size: 'full' }, { size: 'half' }, { size: 'half' }],
    [{ size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'half' }, { size: 'full' }],
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
    <section className="text-neutral-700">
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

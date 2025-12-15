import Image from 'next/image';
import { GalleryImage } from '@/types/gallery';
import cn from 'clsx';

interface PhotoProps {
  image: GalleryImage;
  title?: React.ReactNode;
}

export default function Photo({ image, title }: PhotoProps) {
  return (
    <figure>
      <span className="inline-block w-full">
        <span className="sidenote-content float-left w-full">
          <section>
            <div className="container w-full">
              <div className="w-full p-1">
                <div className="overflow-hidden h-full w-full">
                  <div className="block h-full w-full relative aspect-square">
                    <Image
                      alt={image.alt}
                      className="object-cover object-center transition duration-500 transform scale-100 hover:scale-110"
                      src={image.src}
                      fill
                      sizes="100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </span>
      </span>
      {title && (
        <span
          className={cn(
            'sidenote block relative mt-3.5 mb-7 mx-auto text-left text-pretty w-[80%] text-xs sm:text-sm leading-5 sm:leading-6 text-rurikon-400',
            'text:inline text:float-right text:clear-right text:w-[50%] text:-mr-[50%] text:mt-0 text:pl-7'
          )}
        >
          <span className="sr-only">Sidenote: </span>
          {title}
        </span>
      )}
    </figure>
  );
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export type GalleryItemSize = 'full' | 'half';

export interface GalleryLayoutItem {
  size: GalleryItemSize;
}

export type GalleryLayoutColumn = GalleryLayoutItem[];

export interface GalleryLayout {
  columns: GalleryLayoutColumn[];
}

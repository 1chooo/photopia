export interface Photo {
  id: string
  url: string
  alt?: string
  variant?: 'original' | 'square'
  order: number
  createdAt: Date
}

export interface SlugData {
  slug: string
  photos: Photo[]
}

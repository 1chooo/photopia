export interface Photo {
  id: string
  url: string
  order: number
  createdAt: Date
}

export interface SlugData {
  slug: string
  photos: Photo[]
}

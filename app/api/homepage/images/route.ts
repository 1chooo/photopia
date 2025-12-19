import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getAdminDb();
    
    // 1. 獲取首頁選中的照片 IDs
    const homePinSnapshot = await db
      .collection('home-pin')
      .orderBy('order', 'asc')
      .get();

    if (homePinSnapshot.empty) {
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const photoIds = homePinSnapshot.docs.map(doc => doc.id);

    // 2. 從 telegram 存儲獲取這些照片的詳細信息
    const photoPromises = photoIds.map(id =>
      db.collection('tg-as-image-storage').doc(id).get()
    );

    const photoDocs = await Promise.all(photoPromises);

    // 3. 組合數據並保持順序
    const images = photoDocs
      .map((doc, index) => {
        if (!doc.exists) return null;
        const data = doc.data();
        return {
          id: doc.id,
          url: data?.url,
          file_id: data?.file_id,
          file_name: data?.file_name,
          file_size: data?.file_size,
          width: data?.width,
          height: data?.height,
          alt: data?.alt,
          category: data?.category,
          uploaded_at: data?.uploaded_at,
          order: index, // 保持順序
        };
      })
      .filter(img => img !== null);

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error('Error fetching homepage images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage images' },
      { status: 500 }
    );
  }
}

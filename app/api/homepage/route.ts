import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('home-pin')
      .orderBy('order', 'asc')
      .get();

    const selectedPhotos = snapshot.docs.map(doc => ({
      photoId: doc.id,
      order: doc.data().order,
    }));

    return NextResponse.json({ selectedPhotos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching homepage photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getAdminDb();
    const body = await request.json();
    const { selectedPhotos } = body;

    if (!Array.isArray(selectedPhotos)) {
      return NextResponse.json(
        { error: 'selectedPhotos must be an array' },
        { status: 400 }
      );
    }

    // 使用 batch 來確保原子性操作
    const batch = db.batch();

    // 1. 刪除現有的所有 documents
    const existingSnapshot = await db.collection('home-pin').get();
    existingSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 2. 新增新的 documents
    selectedPhotos.forEach(photo => {
      const docRef = db.collection('home-pin').doc(photo.photoId);
      batch.set(docRef, {
        order: photo.order,
        updatedAt: new Date().toISOString(),
      });
    });

    // 執行 batch
    await batch.commit();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating homepage photos:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage photos' },
      { status: 500 }
    );
  }
}

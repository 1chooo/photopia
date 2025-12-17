import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (slug) {
      // Get photos for a specific slug
      const docRef = db.collection('photo-gallery').doc(slug);
      const doc = await docRef.get();

      if (!doc.exists) {
        return NextResponse.json(
          { photos: [], slug },
          { status: 200 }
        );
      }

      return NextResponse.json(doc.data(), { status: 200 });
    } else {
      // Get all slugs with their photos
      const snapshot = await db.collection('photo-gallery').get();
      const allData = snapshot.docs.map(doc => ({
        slug: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({ galleries: allData }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getAdminDb();
    const body = await request.json();
    const { slug, url } = body;

    if (!slug || !url) {
      return NextResponse.json(
        { error: 'Slug and URL are required' },
        { status: 400 }
      );
    }

    const docRef = db.collection('photo-gallery').doc(slug);
    const doc = await docRef.get();

    const newPhoto = {
      id: `photo-${Date.now()}`,
      url,
      order: doc.exists ? (doc.data()?.photos?.length || 0) : 0,
      createdAt: new Date().toISOString(),
    };

    if (doc.exists) {
      // Add photo to existing slug
      await docRef.update({
        photos: [...(doc.data()?.photos || []), newPhoto],
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new slug with photo
      await docRef.set({
        slug,
        photos: [newPhoto],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, photo: newPhoto }, { status: 200 });
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json(
      { error: 'Failed to add photo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = getAdminDb();
    const body = await request.json();
    const { slug, photos } = body;

    if (!slug || !photos) {
      return NextResponse.json(
        { error: 'Slug and photos are required' },
        { status: 400 }
      );
    }

    // Update the order of photos
    const reorderedPhotos = photos.map((photo: any, index: number) => ({
      ...photo,
      order: index,
    }));

    const docRef = db.collection('photo-gallery').doc(slug);
    await docRef.update({
      photos: reorderedPhotos,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating photos:', error);
    return NextResponse.json(
      { error: 'Failed to update photos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getAdminDb();
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const photoId = searchParams.get('photoId');

    if (!slug || !photoId) {
      return NextResponse.json(
        { error: 'Slug and photoId are required' },
        { status: 400 }
      );
    }

    const docRef = db.collection('photo-gallery').doc(slug);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Slug not found' },
        { status: 404 }
      );
    }

    const photos = doc.data()?.photos || [];
    const updatedPhotos = photos.filter((photo: any) => photo.id !== photoId);

    await docRef.update({
      photos: updatedPhotos,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}

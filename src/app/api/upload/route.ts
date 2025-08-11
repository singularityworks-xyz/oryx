import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/hooks/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const imageUrl = await uploadImage(buffer);
      uploadedUrls.push(imageUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `Successfully uploaded ${uploadedUrls.length} image(s)`
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
} 

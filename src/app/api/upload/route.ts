import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// cloudinary auto-configures from CLOUDINARY_URL env var
cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const resourceType = file.type.startsWith('video') ? 'video' : 'image';

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'tribute_stories', resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url, type: resourceType });
}
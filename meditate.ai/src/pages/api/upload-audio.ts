// app/api/upload-audio/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `recording-${Date.now()}.wav`;
    const filepath = path.join(uploadDir, filename);

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
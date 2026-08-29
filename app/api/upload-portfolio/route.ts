import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Simple password check for the API route
    const password = formData.get('password');
    if (password !== 'gabut 123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const files = formData.getAll('files') as File[];
    const coverIndex = parseInt(formData.get('coverIndex') as string || '0');
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (files.length === 0 || !title || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a unique folder for this upload
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const folderName = `${slug}-${Date.now().toString().slice(-6)}`;
    const uploadDir = join(process.cwd(), 'public', 'nvy', folderName);
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const savedMedia = await Promise.all(files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);

      return {
        url: `/nvy/${folderName}/${filename}`,
        type: fileType
      };
    }));

    const cover = savedMedia[coverIndex] || savedMedia[0];

    // Read the current JSON
    const jsonPath = join(process.cwd(), 'data', 'nvy-portfolio.json');
    const fileContents = await readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);

    // Get a new ID
    const newId = data.portfolio.length > 0 
      ? Math.max(...data.portfolio.map((p: any) => p.id)) + 1 
      : 1;

    // Add the new item
    const newItem = {
      id: newId,
      title,
      category,
      imageUrl: cover.url,
      mediaType: cover.type,
      description,
      media: savedMedia
    };

    // Insert at the beginning so the newest is first
    data.portfolio.unshift(newItem);

    // Save back to JSON
    await writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ success: true, item: newItem });

  } catch (error) {
    console.error('Error in upload-portfolio API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

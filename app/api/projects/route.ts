import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

// GET: Retrieve projects
export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST: Save projects (Overwrite)
export async function POST(request: Request) {
  try {
    // Safety check: Only allow in development environment unless configured otherwise
    // For this use case (Local Admin), we implicitly trust localhost, but good to note.
    
    const projects = await request.json();
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Projects saved successfully' });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

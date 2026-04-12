import { NextResponse } from 'next/server';
import dbConnect from '@/lib/redux/dbConnect'; // Your DB connection utility
import Story from '@/models/Story';     // Your Mongoose model

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category'); // "public" | "heritage"
  const status = searchParams.get('status');     // "pending" | "published" | "archived"

  // Build query object based on actual schema fields
  const query: Record<string, string> = {};
  if (category) query.category = category;
  if (status) query.status = status;

  try {
    const stories = await Story.find(query).sort({ createdAt: -1 });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const newStory = await Story.create(data);
  return NextResponse.json(newStory, { status: 201 });
}



import { NextResponse } from 'next/server';
import dbConnect from '@/lib/redux/dbConnect';
import Story from '@/models/Story';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const updatedStory = await Story.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updatedStory);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  await dbConnect();
  const { id } = await params;
  await Story.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

export async function GET(req: Request, { params }: { params: Params }) {
  await dbConnect();
  const { id } = await params;
  const story = await Story.findById(id);
  return NextResponse.json(story);
}
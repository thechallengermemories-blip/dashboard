import { NextResponse } from 'next/server';
import dbConnect from '@/lib/redux/dbConnect';
import Story from '@/models/Story';
import cloudinary from '@/lib/redux/cloudinary';

export async function GET(req: Request) {
  await dbConnect();

  // ✅ DNS fix
  if (process.env.NODE_ENV === "development") {
    const dns = await import("dns");
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status   = searchParams.get('status');

  const query: Record<string, string> = {};
  if (category) query.category = category;
  if (status)   query.status   = status;
  // ✅ No status param = returns ALL stories (pending + published + archived)

  try {
    const stories = await Story.find(query).sort({ createdAt: -1 });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const name      = formData.get("name");
    const email     = formData.get("email");
    const title     = formData.get("title");
    const narrative = formData.get("narrative");
    const mission   = formData.get("mission");
    const category  = formData.get("category") || "public";
    const relation  = formData.get("relation") || "public-observer";
    const file      = formData.get("image") as File | null;

    let imageUrl = "";
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "stories" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newStory = await Story.create({
      name, email, title, narrative,
      mission, category, relation, imageUrl,
      status: "pending", // ✅ always pending — admin approves before it goes live
    });

    return NextResponse.json({ success: true, data: newStory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
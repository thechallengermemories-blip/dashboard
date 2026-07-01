import { NextResponse } from "next/server";
import dbConnect from "@/lib/redux/dbConnect";
import { CrewMember } from "@/models/CrewMember";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const member = await CrewMember.findOne({ slug }).lean();

    if (!member) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err) {
    console.error("GET /api/crew/[slug] failed:", err);
    return NextResponse.json(
      { error: "Failed to load crew member" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const body = await req.json();

    const member = await CrewMember.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!member) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err) {
    console.error("PATCH /api/crew/[slug] failed:", err);
    return NextResponse.json(
      { error: "Failed to update crew member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const member = await CrewMember.findOneAndDelete({ slug }).lean();

    if (!member) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/crew/[slug] failed:", err);
    return NextResponse.json(
      { error: "Failed to delete crew member" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/redux/dbConnect";
import { CrewMember } from "@/models/CrewMember";

export async function GET() {
  try {
    await dbConnect();

    const crew = await CrewMember.find({})
      .select("slug name role crewId seat img shortBio")
      .sort({ seat: 1 })
      .lean();

    return NextResponse.json({ crew });
  } catch (err) {
    console.error("GET /api/crew failed:", err);
    return NextResponse.json(
      { error: "Failed to load crew list" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const member = await CrewMember.create(body);

    return NextResponse.json({ member }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/crew failed:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A crew member with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create crew member" },
      { status: 500 }
    );
  }
}
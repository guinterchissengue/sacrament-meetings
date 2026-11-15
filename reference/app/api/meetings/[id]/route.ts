import { NextRequest, NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

const MAX_INT4 = 2_147_483_647; // limite do SERIAL; acima disto a BD dá erro

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 400: id não numérico (ex.: "abc") ou fora do intervalo válido.
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAX_INT4) {
    return NextResponse.json(
      { error: "Invalid meeting id. It must be a positive integer." },
      { status: 400 }
    );
  }

  try {
    const meeting = await getMeetingById(Number(id));
    // 404: id válido mas sem registo (ex.: 9999)
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    return NextResponse.json(meeting);
  } catch (error) {
    console.error("GET /api/meetings/[id] failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
